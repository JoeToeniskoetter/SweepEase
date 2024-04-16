import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useUpdateTemplate = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string }): Promise<InspectionTemplate> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.patch(
        `/api/inspection-templates/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return resp.data;
    },
    // onSuccess(_data, variables) {
    // queryClient.invalidateQueries({
    //   queryKey: ["inspection-templates", variables.id],
    // });
    // },
  });
};
