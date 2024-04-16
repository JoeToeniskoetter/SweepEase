import {
  ArrowCircleLeftTwoTone,
  ArticleTwoTone,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInspectionOrder } from "../hooks/useInspectionOrder";
import { useInspectionOrderDetails } from "../hooks/useInspectionOrderDetails";
import { InspectionCustomerInfo } from "./InspectionCustomerInfo";
import { InspectionInspectionItems } from "./InspectionInspectionItems";
import { InspectionOrderStatus } from "./InspectionOrderStatus";
import { ReviewDetail } from "./ReviewDetail";

interface InspectProps {}

export const Inspect: React.FC<InspectProps> = () => {
  const [review, setReview] = useState<boolean>(false);
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: inspection } = useInspectionOrder({ id: id ?? "" });
  const { data: inspectionOrderDetails, isLoading } = useInspectionOrderDetails(
    { id: id ?? "" }
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  const allFieldsComplete = inspectionOrderDetails?.every(
    (iod) => iod.isComplete
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"start"}
        alignItems={"start"}
        pb={1}
      >
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          startIcon={<ArrowCircleLeftTwoTone />}
          sx={{ my: 2 }}
        >
          Back to inspections
        </Button>
        {review && (
          <Button
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => setReview(false)}
          >
            Edit Inspection
          </Button>
        )}
      </Box>
      <Paper
        elevation={12}
        sx={{
          padding: 2,
          bgcolor: theme.palette.secondary.main,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" fontWeight={"bold"} color={"white"}>
            Inspection:{" "}
            <span style={{ fontWeight: "lighter" }}>{inspection?.id}</span>
          </Typography>
          {inspection?.status && (
            <InspectionOrderStatus status={inspection?.status} />
          )}
        </Box>
      </Paper>
      <Card
        elevation={12}
        sx={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
      >
        <CardContent>
          <InspectionCustomerInfo inspection={inspection} />
          {!review ? (
            <>
              <InspectionInspectionItems
                inspectionId={id ?? ""}
                inspectionOrderDetails={inspectionOrderDetails ?? []}
              />
              <Box mt={2}>
                <Tooltip
                  title={
                    !allFieldsComplete &&
                    "Complete all inspection items before review"
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<ArticleTwoTone />}
                      disabled={!allFieldsComplete}
                      sx={{ color: "white" }}
                      onClick={() => setReview(true)}
                    >
                      REVIEW AND FINISH
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </>
          ) : (
            <ReviewDetail
              insepectionDetail={inspectionOrderDetails}
              inspection={inspection}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
