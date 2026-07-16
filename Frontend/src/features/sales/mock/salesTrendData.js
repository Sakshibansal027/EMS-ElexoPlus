// BASE DATA (only monthly)
export const monthlySalesData = [
  { name: "Jan", sales: 20000 },
  { name: "Feb", sales: 28000 },
  { name: "Mar", sales: 22000 },

  { name: "Apr", sales: 45000 },
  { name: "May", sales: 40000 },
  { name: "Jun", sales: 52000 },

  { name: "Jul", sales: 70000 },
  { name: "Aug", sales: 65000 },
  { name: "Sep", sales: 72000 },

  { name: "Oct", sales: 80000 },
  { name: "Nov", sales: 85000 },
  { name: "Dec", sales: 90000 },
];


//  DERIVED DATA (quarterly)
export const getQuarterlySales = (data) => {
  return [
    {
      name: "Q1",
      sales: data.slice(0, 3).reduce((sum, d) => sum + d.sales, 0),
    },
    {
      name: "Q2",
      sales: data.slice(3, 6).reduce((sum, d) => sum + d.sales, 0),
    },
    {
      name: "Q3",
      sales: data.slice(6, 9).reduce((sum, d) => sum + d.sales, 0),
    },
    {
      name: "Q4",
      sales: data.slice(9, 12).reduce((sum, d) => sum + d.sales, 0),
    },
  ];
};