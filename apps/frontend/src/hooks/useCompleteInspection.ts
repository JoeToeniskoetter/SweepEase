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
    onSuccess(data, variables) {
      let cache = queryClient.getQueryData([
        "inspection-order",
        variables.inspectionId,
      ]);
      if (cache) {
        cache = { ...cache, ...data };
      }
      queryClient.setQueryData(
        ["inspection-order", variables.inspectionId],
        cache
      );
    },
  });
};
