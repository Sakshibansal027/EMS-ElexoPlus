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

    role: "QA Engineer",

    email: "sneha@elexoplus.com",

    phone: "+91 9876543223",

    address: "Jaipur, Rajasthan",

    gender: "Female",

    dob: "18 Jan 1999",

    joiningDate: "09 Sep 2024",

    manager: "Rahul Sharma",

    employmentType: "Full Time",

    location: "Jaipur",

    status: "Active",

    salary: {
      basic: 40000,
      hra: 16000,
      allowance: 8000,
      bonus: 5000,
      deduction: 3500,
      total: 65500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
      uan: "10012345679",
    },
  },
  {
    id: "EMP003",

    name: "Amit Singh",

    designation: "Sales Executive",

    department: "Sales",

    role: "Sales Executive",

    email: "amit@elexoplus.com",

    phone: "+91 9876543290",

    address: "Jaipur, Rajasthan",

    gender: "Male",

    dob: "22 Mar 1998",

    joiningDate: "20 Mar 2025",

    manager: "Rajesh Sharma",

    employmentType: "Full Time",

    location: "Jaipur",

    status: "Inactive",

    salary: {
      basic: 40000,
      hra: 16000,
      allowance: 8000,
      bonus: 5000,
      deduction: 3500,
      total: 65500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4590",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "BCDEF2345G",
      aadhaar: "2345-6789-0123",
      uan: "10012345680",
    },
  },
  {
    id: "EMP004",

    name: "Neha Gupta",

    designation: "UI/UX Designer",

    department: "Design",

    role: "UI/UX Designer",

    email: "neha@elexoplus.com",

    phone: "+91 9876543278",

    address: "Jaipur, Rajasthan",

    gender: "Female",

    dob: "05 Jul 1997",

    joiningDate: "08 Apr 2025",

    manager: "Admin Kumar",

    employmentType: "Full Time",

    location: "Jaipur",

    status: "Active",

    salary: {
      basic: 45000,
      hra: 18000,
      allowance: 7000,
      bonus: 6000,
      deduction: 4000,
      total: 72000,
    },

    bank: {
      bankName: "ICICI Bank",
      accountNo: "XXXXXX4591",
      ifsc: "ICIC0000456",
    },

    documents: {
      pan: "CDEFG3456H",
      aadhaar: "3456-7890-1234",
      uan: "10012345681",
    },
  },
  {
    id: "EMP005",

    name: "Rohit Mehta",

    designation: "Accountant",

    department: "Finance",

    role: "Accountant",

    email: "rohit@elexoplus.com",

    phone: "+91 9876543267",

    address: "Jaipur, Rajasthan",

    gender: "Male",

    dob: "12 Nov 1996",

    joiningDate: "18 May 2025",

    manager: "Admin Kumar",

    employmentType: "Full Time",

    location: "Jaipur",

    status: "Active",

    salary: {
      basic: 42000,
      hra: 17000,
      allowance: 6000,
      bonus: 5000,
      deduction: 3500,
      total: 66500,
    },

    bank: {
      bankName: "Axis Bank",
      accountNo: "XXXXXX4592",
      ifsc: "UTIB0000789",
    },

    documents: {
      pan: "DEFGH4567J",
      aadhaar: "4567-8901-2345",
      uan: "10012345682",
    },
  },
  {
    id: "EMP006",

    name: "Karan Malhotra",

    designation: "Operations Executive",

    department: "Operations",

    role: "Operations Executive",

    email: "karan@elexoplus.com",

    phone: "+91 9876543256",

    address: "Jaipur, Rajasthan",

    gender: "Male",

    dob: "10 Oct 1998",

    joiningDate: "02 Jun 2025",

    manager: "Anjali Sharma",

    employmentType: "Full Time",

    location: "Jaipur",

    status: "Inactive",

    salary: {
      basic: 40000,
      hra: 16000,
      allowance: 8000,
      bonus: 5000,
      deduction: 3500,
      total: 65500,
    },

    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX4589",
      ifsc: "HDFC000123",
    },

    documents: {
      pan: "ABCDE1234F",
      aadhaar: "1234-5678-9012",
      uan: "10012345678",
    },
  },

  ,
];

export default employees;
