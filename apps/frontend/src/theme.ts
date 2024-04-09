import { createTheme, ThemeOptions } from "@mui/material/styles";

const theme = createTheme();

export const themeOptions: ThemeOptions = {
  ...theme,
  palette: {
    ...theme.palette,
    mode: "light",
    primary: {
      main: "#F57F37",
      light: "#f2b28a",
    },
    secondary: {
      main: "#7E4438",
    },
  },
};
