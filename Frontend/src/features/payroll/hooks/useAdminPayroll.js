import { useState, useEffect, useRef } from "react";
import adminService from "../services/adminService";

export const useAdminPayroll = () => {
  const [rawStats, setRawStats] = useState([]);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [lopCases, setLopCases] = useState([]);
  const [reports, setReports] = useState([]); // <-- State for Reports
  const [bankTransfers, setBankTransfers] = useState([]); // <-- State for Bank Transfers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const salaryStructureRef = useRef(null);
  const payrollTableRef = useRef(null);
  const salaryRevisionRef = useRef(null);
  const lopCasesRef = useRef(null);
  const reportsRef = useRef(null); // <-- Ref for Reports Section
  const bankTransfersRef = useRef(null); // <-- Ref for Bank Transfers Section

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, recordsRes, summaryRes, revisionsRes, lopRes, reportsRes, transfersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPayrollRecords(),
        adminService.getPayrollSummary(),
        adminService.getSalaryRevisions(),
        adminService.getLopCases(),
        adminService.getPayrollReports(), // <-- Fetch Reports
        adminService.getBankTransfers(), // <-- Fetch Bank Transfers
      ]);

      setRawStats(statsRes);
      setRecords(recordsRes.data || recordsRes);
      setSummary(summaryRes.data || summaryRes);
      setSalaryRevisions(revisionsRes.data || revisionsRes);
      setLopCases(lopRes.data || lopRes);
      setReports(reportsRes.data || reportsRes);
      setBankTransfers(transfersRes.data || transfersRes);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Dynamic Stats Mapping ---
  const stats = rawStats.map((stat) => {
    if (stat.title === "SALARY REVISION PENDING") {
      return {
        ...stat,
        value: `${salaryRevisions.length} Requests`,
      };
    }
    if (stat.title === "LOP CASES") {
      return {
        ...stat,
        value: `${lopCases.length} Employees`,
      };
    }
    return stat;
  });

  const processPayroll = async (payrollId) => {
    try {
      await adminService.processPayroll(payrollId);
      const updatedRecords = await adminService.getPayrollRecords();
      setRecords(updatedRecords.data || updatedRecords);
    } catch (err) {
      console.error("Failed to process payroll:", err);
    }
  };

  // --- Salary Revision Actions ---
  const approveSalaryRevision = async (id) => {
    try {
      await adminService.approveSalaryRevision(id);
      const res = await adminService.getSalaryRevisions();
      setSalaryRevisions(res.data || res);
    } catch (err) {
      console.error("Failed to approve revision:", err);
    }
  };

  const rejectSalaryRevision = async (id) => {
    try {
      await adminService.rejectSalaryRevision(id);
      const res = await adminService.getSalaryRevisions();
      setSalaryRevisions(res.data || res);
    } catch (err) {
      console.error("Failed to reject revision:", err);
    }
  };

  // --- LOP Cases Actions ---
  const resolveLopCase = async (id) => {
    try {
      await adminService.resolveLopCase(id);
      const res = await adminService.getLopCases();
      setLopCases(res.data || res);
    } catch (err) {
      console.error("Failed to resolve LOP case:", err);
    }
  };

  const handleCardClick = (targetTab) => {
    if (targetTab === "salary-structures" && salaryStructureRef.current) {
      salaryStructureRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (targetTab === "payroll-disbursements" && payrollTableRef.current) {
      payrollTableRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (targetTab === "revisions" && salaryRevisionRef.current) {
      salaryRevisionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (targetTab === "lop-desk" && lopCasesRef.current) {
      lopCasesRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (targetTab === "reports" && reportsRef.current) {
      reportsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (targetTab === "transfers" && bankTransfersRef.current) {
      bankTransfersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    stats,
    records,
    summary,
    salaryRevisions,
    lopCases,
    reports,
    bankTransfers,
    loading,
    error,
    salaryStructureRef,
    payrollTableRef,
    salaryRevisionRef,
    lopCasesRef,
    reportsRef,
    bankTransfersRef,
    processPayroll,
    approveSalaryRevision,
    rejectSalaryRevision,
    resolveLopCase,
    handleCardClick,
    refetch: fetchData,
  };
};
