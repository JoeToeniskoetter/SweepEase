import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";
import { toast } from "react-toastify";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyInput): Promise<Profile> => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("zip", data.zip);
      formData.append("phone", data.phone);
      if (data.logo) {
        formData.append("logo", data.logo);
      }
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/company", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError() {
      toast("Failed to create company", { type: "error" });
    },
  });
};
