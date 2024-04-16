import { Close } from "@mui/icons-material";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import React, { useRef, useState } from "react";

interface SignatureModalProps {
  open: boolean;
  disclaimer?: string;
  title: string;
  fileName: string;
  onClose: () => void;
  onFinishedSigning: (dataUrl: string, file: File) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  open,
  disclaimer,
  title,
  fileName,
  onClose,
  onFinishedSigning,
}) => {
  const [hasStartedSignature, setHasStartedSignature] =
    useState<boolean>(false);
  const theme = useTheme();
  const sigRef = useRef<SignatureCanvas>(null);

  async function getBlob(): Promise<Blob> {
    return new Promise((resolve) => {
      sigRef.current?.getTrimmedCanvas().toBlob((blob) => {
        if (!blob) {
          throw new Error("failed to capture signature");
        }
        resolve(blob);
      }, "image/png");
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        borderRadius={2}
        minWidth={200}
        bgcolor={"white"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h5">{title}</Typography>
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
              // width: 600,
              // height: 200,
              className: "sigPad",
            }}
            onBegin={() => setHasStartedSignature(true)}
          />
        </Box>
        <Box p={0.5}>
          {disclaimer && (
            <Typography variant="caption" color={"info"}>
              {disclaimer}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={async () => {
            const blob = await getBlob();
            console.log(blob);
            const dataUrl = sigRef.current?.toDataURL("image/png");
            const file = new File([blob], `${fileName}.png`, {
              type: "image/png",
            });
            onFinishedSigning(dataUrl ?? "", file);
          }}
          disabled={!hasStartedSignature}
        >
          Accept
        </Button>
      </Box>
    </Modal>
  );
};
