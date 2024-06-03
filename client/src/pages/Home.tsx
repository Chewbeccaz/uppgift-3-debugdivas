import { Login } from "../components/Login";
import { motion } from "framer-motion";
import fisk from "../assets/fisk.png";
import fisk2 from "../assets/fisk2.png";
import "../styles/home.css";


export const Home = () => {
  return (
    <>
      <h3>Välkommen till</h3>
      <h2>havsnyheter!</h2>
      <Login />
      <div>
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
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
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
