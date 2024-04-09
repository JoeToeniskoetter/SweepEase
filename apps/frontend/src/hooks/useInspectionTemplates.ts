import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionTemplates = () => {
  return useQuery({
    queryKey: ["inspection-templates"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/inspection/templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionTemplate[];
    },
  });
};
