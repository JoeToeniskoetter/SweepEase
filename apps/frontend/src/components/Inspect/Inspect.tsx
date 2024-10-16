import {
  ArrowCircleLeftTwoTone,
  ArticleTwoTone,
  CheckCircleOutline,
  Edit,
  Print,
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
import React, { useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useInspectionOrder } from "../../hooks/useInspectionOrder";
import { useInspectionOrderDetails } from "../../hooks/useInspectionOrderDetails";
import { InspectionCustomerInfo } from "../InspectionCustomerInfo";
import { InspectionInspectionItems } from "../InspectionInspectionItems";
import { InspectionOrderStatus } from "../InspectionOrderStatus";
import { ReviewDetail } from "../ReviewDetail";
import { useCompleteInspection } from "../../hooks/useCompleteInspection";
import { SignatureModal } from "../SignatureModal";
import "./Inspect.css";
import { InspectionCompleteModal } from "../InspectionCompleteModal";
import { InspectionSignatureSection } from "../InspectionSignatureSection";

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
  const [openInspectionCompleteModal, setOpenInspectionCompleteModal] =
    useState<boolean>(false);
  const [customerSignatureFile, setCustomerSignatureFile] = useState<File>();
  const [techSignatureFile, setTechSignatureFile] = useState<File>();
  const [customerSigModalOpen, setCustomerSigModalOpen] =
    useState<boolean>(false);
  const [techSigModalOpen, setTechSigModalOpen] = useState<boolean>(false);

  const { mutateAsync: completeInspection, isPending } =
    useCompleteInspection();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (inspection?.status === "COMPLETE") {
    return <Navigate to={`/inspections/${inspection.id}/review`} />;
  }

  const allFieldsComplete = inspectionOrderDetails?.every(
    (iod) => iod.isComplete
  );

  const existingCustomerSignature = inspection?.signatures?.find((s) =>
    s.type.includes("customer-signature")
  );
  const existingTechSignature = inspection?.signatures?.find((s) =>
    s.type.includes("technician-signature")
  );

  const getCustomerSignature = () => {
    if (existingCustomerSignature) {
      return existingCustomerSignature.imageUrl;
    }

    if (customerSignatureFile) {
      return URL.createObjectURL(customerSignatureFile);
    }

    return undefined;
  };

  const getTechnicianSignature = () => {
    if (existingTechSignature) {
      return existingTechSignature.imageUrl;
    }

    if (techSignatureFile) {
      return URL.createObjectURL(techSignatureFile);
    }

    return undefined;
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 2 }} ref={componentRef}>
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
          {review && inspection?.status !== "COMPLETE" && (
            <Button
              startIcon={<Edit />}
              variant="outlined"
              onClick={() => setReview(false)}
            >
              Edit Inspection
            </Button>
          )}
          {inspection?.status === "COMPLETE" && (
            <Button
              startIcon={<Print />}
              variant="outlined"
              onClick={handlePrint}
            >
              Print Report
            </Button>
          )}
        </Box>
      </Container>
      <Container sx={{ pb: 4, mt: 2 }} ref={componentRef}>
        <Paper
          variant="outlined"
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
            <Typography variant="h6" fontWeight={"bold"} color={"white"}>
              INSPECTION:{" "}
              <Typography component={"span"} textTransform={"uppercase"}>
                {inspection?.id}
              </Typography>
            </Typography>
            {inspection?.status && (
              <InspectionOrderStatus status={inspection?.status} />
            )}
          </Box>
        </Paper>
        <Card
          elevation={12}
          variant="outlined"
          sx={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <CardContent>
            <InspectionCustomerInfo inspection={inspection} />
            {!review && inspection?.status !== "COMPLETE" && (
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
                        fullWidth
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
            )}
            {(review || inspection?.status === "COMPLETE") && (
              <>
                <ReviewDetail insepectionDetail={inspectionOrderDetails} />
                {inspection?.template?.signaturesRequired && (
                  <InspectionSignatureSection
                    customerSignature={getCustomerSignature()}
                    techSignature={getTechnicianSignature()}
                    inspection={inspection}
                  />
                )}
              </>
            )}
            {review &&
              ["IN PROGRESS", "NEW"].includes(inspection?.status ?? "") &&
              inspection?.template?.signaturesRequired && (
                <>
                  <Box display={"flex"} pb={2} gap={2}>
                    <Box
                      sx={{ width: "50%" }}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      {!customerSignatureFile && (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => setCustomerSigModalOpen(true)}
                        >
                          Sign
                        </Button>
                      )}
                    </Box>
                    <Box
                      sx={{ width: "50%" }}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      {!techSignatureFile && (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => setTechSigModalOpen(true)}
                        >
                          Sign
                        </Button>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            {review && ["IN PROGRESS"].includes(inspection?.status ?? "") && (
              <Box display={"flex"}>
                <Button
                  disabled={
                    inspection?.template?.signaturesRequired &&
                    (!customerSignatureFile || !techSignatureFile)
                  }
                  startIcon={
                    isPending ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <CheckCircleOutline />
                    )
                  }
                  fullWidth
                  variant="contained"
                  sx={{ color: "white" }}
                  color="success"
                  onClick={async () => {
                    await completeInspection({
                      inspectionId: id ?? "",
                      data: {
                        signatures: {
                          customer: customerSignatureFile,
                          technician: techSignatureFile,
                        },
                      },
                    });
                    setOpenInspectionCompleteModal(true);
                  }}
                >
                  Complete Inspection
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
      <SignatureModal
        onClose={() => setCustomerSigModalOpen(false)}
        open={customerSigModalOpen}
        onFinishedSigning={(_dataUrl, file) => {
          setCustomerSignatureFile(file);
          // setCustomerSignature(dataUrl);
          setCustomerSigModalOpen(false);
        }}
        title="Customer Signature"
        fileName="customer-signature"
        disclaimer={
          "By signing below, I acknowledge that I have reviewed the inspection report with the technician and have had the opportunity to ask questions regarding any findings. I understand and agree to the contents of the report as explained to me. I further acknowledge that the inspection has been conducted to the best of the technician's ability and that I have received satisfactory explanations regarding the inspection process and any identified issues."
        }
      />
      <SignatureModal
        onClose={() => setTechSigModalOpen(false)}
        open={techSigModalOpen}
        onFinishedSigning={(_dataUrl, file) => {
          setTechSignatureFile(file);
          // setTechSignature(dataUrl);
          setTechSigModalOpen(false);
        }}
        title="Technician Signature"
        fileName="technician-signature"
      />
      <InspectionCompleteModal
        open={openInspectionCompleteModal}
        onClose={() => setOpenInspectionCompleteModal(false)}
        onPrint={handlePrint}
      />
    </>
  );
};
