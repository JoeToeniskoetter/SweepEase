import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionTemplateOptions = () => {
  return useQuery({
    queryKey: ["inspection-template-options"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/inspection/templates/options", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionTemplateOption[];
    },
  });
};
