import { CloudUploadTwoTone } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import React, { ChangeEvent, useRef, useState, DragEvent } from "react";

interface InspectionIntroProps {
  inspection: InspectionOrder;
}

export const InspectionIntro: React.FC<InspectionIntroProps> = ({
  inspection,
}) => {
  const theme = useTheme();
  const [previewImage, setPreviewImage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e?.currentTarget.files;

    if (files && files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };
  return (
    <Box p={2} display={"flex"} flexDirection={"column"} height={"100%"}>
      <Typography fontWeight={"bold"} variant="h5">
        Inspection Order Info
      </Typography>
      <Divider />
      <Box display={"flex"} gap={1} pt={2}>
        <Typography fontWeight={"bold"} variant="h6">
          Customer Name:{" "}
        </Typography>
        <Typography variant="h6">{inspection.customerName}</Typography>
      </Box>
      <Box display={"flex"} gap={1}>
        <Typography fontWeight={"bold"} variant="h6">
          Address:{" "}
        </Typography>
        <Typography variant="h6">
          {inspection.address}, {inspection.city}, {inspection.state}{" "}
          {inspection.zip}
        </Typography>
      </Box>
      <Box display={"flex"} gap={1} flexGrow={1}>
        <Typography fontWeight={"bold"} variant="h6">
          Inspection Level:{" "}
        </Typography>
        <Typography variant="h6">
          {inspection.template?.inspectionLevel}
        </Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"} my={2}>
        <Typography fontWeight={"bold"} variant="h5">
          Residence Photo
        </Typography>
        <Divider />
      </Box>
      <Box
        style={{
          flexGrow: 1,
          backgroundColor: "transparent",
          borderRadius: 45,
          border: previewImage ? "" : `2px dashed ${theme.palette.grey[500]}`,
          cursor: "pointer",
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        onClick={() => {
          inputRef.current?.click();
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <img
            src={previewImage}
            height={"auto"}
            style={{ maxWidth: "1500px" }}
          />
        ) : (
          <>
            <input
              type="file"
              hidden
              ref={inputRef}
              onChangeCapture={onChange}
            />
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              flexGrow={1}
            >
              <Typography variant="h5">
                Drag and drop image here or click
              </Typography>
              <CloudUploadTwoTone
                sx={{ fontSize: 120, color: theme.palette.grey[500] }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
