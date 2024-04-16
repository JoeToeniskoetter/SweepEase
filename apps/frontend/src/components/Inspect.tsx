import { ArrowCircleLeftTwoTone, ArticleTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInspectionOrder } from "../hooks/useInspectionOrder";
import { useInspectionOrderDetails } from "../hooks/useInspectionOrderDetails";
import { InspectionCustomerInfo } from "./InspectionCustomerInfo";
import { InspectionInspectionItems } from "./InspectionInspectionItems";
import { InspectionOrderStatus } from "./InspectionOrderStatus";

interface InspectProps {}

export const Inspect: React.FC<InspectProps> = () => {
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

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Button
        onClick={() => navigate(-1)}
        variant="outlined"
        startIcon={<ArrowCircleLeftTwoTone />}
        sx={{ my: 2 }}
      >
        Back to inspections
      </Button>
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          bgcolor: theme.palette.secondary.main,
          borderRadius: 0,
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
      <Card>
        <CardContent>
          <InspectionCustomerInfo inspection={inspection} />
          <InspectionInspectionItems
            inspectionId={id ?? ""}
            inspectionOrderDetails={inspectionOrderDetails ?? []}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              startIcon={<ArticleTwoTone />}
              disabled={!inspectionOrderDetails?.every((iod) => iod.isComplete)}
              sx={{ color: "white" }}
              onClick={() => {
                navigate(`/inspections/${id}/review`, {
                  state: {
                    inspection: inspection,
                    details: inspectionOrderDetails,
                  },
                });
              }}
            >
              REVIEW AND FINISH
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
