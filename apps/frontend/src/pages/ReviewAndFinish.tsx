import { CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { ReviewDetail } from "../components/ReviewDetail";
import { useInspectionOrder } from "../hooks/useInspectionOrder";
import { useInspectionOrderDetails } from "../hooks/useInspectionOrderDetails";

export const ReviewAndFinish: React.FC = () => {
  const { id } = useParams();

  const { data: apiInspection, isLoading: loadingInspectionOrder } =
    useInspectionOrder({ id: id ?? "" });
  const { data: apiDetails, isLoading: loadingDetail } =
    useInspectionOrderDetails({
      id: id ?? "",
    });

  if (loadingDetail || loadingInspectionOrder) {
    return <CircularProgress />;
  }

  return (
    <ReviewDetail
      details={{
        inspection: apiInspection,
        details: apiDetails,
      }}
    />
  );
};
