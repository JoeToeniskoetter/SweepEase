import {
  ArrowCircleLeftTwoTone,
  Edit,
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
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignatureModal } from "../components/SignatureModal";
import { useCompleteInspection } from "../hooks/useCompleteInspection";

export const ReviewAndFinish: React.FC = () => {
  const [customerSignature, setCustomerSignature] = useState<string>();
  const [techSignature, setTechSignature] = useState<string>();
  const [customerSignatureFile, setCustomerSignatureFile] = useState<File>();
  const [techSignatureFile, setTechSignatureFile] = useState<File>();

  const { mutateAsync, isPending } = useCompleteInspection();
  const [customerSigModalOpen, setCustomerSigModalOpen] =
    useState<boolean>(false);
  const [techSigModalOpen, setTechSigModalOpen] = useState<boolean>(false);
  const { state } = useLocation();
  const details = state as {
    inspection: InspectionOrder;
    details: InspectionDetail[];
  };
  const navigate = useNavigate();
  const theme = useTheme();

  const getExistingSignature = (type: string) => {
    return details.inspection.signatures?.find((s) => s.type.includes(type))
      ?.imageUrl;
  };

  const existingCustomerSig = getExistingSignature("customer-signature");
  const existingTechSig = getExistingSignature("technician-signature");
  console.log({ existingCustomerSig, existingTechSig });

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      <Button
        onClick={() => navigate(-1)}
        variant="outlined"
        startIcon={<ArrowCircleLeftTwoTone />}
        sx={{ my: 2 }}
      >
        Back to inspection
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
                <Box py={2} key={detail.id}>
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
            <Box width={"100%"} mt={2} mb={4} maxHeight={200}>
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
              <Box mt={2} display={"flex"} justifyContent={"space-evenly"}>
                <Box>
                  <Typography fontWeight={"bold"}>
                    Customer Signature
                  </Typography>
                  {customerSignature || existingCustomerSig ? (
                    <img
                      src={customerSignature || existingCustomerSig}
                      style={{
                        maxHeight: 250,
                        width: "50%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Button
                      onClick={() => setCustomerSigModalOpen(true)}
                      variant="contained"
                      fullWidth
                      startIcon={<Edit />}
                      sx={{ color: "white" }}
                    >
                      Sign
                    </Button>
                  )}

                  <SignatureModal
                    onClose={() => setCustomerSigModalOpen(false)}
                    open={customerSigModalOpen}
                    onFinishedSigning={(dataUrl, file) => {
                      setCustomerSignature(dataUrl);
                      setCustomerSignatureFile(file);
                      setCustomerSigModalOpen(false);
                    }}
                    title="Customer Signature"
                    fileName="customer-signature"
                    disclaimer={
                      "By signing below, I acknowledge that I have reviewed the inspection report with the technician and have had the opportunity to ask questions regarding any findings. I understand and agree to the contents of the report as explained to me. I further acknowledge that the inspection has been conducted to the best of the technician's ability and that I have received satisfactory explanations regarding the inspection process and any identified issues."
                    }
                  />
                </Box>
                <Box>
                  <Typography fontWeight={"bold"}>
                    Technician Signature
                  </Typography>
                  {techSignature || existingTechSig ? (
                    <img
                      src={techSignature || existingTechSig}
                      style={{
                        maxHeight: 250,
                        width: "50%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Button
                      onClick={() => setTechSigModalOpen(true)}
                      variant="contained"
                      fullWidth
                      startIcon={<Edit />}
                      sx={{ color: "white" }}
                    >
                      Sign
                    </Button>
                  )}

                  <SignatureModal
                    onClose={() => setTechSigModalOpen(false)}
                    open={techSigModalOpen}
                    onFinishedSigning={(dataUrl, file) => {
                      setTechSignature(dataUrl);
                      setTechSignatureFile(file);
                      setTechSigModalOpen(false);
                    }}
                    title={"Technician Signature"}
                    fileName="technician-signature"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ color: "white" }}
            startIcon={
              isPending && (
                <CircularProgress sx={{ color: "white" }} size={18} />
              )
            }
            disabled={
              customerSignature == undefined || techSignature == undefined
            }
            onClick={async () => {
              if (!customerSignatureFile || !techSignatureFile) {
                return;
              }
              await mutateAsync({
                inspectionId: details.inspection.id,
                data: {
                  signatures: {
                    customer: customerSignatureFile,
                    technician: techSignatureFile,
                  },
                },
              });
            }}
          >
            Finish
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};
