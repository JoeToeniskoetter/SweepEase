import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCompany = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/company/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data;
    },
  });
};
