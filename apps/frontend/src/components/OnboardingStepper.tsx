import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import {
  Business,
  CheckCircleOutline,
  FormatListBulletedRounded,
} from "@mui/icons-material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const steps = [
  {
    label: "Your company details",
    description: "Some basic informatino about your business",
  },
  // {
  //   label: "Select a plan",
  //   description: "Choose the plan that's right for your business",
  // },
];

export default function OnboardingStepper() {
  const [activeStep] = React.useState(0);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={
          <StepConnector
            sx={{
              [`& .${stepConnectorClasses.line}`]: {
                height: 15,
                borderLeft: 2,
                borderColor: "white",
              },
            }}
          />
        }
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => {
                if (activeStep > index) {
                  return (
                    <Box
                      bgcolor={"#5afa6d"}
                      borderRadius={12}
                      width={25}
                      height={25}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      p={1}
                    >
                      <CheckCircleOutline
                        fontSize={"medium"}
                        sx={{ color: "black" }}
                      />
                    </Box>
                  );
                }
                return (
                  <Box
                    bgcolor={"white"}
                    borderRadius={12}
                    width={25}
                    height={25}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    p={1}
                  >
                    {index == 0 ? <Business /> : <FormatListBulletedRounded />}
                  </Box>
                );
              }}
            >
              <Typography color={"white"} fontWeight={"bold"} variant="h6">
                {step.label}
              </Typography>
              <Typography color={"black"} variant="body2" fontWeight={"light"}>
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* {activeStep === steps.length ? (
        <Button
          onClick={handleReset}
          variant="contained"
          fullWidth
          sx={{ textTransform: "none", marginTop: 4 }}
        >
          <Typography color={"white"}>Create Account</Typography>
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          variant="contained"
          fullWidth
          sx={{ textTransform: "none", marginTop: 4 }}
        >
          <Typography color={"white"}>Next</Typography>
        </Button>
      )} */}
    </Box>
  );
}
