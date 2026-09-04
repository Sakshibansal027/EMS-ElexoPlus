import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

export const buildWeeklyTrend = (records = []) => {
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  return dates.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const dayRecords = records.filter((record) => String(record.date).slice(0, 10) === key);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      present: dayRecords.filter((record) => [ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.WFH].includes(record.status)).length,
      late: dayRecords.filter((record) => record.status === ATTENDANCE_STATUS.LATE).length,
      absent: dayRecords.filter((record) => record.status === ATTENDANCE_STATUS.ABSENT).length,
    };
  });
};
