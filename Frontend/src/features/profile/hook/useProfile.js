import useAuth from "../../auth/hooks/useAuth";
import { getProfileData } from "../service/profileService";

const useProfile = () => {
  const { user } = useAuth();

  const data = getProfileData(user.role);

  return {
    user,
    ...data,
  };
};

export default useProfile;
