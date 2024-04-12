import {
  ArrowCircleLeftTwoTone,
  ArticleTwoTone,
  FireplaceTwoTone,
  InfoTwoTone,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInspectionOrder } from "../hooks/useInspectionOrder";
import { useInspectionOrderDetails } from "../hooks/useInspectionOrderDetails";
import { InspectItem } from "./InspectItem";

interface InspectProps {}

export const Inspect: React.FC<InspectProps> = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [openInspectionItem, setOpenInspectionItem] = useState<string>();
  const { data: inspection } = useInspectionOrder({ id: id ?? "" });
  const { data: inspectionOrderDetails, isLoading } = useInspectionOrderDetails(
    { id: id ?? "" }
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 8 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowCircleLeftTwoTone sx={{ color: "gray", fontSize: 48 }} />
      </IconButton>
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
          <Chip label={inspection?.status} sx={{ color: "white" }} />
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
              <Typography>{inspection?.customerName}</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Address:</Typography>
              <Typography>{inspection?.address}</Typography>
              <Typography>
                {inspection?.city}, {inspection?.state} {inspection?.zip}
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Phone:</Typography>
              <Typography>{inspection?.phone || "-"}</Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">Inspection Date:</Typography>
              <Typography>
                {format(
                  new Date(inspection?.createdAt ?? new Date()),
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
              {inspectionOrderDetails?.map((iod, idx) => (
                <InspectItem
                  inspectionId={id ?? ""}
                  item={iod}
                  idx={idx}
                  key={iod.id}
                  openInspectionItem={openInspectionItem}
                  setOpenInspectionItem={setOpenInspectionItem}
                />
              ))}
            </Box>
          </Box>
          <Box mt={2} display={"flex"} flexDirection={"column"}>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              display={"flex"}
              gap={1}
            ></Typography>
            <Button
              LinkComponent={Link}
              to={`/inspections/${id}/review`}
              startIcon={<ArticleTwoTone />}
              disabled={!inspectionOrderDetails?.every((iod) => iod.isComplete)}
            >
              REVIEW AND FINISH
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
