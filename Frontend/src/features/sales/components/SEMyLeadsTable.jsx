// src/features/sales/components/SEMyLeadsTable.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  UserCheck, 
  Plus, 
  FileText, 
  ChevronDown, 
  Building2, 
  User, 
  Check, 
  X, 
  Edit3, 
  Archive, 
  RotateCcw, 
  LayoutGrid, 
  List,
  Search
} from 'lucide-react';

const SEMyLeadsTable = ({ leads = [], onViewDirectory }) => {
  const navigate = useNavigate();

  // View States
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pipeline'
  const [clientType, setClientType] = useState('B2B'); // 'B2B' | 'B2C'
  const [showArchived, setShowArchived] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // Data State
  const [leadsList, setLeadsList] = useState(leads);
  
  // Modals State
  const [activeNoteLead, setActiveNoteLead] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false); // Directory Modal State
  const [directorySearch, setDirectorySearch] = useState('');

  // Form State
  const [leadForm, setLeadForm] = useState({
    leadName: '',
    customer: '',
    type: 'B2B',
    stage: 'New',
    value: '',
    phone: '',
    email: ''
  });

  // Stage Badge Styles
  const getStageBadgeStyle = (stage) => {
    switch (stage) {
      case 'New':
        return 'bg-[#121d28] text-blue-400 border-blue-900/40';
      case 'Contacted':
        return 'bg-[#111c15] text-green-400 border-green-900/40';
      case 'Proposal':
        return 'bg-[#211a10] text-[#FFC107] border-[#42341d]';
      case 'Negotiation':
        return 'bg-[#1f1528] text-purple-400 border-purple-900/40';
      default:
        return 'bg-zinc-800 text-gray-300 border-zinc-700';
    }
  };

  // Base Filter: Active vs Archive + B2B/B2C
  const baseFiltered = leadsList.filter(
    l => (l.type || 'B2B') === clientType && Boolean(l.isArchived) === showArchived
  );

  // Stage Filtered
  const finalLeads = selectedFilter === 'All' 
    ? baseFiltered 
    : baseFiltered.filter(l => l.stage === selectedFilter);

  // Stage Counts
  const counts = {
    New: baseFiltered.filter(l => l.stage === 'New').length,
    Contacted: baseFiltered.filter(l => l.stage === 'Contacted').length,
    Proposal: baseFiltered.filter(l => l.stage === 'Proposal').length,
    Negotiation: baseFiltered.filter(l => l.stage === 'Negotiation').length,
  };

  const tabs = [
    { label: 'All', count: baseFiltered.length },
    { label: 'New', count: counts.New },
    { label: 'Contacted', count: counts.Contacted },
    { label: 'Proposal', count: counts.Proposal },
    { label: 'Negotiation', count: counts.Negotiation },
  ];

  // Handlers
  const handleStatusChange = (leadId, newStage) => {
    setLeadsList(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, stage: newStage, lastActivity: 'Stage updated (Just now)' } 
        : lead
    ));
  };

  const toggleArchiveLead = (leadId) => {
    setLeadsList(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, isArchived: !lead.isArchived } : lead
    ));
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    setLeadsList(prev => prev.map(lead => {
      if (lead.id === activeNoteLead.id) {
        return {
          ...lead,
          notes: [...(lead.notes || []), { text: noteInput, time: 'Just now' }],
          lastActivity: 'Note added (Just now)'
        };
      }
      return lead;
    }));
    setNoteInput('');
    setActiveNoteLead(null);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setLeadForm({
      leadName: lead.leadName || '',
      customer: lead.customer || '',
      type: lead.type || 'B2B',
      stage: lead.stage || 'New',
      value: lead.value || '',
      phone: lead.phone || '',
      email: lead.email || ''
    });
  };

  const handleUpdateLead = (e) => {
    e.preventDefault();
    setLeadsList(prev => prev.map(l => 
      l.id === editingLead.id ? { ...l, ...leadForm, lastActivity: 'Updated just now' } : l
    ));
    setEditingLead(null);
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadForm.leadName) return;

    const created = {
      id: Date.now().toString(),
      ...leadForm,
      isArchived: false,
      lastActivity: 'Created today',
      notes: []
    };

    setLeadsList([created, ...leadsList]);
    setIsAddLeadOpen(false);
    setLeadForm({ leadName: '', customer: '', type: 'B2B', stage: 'New', value: '', phone: '', email: '' });
  };

  // View All Directory Click Handler
  const handleViewAllClick = () => {
    if (onViewDirectory) {
      onViewDirectory();
    } else {
      setIsDirectoryOpen(true);
    }
  };

  // Filtered Leads for Directory Modal Search
  const directoryLeads = leadsList.filter(l => 
    l.leadName.toLowerCase().includes(directorySearch.toLowerCase()) ||
    (l.customer && l.customer.toLowerCase().includes(directorySearch.toLowerCase()))
  );

  return (
    <div className="w-full bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-5 shadow-xl flex flex-col justify-between relative">
      
      {/* 1. Top Header Controls */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 border-b border-[#1f1b14] pb-3">
          
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
              <UserCheck size={18} className="text-[#FFC107]" />
              My Leads
            </h3>

            {/* B2B / B2C Toggle */}
            <div className="bg-[#14120e] p-1 border border-[#2b2214] rounded-xl flex items-center gap-1">
              <button
                onClick={() => { setClientType('B2B'); setSelectedFilter('All'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  clientType === 'B2B' ? 'bg-[#FFC107] text-black shadow font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Building2 size={13} />
                <span>B2B</span>
              </button>
              <button
                onClick={() => { setClientType('B2C'); setSelectedFilter('All'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  clientType === 'B2C' ? 'bg-[#FFC107] text-black shadow font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={13} />
                <span>B2C</span>
              </button>
            </div>

            {/* Active vs Archived Toggle */}
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`text-xs px-3 py-1 rounded-xl font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                showArchived 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold' 
                  : 'bg-[#14120e] border-[#2b2214] text-gray-400 hover:text-white'
              }`}
            >
              <Archive size={13} />
              <span>{showArchived ? 'Viewing Archived' : 'Archived Leads'}</span>
            </button>
          </div>

          {/* View Switcher & Add Lead */}
          <div className="flex items-center gap-3">
            
            {/* View Switcher with Text Labels */}
            <div className="bg-[#14120e] p-1 border border-[#2b2214] rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-[#FFC107] text-black font-bold shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={14} />
                <span>List View</span>
              </button>

              <button
                onClick={() => setViewMode('pipeline')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'pipeline' 
                    ? 'bg-[#FFC107] text-black font-bold shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Pipeline View</span>
              </button>
            </div>

            {/* Add Lead Button */}
            <button 
              onClick={() => {
                setLeadForm({ leadName: '', customer: '', type: clientType, stage: 'New', value: '', phone: '', email: '' });
                setIsAddLeadOpen(true);
              }}
              className="bg-[#1c1810] border border-[#382b17] hover:border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Lead</span>
            </button>
          </div>

        </div>

        {/* Stage Filter Tabs (Table Mode) */}
        {viewMode === 'table' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = selectedFilter === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setSelectedFilter(tab.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1f1a10] text-[#FFC107] border-[#FFC107] font-bold shadow-md'
                      : 'bg-[#131210] text-gray-400 border-[#262118] hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-md font-mono ${
                    isActive ? 'bg-[#FFC107] text-black font-bold' : 'bg-[#221f1a] text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Main Content Display */}
      {viewMode === 'table' ? (
        /* --- LIST VIEW --- */
        <div className="w-full overflow-x-auto mt-3 rounded-xl border border-[#1f1a12]">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-[#12100d] text-gray-400 font-semibold tracking-wider border-b border-[#1f1a12] text-[11px]">
                <th className="py-3 px-3 font-medium w-[22%]">Lead Name</th>
                <th className="py-3 px-3 font-medium w-[20%]">Customer Category</th>
                <th className="py-3 px-3 font-medium w-[18%]">Stage</th>
                <th className="py-3 px-3 font-medium w-[18%]">Last Activity</th>
                <th className="py-3 px-3 text-right font-medium w-[22%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1812]">
              {finalLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#17140e]/80 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-gray-200">
                    {lead.leadName}
                    {lead.value && <span className="block text-[10px] font-mono text-[#FFC107]">₹{Number(lead.value).toLocaleString('en-IN')}</span>}
                  </td>
                  
                  <td className="py-3.5 px-3 text-gray-300">
                    {lead.customer && lead.customer !== 'New lead' ? lead.customer : 'Wholesaler / Client'}
                  </td>
                  
                  <td className="py-3.5 px-3">
                    <div className="relative inline-block">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`appearance-none text-[10px] font-bold px-2.5 py-1 pr-6 rounded-md border cursor-pointer focus:outline-none ${getStageBadgeStyle(lead.stage)}`}
                      >
                        <option value="New" className="bg-[#0c0b09] text-blue-400">New</option>
                        <option value="Contacted" className="bg-[#0c0b09] text-green-400">Contacted</option>
                        <option value="Proposal" className="bg-[#0c0b09] text-[#FFC107]">Proposal</option>
                        <option value="Negotiation" className="bg-[#0c0b09] text-purple-400">Negotiation</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-1.5 top-2 pointer-events-none text-gray-400" />
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-400 font-mono text-[11px]">{lead.lastActivity}</td>

                  {/* Actions Column (Permanent Golden Tint) */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveNoteLead(lead)}
                        title="Notes"
                        className="p-1.5 bg-[#211a10] border border-[#42341d] text-[#FFC107] hover:bg-[#FFC107] hover:text-black rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        <FileText size={14} />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(lead)}
                        title="Edit Lead Details"
                        className="p-1.5 bg-[#211a10] border border-[#42341d] text-[#FFC107] hover:bg-[#FFC107] hover:text-black rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => toggleArchiveLead(lead.id)}
                        title={lead.isArchived ? "Restore Lead" : "Archive Lead"}
                        className={`p-1.5 rounded-lg transition-all shadow-sm border cursor-pointer ${
                          lead.isArchived 
                            ? 'bg-green-950/40 border-green-800 text-green-400 hover:bg-green-500 hover:text-black' 
                            : 'bg-[#211a10] border-[#42341d] text-[#FFC107] hover:bg-[#FFC107] hover:text-black'
                        }`}
                      >
                        {lead.isArchived ? <RotateCcw size={14} /> : <Archive size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {finalLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                    No leads found under this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* --- PIPELINE KANBAN VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {['New', 'Contacted', 'Proposal', 'Negotiation'].map((stage) => {
            const stageLeads = baseFiltered.filter(l => l.stage === stage);
            return (
              <div key={stage} className="bg-[#11100d] border border-[#1f1a12] rounded-xl p-3 flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[#221c13] pb-2 mb-3">
                    <span className="text-xs font-bold text-gray-200">{stage}</span>
                    <span className="text-[10px] bg-[#1a1711] text-[#FFC107] border border-[#332815] font-mono px-2 py-0.5 rounded-md font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="bg-[#171510] border border-[#292116] hover:border-[#FFC107] rounded-xl p-3 shadow-md transition-all space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold text-white leading-tight">{lead.leadName}</h5>
                          
                          <div className="flex gap-1.5">
                            <button onClick={() => handleOpenEdit(lead)} className="text-[#FFC107] hover:scale-110 transition-transform cursor-pointer">
                              <Edit3 size={13} />
                            </button>
                            <button onClick={() => toggleArchiveLead(lead.id)} className="text-[#FFC107] hover:scale-110 transition-transform cursor-pointer">
                              {lead.isArchived ? <RotateCcw size={13} /> : <Archive size={13} />}
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400">{lead.customer || 'Client'}</p>
                        
                        {lead.value && (
                          <p className="text-xs font-mono font-bold text-[#FFC107]">₹{Number(lead.value).toLocaleString('en-IN')}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[#221c13] text-[10px] text-gray-500">
                          <span className="font-mono">{lead.lastActivity}</span>
                          <button onClick={() => setActiveNoteLead(lead)} className="text-[#FFC107] font-bold flex items-center gap-1 hover:underline cursor-pointer">
                            <FileText size={11} /> Note
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Bottom Footer (WORKING VIEW ALL BUTTON) */}
      <div className="mt-4 pt-3 border-t border-[#1a1712]">
        <button 
          onClick={handleViewAllClick}
          className="text-xs text-[#FFC107] font-bold hover:underline flex items-center gap-1.5 cursor-pointer transition-all hover:gap-2 group active:scale-95"
        >
          <span>View All Leads Directory</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* --- MODAL 1: COMPLETE DIRECTORY MODAL --- */}
      {isDirectoryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-4xl max-h-[85vh] p-6 shadow-2xl flex flex-col justify-between">
            
            {/* Header & Search */}
            <div>
              <div className="flex justify-between items-center border-b border-[#241f17] pb-4">
                <div>
                  <h3 className="text-white text-base font-bold flex items-center gap-2">
                    <UserCheck size={20} className="text-[#FFC107]" />
                    Complete Leads Directory
                  </h3>
                  <p className="text-xs text-gray-400">Total Leads in System: {leadsList.length}</p>
                </div>
                <button 
                  onClick={() => setIsDirectoryOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white bg-[#1a1813] hover:bg-[#28241d] rounded-xl cursor-pointer transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search size={15} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search directory by lead or customer name..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC107]"
                />
              </div>
            </div>

            {/* Directory Table List */}
            <div className="overflow-y-auto my-4 rounded-xl border border-[#1f1a12] max-h-[50vh] pr-1">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#17140e] text-gray-400 border-b border-[#292116] z-10">
                  <tr>
                    <th className="py-2.5 px-3">Lead Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Client Type</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1812]">
                  {directoryLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#1a1711] transition-colors">
                      <td className="py-2.5 px-3 text-white font-semibold">
                        {lead.leadName}
                        {lead.value && <span className="block text-[10px] font-mono text-[#FFC107]">₹{Number(lead.value).toLocaleString('en-IN')}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400">{lead.customer || 'Wholesaler / Client'}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#1f1a10] text-[#FFC107] text-[10px] font-mono border border-[#382b17]">
                          {lead.type || 'B2B'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-300 font-medium">{lead.stage}</td>
                      <td className="py-2.5 px-3">
                        {lead.isArchived ? (
                          <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-500/20">Archived</span>
                        ) : (
                          <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-[10px] font-medium border border-green-500/20">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {directoryLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                        No directory leads match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-[#241f17]">
              <button
                onClick={() => setIsDirectoryOpen(false)}
                className="px-4 py-2 bg-[#FFC107] text-black font-bold rounded-xl text-xs cursor-pointer hover:bg-[#e0a800] transition-colors"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT / CREATE LEAD MODAL --- */}
      {(isAddLeadOpen || editingLead) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead} className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#241f17] pb-3">
              <h4 className="text-white text-sm font-bold flex items-center gap-2">
                <Edit3 size={16} className="text-[#FFC107]" />
                {editingLead ? 'Edit Lead Details' : 'Create New Lead'}
              </h4>
              <button 
                type="button"
                onClick={() => { setIsAddLeadOpen(false); setEditingLead(null); }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-gray-400 mb-1 block">Lead / Firm Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Metro Traders"
                  value={leadForm.leadName}
                  onChange={(e) => setLeadForm({ ...leadForm, leadName: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC107]"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Customer Category</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Wholesaler"
                  value={leadForm.customer}
                  onChange={(e) => setLeadForm({ ...leadForm, customer: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFC107]"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Est. Deal Value (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={leadForm.value}
                  onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#FFC107]"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Client Category</label>
                <select
                  value={leadForm.type}
                  onChange={(e) => setLeadForm({ ...leadForm, type: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFC107]"
                >
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Lead Stage</label>
                <select
                  value={leadForm.stage}
                  onChange={(e) => setLeadForm({ ...leadForm, stage: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFC107]"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFC107]"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="buyer@firm.com"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFC107]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#241f17]">
              <button
                type="button"
                onClick={() => { setIsAddLeadOpen(false); setEditingLead(null); }}
                className="px-3 py-1.5 bg-[#1a1813] text-gray-400 hover:text-white rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#FFC107] text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                {editingLead ? 'Save Changes' : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: ADD SE NOTES MODAL --- */}
      {activeNoteLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#241f17] pb-3">
              <div>
                <h4 className="text-white text-sm font-bold">SE Field Notes</h4>
                <p className="text-[11px] text-gray-400">{activeNoteLead.leadName}</p>
              </div>
              <button onClick={() => setActiveNoteLead(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Discussed bulk order discount..."
              className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC107]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveNoteLead(null)} className="px-3 py-1.5 bg-[#1a1813] text-gray-400 hover:text-white rounded-xl text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveNote} className="px-4 py-1.5 bg-[#FFC107] text-black font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                <Check size={14} /> Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SEMyLeadsTable;