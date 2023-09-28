import React from "react";
import img2000 from "../assets/notes/2000.jpg";
import img500 from "../assets/notes/500.jpg";
import img200 from "../assets/notes/200.jpg";
import img100 from "../assets/notes/100.jpg";
import img50 from "../assets/notes/50.jpg";
import img20 from "../assets/notes/20.jpg";
import img10 from "../assets/notes/10.jpg";
import img1 from "../assets/notes/1.jpg";
const currencyImages = {
  2000: img2000,
  500: img500,
  200: img200,
  100: img100,
  50: img50,
  20: img20,
  10: img10,
  1: img1,
};

function CurrencyImage({ denomination }) {
  return <img src={currencyImages[denomination]} alt="Currency" width={80} />;
}

export default CurrencyImage;
