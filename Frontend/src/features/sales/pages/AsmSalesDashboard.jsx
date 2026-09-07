// src/features/sales/pages/AsmSalesDashboard.jsx
import { useMemo, useState, useEffect } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import StatsCard from '../components/StatCard';
import SalesTrendChart from '../components/SalesTrendChart';
import TeamVisitsTracker from '../components/TeamVisitsTracker';
import TeamOrders from '../components/TeamOrders';
import CustomSelect from '../../employee-master/components/ui/CustomSelect';
import InlineLoader from "../../../components/common/InlineLoader";
import { salesApi } from '../services/salesApi';
const AsmSalesDashboard = () => {
  const { cards, data: initialData, loading, error } = useSalesData();
  const asmAssignedTerritory = initialData?.asmTerritory || "All Assigned Territories";

  // Modals & Feedback States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedSeForTarget, setSelectedSeForTarget] = useState(null);
  const [selectedSeForFeedback, setSelectedSeForFeedback] = useState(null);
  const [isFullPerformanceOpen, setIsFullPerformanceOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Lead Type State
  const [leadFormType, setLeadFormType] = useState('B2B');

  // Pipeline Layout Filters
  const [activePipelineTab, setActivePipelineTab] = useState('B2B');
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeFilter, setSelectedSeFilter] = useState('ALL');

  // Local Sync States
  const [localSePerformanceList, setLocalSePerformanceList] = useState([]);
  const [allLeads, setAllLeads] = useState([]);

  // Form Initial States
  const [leadForm, setLeadForm] = useState({
    companyName: '', customerName: '', contactPerson: '', phone: '', email: '', requirement: '', estimatedValue: '', assignedSeId: '', gstNumber: ''
  });

  const PIPELINE_STAGES = ['New Lead', 'Contacted', 'Proposal Sent', 'In Negotiation', 'Closed'];

  useEffect(() => {
    if (initialData?.sePerformanceList) {
      const enrichedSeList = initialData.sePerformanceList.map(se => {
        const achPct = se.target > 0 ? Math.round((se.achievement / se.target) * 100) : 0;
        let trend = 'neutral';
        if (achPct >= 80) trend = 'up';
        else if (achPct < 65) trend = 'down';

        return {
          ...se,
          achPercentage: achPct,
          trend: se.trend || trend,
          feedback: se.feedback || ''
        };
      });
      setLocalSePerformanceList(enrichedSeList);
    }
    if (initialData?.leadsPipeline) {
      setAllLeads(initialData.leadsPipeline);
    }
  }, [initialData?.sePerformanceList, initialData?.leadsPipeline]);

  const filteredLeadsForAsm = useMemo(() => {
    return allLeads.filter(lead => {
      const matchesTab = lead.segment === activePipelineTab;
      const matchesSe = selectedSeFilter === 'ALL' || lead.assignedSeId === selectedSeFilter;

      const targetQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = targetQuery === '' ||
        (lead.id && lead.id.toLowerCase().includes(targetQuery)) ||
        (lead.name && lead.name.toLowerCase().includes(targetQuery)) ||
        (lead.contact && lead.contact.toLowerCase().includes(targetQuery)) ||
        (lead.phone && lead.phone.includes(targetQuery));

      return matchesTab && matchesSe && matchesSearch;
    });
  }, [allLeads, activePipelineTab, selectedSeFilter, searchQuery]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const targetSe = localSePerformanceList.find(se => se.id === leadForm.assignedSeId) || { name: 'Unassigned SE' };
    let newLeadObj;
    try {
      const created = await salesApi.createLead({
        segment: leadFormType,
        lead_name: leadFormType === 'B2B' ? leadForm.companyName : leadForm.customerName,
        company_name: leadFormType === 'B2B' ? leadForm.companyName : '',
        contact_person: leadForm.contactPerson || leadForm.customerName,
        phone_number: leadForm.phone,
        email: leadForm.email,
        requirement: leadForm.requirement,
        estimated_value: Number(leadForm.estimatedValue) || 0,
        gst_number: leadForm.gstNumber,
        assigned_employee_id: leadForm.assignedSeId,
      });
      newLeadObj = { ...created, name: created.name || created.lead_name, segment: created.segment || leadFormType, status: created.status || 'New Lead', value: Number(created.value || leadForm.estimatedValue || 0), assignedSeId: leadForm.assignedSeId, assignedSeName: targetSe.name };
    } catch {
      setIsSubmitting(false);
      return;
    }

    setAllLeads(prevLeads => [newLeadObj, ...prevLeads]);
    setActivePipelineTab(leadFormType);
    setIsLeadModalOpen(false);
    setLeadForm({ companyName: '', customerName: '', contactPerson: '', phone: '', email: '', requirement: '', estimatedValue: '', assignedSeId: '', gstNumber: '' });
    setIsSubmitting(false);
  };

  const handleTargetSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const updatedTargetValue = Number(e.target.targetAmount.value);
    try {
      await salesApi.createTarget({ assigned_to_employee_id: selectedSeForTarget.id, target_value: updatedTargetValue });
    } catch {
      setIsSubmitting(false);
      return;
    }
    setLocalSePerformanceList(prevList =>
      prevList.map(se => {
        if (se.id === selectedSeForTarget.id) {
          const newAchPct = updatedTargetValue > 0 ? Math.round((se.achievement / updatedTargetValue) * 100) : 0;
          let newTrend = 'neutral';
          if (newAchPct >= 80) newTrend = 'up';
          else if (newAchPct < 65) newTrend = 'down';

          return { ...se, target: updatedTargetValue, achPercentage: newAchPct, trend: newTrend };
        }
        return se;
      })
    );
    setSelectedSeForTarget(null);
    setIsSubmitting(false);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSeForFeedback?.feedbackReportId) {
      setActionError('No daily report is available for this executive yet.');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await salesApi.updateDailyReportFeedback(selectedSeForFeedback.feedbackReportId, feedbackText);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to save feedback.');
      setIsSubmitting(false);
      return;
    }
    setLocalSePerformanceList(prevList =>
      prevList.map(se => se.id === selectedSeForFeedback.id ? { ...se, feedback: feedbackText } : se)
    );
    setSelectedSeForFeedback(null);
    setFeedbackText('');
    setActionError('');
    setIsSubmitting(false);
  };

  if (loading) return <div className="min-h-screen"><InlineLoader message="Loading KPI Metrics..." /></div>;
  if (error) return <div className="p-6 text-red-500 bg-[#141414] min-h-screen">{error}</div>;
  const executiveOptions = [
    { label: "All Executives", value: "ALL" },
    ...localSePerformanceList.map(se => ({
      label: se.name,
      value: se.id
    }))
  ];
  return (
    <div className="w-full text-gray-200 px-2 py-4 flex flex-col gap-6 select-none relative min-h-screen">
      {actionError && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{actionError}</div>}

      {/* HEADER SECTION */}
      <div className="w-full flex justify-between items-center border-b border-[#1f1f1f] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            Sales Performance
            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-medium">
              {asmAssignedTerritory} Region
            </span>
          </h1>
        </div>
        <button onClick={() => setIsLeadModalOpen(true)} className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-xs hover:bg-yellow-600 transition-all shadow-md">+ Add New Lead</button>
      </div>

      {/* 1. KPI CARDS GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards && cards.map((cardKey) => {
          let title = ""; let value = ""; let iconType = "users";
          if (cardKey === "teamTarget") { title = "Team Target"; value = `₹${((initialData?.kpiStats?.teamTarget || 0) / 100000).toFixed(1)}L`; iconType = "target"; }
          else if (cardKey === "teamAchievement") { title = "Team Achievement"; value = `₹${((initialData?.kpiStats?.teamAchievement || 0) / 100000).toFixed(1)}L`; iconType = "rupee"; }
          else if (cardKey === "lowPerformers") { title = "Low Performers"; value = initialData?.kpiStats?.lowPerformanceAlerts || "0"; iconType = "users"; }
          else if (cardKey === "activeSE") { title = "Active SEs"; value = initialData?.kpiStats?.activeSalesExecutives || "0"; iconType = "users"; }
          return <StatsCard key={cardKey} title={title} value={value} icon={iconType} />;
        })}
      </div>

      {/* 2. SALES TREND CHART SECTION */}
      <div className="w-full grid grid-cols-1 gap-6"><SalesTrendChart data={initialData?.apiDashboard?.trend || []} /></div>

      {/* 3. TEAM PERFORMANCE TABLE */}
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl w-full">
        <div className="mb-6">
          <h2 className="text-white text-lg font-bold tracking-tight">Team Performance</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-gray-300 min-w-[650px]">
            <thead>
              <tr className="text-gray-500 text-xs tracking-wider border-b border-[#1f1f1f]">
                <th className="py-4 px-2 font-normal">SE Name</th>
                <th className="py-4 px-2 font-normal">Target (₹)</th>
                <th className="py-4 px-2 font-normal">Achievement (₹)</th>
                <th className="py-4 px-2 font-normal">Ach %</th>
                <th className="py-4 px-2 font-normal text-center">Trend</th>
                <th className="py-4 px-2 font-normal text-center">Feedback</th>
                <th className="py-4 px-2 font-normal text-right">Target Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]/60 text-sm">
              {localSePerformanceList.map((se) => (
                <tr key={se.id} className="hover:bg-[#151515] transition-colors duration-150">
                  <td className="py-4 px-2 font-medium text-gray-200">{se.name}</td>
                  <td className="py-4 px-2 font-mono text-gray-400">{se.target ? se.target.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-4 px-2 font-mono text-gray-400">{se.achievement ? se.achievement.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-4 px-2 font-medium text-gray-300">{se.achPercentage}%</td>
                  <td className="py-4 px-2 text-center">
                    {se.trend === 'up' && <span className="text-green-500 font-bold text-lg">↑</span>}
                    {se.trend === 'down' && <span className="text-red-500 font-bold text-lg">↓</span>}
                    {se.trend === 'neutral' && <span className="text-yellow-500 font-bold text-lg">—</span>}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedSeForFeedback(se);
                        setFeedbackText(se.feedback || '');
                      }}
                      className={`transition-transform transform hover:scale-110 p-1 rounded ${se.feedback ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 inline-block">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
                      </svg>
                    </button>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button onClick={() => setSelectedSeForTarget(se)} className="text-[11px] bg-[#1c1c1c] text-yellow-500/80 border border-yellow-500/20 px-2.5 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition-all font-medium">Update Target</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active Actionable Link */}
        <div className="mt-5 pt-2 border-t border-[#1f1f1f]/50">
          <button
            onClick={() => setIsFullPerformanceOpen(true)}
            className="text-yellow-500 hover:text-yellow-400 font-medium text-xs tracking-wide flex items-center gap-1 transition-all"
          >
            View Full Performance <span className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* CENTRAL LEADS PIPELINE PANEL */}
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-5 shadow-lg w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4 border-b border-[#1f1f1f]/60 pb-5">
          <div>
            <h2 className="text-white text-base font-semibold tracking-wide">Central Leads Pipeline</h2>
            <div className="flex bg-[#141414] p-1 rounded-xl border border-[#1f1f1f] mt-4 w-fit">
              <button onClick={() => setActivePipelineTab('B2B')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activePipelineTab === 'B2B' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>B2B Segment</button>
              <button onClick={() => setActivePipelineTab('B2C')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activePipelineTab === 'B2C' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>B2C Segment</button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <input type="text" placeholder="Search lead, account, phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-[10px] text-gray-500 hover:text-white">✕</button>}
            </div>

            <CustomSelect
              value={selectedSeFilter}
              onValueChange={(value) => setSelectedSeFilter(value)}
              options={executiveOptions}
              variant="pill"
              width="w-[150px]"
              placeholder="All Executives"
            />

            <div className="flex bg-[#141414] p-1 rounded-xl border border-[#1f1f1f]">
              <button onClick={() => setViewMode('table')} className={`p-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-[#222] text-yellow-500 border border-yellow-500/20' : 'text-gray-400 hover:text-white'}`}>☰ Table</button>
              <button onClick={() => setViewMode('pipeline')} className={`p-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${viewMode === 'pipeline' ? 'bg-[#222] text-yellow-500 border border-yellow-500/20' : 'text-gray-400 hover:text-white'}`}>⚃ Pipeline</button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs lg:text-sm text-gray-400 min-w-[700px]">
              <thead className="bg-[#111] text-[11px] uppercase tracking-wider text-gray-300 border-b border-[#1f1f1f]">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">{activePipelineTab === 'B2B' ? 'Company Account' : 'Customer Name'}</th>
                  {activePipelineTab === 'B2B' && <th className="py-3 px-4">Contact Person</th>}
                  <th className="py-3 px-4">Est. Deal Value</th>
                  <th className="py-3 px-4">Assigned Sales Exec (SE)</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]/40">
                {filteredLeadsForAsm.length === 0 ? (
                  <tr><td colSpan={activePipelineTab === 'B2B' ? "6" : "5"} className="py-8 text-center text-gray-500 text-xs">No matching leads found.</td></tr>
                ) : (
                  filteredLeadsForAsm.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#1a1a1a]/40 transition-colors duration-200">
                      <td className="py-3 px-4 text-gray-500 font-mono text-xs">{lead.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-[10px] text-gray-500">{lead.phone}</div>
                      </td>
                      {activePipelineTab === 'B2B' && <td className="py-3 px-4 text-gray-300">{lead.contact}</td>}
                      <td className="py-3 px-4 font-semibold text-gray-300">₹{lead.value ? lead.value.toLocaleString() : '0'}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-xs">{lead.assignedSeName}</span>
                          <span className="text-[10px] text-yellow-500/70 font-mono">{lead.assignedSeId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1c1c1c] text-yellow-500 border border-yellow-500/20">{lead.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4  pb-4 pt-1 overflow-hidden">
            {PIPELINE_STAGES.map((stage) => {
              const stageSpecificLeads = filteredLeadsForAsm.filter(l => l.status === stage || (stage === 'New Lead' && !PIPELINE_STAGES.includes(l.status)));
              return (
                <div key={stage} className="bg-[#121212] border border-[#262626] rounded-xl p-3 flex flex-col gap-3 min-w-[220px]">
                  <div className="flex justify-between items-center border-b border-[#262626] pb-2">
                    <span className="text-white font-semibold text-xs tracking-wide">{stage}</span>
                    <span className="text-[10px] bg-[#1a1a1a] px-2 py-0.5 rounded-md text-gray-400 font-mono">{stageSpecificLeads.length}</span>
                  </div>
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-[450px]">
                    {stageSpecificLeads.length === 0 ? (
                      <div className="text-center text-[11px] py-6 text-gray-600 italic">Empty Stage</div>
                    ) : (
                      stageSpecificLeads.map((lead) => (
                        <div key={lead.id} className="bg-[#181818] border border-[#2a2a2a] p-3 rounded-lg flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] text-gray-500 font-mono">{lead.id}</span>
                            <span className="text-[11px] text-yellow-500 font-bold">₹{((lead.value || 0) / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate">{lead.name}</div>
                          <div className="border-t border-[#2a2a2a]/40 pt-1.5 mt-1 flex justify-between items-center text-[10px]">
                            <span className="text-gray-400 font-medium truncate">{lead.assignedSeName}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TeamVisitsTracker visits={initialData?.visits || []} />
      <TeamOrders />

      {/* 4. MODAL: FULL PERFORMANCE DETAILED REPORT */}
      {isFullPerformanceOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#1f1f1f] flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-base">Territorial Performance Audit Report</h3>
                <p className="text-xs text-gray-400">Exhaustive sales analytics & gap metrics for {asmAssignedTerritory}</p>
              </div>
              <button onClick={() => setIsFullPerformanceOpen(false)} className="text-gray-400 hover:text-white text-xs bg-[#222] border border-[#333] px-3 py-1.5 rounded-xl transition-all">✕ Close Report</button>
            </div>

            <div className="p-6 overflow-y-auto w-full">
              <table className="w-full text-left text-xs sm:text-sm text-gray-300 min-w-[700px]">
                <thead className="bg-[#141414] text-gray-500 uppercase tracking-wider text-[11px] border-b border-[#1f1f1f]">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Executive Name</th>
                    <th className="py-3 px-4">Target Amount</th>
                    <th className="py-3 px-4">Achieved Amount</th>
                    <th className="py-3 px-4">Pipeline Value Remaining</th>
                    <th className="py-3 px-4">Last Pushed Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]/40">
                  {localSePerformanceList.map((se) => {
                    const gap = (se.target || 0) - (se.achievement || 0);
                    return (
                      <tr key={se.id} className="hover:bg-[#151515] transition-colors">
                        <td className="py-3 px-4 font-mono text-yellow-500/70 text-xs">{se.id}</td>
                        <td className="py-3 px-4 font-medium text-white">{se.name}</td>
                        <td className="py-3 px-4 font-mono">₹{se.target?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-mono text-green-400">₹{se.achievement?.toLocaleString('en-IN')}</td>
                        <td className={`py-3 px-4 font-mono ${gap > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                          {gap > 0 ? `₹${gap.toLocaleString('en-IN')}` : 'Target Met ✓'}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400 italic max-w-[220px] truncate">
                          {se.feedback || <span className="text-gray-600 font-normal">No custom logs recorded</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASM FEEDBACK */}
      {selectedSeForFeedback && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#2a2a2a] flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold text-base">Write ASM Feedback</h3>
                <p className="text-[11px] text-gray-400">For Executive: {selectedSeForFeedback.name}</p>
              </div>
              <button onClick={() => setSelectedSeForFeedback(null)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-medium">Performance Remarks (Visible to SE)</label>
                <textarea required rows={4} placeholder="Type advice, targets warnings..." className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 resize-none" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
                <button type="button" onClick={() => setSelectedSeForFeedback(null)} className="px-4 py-2 border border-[#2a2a2a] text-gray-400 rounded-lg text-xs hover:bg-[#1c1c1c]">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-xs hover:bg-yellow-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Push Feedback'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TARGET CONTROL */}
      {selectedSeForTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#2a2a2a] flex justify-between items-center">
              <h3 className="text-white font-semibold text-base">Assign Revenue Target</h3>
              <button onClick={() => setSelectedSeForTarget(null)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleTargetSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">New Target (₹)</label>
                <input type="number" name="targetAmount" required defaultValue={selectedSeForTarget.target || ''} placeholder="Enter amount" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" />
              </div>
              <div className="mt-2 flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
                <button type="button" onClick={() => setSelectedSeForTarget(null)} className="px-4 py-2 border border-[#2a2a2a] text-gray-400 rounded-lg text-xs hover:bg-[#1c1c1c]">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-xs hover:bg-yellow-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Confirm Target'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD CREATION MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 bg-[#161616] border-b border-[#2a2a2a] flex justify-between items-center">
              <h3 className="text-white font-semibold text-base">Create Business Lead</h3>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            <div className="px-6 pt-4 flex">
              <div className="flex bg-[#161616] p-1 rounded-xl border border-[#2a2a2a] w-full">
                <button type="button" onClick={() => setLeadFormType('B2B')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${leadFormType === 'B2B' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}>B2B Segment</button>
                <button type="button" onClick={() => setLeadFormType('B2C')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${leadFormType === 'B2C' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}>B2C Segment</button>
              </div>
            </div>
            <form onSubmit={handleLeadSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              {leadFormType === 'B2B' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Company Name</label>
                      <input type="text" required placeholder="e.g. Acme Tech" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.companyName} onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">GST Number</label>
                      <input type="text" placeholder="Optional" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.gstNumber} onChange={(e) => setLeadForm({ ...leadForm, gstNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Contact Person</label>
                      <input type="text" required placeholder="Name" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.contactPerson} onChange={(e) => setLeadForm({ ...leadForm, contactPerson: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Requirement Details</label>
                      <input type="text" placeholder="e.g. Bulk orders" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.requirement} onChange={(e) => setLeadForm({ ...leadForm, requirement: e.target.value })} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Customer Name</label>
                    <input type="text" required placeholder="e.g. Amit Verma" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.customerName} onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Requirement Details</label>
                    <input type="text" placeholder="Product interest" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.requirement} onChange={(e) => setLeadForm({ ...leadForm, requirement: e.target.value })} />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Phone</label>
                  <input type="tel" required placeholder="10 digit phone" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Email Address</label>
                  <input type="email" placeholder="name@domain.com" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Estimated Value (₹)</label>
                  <input type="number" placeholder="Deal value" className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.estimatedValue} onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-medium">Assign Executive (SE)</label>
                  <select className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500" value={leadForm.assignedSeId} onChange={(e) => setLeadForm({ ...leadForm, assignedSeId: e.target.value })}>{localSePerformanceList.map(se => <option key={se.id} value={se.id}>{se.name} ({se.id})</option>)}</select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
                <button type="button" onClick={() => setIsLeadModalOpen(false)} className="px-4 py-2 border border-[#2a2a2a] text-gray-400 rounded-lg text-xs hover:bg-[#1c1c1c]">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-xs hover:bg-yellow-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Save Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsmSalesDashboard;
