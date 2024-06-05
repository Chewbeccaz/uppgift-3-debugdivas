import { motion } from "framer-motion";
import fisk from "../assets/fisk.png";
import fisk2 from "../assets/fisk2.png";
import "../styles/home.css";
import React, { useState, useEffect } from 'react'; // Importera useState och useEffect

export const Home = () => {
  // Skapar en state för att lagra den aktuella toppositionen för fisk1
  const [topPosition, setTopPosition] = useState('50px'); // Startposition

  // Funktion för att generera en slumpmässig topposition
  const generateRandomTopPosition = () => {
    const minTop = 10; // Minsta topposition i px
    const maxTop = 1000; // Maximala topposition i px
    const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    return `${randomTop}px`;
  };
// Uppdaterar toppositionen när komponenten renderas
useEffect(() => {
  setTopPosition(generateRandomTopPosition());
}, []);

// Effekt för att uppdatera toppositionen efter varje passering
useEffect(() => {
  const timer = setTimeout(() => {
    setTopPosition(generateRandomTopPosition());
  }, 20000); // Ställer in en timeout för att uppdatera positionen efter 20 sekunder

  return () => clearTimeout(timer); // Rensa upp timern när komponenten destrueras
}, [topPosition]); // Dependencyn är topPosition så att effekten körs igen när toppositionen ändras

  return (
    <>
      <h3>Välkommen till</h3>
      <h2>havsnyheter!</h2>

      <div style={{ overflow:"hidden"}}>
        <motion.img
          src={fisk}
          id="fisk1"
          alt="fisk"
          animate={{
            x: ["100%", "-2000%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeOut",
            repeatDelay: 0,
          }}
          style={{
            display: "block",
            position: "absolute",
            right: 0,
            width: "8%",
            height: "auto",
            top: topPosition, // Använder state-värdet för toppositionen
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", height: "100vh", overflow:"hidden"}}>
        <motion.img
          src={fisk2}
          id="fisk2"
          alt="fisk"
          animate={{
            left: ["0%", "100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeOut",
            repeatDelay: 0,
          }}
          style={{
            display: "block",
            position: "absolute",
            bottom: "55vh",
            width: "10%",
            height: "auto",
          }}
        />
      </div>
    </>
  );
};
