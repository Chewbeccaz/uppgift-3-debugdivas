import "../styles/plan.css";
import triton from "../assets/triton.png";
import blunder from "../assets/blunder3.png";
import ariel from "../assets/ariel.png";
import { Link } from "react-router-dom";

export const Plan = () => {
  return (
    <div className="plan-container">
      <div className="plan-box 1">
        <div className="top-box">
        <img src={blunder} alt="blunder" />
          <h2>BLUNDERS BUBBLOR</h2>
          <h3>För dig som precis börjat doppa tårna</h3>
        </div>
        <Link to="/signup" className="buy">
          <button className="buy-btn">25 SEK / veckan</button>
        </Link>
      </div>
      <div className="plan-box 2">
        <div className="top-box">
        <img src={ariel} alt="Ariel" />
          <h2>ARIELS ANTIKVITETER</h2>
          <h3>För dig som är nyfiken på havets alla djurarter</h3>

        </div>
        <Link to="/signup">
          <button className="buy-btn">50 SEK / veckan</button>
        </Link>
      </div>
      <div className="plan-box 3">
        <div className="top-box">
          <img src={triton} alt="triton" />
          <h2>TRITIONS <br />TREUDD</h2>
          <h3>För dig som är redo att finkamma havsbotten med oss</h3>
        </div>
        <Link to="/signup">
          <button className="buy-btn">100 SEK / veckan</button>
        </Link>
      </div>
    </div>
  );
};
