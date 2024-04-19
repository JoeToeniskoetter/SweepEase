import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      role: string;
      id: string;
    }): Promise<InspectionTemplate> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.patch(`/api/users/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast("User updated", { type: "success" });
    },
    onError() {
      toast("Error updating user", { type: "error" });
    },
  });
};
