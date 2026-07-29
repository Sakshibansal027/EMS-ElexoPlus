import { useState, useRef, useEffect } from "react";
import { Search, Download, ChevronDown, Check, RotateCcw, Eye, X } from "lucide-react";
import Pagination from "../../leave/components/Pagination";

const MasterEmployeePayrollDirectory = ({ data = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dropdown Open States
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const deptRef = useRef(null);
  const roleRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setIsDeptOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset Filters Function
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("All");
    setSelectedRole("All");
    setCurrentPage(1);
  };

  // Dynamic Options extraction
  const departments = ["All", ...new Set(data.map((e) => e.dept).filter(Boolean))];
  const roles = ["All", ...new Set(data.map((e) => e.designation).filter(Boolean))];

  // Filtering Logic for Main Card Table
  const filteredEmployees = data.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === "All" || emp.dept === selectedDept;
    const matchesRole = selectedRole === "All" || emp.designation === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  // Filtering Logic for Full Modal Directory
  const modalFilteredEmployees = data.filter((emp) => {
    return (
      emp.name?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      emp.id?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      emp.dept?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(modalSearch.toLowerCase())
    );
  });

  // Pagination Calculations
  const totalEntries = filteredEmployees.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  const startEntry = totalEntries === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(startIndex + itemsPerPage, totalEntries);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // CSV Export Utility
  const handleExportCSV = (exportData = filteredEmployees) => {
    if (!exportData.length) return;

    const headers = [
      "EMP ID,EMPLOYEE NAME,DEPARTMENT,DESIGNATION,ANNUAL CTC,GROSS MONTHLY,DEDUCTIONS,NET PAYABLE,STATUS",
    ];
    const rows = exportData.map(
      (emp) =>
        `"${emp.id}","${emp.name}","${emp.dept}","${emp.designation}","${emp.ctc}","${emp.monthlyGross}","${emp.deductions || "- ₹0"}","${emp.netPayable}","${emp.status}"`
    );

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Payroll_Directory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="card p-5 shadow-md space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              MASTER EMPLOYEE PAYROLL DIRECTORY
            </h2>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              Complete organization salary roll for July 2026
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-muted-foreground)]" />
              <input
                type="text"
                placeholder="Search Emp ID or Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input text-xs pl-8 pr-3 py-1.5 rounded-full focus:outline-none transition-colors w-44 sm:w-52 placeholder:text-[var(--color-muted-foreground)]"
              />
            </div>

            {/* CUSTOM DEPARTMENT DROPDOWN */}
            <div className="relative" ref={deptRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDeptOpen(!isDeptOpen);
                  setIsRoleOpen(false);
                }}
                className="input text-xs text-[var(--color-foreground)] px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
              >
                <span>{selectedDept === "All" ? "Department" : selectedDept}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </button>

              {isDeptOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl shadow-xl p-1.5 z-50">
                  {departments.map((dept) => {
                    const isSelected = selectedDept === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setSelectedDept(dept);
                          setIsDeptOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-semibold"
                            : "text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)]"
                        }`}
                      >
                        <span>{dept === "All" ? "All Departments" : dept}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CUSTOM ROLE DROPDOWN */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => {
                  setIsRoleOpen(!isRoleOpen);
                  setIsDeptOpen(false);
                }}
                className="input text-xs text-[var(--color-foreground)] px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
              >
                <span>{selectedRole === "All" ? "Role" : selectedRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </button>

              {isRoleOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl shadow-xl p-1.5 z-50">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsRoleOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-semibold"
                            : "text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)]"
                        }`}
                      >
                        <span>{role === "All" ? "All Roles" : role}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RESET FILTERS BUTTON */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="input hover:bg-[var(--color-card-hover)] text-xs text-[var(--color-foreground)] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Reset</span>
            </button>

            {/* VIEW ALL MODAL BUTTON */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="input hover:bg-[var(--color-card-hover)] text-xs text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View All ({data.length})</span>
            </button>

            {/* EXPORT DIRECTORY */}
            <button
              type="button"
              onClick={() => handleExportCSV(filteredEmployees)}
              className="btn-primary px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[var(--color-primary-foreground)]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/50 border-y border-[var(--color-border)] text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                <th className="py-2.5 px-3">EMP ID</th>
                <th className="py-2.5 px-3">EMPLOYEE NAME</th>
                <th className="py-2.5 px-3">DEPARTMENT</th>
                <th className="py-2.5 px-3">DESIGNATION</th>
                <th className="py-2.5 px-3">ANNUAL CTC</th>
                <th className="py-2.5 px-3">GROSS MONTHLY</th>
                <th className="py-2.5 px-3">DEDUCTIONS</th>
                <th className="py-2.5 px-3">NET PAYABLE</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/60 text-xs">
              {currentItems.length > 0 ? (
                currentItems.map((emp) => {
                  const isVerified =
                    emp.status === "Verified" || emp.status === "Active";

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-[var(--color-card-hover)] transition-colors"
                    >
                      <td className="py-3 px-3 text-[var(--color-foreground-muted)] font-mono text-[11px]">
                        {emp.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-[var(--color-foreground)]">
                        {emp.name}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground)]">
                        {emp.dept}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground-muted)]">
                        {emp.designation}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                        {emp.ctc}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                        {emp.monthlyGross}
                      </td>
                      <td className="py-3 px-3 text-[var(--color-danger)] font-medium">
                        {emp.deductions || "- ₹0"}
                      </td>
                      <td className="py-3 px-3 font-bold text-[var(--color-success)]">
                        {emp.netPayable}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isVerified ? (
                          <span className="inline-block text-[10px] font-semibold text-[var(--color-success)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 px-2.5 py-0.5 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 px-2.5 py-0.5 rounded-full">
                            Pending HR
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold">
                        <button
                          type="button"
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer text-xs"
                        >
                          {isVerified ? "View Slip" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="py-8 text-center text-xs text-[var(--color-foreground-muted)]"
                  >
                    No records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION COMPONENT INTEGRATION */}
        {totalEntries > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={totalEntries}
            startEntry={startEntry}
            endEntry={endEntry}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* FULL DIRECTORY POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-card-sub,rgba(255,255,255,0.02))]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--color-primary,yellow)] uppercase tracking-wider">
                    COMPLETE MASTER PAYROLL DIRECTORY
                  </h3>
                  <span className="text-[10px] font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary,yellow)] border border-[var(--color-primary)]/30 px-2.5 py-0.5 rounded-full">
                    {data.length} Total Records
                  </span>
                </div>
                <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
                  Full organizational structure and current payroll status breakdown.
                </p>
              </div>

              {/* Modal Search & Export Actions */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Quick search in modal..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="input text-xs pl-8 pr-3 py-1.5 rounded-full focus:outline-none transition-colors w-48 sm:w-64 placeholder:text-[var(--color-muted-foreground)]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleExportCSV(modalFilteredEmployees)}
                  className="btn-primary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Table Body (Scrollable) */}
            <div className="overflow-y-auto p-5 flex-1 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-muted)]/50 border-y border-[var(--color-border)] text-[10px] font-bold text-[var(--color-foreground-muted)] uppercase tracking-wider">
                      <th className="py-2.5 px-3">EMP ID</th>
                      <th className="py-2.5 px-3">EMPLOYEE NAME</th>
                      <th className="py-2.5 px-3">DEPARTMENT</th>
                      <th className="py-2.5 px-3">DESIGNATION</th>
                      <th className="py-2.5 px-3">ANNUAL CTC</th>
                      <th className="py-2.5 px-3">GROSS MONTHLY</th>
                      <th className="py-2.5 px-3">DEDUCTIONS</th>
                      <th className="py-2.5 px-3">NET PAYABLE</th>
                      <th className="py-2.5 px-3 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/60 text-xs">
                    {modalFilteredEmployees.length > 0 ? (
                      modalFilteredEmployees.map((emp) => {
                        const isVerified =
                          emp.status === "Verified" || emp.status === "Active";

                        return (
                          <tr
                            key={emp.id}
                            className="hover:bg-[var(--color-card-hover)] transition-colors"
                          >
                            <td className="py-3 px-3 text-[var(--color-foreground-muted)] font-mono text-[11px]">
                              {emp.id}
                            </td>
                            <td className="py-3 px-3 font-bold text-[var(--color-foreground)]">
                              {emp.name}
                            </td>
                            <td className="py-3 px-3 text-[var(--color-foreground)]">
                              {emp.dept}
                            </td>
                            <td className="py-3 px-3 text-[var(--color-foreground-muted)]">
                              {emp.designation}
                            </td>
                            <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                              {emp.ctc}
                            </td>
                            <td className="py-3 px-3 text-[var(--color-foreground)] font-medium">
                              {emp.monthlyGross}
                            </td>
                            <td className="py-3 px-3 text-[var(--color-danger)] font-medium">
                              {emp.deductions || "- ₹0"}
                            </td>
                            <td className="py-3 px-3 font-bold text-[var(--color-success)]">
                              {emp.netPayable}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {isVerified ? (
                                <span className="inline-block text-[10px] font-semibold text-[var(--color-success)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 px-2.5 py-0.5 rounded-full">
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 px-2.5 py-0.5 rounded-full">
                                  Pending HR
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="py-12 text-center text-xs text-[var(--color-foreground-muted)]"
                        >
                          No employee record matching "{modalSearch}" found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-card-sub,rgba(255,255,255,0.02))] flex items-center justify-between">
              <span className="text-xs text-[var(--color-foreground-muted)]">
                Showing {modalFilteredEmployees.length} of {data.length} total entries
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="input px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-zinc-800"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MasterEmployeePayrollDirectory;
