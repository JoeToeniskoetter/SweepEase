import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useProfile = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    enabled: enabled,
  });
};
