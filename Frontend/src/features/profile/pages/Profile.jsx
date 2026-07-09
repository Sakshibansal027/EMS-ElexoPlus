import { useState } from "react";

import useAuth from "../../auth/hooks/useAuth";

import PROFILE_DATA from "../config/profileData";

import ProfileHeader from "../components/ProfileHeader";
import InfoCard from "../components/InfoCard";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Profile = () => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const { user } = useAuth();

const profile = PROFILE_DATA[user.role];

  return (
    <section className="space-y-8">

      {/* ==========================================
                    Profile Header
      ========================================== */}

      <ProfileHeader
        user={user}
        profile={profile}
        onChangePassword={() => setOpenPasswordModal(true)}
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

      <InfoCard
        title="Bank Details"
        data={profile.bank}
      />

      {/* ==========================================
                      Documents
      ========================================== */}

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