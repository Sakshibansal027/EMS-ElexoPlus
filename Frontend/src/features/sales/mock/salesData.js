// src/features/sales/mock/salesData.js

const salesData = [
  { month: "Apr", sales: 40000, region: "North", asm: "Rohit" },
  { month: "May", sales: 60000, region: "West", asm: "Ankit" },
  { month: "Jun", sales: 50000, region: "East", asm: "Priya" },
  { month: "Jul", sales: 72000, region: "South", asm: "Neha" },
  { month: "Aug", sales: 68000, region: "North", asm: "Rohit" },
];
export default salesData;

export const mockAsmDashboardData = {
  kpiStats: {
    teamTarget: 5000000,
    teamAchievement: 4120000,
    activeSalesExecutives: 18,
    lowPerformanceAlerts: 3
  },
  
  salesTrend: [
    { date: '01 May', target: 150000, achievement: 120000 },
    { date: '08 May', target: 300000, achievement: 280000 },
    { date: '15 May', target: 450000, achievement: 490000 },
    { date: '22 May', target: 600000, achievement: 580000 },
    { date: '29 May', target: 750000, achievement: 810000 }
  ],

  sePerformanceList: [
    { id: 'SE001', name: 'Amit Verma', territory: 'North Zone', target: 500000, achievement: 450000, compliance: 92, visits: { total: 42, completed: 38, pending: 4 } },
    { id: 'SE002', name: 'Rohit Sharma', territory: 'North Zone', target: 600000, achievement: 570000, compliance: 95, visits: { total: 45, completed: 43, pending: 2 } },
    { id: 'SE003', name: 'Nisha Singh', territory: 'East Zone', target: 400000, achievement: 260000, compliance: 65, visits: { total: 38, completed: 25, pending: 13 } },
    { id: 'SE004', name: 'Sanjay Patel', territory: 'South Zone', target: 550000, achievement: 420000, compliance: 76, visits: { total: 40, completed: 32, pending: 8 } }
  ],

  // Lead Details array fully aligned with dashboard UI expectations
  leadsPipeline: [
    { 
      id: 'LD-401', 
      segment: 'B2B', 
      name: 'Vertex Industries', 
      contact: 'Rakesh Verma', 
      phone: '9876543210', 
      value: 350000, 
      assignedSeId: 'SE001', 
      assignedSeName: 'Amit Verma', 
      status: 'Negotiation' 
    },
    { 
      id: 'LD-402', 
      segment: 'B2B', 
      name: 'Matrix Logistics', 
      contact: 'Sanjay Gupta', 
      phone: '9812345678', 
      value: 180000, 
      assignedSeId: 'SE002', 
      assignedSeName: 'Rohit Sharma', 
      status: 'Proposal Sent' 
    },
    { 
      id: 'LD-403', 
      segment: 'B2C', 
      name: 'Anil Mehta (Retail)', 
      contact: 'Anil Mehta', 
      phone: '9944556677', 
      value: 45000, 
      assignedSeId: 'SE003', 
      assignedSeName: 'Nisha Singh', 
      status: 'Demo Scheduled' 
    },
    { 
      id: 'LD-404', 
      segment: 'B2B', 
      name: 'Apex Corp', 
      contact: 'Vikram Malhotra', 
      phone: '9765432109', 
      value: 620000, 
      assignedSeId: 'SE001', 
      assignedSeName: 'Amit Verma', 
      status: 'New Lead' 
    }
  ],

  recentOrders: [
    { id: 'ORD-1021', clientName: 'Rudra Industries', value: 125000, status: 'Confirmed', date: '19 May 2026' },
    { id: 'ORD-1022', clientName: 'Balaji Traders', value: 75000, status: 'Pending', date: '18 May 2026' },
    { id: 'ORD-1023', clientName: 'Mittals Corp', value: 350000, status: 'Dispatched', date: '17 May 2026' }
  ],

  recentActivities: [
    { id: 1, text: 'Amit Verma submitted operational report', time: 'Today 10:30 AM', type: 'report' },
    { id: 2, text: 'Nisha Singh missed check-out at Jaipur route', time: 'Today 09:15 AM', type: 'alert' },
    { id: 3, text: 'Sanjay Patel achieved 80% of weekly target', time: 'Yesterday 06:00 PM', type: 'milestone' }
  ]
};