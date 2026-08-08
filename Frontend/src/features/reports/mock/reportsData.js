const EMPLOYEES = [
  { id: "EMP001", name: "Harshit Goel", role: "Administrator", department: "Management", branch: "Head Office", designation: "Administrator" },
  { id: "EMP002", name: "Sakshi Bansal", role: "HR Manager", department: "Human Resources", branch: "Head Office", designation: "HR Manager" },
  { id: "EMP003", name: "Gaurav Kumar", role: "Area Sales Manager", department: "Sales", branch: "Delhi", designation: "ASM" },
  { id: "EMP004", name: "Nisha Barnwal", role: "Sales Executive", department: "Sales", branch: "Delhi", designation: "Sales Executive" },
  { id: "EMP005", name: "Niyati Kansal", role: "Sales Executive", department: "Sales", branch: "Mumbai", designation: "Sales Executive" },
  { id: "EMP006", name: "Rahul Sharma", role: "Sales Executive", department: "Sales", branch: "Bangalore", designation: "Sales Executive" },
  { id: "EMP007", name: "Priya Verma", role: "HR Executive", department: "Human Resources", branch: "Head Office", designation: "HR Executive" },
  { id: "EMP008", name: "Aditya Mehra", role: "Sales Executive", department: "Sales", branch: "Pune", designation: "Sales Executive" },
  { id: "EMP009", name: "Kavita Singh", role: "Area Sales Manager", department: "Sales", branch: "Mumbai", designation: "ASM" },
  { id: "EMP010", name: "Rohan Malhotra", role: "Sales Executive", department: "Sales", branch: "Delhi", designation: "Sales Executive" },
  { id: "EMP011", name: "Neha Kapoor", role: "Sales Executive", department: "Sales", branch: "Bangalore", designation: "Sales Executive" },
  { id: "EMP012", name: "Vikram Joshi", role: "Area Sales Manager", department: "Sales", branch: "Chennai", designation: "ASM" },
];

const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const getInitials = (name) => name.split(" ").map(n => n[0]).join("");

const generateAttendanceReports = () => {
  const records = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  EMPLOYEES.forEach(emp => {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = date.getDay();

      if (day !== 0 && day !== 6) {
        const seed = hash(emp.id + date.toDateString());
        const statusTypes = ["Present", "Present", "Present", "Late", "WFH", "Leave", "Absent"];
        const status = statusTypes[seed % statusTypes.length];

        let checkIn = null, checkOut = null, workingHours = 0;
        if (["Present", "Late", "WFH"].includes(status)) {
          const inH = status === "Late" ? 10 : 9;
          const inM = seed % 45;
          checkIn = new Date(date);
          checkIn.setHours(inH, inM, 0, 0);

          checkOut = new Date(date);
          checkOut.setHours(18, 30 + (seed % 30), 0, 0);

          workingHours = ((checkOut - checkIn) / 3600000) - 0.75;
        }

        records.push({
          id: `${emp.id}-${date.toISOString().split("T")[0]}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: getInitials(emp.name),
          department: emp.department,
          date: date.toISOString(),
          checkIn: checkIn ? checkIn.toISOString() : null,
          checkOut: checkOut ? checkOut.toISOString() : null,
          workingHours: Math.max(0, workingHours),
          status,
          remarks: status === "Late" ? "Traffic" : "",
        });
      }
    }
  });
  return records;
};

const generateSalesReports = () => {
  const records = [];
  const salesExecs = EMPLOYEES.filter(e => e.designation === "Sales Executive");
  const asms = EMPLOYEES.filter(e => e.designation === "ASM");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const regionMap = { Delhi: "Delhi", Mumbai: "Mumbai", Bangalore: "Bangalore", Pune: "Pune", Chennai: "Chennai" };
  const statusTypes = ["On Track", "On Track", "Exceeded", "Behind Target"];

  salesExecs.forEach((exec) => {
    months.forEach((month, mi) => {
      const seed = hash(exec.id + month);
      const asm = asms.find(a => a.branch === exec.branch) || asms[0];
      const target = 50000 + (seed % 30000);
      const achievement = Math.round(target * (0.6 + (seed % 60) / 100));
      const percentage = (achievement / target) * 100;
      const statusIdx = seed % statusTypes.length;

      records.push({
        id: `${exec.id}-${month}`,
        salesExecutive: exec.name,
        asm: asm.name,
        region: regionMap[exec.branch] || "Delhi",
        month,
        target,
        achievement,
        percentage,
        rank: mi + 1,
        status: statusTypes[statusIdx],
      });
    });
  });
  return records;
};

const generateAsmReports = () => {
  const asms = EMPLOYEES.filter(e => e.designation === "ASM");
  return asms.map((asm, idx) => {
    const seed = hash(asm.id);
    const target = 200000 + (seed % 100000);
    const achievement = Math.round(target * (0.7 + (seed % 40) / 100));
    const percentage = (achievement / target) * 100;
    return {
      id: asm.id,
      asmName: asm.name,
      region: asm.branch,
      teamSize: 3 + (seed % 4),
      target,
      achievement,
      percentage,
      teamPerformance: 65 + (seed % 30),
      rank: idx + 1,
    };
  });
};

const getEmployeeReports = () => {
  return EMPLOYEES.map(emp => ({
    id: emp.id,
    name: emp.name,
    department: emp.department,
    designation: emp.designation,
    branch: emp.branch,
    employmentType: emp.designation === "Administrator" ? "Full-Time" : "Permanent",
    joiningDate: new Date(2022, hash(emp.id) % 12, (hash(emp.id) % 28) + 1).toISOString(),
    status: "Active",
  }));
};

const getCompanyMetrics = () => ({
  overview: {
    totalEmployees: EMPLOYEES.length,
    avgAttendance: 88,
    salesAchievement: 76,
    activeReports: 6,
  },
  companyKpis: {
    totalRevenue: { value: "₹28.4L", trend: "+12.3%" },
    overallAttendance: { value: "88%", trend: "+2.1%" },
    activeEmployees: { value: "12", trend: "+1 new" },
    customerSatisfaction: { value: "4.6/5", trend: "+0.2" },
  },
});

const getChartData = () => ({
  monthlyAttendanceTrend: [
    { day: "Jan", present: 85, late: 5, absent: 10 },
    { day: "Feb", present: 88, late: 4, absent: 8 },
    { day: "Mar", present: 90, late: 6, absent: 4 },
    { day: "Apr", present: 87, late: 8, absent: 5 },
    { day: "May", present: 92, late: 3, absent: 5 },
    { day: "Jun", present: 95, late: 2, absent: 3 },
    { day: "Jul", present: 94, late: 4, absent: 2 },
  ],
  salesCategoryBreakdown: [
    { name: "Electronics", value: 35 },
    { name: "Appliances", value: 25 },
    { name: "Accessories", value: 20 },
    { name: "Services", value: 12 },
    { name: "Others", value: 8 },
  ],
  departmentPerformance: [
    { name: "Management", value: 92 },
    { name: "HR", value: 88 },
    { name: "Sales", value: 75 },
    { name: "Marketing", value: 82 },
    { name: "Operations", value: 85 },
  ],
  monthlySalesTrend: [
    { name: "Jan", target: 50, actual: 45 },
    { name: "Feb", target: 50, actual: 48 },
    { name: "Mar", target: 55, actual: 58 },
    { name: "Apr", target: 55, actual: 52 },
    { name: "May", target: 60, actual: 50 },
    { name: "Jun", target: 60, actual: 65 },
    { name: "Jul", target: 65, actual: 61 },
  ],
  regionAchievement: [
    { name: "Delhi", value: 85 },
    { name: "Mumbai", value: 78 },
    { name: "Bangalore", value: 92 },
    { name: "Pune", value: 65 },
    { name: "Chennai", value: 70 },
  ],
  companyPerformanceTrend: [
    { day: "Jan", present: 85, late: 5, absent: 10 },
    { day: "Feb", present: 88, late: 4, absent: 8 },
    { day: "Mar", present: 90, late: 6, absent: 4 },
    { day: "Apr", present: 87, late: 8, absent: 5 },
    { day: "May", present: 92, late: 3, absent: 5 },
    { day: "Jun", present: 95, late: 2, absent: 3 },
    { day: "Jul", present: 94, late: 4, absent: 2 },
  ],
  regionTeamDistribution: [
    { name: "Delhi", value: 24 },
    { name: "Mumbai", value: 18 },
    { name: "Bangalore", value: 22 },
    { name: "Pune", value: 15 },
    { name: "Chennai", value: 12 },
  ],
});

export const reportsData = {
  attendanceReports: generateAttendanceReports(),
  salesReports: generateSalesReports(),
  asmReports: generateAsmReports(),
  employeeReports: getEmployeeReports(),
  metrics: getCompanyMetrics(),
  chartData: getChartData(),
};
