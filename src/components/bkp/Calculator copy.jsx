import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyImage from "./CurrencyImage";

function Calculator() {
  const [currencyCounts, setCurrencyCounts] = useState({
    2000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    1: 0,
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
  const calculateTotal = () => {
    return cashTotal + cardTotal + phonePeTotal;
  };

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

  return (
    <div>
      <Typography variant="h4">Indian Currency Calculator</Typography>
      <Box mt={2}>
        <Grid container spacing={2}>
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
                    <CurrencyImage imageUrl={currencyImages[denomination]} />
                    <TextField
                      type="number"
                      variant="outlined"
                      label={`₹${denomination}`}
                      value={count}
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
      <Box mt={4}>
        <Typography variant="h4" color={"green"}>
          Total of All Sections: ₹ {calculateTotal()}
        </Typography>
      </Box>
    </div>
  );
}

export default Calculator;
