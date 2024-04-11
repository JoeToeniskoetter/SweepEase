import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useStartInspection = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<Profile> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(`/api/inspection/start/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
  });
};
