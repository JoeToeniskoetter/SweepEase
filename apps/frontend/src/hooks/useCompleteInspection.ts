import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCompleteInspection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      inspectionId,
      data,
    }: {
      inspectionId: string;
      data: {
        signatures: {
          customer: File | null | undefined;
          technician: File | null | undefined;
        };
      };
    }) => {
      const formData = new FormData();
      if (data.signatures.customer) {
        formData.append("signatures", data.signatures.customer);
      }
      if (data.signatures.technician) {
        formData.append("signatures", data.signatures.technician);
      }

      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(
        `/api/inspection/${inspectionId}/complete`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return resp.data as InspectionOrder;
    },
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["inspection-order", variables.inspectionId],
      });
    },
  });
};
