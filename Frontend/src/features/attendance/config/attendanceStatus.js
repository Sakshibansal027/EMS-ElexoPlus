export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  HALF_DAY: "Half Day",
  WFH: "Work From Home",
  LEAVE: "Leave",
  HOLIDAY: "Holiday",
  WEEKEND: "Weekend",
});

export const STATUS_STYLES = {
  [ATTENDANCE_STATUS.PRESENT]: {
    dot: "bg-[#2ecc71]",
    text: "text-[#2ecc71]",
    bg: "bg-[#2ecc71]/10",
    border: "border-[#2ecc71]/30",
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    dot: "bg-[#e74c3c]",
    text: "text-[#e74c3c]",
    bg: "bg-[#e74c3c]/10",
    border: "border-[#e74c3c]/30",
  },
  [ATTENDANCE_STATUS.LATE]: {
    dot: "bg-[#ffbf00]",
    text: "text-[#ffbf00]",
    bg: "bg-[#ffbf00]/10",
    border: "border-[#ffbf00]/30",
  },
  [ATTENDANCE_STATUS.HALF_DAY]: {
    dot: "bg-[#f4a261]",
    text: "text-[#f4a261]",
    bg: "bg-[#f4a261]/10",
    border: "border-[#f4a261]/30",
  },
  [ATTENDANCE_STATUS.WFH]: {
    dot: "bg-[#4dabf7]",
    text: "text-[#4dabf7]",
    bg: "bg-[#4dabf7]/10",
    border: "border-[#4dabf7]/30",
  },
  [ATTENDANCE_STATUS.LEAVE]: {
    dot: "bg-[#a78bfa]",
    text: "text-[#a78bfa]",
    bg: "bg-[#a78bfa]/10",
    border: "border-[#a78bfa]/30",
  },
  [ATTENDANCE_STATUS.HOLIDAY]: {
    dot: "bg-[#f4c21c]",
    text: "text-[#f4c21c]",
    bg: "bg-[#f4c21c]/10",
    border: "border-[#f4c21c]/30",
  },
  [ATTENDANCE_STATUS.WEEKEND]: {
    dot: "bg-[#909090]",
    text: "text-[#909090]",
    bg: "bg-[#909090]/10",
    border: "border-[#909090]/30",
  },
};

export const CORRECTION_STATUS = Object.freeze({
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
});
