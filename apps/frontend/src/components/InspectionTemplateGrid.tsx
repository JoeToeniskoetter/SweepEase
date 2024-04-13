import { FeedTwoTone } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  keyframes,
  Skeleton,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

interface InspectionTemplateGridProps {
  data: InspectionTemplate[];
  isLoading: boolean;
}

const spin = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

function groupTemplates(
  templates: InspectionTemplate[]
): Record<string, InspectionTemplate[]> {
  const result: Record<string, InspectionTemplate[]> = {};

  templates.forEach((template) => {
    if (template.inspectionLevel in result) {
      result[template.inspectionLevel] = [
        ...result[template.inspectionLevel],
        template,
      ];
    } else {
      result[template.inspectionLevel] = [template];
    }
  });

  return result;
}

export const InspectionTemplateGrid: React.FC<InspectionTemplateGridProps> = ({
  data,
  isLoading,
}) => {
  const templates = groupTemplates(data);

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7].map((t) => (
          <Grid
            item
            width={200}
            display={"flex"}
            flexDirection={"column"}
            gap={1}
          >
            <Skeleton variant="rounded" height={100} width={180} />
            <Skeleton variant="rectangular" width={100} />
            <Skeleton variant="rectangular" width={100} height={10} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      {Object.keys(templates).map((key) => (
        <Box width={"100%"}>
          <Box display={"flex"} pb={2}>
            <Typography fontWeight={"bold"} variant="h6">
              {key}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {templates[key].map((t) => (
              <Grid item lg={2}>
                <Link key={t.id} to={`${t.id}`} style={{ all: "unset" }}>
                  <Box
                    sx={{ minWidth: 180, cursor: "pointer" }}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={1}
                  >
                    <Card
                      elevation={3}
                      sx={{
                        ":hover": {
                          animation: `${spin} .250s ease forwards`,
                        },
                        borderRadius: 2,
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FeedTwoTone sx={{ color: "#e3e3e3", fontSize: 60 }} />
                      </CardContent>
                    </Card>
                    <Box>
                      <Typography>Name: {t.name}</Typography>
                      <Typography fontWeight={"light"} fontSize={12}>
                        Created: {format(new Date(t.createdAt), "MM/dd/yyyy")}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
};