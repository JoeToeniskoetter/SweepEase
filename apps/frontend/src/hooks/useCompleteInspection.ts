import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCompleteInspection = () => {
  return useMutation({
    mutationFn: async ({
      inspectionId,
      data,
    }: {
      inspectionId: string;
      data: { signatures: { customer: File; technician: File } };
    }) => {
      const formData = new FormData();
      formData.append("signatures", data.signatures.customer);
      formData.append("signatures", data.signatures.technician);

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
  });
};
