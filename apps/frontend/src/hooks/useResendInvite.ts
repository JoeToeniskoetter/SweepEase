import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useResendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(
        `/api/user-invite/${data.id}/resend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-invites"] });
      toast("Invite resent", { type: "success" });
    },
    onError() {
      toast("Error resending invite", { type: "error" });
    },
  });
};
