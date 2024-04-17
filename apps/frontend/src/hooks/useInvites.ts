import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInvites = () => {
  return useQuery({
    queryKey: ["user-invites"],
    queryFn: async (): Promise<UserInvite[]> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/user-invite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
  });
};
