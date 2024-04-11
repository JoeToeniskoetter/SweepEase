import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

export const useUpdateInspectionOrderDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      inspectionId,
      data,
    }: {
      inspectionId: string;
      data: Partial<InspectionDetail>;
    }) => {
      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(
        `/api/inspection/details/${inspectionId}/item/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return resp.data as InspectionDetail;
    },
    onSuccess(data, variables) {
      let cache = queryClient.getQueryData([
        "inspection-order-details",
        variables.inspectionId,
      ]);
      console.log(cache);
      if (cache) {
        cache = (cache as InspectionDetail[]).map((d) => {
          if (d.id === variables.data.id) {
            return data;
          }
          return d;
        });
      }
      queryClient.setQueryData(
        ["inspection-order-details", variables.inspectionId],
        cache
      );
    },
  });
};
