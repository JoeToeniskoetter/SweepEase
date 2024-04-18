import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useInviteUser = () => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string }): Promise<any> => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post("/api/user-invite", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data;
    },
    onSuccess(data) {
      console.log({ data });
      //   // queryClient.invalidateQueries({ queryKey: ["inspection-templates"] });
      //   const cache = queryClient.getQueryData<InspectionTemplate[]>([
      //     "inspection-templates",
      //   ]);
      //   queryClient.setQueryData(
      //     ["inspection-templates"],
      //     [...(cache ?? []), data]
      //   );
    },
  });
};
