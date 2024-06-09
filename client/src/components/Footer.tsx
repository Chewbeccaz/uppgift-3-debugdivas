import "../styles/footer.css";
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="box1">
        <h3>Om Oss</h3>
        <p>Våra nyhetsbrev erbjuder allt från de senaste forskningsnyheterna till tips för hållbart simmande.</p>
      </div>
      <div className="box2">
        <h3>Kontakt</h3>
        <p>Email: info@havsnyheter.se</p>
        <p>Telefon: 123-456-789</p>
        <p>Adress: Havsgatan 1, 123 45 Havsstad</p>
      </div>
      <div className="box3">
        <h3>Följ Oss</h3>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookSquare size="30px" /></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitterSquare size="30px" /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagramSquare size="30px" /></a>
      </div>
    </div>
  );
};
