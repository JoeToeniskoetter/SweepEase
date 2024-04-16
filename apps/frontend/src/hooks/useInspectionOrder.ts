import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionOrder = ({
  id,
  enabled = true,
}: {
  id: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["inspection-order", id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get(`/api/inspection/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionOrder;
    },
    enabled,
  });
};
