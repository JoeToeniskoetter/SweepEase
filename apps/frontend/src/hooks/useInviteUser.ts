import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string }): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/user-invite", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-invites"] });
      toast("User invited", { type: "success" });
    },
    onError() {
      toast("Error inviting user", { type: "error" });
    },
  });
};
