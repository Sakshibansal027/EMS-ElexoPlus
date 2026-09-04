import EmployeeAttendance from "./EmployeeAttendance";
import AdminAttendance from "./AdminAttendance";

const HrAttendance = () => (
  <div className="space-y-12">
    <section>
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="section-title">My Attendance</h2>
        <p className="text-sm text-muted-foreground">Check in/out, manage your break, review your history and request corrections.</p>
      </div>
      <EmployeeAttendance />
    </section>
    <section className="border-t border-border pt-10">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="section-title">Organization Attendance</h2>
        <p className="text-sm text-muted-foreground">Review organization attendance, edit records, process assigned corrections and export reports.</p>
      </div>
      <AdminAttendance />
    </section>
  </div>
);

export default HrAttendance;
