import { Edit, FireplaceTwoTone, HistoryEduTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { SignatureModal } from "./SignatureModal";
import { useCompleteInspection } from "../hooks/useCompleteInspection";
import { InspectionCompleteModal } from "./InspectionCompleteModal";

interface ReviewDetailProps {
  inspection?: InspectionOrder;
  insepectionDetail?: InspectionDetail[];
}

export const ReviewDetail: React.FC<ReviewDetailProps> = ({
  inspection,
  insepectionDetail,
}) => {
  const [openInspectionCompleteModal, setOpenInspectionCompleteModal] =
    useState<boolean>(false);
  const [customerSignature, setCustomerSignature] = useState<string>();
  const [techSignature, setTechSignature] = useState<string>();
  const [customerSignatureFile, setCustomerSignatureFile] = useState<File>();
  const [techSignatureFile, setTechSignatureFile] = useState<File>();
  const [customerSigModalOpen, setCustomerSigModalOpen] =
    useState<boolean>(false);
  const [techSigModalOpen, setTechSigModalOpen] = useState<boolean>(false);
  const getExistingSignature = (type: string) => {
    return inspection?.signatures?.find((s) => s.type.includes(type))?.imageUrl;
  };
  const { mutateAsync: completeInspection, isPending } =
    useCompleteInspection();

  const existingCustomerSig = getExistingSignature("customer-signature");
  const existingTechSig = getExistingSignature("technician-signature");

  return (
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
        {insepectionDetail?.map((detail) => (
          <Box py={2} key={detail.id}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {detail.item}
            </Typography>
            <Divider />
            <Typography>Condition: {detail.condition?.name}</Typography>
            <Typography>Reason: {detail.condition?.description}</Typography>
            {detail.notes && <Typography>Notes: {detail.notes}</Typography>}
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
        <Box
          mt={2}
          display={"flex"}
          justifyContent={"space-evenly"}
          width={"100%"}
          gap={2}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={"50%"}
            alignItems={"center"}
          >
            <Typography fontWeight={"bold"}>Customer Signature</Typography>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {customerSignature || existingCustomerSig ? (
                <img
                  src={customerSignature || existingCustomerSig}
                  style={{
                    maxHeight: 250,
                    width: "100%",
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
            </Paper>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={"50%"}
            alignItems={"center"}
          >
            <Typography fontWeight={"bold"}>Technician Signature</Typography>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {techSignature || existingTechSig ? (
                <img
                  src={techSignature || existingTechSig}
                  style={{
                    maxHeight: 250,
                    width: "100%",
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
            </Paper>
          </Box>
        </Box>
      </Box>
      <Box pt={4}>
        <Button
          variant="contained"
          fullWidth
          sx={{ color: "white" }}
          startIcon={
            isPending && <CircularProgress size={18} sx={{ color: "white" }} />
          }
          onClick={async () => {
            await completeInspection({
              inspectionId: inspection?.id ?? "",
              data: {
                signatures: {
                  customer: null,
                  technician: null,
                },
              },
            });
            setOpenInspectionCompleteModal(true);
          }}
        >
          Finish Report
        </Button>
      </Box>
      <InspectionCompleteModal
        open={openInspectionCompleteModal}
        onClose={() => {
          setOpenInspectionCompleteModal(false);
        }}
      />
    </Box>
  );
};
