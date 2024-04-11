import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionOrderDetails = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["inspection-order-details", id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get(`/api/inspection/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionDetail[];
    },
  });
};
