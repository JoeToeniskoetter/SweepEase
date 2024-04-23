import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../context/firebase";

type relationOptions = "template" | "items" | "options" | "signatures";

export const useInspectionOrder = ({
  id,
  enabled = true,
  relations,
}: {
  id: string;
  enabled?: boolean;
  relations?: relationOptions[];
}) => {
  return useQuery({
    queryKey: ["inspection-order", id, relations],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      let baseUrl = `/api/inspection/${id}`;

      if (relations) {
        const params = new URLSearchParams();
        relations.forEach((rel) => {
          params.append("relations", rel);
        });
        baseUrl = `${baseUrl}?${params}`;
      }

      const resp = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data as InspectionOrder;
    },
    enabled,
  });
};
