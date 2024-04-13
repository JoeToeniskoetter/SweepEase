import {
  ArrowCircleLeftTwoTone,
  Close,
  DrawTwoTone,
  FireplaceTwoTone,
  HistoryEduTwoTone,
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
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

interface ReviewAndFinishProps {}

export const ReviewAndFinish: React.FC<ReviewAndFinishProps> = ({}) => {
  const [customerSignature, setCustomerSignature] = useState<string>();
  const [customerSigModalOpen, setCustomerSigModalOpen] =
    useState<boolean>(false);
  const { state } = useLocation();
  const details = state as {
    inspection: InspectionOrder;
    details: InspectionDetail[];
  };
  const navigate = useNavigate();
  const theme = useTheme();

  const sigRef = useRef<SignatureCanvas>(null);
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
          <Chip label={details.inspection.status} sx={{ color: "white" }} />
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
            <Box width={"100%"} mt={2}>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
                display={"flex"}
                gap={1}
              >
                <HistoryEduTwoTone />
                SIGN
              </Typography>
              <Divider />
              <Typography fontWeight={"bold"}>Customer Signature</Typography>
              {customerSignature ? (
                <img src={customerSignature} />
              ) : (
                <Button onClick={() => setCustomerSigModalOpen(true)}>
                  Sign
                </Button>
              )}

              <Modal
                open={customerSigModalOpen}
                onClose={() => setCustomerSigModalOpen(false)}
              >
                <Box
                  borderRadius={2}
                  width={500}
                  bgcolor={"white"}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                  >
                    <IconButton onClick={() => setCustomerSigModalOpen(false)}>
                      <Close />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="h5">Customer Signature</Typography>
                  </Box>
                  <Box
                    border={1}
                    borderColor={theme.palette.divider}
                    borderRadius={2}
                    width={"100%"}
                  >
                    <SignatureCanvas
                      ref={sigRef}
                      canvasProps={{
                        width: 600,
                        height: 200,
                        className: "sigCanvas",
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setCustomerSignature(
                        sigRef.current
                          ?.getTrimmedCanvas()
                          .toDataURL("image/png")
                      );
                      setCustomerSigModalOpen(false);
                    }}
                  >
                    Accept
                  </Button>
                </Box>
              </Modal>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
