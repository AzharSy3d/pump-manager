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
} from "@mui/material";
import CurrencyImage from "../CurrencyImage";

import axios from "axios";

function Calculator() {
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

  const currencyImages = {
    2000: "image_2000.jpg", // Replace with actual image URLs
    500: "image_500.jpg",
    200: "image_200.jpg",
    100: "image_100.jpg",
    50: "image_50.jpg",
    20: "image_20.jpg",
    10: "image_10.jpg",
    1: "image_1.jpg",
  };

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
  }, [cashTotal, cardTotal, phonePeTotal]);

  useEffect(() => {
    updateBalance();
  }, [finalTotal]);

  // Calculate sales unit, sale amount, and balance
  useEffect(() => {
    const salesUnit = closingReading - openingReading;
    if (salesUnit > 0) {
      setSalesUnit(salesUnit);
      console.log("salesUnit :", salesUnit);
      console.log("todaysRate :", todaysRate);
      const saleAmountx = Number(salesUnit * todaysRate);
      console.log("saleAmountx :", saleAmount);
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

    // Simulate fetching the daily rate based on the selected fuel type
    // Replace this with actual API call to get the rate

    const options = {
      method: "GET",
      url: "https://daily-fuel-price-india1.p.rapidapi.com/api/fuel/price/Maharashtra/Parbhani",
      headers: {
        "X-RapidAPI-Key": "7b9d921ba9msh8e524f9eb7cd885p110a93jsn0ccba72b7b6b",
        "X-RapidAPI-Host": "daily-fuel-price-india1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    let rate = 0;
    if (selectedFuelType === "Petrol") {
      rate = 80; // Replace with actual rate
    } else if (selectedFuelType === "Power Petrol") {
      rate = 85; // Replace with actual rate
    } else if (selectedFuelType === "Diesel") {
      rate = 70; // Replace with actual rate
    }
    setTodaysRate(rate);
  };

  // Update balance and set it in red or green color
  const updateBalance = () => {
    console.log("finalTotal : ", finalTotal);
    console.log("SaleAmount : ", saleAmount);
    const diff = finalTotal - saleAmount;
    setBalance(diff);
    console.error("Balance: ", balance);
    if (diff < 0) {
      document.getElementById("balance").style.color = "red";
    } else {
      document.getElementById("balance").style.color = "green";
    }
  };

  return (
    <div>
      <Typography variant="h4">Indian Currency Calculator</Typography>
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            {/* Fuel Sale section */}
            <Card>
              <CardContent>
                <Typography variant="h5">Fuel Sale</Typography>
                <Select
                  value={fuelType}
                  onChange={handleFuelTypeChange}
                  variant="outlined"
                  label="Fuel Type"
                >
                  <MenuItem value="Petrol">Petrol</MenuItem>
                  <MenuItem value="Power Petrol">Power Petrol</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                </Select>
                <TextField
                  type="number"
                  variant="outlined"
                  label="Today's Rate (₹/Ltr)"
                  value={todaysRate}
                  disabled
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
                />
                <TextField
                  type="number"
                  variant="outlined"
                  label="Sale Amount (₹)"
                  value={saleAmount} // Format to two decimal places
                  disabled
                />
                <Typography variant="h5" m={3}>
                  Balance: ₹ <span id="balance">{balance.toFixed(2)}</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Rest of the code for Cash, Card, and PhonePe sections */}
          {/* ... */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">Cash Payment</Typography>
                {Object.entries(currencyCounts).map(([denomination, count]) => (
                  <Box
                    key={denomination}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mt={2}
                  >
                    {/* <CurrencyImage imageUrl={currencyImages[denomination]} /> */}
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
                <Typography variant="h5" m={3} color={"green"}>
                  Total: ₹ {cashTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">Card Payment</Typography>
                <TextField
                  type="number"
                  variant="outlined"
                  label="Amount"
                  value={cardAmount}
                  onChange={(e) =>
                    setCardAmount(parseFloat(e.target.value) || 0)
                  }
                />
                <input
                  type="file"
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
                <Typography variant="h5" m={3} color={"green"}>
                  Total: ₹ {cardTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">PhonePe Payment</Typography>
                <TextField
                  type="number"
                  variant="outlined"
                  label="Amount"
                  value={phonePeAmount}
                  onChange={(e) =>
                    setPhonePeAmount(parseFloat(e.target.value) || 0)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhonePeScreenshotImage(e.target.files[0])}
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
                <Typography variant="h5" m={3} color={"green"}>
                  Total: ₹ {phonePeTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5">Payment History</Typography>
                <div>
                  <Typography variant="h6">Card Payments</Typography>
                  <ul>
                    {cardPayments.map((payment, index) => (
                      <li key={index}>
                        Amount: ₹{payment.amount}, Receipt Image:{" "}
                        <img
                          src={URL.createObjectURL(payment.receiptImage)}
                          alt="Receipt"
                          width="100px"
                          height="40px"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Typography variant="h6">PhonePe Payments</Typography>
                  <ul>
                    {phonePePayments.map((payment, index) => (
                      <li key={index}>
                        Amount: ₹{payment.amount}, Screenshot Image:{" "}
                        <img
                          src={URL.createObjectURL(payment.screenshotImage)}
                          alt="Screenshot"
                          width="100px"
                          height="40px"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Typography variant="h5">
          Balance of Today: ₹ {balance.toFixed(2)}
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h4" color={"green"}>
          Total of All Sections: ₹ {finalTotal.toFixed(2)}
        </Typography>
      </Box>
    </div>
  );
}

export default Calculator;
