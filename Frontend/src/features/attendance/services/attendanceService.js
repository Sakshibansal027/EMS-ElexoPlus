import client from "../../../api/client";
import authStorage from "../../auth/utils/authStorage";

let cache = null;
let pending = null;
let cacheToken = null;
let pendingToken = null;
const errorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

const getOverview = async ({ force = false } = {}) => {
  // The module is kept alive during logout/login in the SPA. Never let a
  // previous user's cached attendance become visible to the next user.
  const token = authStorage.getToken();
  if (cacheToken !== token) {
    cache = null;
    cacheToken = token;
  }
  if (!force && cache) return cache;
  if (!force && pending && pendingToken === token) return pending;
  pending = client.get("/attendance/overview").then(({ data }) => {
    if (!data?.success) throw new Error(data?.message || "Unable to load attendance.");
    // A late response from a logged-out user must not populate the new
    // session's cache.
    if (authStorage.getToken() === token) cache = data.data;
    return data.data;
  }).finally(() => {
    if (pendingToken === token) {
      pending = null;
      pendingToken = null;
    }
  });
  pendingToken = token;
  return pending;
};
const refresh = () => getOverview({ force: true });
const mutate = async (request, fallback) => {
  try {
    const { data } = await request;
    if (!data?.success) throw new Error(data?.message || fallback);
    await refresh();
    return data;
  } catch (error) { throw new Error(errorMessage(error, fallback)); }
};
const records = async () => (await getOverview()).records || [];
const corrections = async () => (await getOverview()).corrections || [];

export const attendanceService = {
  getOverview,
  refresh,
  getEmployees: async () => (await getOverview()).employees || [],
  getEmployeeById: async (id) => ((await getOverview()).employees || []).find((e) => e.id === id) || null,
  getEmployeeByName: async (name) => ((await getOverview()).employees || []).find((e) => e.name === name) || null,
  getDepartments: async () => [...new Set(((await getOverview()).employees || []).map((e) => e.department))],
  getBranches: async () => [...new Set(((await getOverview()).employees || []).map((e) => e.branch))],
  getAttendanceRecords: records,
  getAllRecords: records,
  getEmployeeAttendance: async (id) => (await records()).filter((r) => r.employeeId === id),
  getRecordsForEmployee: async (id) => (await records()).filter((r) => r.employeeId === id),
  getTodayAttendance: async () => (await getOverview()).todayRecords || [],
  getTodayRecords: async () => (await getOverview()).todayRecords || [],
  getTeamAttendance: async (ids) => (await records()).filter((r) => ids.includes(r.employeeId)),
  getRecordsForTeam: async (ids) => (await records()).filter((r) => ids.includes(r.employeeId)),
  getCorrections: corrections,
  getEmployeeCorrections: async (id) => (await corrections()).filter((r) => r.employeeId === id),
  getCorrectionsForEmployee: async (id) => (await corrections()).filter((r) => r.employeeId === id),
  getNotifications: async () => {
    const { data } = await client.get("/attendance/notifications");
    if (!data?.success) throw new Error(data?.message || "Unable to load attendance notifications.");
    return data.notifications || [];
  },
  getTodayState: async () => {
    const { data } = await client.get("/attendance/me/today");
    if (!data?.success) throw new Error(data?.message || "Unable to load today's attendance.");
    return data.record;
  },
  checkIn: async () => (await mutate(client.post("/attendance/me/check-in"), "Unable to check in.")).record,
  checkOut: async () => (await mutate(client.post("/attendance/me/check-out"), "Unable to check out.")).record,
  startBreak: async () => (await mutate(client.post("/attendance/me/break/start"), "Unable to start break.")).record,
  endBreak: async () => (await mutate(client.post("/attendance/me/break/end"), "Unable to end break.")).record,
  updateRecord: async (id, payload) => (await mutate(client.patch(`/attendance/records/${id}`, payload), "Unable to update attendance record.")).record,
  submitCorrection: async ({ form }) => (await mutate(client.post("/attendance/corrections", { correction_date: form.date, requested_check_in: form.checkIn || null, requested_check_out: form.checkOut || null, reason: form.reason }), "Unable to submit correction request.")).correction,
  approveCorrection: async (id, remarks = "") => (await mutate(client.post(`/attendance/corrections/${id}/decision`, { decision: "Approved", remarks }), "Unable to approve correction.")).correction,
  rejectCorrection: async (id, remarks = "") => (await mutate(client.post(`/attendance/corrections/${id}/decision`, { decision: "Rejected", remarks }), "Unable to reject correction.")).correction,
};
