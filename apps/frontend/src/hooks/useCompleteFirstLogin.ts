import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCompleteFirstLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<Profile> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(`/api/users/complete-first-login`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};
