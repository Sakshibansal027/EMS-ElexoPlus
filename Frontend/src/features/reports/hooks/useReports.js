import { useState, useEffect, useMemo } from "react";
import { reportsService } from "../services/reportsService";
import { downloadCSV, downloadPDF } from "../utils/exportUtils";

export const useReports = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  // Data state
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [asmRecords, setAsmRecords] = useState([]);
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [employee, setEmployee] = useState("All");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      reportsService.getAttendanceReports(),
      reportsService.getSalesReports(),
      reportsService.getAsmReports(),
      reportsService.getEmployeeReports(),
      reportsService.getCompanyMetrics(),
      reportsService.getChartData(),
    ]).then(([att, sales, asm, emp, met, charts]) => {
      if (mounted) {
        setAttendanceRecords(att);
        setSalesRecords(sales);
        setAsmRecords(asm);
        setEmployeeRecords(emp);
        setMetrics(met);
        setChartData(charts);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  // Filtered Data
  const filteredAttendance = useMemo(() => {
    let data = attendanceRecords;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => r.employeeName.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q));
    }
    if (employee !== "All") data = data.filter(r => r.employeeName === employee);
    if (department !== "All") data = data.filter(r => r.department === department);
    if (status !== "All") data = data.filter(r => r.status === status);
    if (dateFrom) data = data.filter(r => new Date(r.date) >= new Date(dateFrom));
    if (dateTo) data = data.filter(r => new Date(r.date) <= new Date(dateTo));
    return data;
  }, [attendanceRecords, search, employee, department, status, dateFrom, dateTo]);

  const filteredSales = useMemo(() => {
    let data = salesRecords;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => r.salesExecutive.toLowerCase().includes(q) || r.asm.toLowerCase().includes(q));
    }
    if (employee !== "All") data = data.filter(r => r.salesExecutive === employee || r.asm === employee);
    if (region !== "All") data = data.filter(r => r.region === region);
    if (status !== "All") data = data.filter(r => r.status === status);
    return data;
  }, [salesRecords, search, employee, region, status]);

  const filteredAsm = useMemo(() => {
    let data = asmRecords;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => r.asmName.toLowerCase().includes(q));
    }
    if (employee !== "All") data = data.filter(r => r.asmName === employee);
    if (region !== "All") data = data.filter(r => r.region === region);
    return data;
  }, [asmRecords, search, employee, region]);

  const filteredEmployees = useMemo(() => {
    let data = employeeRecords;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    }
    if (department !== "All") data = data.filter(r => r.department === department);
    if (status !== "All") data = data.filter(r => r.status === status);
    return data;
  }, [employeeRecords, search, department, status]);

  // Export actions
  const handleExportCSV = (data, columns, filename) => {
    downloadCSV(data, columns, filename);
  };

  const handleExportPDF = (data, columns, title, filename) => {
    downloadPDF(data, columns, title, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    activeTab, setActiveTab,
    loading,
    metrics, chartData,

    // Filters
    filters: { search, dateFrom, dateTo, employee, department, status, region },
    setSearch, setDateFrom, setDateTo, setEmployee, setDepartment, setStatus, setRegion,

    // Filtered lists
    filteredAttendance,
    filteredSales,
    filteredAsm,
    filteredEmployees,

    // Original lists
    employeeRecords,

    // Exports
    handleExportCSV, handleExportPDF, handlePrint,
  };
};
