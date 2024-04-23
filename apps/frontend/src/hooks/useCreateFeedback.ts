import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (data: { feedback: string }): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/feedback", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      toast("Feedback sent", { type: "success" });
    },
    onError() {
      toast("Error sending feedback", { type: "error" });
    },
  });
};
