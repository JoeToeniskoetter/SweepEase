import { CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { ReviewDetail } from "../components/ReviewDetail";
import { useInspectionOrderDetails } from "../hooks/useInspectionOrderDetails";

export const ReviewAndFinish: React.FC = () => {
  const { id } = useParams();

  const { data: apiDetails, isLoading: loadingDetail } =
    useInspectionOrderDetails({
      id: id ?? "",
    });

  if (loadingDetail) {
    return <CircularProgress />;
  }

  return <ReviewDetail insepectionDetail={apiDetails} />;
};
