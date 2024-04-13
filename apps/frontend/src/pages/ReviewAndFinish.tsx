import {
  ArrowCircleLeftTwoTone,
  FireplaceTwoTone,
  InfoTwoTone,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ReviewAndFinishProps {}

export const ReviewAndFinish: React.FC<ReviewAndFinishProps> = ({}) => {
  const { state } = useLocation();
  const details = state as {
    inspection: InspectionOrder;
    details: InspectionDetail[];
  };
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
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
          <Box>
            <Typography variant="h5" fontWeight={"bold"} color={"white"}>
              Review and Finish
            </Typography>
            <Typography style={{ fontWeight: "lighter" }} color={"white"}>
              Inspection: {details.inspection.id}
            </Typography>
          </Box>
          <Chip label={"IN PROGRESS"} sx={{ color: "white" }} />
        </Box>
      </Paper>
      <Card>
        <CardContent>
          <Typography
            sx={{ fontSize: 18 }}
            color="text.secondary"
            gutterBottom
            display={"flex"}
            gap={1}
          >
            <InfoTwoTone />
            CUSTOMER INFO
          </Typography>
          <Divider />
          <Box display={"flex"} flexDirection={"column"} gap={1} p={1}>
            <Box>
              <Typography fontWeight="bold">Customer name:</Typography>
              <Typography>{details.inspection?.customerName}</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Address:</Typography>
              <Typography>{details.inspection?.address}</Typography>
              <Typography>
                {details.inspection?.city}, {details.inspection?.state}{" "}
                {details.inspection?.zip}
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Phone:</Typography>
              <Typography>{details.inspection?.phone || "-"}</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Inspection Date:</Typography>
              <Typography>
                {format(
                  new Date(details.inspection?.createdAt ?? new Date()),
                  "MM/d/yyyy"
                )}
              </Typography>
            </Box>
          </Box>
          <Box mt={2} display={"flex"} flexDirection={"column"}>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              display={"flex"}
              gap={1}
            >
              <FireplaceTwoTone />
              INSPECTION ITEMS
            </Typography>
            <Divider />
            <Box pt={2}>
              {details.details.map((detail) => (
                <Box py={2}>
                  <Typography fontWeight={"bold"} fontSize={18}>
                    {detail.item}
                  </Typography>
                  <Divider />
                  <Typography>Condition: {detail.condition?.name}</Typography>
                  <Typography>
                    Reason: {detail.condition?.description}
                  </Typography>
                  {detail.notes && (
                    <Typography>Notes: {detail.notes}</Typography>
                  )}
                  {detail.photoUrl && <img src={detail.photoUrl} />}
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
