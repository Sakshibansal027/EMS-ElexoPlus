import ROLES from "../../../config/roles";

const PROFILE_DATA = {
  /* ==========================================================
                            ADMIN
  ========================================================== */

  [ROLES.ADMIN]: {
    personal: [
      { label: "Date of Birth", value: "15 Mar 2002" },
      { label: "Gender", value: "Male" },
      { label: "Blood Group", value: "B+" },
      { label: "Phone", value: "+91 9876543210" },
    ],

    employment: [
      { label: "Employee ID", value: "EMP001" },
      { label: "Department", value: "Administration" },
      { label: "Reporting To", value: "-" },
      { label: "Joining Date", value: "01 Jan 2025" },
      { label: "Employment Type", value: "Full Time" },
    ],

    contact: [
      { label: "Address", value: "Dwarka, New Delhi" },
      { label: "City", value: "New Delhi" },
      { label: "State", value: "Delhi" },
      { label: "Country", value: "India" },
      { label: "PIN Code", value: "110075" },
    ],

    emergency: [
      { label: "Contact Name", value: "Amit Goel" },
      { label: "Relation", value: "Father" },
      { label: "Phone", value: "+91 9811111111" },
    ],

    bank: [
      { label: "Bank Name", value: "HDFC Bank" },
      { label: "Account Number", value: "XXXX XXXX 4582" },
      { label: "IFSC Code", value: "HDFC0001234" },
      { label: "PAN Number", value: "ABCDE1234F" },
    ],
  },

  /* ==========================================================
                              HR
  ========================================================== */

  [ROLES.HR]: {
    personal: [
      { label: "Date of Birth", value: "08 Jul 2001" },
      { label: "Gender", value: "Female" },
      { label: "Blood Group", value: "O+" },
      { label: "Phone", value: "+91 9876500000" },
    ],

    employment: [
      { label: "Employee ID", value: "EMP021" },
      { label: "Department", value: "Human Resources" },
      { label: "Reporting To", value: "Harshit Goel" },
      { label: "Joining Date", value: "12 Apr 2025" },
      { label: "Employment Type", value: "Full Time" },
    ],

    contact: [
      { label: "Address", value: "Sector 62" },
      { label: "City", value: "Noida" },
      { label: "State", value: "Uttar Pradesh" },
      { label: "Country", value: "India" },
      { label: "PIN Code", value: "201301" },
    ],

    emergency: [
      { label: "Contact Name", value: "Rajesh Bansal" },
      { label: "Relation", value: "Father" },
      { label: "Phone", value: "+91 9898989898" },
    ],

    bank: [
      { label: "Bank Name", value: "ICICI Bank" },
      { label: "Account Number", value: "XXXX XXXX 9821" },
      { label: "IFSC Code", value: "ICIC0005678" },
      { label: "PAN Number", value: "FGHIJ5678K" },
    ],
  },

  /* ==========================================================
                              ASM
  ========================================================== */

  [ROLES.ASM]: {
    personal: [
      { label: "Date of Birth", value: "18 Nov 1999" },
      { label: "Gender", value: "Male" },
      { label: "Blood Group", value: "A+" },
      { label: "Phone", value: "+91 9999988888" },
    ],

    employment: [
      { label: "Employee ID", value: "EMP056" },
      { label: "Designation", value: "Area Sales Manager" },
      { label: "Department", value: "Sales" },
      { label: "Reporting To", value: "Harshit Goel" },
      { label: "Joining Date", value: "15 Feb 2024" },
      { label: "Employment Type", value: "Full Time" },
    ],

    contact: [
      { label: "Address", value: "DLF Phase 2" },
      { label: "City", value: "Gurugram" },
      { label: "State", value: "Haryana" },
      { label: "Country", value: "India" },
      { label: "PIN Code", value: "122002" },
    ],

    emergency: [
      { label: "Contact Name", value: "Neha Kumar" },
      { label: "Relation", value: "Spouse" },
      { label: "Phone", value: "+91 9812345678" },
    ],

    bank: [
      { label: "Bank Name", value: "Axis Bank" },
      { label: "Account Number", value: "XXXX XXXX 4521" },
      { label: "IFSC Code", value: "UTIB0000123" },
      { label: "PAN Number", value: "LMNOP9876Q" },
    ],
  },

  /* ==========================================================
                        SALES EXECUTIVE
  ========================================================== */

  [ROLES.SALES_EXECUTIVE]: {
    personal: [
      { label: "Date of Birth", value: "21 May 2003" },
      { label: "Gender", value: "Female" },
      { label: "Blood Group", value: "AB+" },
      { label: "Phone", value: "+91 9876543210" },
    ],

    employment: [
      { label: "Employee ID", value: "EMP109" },
      { label: "Department", value: "Sales" },
      { label: "Reporting To", value: "Gaurav Kumar" },
      { label: "Joining Date", value: "03 Jan 2026" },
      { label: "Employment Type", value: "Full Time" },
    ],

    contact: [
      { label: "Address", value: "Aliganj" },
      { label: "City", value: "Lucknow" },
      { label: "State", value: "Uttar Pradesh" },
      { label: "Country", value: "India" },
      { label: "PIN Code", value: "226024" },
    ],

    emergency: [
      { label: "Contact Name", value: "Rakesh Barnwal" },
      { label: "Relation", value: "Father" },
      { label: "Phone", value: "+91 9812349876" },
    ],

    bank: [
      { label: "Bank Name", value: "State Bank of India" },
      { label: "Account Number", value: "XXXX XXXX 7854" },
      { label: "IFSC Code", value: "SBIN0000456" },
      { label: "PAN Number", value: "QRSTU1234V" },
    ],
  },
};

export default PROFILE_DATA;