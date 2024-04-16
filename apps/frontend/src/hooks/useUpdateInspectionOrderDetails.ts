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
      data: Partial<InspectionDetail> & { photo?: File };
    }) => {
      const formData = new FormData();
      formData.append("id", data?.id ?? "");
      formData.append("item", data?.item ?? "");
      formData.append("condition[name]", data.condition?.name ?? "");
      formData.append(
        "condition[description]",
        data.condition?.description ?? ""
      );
      formData.append("notes", data.notes ?? "");
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const token = await auth.currentUser?.getIdToken();
      const resp = await axios.post(
        `/api/inspection-details/${inspectionId}/item/${data.id}`,
        formData,
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
      if (cache) {
        cache = (cache as InspectionDetail[]).map((d) => {
          if (d.id === variables.data.id) {
            return { ...d, ...data };
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
