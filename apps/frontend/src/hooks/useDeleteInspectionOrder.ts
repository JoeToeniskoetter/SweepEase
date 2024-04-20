import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useDeleteInspectionOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.delete(`/api/inspection/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["inspection-orders"],
      });
      toast("Inspection order removed", { type: "success" });
    },
    onError() {
      toast("Error removing inspection order", { type: "error" });
    },
  });
};
