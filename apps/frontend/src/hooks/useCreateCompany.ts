import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyInput): Promise<Profile> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/company", data, {
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
