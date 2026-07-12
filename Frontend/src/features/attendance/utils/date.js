export const pad = (n) => String(n).padStart(2, "0");

export const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const formatPrettyDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const monthName = (m) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][m];

export const getMonthMatrix = (year, month) => {
  // returns 6x7 array of { date, currentMonth }
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const matrix = [];
  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      let date;
      let currentMonth = true;
      if (day < 1) {
        date = new Date(year, month - 1, daysInPrev + day);
        currentMonth = false;
      } else if (day > daysInMonth) {
        date = new Date(year, month + 1, day - daysInMonth);
        currentMonth = false;
      } else {
        date = new Date(year, month, day);
      }
      row.push({ date, currentMonth });
      day++;
    }
    matrix.push(row);
  }
  return matrix;
};

export const diffHours = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(0, (e - s) / 3600000);
};

export const formatHours = (h) => {
  if (!h) return "—";
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${hours}h ${pad(mins)}m`;
};
