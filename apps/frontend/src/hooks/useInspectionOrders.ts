import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionOrders = (page: number) => {
  return useQuery({
    queryKey: ["inspection-orders", page],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get(`/api/inspection?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as Page<InspectionOrder>;
    },
    placeholderData: keepPreviousData,
  });
};
