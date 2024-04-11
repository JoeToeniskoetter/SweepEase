import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useCreateInspectionOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInspectionOrderInput): Promise<unknown> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/inspection", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess(data) {
      console.log({ data });
      // queryClient.invalidateQueries({ queryKey: ["inspection-templates"] });
      const cache = queryClient.getQueryData<InspectionTemplate[]>([
        "inspection-orders",
      ]);
      queryClient.setQueryData(["inspection-orders"], [...(cache ?? []), data]);
    },
  });
};
