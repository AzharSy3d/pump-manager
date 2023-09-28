/*
Author: Azhar Syed (azsyed)
SalesSummary.jsx (c) 2023
*/

import React from "react";
import { Typography, Grid } from "@mui/material";

const LabeledData = ({ label, data }) => {
  return (
    <Grid container spacing={3} p={"5px"}>
      <Grid item xs={6}>
        <Typography variant="h6">{label}:</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6">{data}</Typography>
      </Grid>
    </Grid>
  );
};

export default LabeledData;
