export const initialCompanySettings = {
  companyName: "ElexoPlus Pvt. Ltd.",
  tagline: "Empowering Enterprises",
  email: "contact@elexoplus.com",
  phone: "+91 9876543210",
  website: "www.elexoplus.com",
  address: "123, Tech Park, Sector 21, Gurugram, Haryana - 122001",
  city: "Gurugram",
  state: "Haryana",
  country: "India",
  pincode: "122001",
  logo: null,
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  timezone: "Asia/Kolkata",
  dateFormat: "DD-MMM-YYYY",
  currency: "INR",
};

export const initialDepartments = [
  { id: 1, name: "Development", head: "Harshit Goel", status: "Active" },
  { id: 2, name: "Testing", head: "Sneha Kapoor", status: "Active" },
  { id: 3, name: "Sales", head: "Gaurav Kumar", status: "Active" },
  { id: 4, name: "Design", head: "Neha Gupta", status: "Active" },
  { id: 5, name: "Finance", head: "Vikram Singh", status: "Active" },
  { id: 6, name: "Operations", head: "Rajesh Mehta", status: "Active" },
  { id: 7, name: "HR", head: "Sakshi Bansal", status: "Active" },
  { id: 8, name: "Marketing", head: null, status: "Inactive" },
];

export const initialDesignations = [
  { id: 1, name: "Administrator", department: "Management" },
  { id: 2, name: "HR Manager", department: "HR" },
  { id: 3, name: "Senior Software Engineer", department: "Development" },
  { id: 4, name: "QA Engineer", department: "Testing" },
  { id: 5, name: "Sales Executive", department: "Sales" },
  { id: 6, name: "Area Sales Manager", department: "Sales" },
  { id: 7, name: "UI/UX Designer", department: "Design" },
  { id: 8, name: "Accountant", department: "Finance" },
  { id: 9, name: "DevOps Engineer", department: "Development" },
  { id: 10, name: "Operations Executive", department: "Operations" },
  { id: 11, name: "HR Executive", department: "HR" },
  { id: 12, name: "Marketing Executive", department: "Marketing" },
];

export const initialEmploymentTypes = [
  { id: 1, name: "Full Time", status: "Active" },
  { id: 2, name: "Part Time", status: "Active" },
  { id: 3, name: "Intern", status: "Active" },
  { id: 4, name: "Contract", status: "Active" },
  { id: 5, name: "Probation", status: "Active" },
];

export const initialEmployeeStatuses = [
  { id: 1, name: "Active", color: "#2ecc71" },
  { id: 2, name: "Inactive", color: "#e74c3c" },
  { id: 3, name: "Probation", color: "#ffbf00" },
  { id: 4, name: "Notice Period", color: "#e67e22" },
];

export const initialPreferences = {
  appearance: {
    theme: "dark",
    fontSize: "medium",
    compactMode: false,
    reducedMotion: false,
  },
  notifications: {
    email: {
      leaveUpdates: true,
      attendanceAlerts: false,
      payrollUpdates: true,
      taskAssignments: true,
      systemAnnouncements: false,
    },
    inApp: {
      leaveUpdates: true,
      attendanceAlerts: true,
      payrollUpdates: true,
      taskAssignments: true,
      systemAnnouncements: true,
    },
    pushEnabled: false,
    digestFrequency: "immediate",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  },
  language: {
    preferred: "en",
    timeFormat: "12h",
    firstDayOfWeek: "monday",
  },
};
