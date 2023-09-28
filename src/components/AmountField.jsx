/*
Author: Azhar Syed (azsyed)
AmountField.jsx (c) 2023
*/

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AmountField = ({ title, value, m, color, variant }) => {
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

  const currencyColor = value < 0 ? "red" : "green";

  return (
    <Typography variant={"h6"} m={m} color={color}>
      {title && <span>{title}: </span>}
      <span style={{ color: currencyColor }}>{formattedNumber}</span>
    </Typography>
  );
};

export default AmountField;
