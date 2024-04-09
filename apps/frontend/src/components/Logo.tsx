import React from "react";

export const Logo: React.FC<{
  variant: "light" | "dark";
}> = ({ variant = "dark" }) => {
  return (
    <p
      style={{
        color: variant == "dark" ? "black" : "white",
        fontFamily: "lobster",
        fontSize: 24,
        padding: 0,
      }}
    >
      SweepEase.
    </p>
  );
};
