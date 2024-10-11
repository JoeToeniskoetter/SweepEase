import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCopyTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      inspectionLevel,
    }: {
      id: string;
      name: string;
      inspectionLevel: string;
    }): Promise<InspectionTemplate> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(
        `/api/inspection-templates/copy/${id}`,
        {
          name,
          inspectionLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["inspection-templates"],
      });
    },
  });
};
