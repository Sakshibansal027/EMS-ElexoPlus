// src/features/sales/data/seMockData.js

export const seMockData = {
  profile: {
    id: "SE001",
    name: "Vikram Mehta",
    role: "Sales Executive",
    region: "North Region",
    goodEveningText: "Good Evening, Vikram Mehta",
  },
  topMetrics: {
    target: 500000,
    achievement: 410000,
    achievementPercentage: 82,
    totalOrders: 16,
    ordersSubText: "Total Confirmed Orders",
    projectedIncentive: 12850,
    incentiveSubText: "Based on 82% slab calculation",
  },
  todaysSummary: {
    checkInTime: "09:32 AM",
    checkOutTime: "06:45 PM",
    totalVisits: 5,
    newLeads: 3,
    darStatus: "Submitted",
    expenseStatus: "Submitted",
  },
  darLogs: [
    { date: "19 May 2026", submittedAt: "08:45 PM", status: "Submitted" },
    { date: "18 May 2026", submittedAt: "08:15 PM", status: "Submitted" },
    { date: "17 May 2026", submittedAt: "09:05 PM", status: "Late" },
  ],
  expenses: [
    {
      id: "EXP-101",
      date: "19 May",
      category: "Travel",
      amount: 1250,
      status: "Approved",
    },
    {
      id: "EXP-102",
      date: "18 May",
      category: "Client Meeting",
      amount: 750,
      status: "Approved",
    },
    {
      id: "EXP-103",
      date: "17 May",
      category: "Stationery",
      amount: 300,
      status: "Pending",
    },
  ],
  performanceGauge: {
    target: 500000,
    achieved: 410000,
    balance: 90000,
    percentage: 82,
  },
  targetTrend: {
    timeframe: "This Month",
    insightText: "You are 18% ahead of yesterday",
    data: [
      { date: "01 May", target: 210000, achievement: 100000 },
      { date: "04 May", target: 260000, achievement: 140000 },
      { date: "07 May", target: 330000, achievement: 230000 },
      { date: "11 May", target: 340000, achievement: 220000 },
      { date: "14 May", target: 410000, achievement: 310000 },
      { date: "19 May", target: 450000, achievement: 360000 },
      { date: "21 May", target: 450000, achievement: 370000 },
      { date: "28 May", target: 520000, achievement: 420000 },
      { date: "31 May", target: 600000, achievement: 490000 },
    ],
  },
  myLeads: [
    { id: '1', leadName: 'ABC Distributors', customer: 'Regional Wholesaler', type: 'B2B', stage: 'New', lastActivity: 'Today, 11:30 AM', notes: [] },
    { id: '2', leadName: 'PQR Traders', customer: 'Key Retailer', type: 'B2B', stage: 'New', lastActivity: 'Today, 10:20 AM', notes: [] },
    { id: '3', leadName: 'LMN Mart', customer: 'Supermarket Chain', type: 'B2B', stage: 'Contacted', lastActivity: 'Yesterday, 05:15 PM', notes: [] },
    { id: '4', leadName: 'XYZ Retailers', customer: 'Electronics Hub', type: 'B2B', stage: 'Proposal', lastActivity: '18 May 2026', notes: [] },
    { id: '5', leadName: 'Super Market', customer: 'FMCG Wholesaler', type: 'B2B', stage: 'Negotiation', lastActivity: '17 May 2026', notes: [] },
  ],
  mockSummaryData: {
    totalOrderValue: 220000,
    paymentCollected: 85000,
    totalVisits: 5,
    productiveVisits: 3,
    newLeads: 2,
    ordersCreated: 3,
    leadExpenses: [
      { id: 'EXP-101', leadName: 'ABC Distributors', amount: 450, category: 'Fuel & Conveyance', status: 'Approved' },
      { id: 'EXP-102', leadName: 'PQR Traders', amount: 350, category: 'Client Hospitality', status: 'Pending' },
      { id: 'EXP-103', leadName: 'XYZ Retailers', amount: 120, category: 'Parking & Toll', status: 'Approved' },
    ]
  }
};

export const mockVisitsData = [
  { id: 'VST-101', customer: 'ABC Distributors', location: 'M.I. Road, Jaipur', checkIn: '09:30 AM', checkOut: '10:15 AM', status: 'Completed', purpose: 'Payment Collection', orderValue: 125000 },
  { id: 'VST-102', customer: 'PQR Traders', location: 'Raja Park, Jaipur', checkIn: '10:45 AM', checkOut: '11:40 AM', status: 'Completed', purpose: 'Product Demo', orderValue: 95000 },
  { id: 'VST-103', customer: 'LMN Mart', location: 'Mansarovar, Jaipur', checkIn: '01:00 PM', checkOut: '02:15 PM', status: 'Completed', purpose: 'Order Booking', orderValue: 0 },
  { id: 'VST-104', customer: 'XYZ Retailers', location: 'Sanganer, Jaipur', checkIn: '03:30 PM', checkOut: '03:45 PM', status: 'Cancelled', purpose: 'Follow Up (Store Closed)', orderValue: 0 },
  { id: 'VST-105', customer: 'Super Market', location: 'Tonk Road, Jaipur', checkIn: '04:45 PM', checkOut: '-- : --', status: 'In-Progress', purpose: 'Stock Audit', orderValue: 0 },
];