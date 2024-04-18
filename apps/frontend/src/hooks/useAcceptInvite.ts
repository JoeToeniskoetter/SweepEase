import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { auth } from "../context/firebase";

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SweepInspectrUser,
    AxiosError<{ message: string }>,
    { code: string }
  >({
    mutationFn: async (data: { code: string }): Promise<SweepInspectrUser> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/user-invite/accept", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
