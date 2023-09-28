/*
Author: Azhar Syed (azsyed)
index.jsx (c) 2023
*/

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Divider,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Autocomplete,
  useTheme,
  Stack,
} from "@mui/material";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";

import AmountField from "../../components/AmountField";
import CurrencyImage from "../../components/CurrencyImage";

import { mockedSalesmenData } from "../../Data";
import SalesSummary from "../../components/LabeledData";
import LabeledData from "../../components/LabeledData";
import { formatDateMMMDoYYYY } from "../../utils/DateUtils";
import { fontSize } from "@mui/system";

function ImageOverlay({ image, onClose }) {
  return (
    <div className="image-overlay">
      <div className="image-container">
        <img src={URL.createObjectURL(image)} alt="Overlay" />
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function Calculator() {
  const theme = useTheme();

  const [currencyCounts, setCurrencyCounts] = useState({
    2000: null,
    500: null,
    200: null,
    100: null,
    50: null,
    20: null,
    10: null,
    1: null,
  });

  const [cardPayments, setCardPayments] = useState([]);
  const [phonePePayments, setPhonePePayments] = useState([]);

  const [cardAmount, setCardAmount] = useState(0);
  const [cardReceiptImage, setCardReceiptImage] = useState(null);

  const [phonePeAmount, setPhonePeAmount] = useState(0);
  const [phonePeScreenshotImage, setPhonePeScreenshotImage] = useState(null);

  // Separate totals for each section
  const [cashTotal, setCashTotal] = useState(0);
  const [cardTotal, setCardTotal] = useState(0);
  const [phonePeTotal, setPhonePeTotal] = useState(0);

  // Fuel Sale section state
  const [fuelType, setFuelType] = useState("");
  const [todaysRate, setTodaysRate] = useState(0);
  const [openingReading, setOpeningReading] = useState(0);
  const [closingReading, setClosingReading] = useState(0);
  const [salesUnit, setSalesUnit] = useState(0);
  const [saleAmount, setSaleAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [showMoreCard, setShowMoreCard] = useState(false);
  const [showMorePhonePe, setShowMorePhonePe] = useState(false);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [selectedSalesman, setSelectedSalesman] = useState(null);

  useEffect(() => {
    // Calculate Cash total
    let cashTotal = 0;
    for (const denomination in currencyCounts) {
      cashTotal += denomination * currencyCounts[denomination];
    }
    setCashTotal(cashTotal);
  }, [currencyCounts]);

  useEffect(() => {
    // Calculate Card total
    let cardTotal = 0;
    cardPayments.forEach((payment) => {
      cardTotal += payment.amount;
    });
    setCardTotal(cardTotal);
  }, [cardPayments]);

  useEffect(() => {
    // Calculate PhonePe total
    let phonePeTotal = 0;
    phonePePayments.forEach((payment) => {
      phonePeTotal += payment.amount;
    });
    setPhonePeTotal(phonePeTotal);
  }, [phonePePayments]);

  // Calculate the total of all sections
  useEffect(() => {
    const total = cashTotal + cardTotal + phonePeTotal;
    setFinalTotal(total);
  }, [cashTotal, cardTotal, phonePeTotal, saleAmount]);

  useEffect(() => {
    updateBalance();
  }, [finalTotal, saleAmount]);

  // Calculate sales unit, sale amount, and balance
  useEffect(() => {
    const salesUnit = closingReading - openingReading;
    if (salesUnit > 0) {
      setSalesUnit(salesUnit);
      const saleAmountx = Number(salesUnit * todaysRate);
      setSaleAmount(saleAmountx.toFixed(2));
    }
  }, [openingReading, closingReading, todaysRate]);

  const handleInputChange = (denomination, value) => {
    setCurrencyCounts({
      ...currencyCounts,
      [denomination]: value,
    });
  };

  const addCardPayment = () => {
    setCardPayments([
      ...cardPayments,
      { amount: cardAmount, receiptImage: cardReceiptImage },
    ]);
    setCardAmount(0);
    setCardReceiptImage(null);
  };

  const addPhonePePayment = () => {
    setPhonePePayments([
      ...phonePePayments,
      { amount: phonePeAmount, screenshotImage: phonePeScreenshotImage },
    ]);
    setPhonePeAmount(0);
    setPhonePeScreenshotImage(null);
  };

  // Handle fuel type selection
  const handleFuelTypeChange = async (event) => {
    const selectedFuelType = event.target.value;
    setFuelType(selectedFuelType);

    let rate = 0;
    if (selectedFuelType === "XS") {
      rate = 80; // Replace with actual rate
    } else if (selectedFuelType === "XP") {
      rate = 85; // Replace with actual rate
    } else if (selectedFuelType === "MS") {
      rate = 70; // Replace with actual rate
    }
    setTodaysRate(rate);
  };

  // Update balance and set it in red or green color
  const updateBalance = () => {
    const diff = finalTotal - saleAmount;
    setBalance(diff);
  };

  // Function to delete a Card payment record by index
  const deleteCardPayment = (index) => {
    const updatedCardPayments = [...cardPayments];
    updatedCardPayments.splice(index, 1);
    setCardPayments(updatedCardPayments);
    updateTotalAndBalanceAfterDelete();
  };

  // Function to delete a PhonePe payment record by index
  const deletePhonePePayment = (index) => {
    const updatedPhonePePayments = [...phonePePayments];
    updatedPhonePePayments.splice(index, 1);
    setPhonePePayments(updatedPhonePePayments);
    updateTotalAndBalanceAfterDelete();
  };

  // Function to update the total and balance after a record is deleted
  const updateTotalAndBalanceAfterDelete = () => {
    const newCardTotal = cardPayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );
    setCardTotal(newCardTotal);

    const newPhonePeTotal = phonePePayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );
    setPhonePeTotal(newPhonePeTotal);

    const newTotal = cashTotal + newCardTotal + newPhonePeTotal;
    setFinalTotal(newTotal);
    updateBalance(newTotal);
  };

  const openImageDialog = (imageURL) => {
    setSelectedImage(imageURL);
    setImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage("");
  };

  const handleSalesmanChange = (event, newValue) => {
    setSelectedSalesman(newValue);
  };

  const data = {
    saleAmount: "₹0.00",
    cash: "₹0.00",
    phonePe: "₹0.00",
    cards: "₹0.00",
    amountCollected: "₹0.00",
    balance: "₹0.00",
  };
  return (
    <div>
      <Box mt={0}>
        <Typography variant="h2" align="center" mb={3} color={"secondary"}>
          Daily Sales Calculator
        </Typography>
        <Grid container spacing={2}>
          <Dialog
            open={imageDialogOpen}
            onClose={closeImageDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Image Popup</DialogTitle>
            <DialogContent>
              <img src={selectedImage} alt="Popup" style={{ width: "100%" }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeImageDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Grid item xs={12} sm={6} md={3}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: theme.palette.primary }}
              >
                <Typography variant="h5">Fuel Sale</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{}}>
                <Box justifyContent={"center"}>
                  <Stack
                    component="form"
                    sx={{
                      width: "30ch",
                    }}
                    spacing={2}
                    // noValidate
                    autoComplete="off"
                  >
                    <Autocomplete
                      value={selectedSalesman}
                      onChange={handleSalesmanChange}
                      options={mockedSalesmenData} // Salesmen data from your API or state
                      getOptionLabel={(salesman) => salesman.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Salesman"
                          variant="outlined"
                        />
                      )}
                    />
                    <Select
                      value={fuelType}
                      onChange={handleFuelTypeChange}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <LocalGasStationOutlinedIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Select Fuel Type</MenuItem>
                      <MenuItem value="XS">Petrol</MenuItem>
                      <MenuItem value="XP">Power Petrol</MenuItem>
                      <MenuItem value="MS">Diesel</MenuItem>
                    </Select>
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Today's Rate (₹/Ltr)"
                      value={todaysRate}
                      onChange={(e) =>
                        setTodaysRate(parseFloat(e.target.value) || 0)
                      }
                      // disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Opening Reading (Ltr)"
                      value={openingReading}
                      onChange={(e) =>
                        setOpeningReading(parseFloat(e.target.value) || 0)
                      }
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Closing Reading (Ltr)"
                      value={closingReading}
                      onChange={(e) =>
                        setClosingReading(parseFloat(e.target.value) || 0)
                      }
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Sales Unit (Ltr)"
                      value={salesUnit}
                      disabled
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start" color="primary">
                            ltr
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Sale Amount (₹)"
                      value={saleAmount} // Format to two decimal places
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" color="primary">
                            ₹
                          </InputAdornment>
                        ),
                      }}
                    />
                    <AmountField
                      title={"Sale Amt"}
                      value={saleAmount}
                      m={2}
                      // variant={"h3"}
                      color={"primary"}
                    />
                  </Stack>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Cash Payment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{}}>
                  <Stack
                    component="form"
                    sx={
                      {
                        // width: "30ch",
                      }
                    }
                    spacing={1.1}
                    // noValidate
                    autoComplete="off"
                  >
                    {Object.entries(currencyCounts)
                      .reverse()
                      .map(([denomination, count]) => (
                        <Box
                          key={denomination}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          m={1}
                        >
                          <CurrencyImage denomination={denomination} /> x
                          <TextField
                            type="number"
                            variant="outlined"
                            label={`₹${denomination}`}
                            value={count}
                            inputProps={{ min: 0 }}
                            onChange={(e) =>
                              handleInputChange(
                                denomination,
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </Box>
                      ))}
                    <AmountField
                      title={"Cash"}
                      value={cashTotal}
                      m={3}
                      color={"primary"}
                    />
                  </Stack>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Card Payment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{}}>
                  <Stack
                    component="form"
                    sx={{}}
                    spacing={2}
                    // noValidate
                    autoComplete="off"
                  >
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Amount"
                      value={cardAmount}
                      onChange={(e) =>
                        setCardAmount(parseFloat(e.target.value) || 0)
                      }
                    />
                    <TextField
                      type="file"
                      variant="outlined"
                      accept="image/*"
                      onChange={(e) => setCardReceiptImage(e.target.files[0])}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addCardPayment}
                    >
                      Add Card Payment
                    </Button>
                  </Stack>
                  {cardReceiptImage && (
                    <Box mt={2}>
                      <img
                        src={URL.createObjectURL(cardReceiptImage)}
                        alt="Receipt"
                        width="100px"
                        height="40px"
                      />
                    </Box>
                  )}

                  <AmountField
                    title={"Card"}
                    value={cardTotal}
                    m={3}
                    color={"primary"}
                  />
                  {showMoreCard && (
                    <>
                      <Divider />
                      <Box mt={1}>
                        <Typography variant="h6" p={1}>
                          Card Payments
                        </Typography>
                        <TableContainer
                          component={Paper}
                          sx={{ overflow: "auto", maxHeight: "230px" }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Receipt Image</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cardPayments.map((payment, index) => (
                                <TableRow key={index}>
                                  <TableCell>₹{payment.amount}</TableCell>
                                  <TableCell>
                                    <img
                                      src={URL.createObjectURL(
                                        payment.receiptImage
                                      )}
                                      alt="Receipt"
                                      width="100px"
                                      height="40px"
                                      onClick={() =>
                                        openImageDialog(
                                          URL.createObjectURL(
                                            payment.receiptImage
                                          )
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      aria-label="delete"
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() => {
                                        deleteCardPayment(index);
                                      }}
                                    >
                                      <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </>
                  )}
                  <Button
                    onClick={() => setShowMoreCard(!showMoreCard)}
                    variant="outlined"
                    size="small"
                    sx={{ m: 1 }}
                  >
                    {showMoreCard ? "Show Less" : "Show More"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">PhonePe Payment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{}}>
                  <Stack
                    component="form"
                    sx={{}}
                    spacing={2}
                    autoComplete="off"
                  >
                    <TextField
                      type="number"
                      variant="outlined"
                      label="Amount"
                      value={phonePeAmount}
                      onChange={(e) =>
                        setPhonePeAmount(parseFloat(e.target.value) || 0)
                      }
                    />
                    <TextField
                      variant="outlined"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPhonePeScreenshotImage(e.target.files[0])
                      }
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addPhonePePayment}
                    >
                      Add PhonePe Payment
                    </Button>
                    {phonePeScreenshotImage && (
                      <Box mt={2}>
                        <img
                          src={URL.createObjectURL(phonePeScreenshotImage)}
                          alt="Screenshot"
                          width="100px"
                          height="40px"
                        />
                      </Box>
                    )}
                  </Stack>
                  <AmountField
                    title={"PhonePe"}
                    value={phonePeTotal}
                    m={3}
                    color={"primary"}
                  />
                  {showMorePhonePe && (
                    <>
                      <Divider />
                      <Box mt={1}>
                        <Typography variant="h6" p={1}>
                          PhonePe Payments
                        </Typography>
                        <TableContainer
                          component={Paper}
                          sx={{ overflow: "auto", maxHeight: "230px" }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Screenshot</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {phonePePayments.map((payment, index) => (
                                <TableRow key={index}>
                                  <TableCell>₹{payment.amount}</TableCell>
                                  <TableCell>
                                    <img
                                      src={URL.createObjectURL(
                                        payment.screenshotImage
                                      )}
                                      alt="Screenshot"
                                      width="100px"
                                      height="40px"
                                      onClick={() =>
                                        openImageDialog(
                                          URL.createObjectURL(
                                            payment.screenshotImage
                                          )
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      aria-label="delete"
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() => {
                                        deletePhonePePayment(index);
                                      }}
                                    >
                                      <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </>
                  )}
                  <Button
                    onClick={() => setShowMorePhonePe(!showMorePhonePe)}
                    variant="outlined"
                    size="small"
                    sx={{ m: 1 }}
                  >
                    {showMorePhonePe ? "Show Less" : "Show More"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box mt={4} component={"div"}>
              <Card variant="outlined" sx={{ boxShadow: 1 }}>
                <CardContent gap={3} backgroundColor="red">
                  <Typography variant="h4" color="text.secondary" gutterBottom>
                    Sales Summary{" "}
                    <span style={{ fontSize: "10px" }}>
                      ( {formatDateMMMDoYYYY(new Date())} )
                    </span>
                  </Typography>
                  <Divider />
                  <br />
                  <LabeledData
                    label={"Sale Amount"}
                    data={<AmountField value={saleAmount} />}
                  />
                  <LabeledData
                    label={"Cash"}
                    data={<AmountField value={cashTotal} />}
                  />

                  <LabeledData
                    label={"PhonePe"}
                    data={<AmountField value={phonePeTotal} />}
                  />
                  <LabeledData
                    label={"Cards"}
                    data={<AmountField value={cardTotal} />}
                  />

                  <LabeledData
                    label={"Amount Collected"}
                    data={<AmountField value={finalTotal} />}
                  />

                  <LabeledData
                    label={balance > 0 ? "Profit" : "Balance"}
                    data={<AmountField value={balance.toFixed(20)} />}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Calculator;
