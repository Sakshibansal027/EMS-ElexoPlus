import { useState } from "react";
import useProfile from "../hook/useProfile";
import ProfileHeader from "../components/ProfileHeader";
import InfoCard from "../components/InfoCard";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Profile = () => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { user, profile, permissions, loading, error } = useProfile();

  if (loading || !profile) return <section className="p-8 text-foreground-muted">Loading profile…</section>;
  if (error) return <section className="p-8 text-danger">{error}</section>;

  return (
    <section className="space-y-8">

      {/* ==========================================
                    Profile Header
      ========================================== */}

      <ProfileHeader
        user={user}
        profile={profile}
        canChangePassword={permissions.canChangePassword}
        onChangePassword={() =>
          setOpenPasswordModal(true)
        }
      />

      {/* ==========================================
                  Information Cards
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <InfoCard
          title="Personal Information"
          data={profile.personal}
        />

        <InfoCard
          title="Employment Information"
          data={profile.employment}
        />

        <InfoCard
          title="Contact Information"
          data={profile.contact}
        />

        <InfoCard
          title="Emergency Contact"
          data={profile.emergency}
        />

      </div>

      {/* ==========================================
                    Bank Details
      ========================================== */}

      {permissions.showBank && (
        <InfoCard
          title="Bank Details"
          data={profile.bank}
        />
      )}

      {/* ==========================================
                      Documents
      ========================================== */}

      {permissions.showDocuments && (

        <div className="dashboard-card p-8">

          <h2 className="text-xl font-bold text-foreground">
            Documents
          </h2>

          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">

            <div className="mb-4 text-5xl">
              📄
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              Coming Soon
            </h3>

            <p className="mt-2 text-center text-sm text-foreground-muted">
              Employee documents will be available here
              after backend integration.
            </p>

          </div>

        </div>

      )}
      {/* ==========================================
                Change Password Modal
      ========================================== */}

      <ChangePasswordModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />

    </section>
  );
};

export default Profile;
