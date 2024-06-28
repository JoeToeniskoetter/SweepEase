import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useCancelInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.delete(`/api/user-invite/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-invites"] });
      toast("Invite canceled", { type: "success" });
    },
    onError() {
      toast("Error cancelling invite", { type: "error" });
    },
  });
};
