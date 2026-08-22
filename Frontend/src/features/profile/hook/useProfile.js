import { useEffect, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import { getProfileData } from "../service/profileService";

const useProfile = () => {
  const { user } = useAuth();

  const [data, setData] = useState({ profile: null, permissions: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => getProfileData(user?.role)).then((result) => {
      if (active) {
        setData(result);
        setError(null);
      }
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Unable to load profile.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user?.role]);

  return {
    user,
    ...data,
    loading,
    error,
  };
};

export default useProfile;
