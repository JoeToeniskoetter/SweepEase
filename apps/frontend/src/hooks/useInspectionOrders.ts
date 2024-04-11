import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionOrders = () => {
  return useQuery({
    queryKey: ["inspection-orders"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get("/api/inspection", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionOrder[];
    },
  });
};
