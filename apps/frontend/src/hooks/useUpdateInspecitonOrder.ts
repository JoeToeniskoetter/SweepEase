import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useUpdateInspectionOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: CreateInspectionOrderInput & { id: string }
    ): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.patch(`/api/inspection/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inspection-orders"] });
      toast("Inspection order updated", { type: "success" });
    },
  });
};
