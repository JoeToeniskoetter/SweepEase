import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInspectionTemplate = (input: { id: string }) => {
  return useQuery({
    queryKey: ["inspection-templates", input.id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.get(`/api/inspection-templates/${input.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionTemplate;
    },
  });
};
