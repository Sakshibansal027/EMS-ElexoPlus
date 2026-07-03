const employees = [
 {
  id: "EMP001",
  name: "Rahul Sharma",
  designation: "Senior Software Engineer",
  department: "Development",
  role: "Team Lead",

  email: "rahul@elexoplus.com",
  phone: "+91 9876543210",

  address: "Bangalore",

  gender: "Male",

  dob: "15 Aug 1997",

  joiningDate: "12 Jan 2022",

  manager: "Amit Verma",

  employmentType: "Full Time",

  location: "Bangalore",

  status: "Active",

  bankName: "HDFC",

  accountNo: "XXXXXX67890",

  ifsc: "HDFC000123",

  pan: "ABCDE1234F",

  aadhaar: "XXXX-XXXX-1234",

  uan: "10012345678",

  grossSalary: "₹72,000",

  basicSalary: "₹40,000",

  hra: "₹16,000",

  allowance: "₹8,000",

  bonus: "₹8,000",

  netSalary: "₹57,500",

  casualLeave: 8,

  earnedLeave: 15,

  sickLeave: 10,

  documents: [
    { name: "PAN Card", status: "Uploaded" },
    { name: "Aadhaar", status: "Uploaded" },
    { name: "Resume", status: "Uploaded" },
    { name: "Offer Letter", status: "Uploaded" },
  ],
},
  {
    id: "EMP002",
    name: "Sneha Kapoor",
    designation: "QA Engineer",
    department: "Testing",
    email: "sneha@elexoplus.com",
    phone: "+91 9876543223",
    joiningDate: "09 Sep 2024",
    manager: "Rahul Sharma",
    status: "Active",
    salary: {
      basic: 40000,
      hra: 16000,
      bonus: 5000,
      deduction: 3500,
      total: 57500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
    },

    address: "Jaipur, Rajasthan",

    dob: "18 Jan 1999",

    gender: "Female",

    emergencyContact: "+91 9876543210",
  },
  {
    id: "EMP003",
    name: "Amit Singh",
    designation: "Sales Executive",
    department: "Sales",
    email: "amit@elexoplus.com",
    phone: "+91 9876543290",
    joiningDate: "20 Mar 2025",
    manager: "Rajesh Sharma",
    status: "Inactive",
    salary: {
      basic: 40000,
      hra: 16000,
      bonus: 5000,
      deduction: 3500,
      total: 57500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
    },

    address: "Jaipur, Rajasthan",

    dob: "18 Jan 1999",

    gender: "Female",

    emergencyContact: "+91 9876543210",
  },
  {
    id: "EMP004",
    name: "Neha Gupta",
    designation: "UI/UX Designer",
    department: "Design",
    email: "neha@elexoplus.com",
    phone: "+91 9876543278",
    joiningDate: "08 Apr 2025",
    manager: "Admin Kumar",
    status: "Active",
    salary: {
      basic: 40000,
      hra: 16000,
      bonus: 5000,
      deduction: 3500,
      total: 57500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
    },

    address: "Jaipur, Rajasthan",

    dob: "18 Jan 1999",

    gender: "Female",

    emergencyContact: "+91 9876543210",
  },
  {
    id: "EMP005",
    name: "Rohit Mehta",
    designation: "Accountant",
    department: "Finance",
    email: "rohit@elexoplus.com",
    phone: "+91 9876543267",
    joiningDate: "18 May 2025",
    manager: "Admin Kumar",
    status: "Active",
    salary: {
      basic: 40000,
      hra: 16000,
      bonus: 5000,
      deduction: 3500,
      total: 57500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
    },

    address: "Jaipur, Rajasthan",

    dob: "18 Jan 1999",

    gender: "Female",

    emergencyContact: "+91 9876543210",
  },
  {
    id: "EMP006",
    name: "Karan Malhotra",
    designation: "Operations Executive",
    department: "Operations",
    email: "karan@elexoplus.com",
    phone: "+91 9876543256",
    joiningDate: "02 Jun 2025",
    manager: "Anjali Sharma",
    status: "Inactive",
    salary: {
      basic: 40000,
      hra: 16000,
      bonus: 5000,
      deduction: 3500,
      total: 57500,
    },
    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },
    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
    },

    address: "Jaipur, Rajasthan",

    dob: "18 Jan 1999",

    gender: "Female",

    emergencyContact: "+91 9876543210",
  },

  ,
];

export default employees;
