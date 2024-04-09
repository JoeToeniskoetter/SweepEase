import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useMessage = () => {
  return useQuery({
    queryKey: ["message"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data;
    },
  });
};
