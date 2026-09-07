import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import useProfile from "../hook/useProfile";
import ProfileHeader from "../components/ProfileHeader";
import InfoCard from "../components/InfoCard";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { openProfileDocument } from "../service/profileService";
import InlineLoader from "../../../components/common/InlineLoader";

const Profile = () => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { user, profile, permissions, loading, error } = useProfile();

  if (error) return <section className="p-8 text-danger">{error}</section>;
  if (loading || !profile) return <section className="p-8"><InlineLoader message="Loading profile..." /></section>;

  return (
    <section className="space-y-8">
      <ProfileHeader user={user} profile={profile} canChangePassword={permissions.canChangePassword} onChangePassword={() => setOpenPasswordModal(true)} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InfoCard title="Personal Information" data={profile.personal} />
        <InfoCard title="Employment Information" data={profile.employment} />
        <InfoCard title="Contact Information" data={profile.contact} />
        <InfoCard title="Emergency Contact" data={profile.emergency} />
      </div>

      {permissions.showBank && <InfoCard title="Bank Details" data={profile.bank} />}

      {permissions.showDocuments && (
        <div className="dashboard-card p-8">
          <h2 className="text-xl font-bold text-foreground">Documents</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            {(profile.documents || []).length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-foreground-muted">No documents are available.</p>
            ) : (profile.documents || []).map((document) => (
              <div key={document.id} className="flex items-center justify-between border-b border-border px-5 py-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-primary" />
                  <div><p className="font-medium">{document.name}</p><p className="text-xs text-foreground-muted">{document.type} · {document.status}</p></div>
                </div>
                <div className="flex gap-2">
                  <button type="button" aria-label="View document" onClick={() => void openProfileDocument(document.id)} className="rounded-lg p-2 hover:bg-primary/10 hover:text-primary"><Eye size={18} /></button>
                  <button type="button" aria-label="Download document" onClick={() => void openProfileDocument(document.id, true)} className="rounded-lg p-2 hover:bg-primary/10 hover:text-primary"><Download size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChangePasswordModal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} />
    </section>
  );
};

export default Profile;
