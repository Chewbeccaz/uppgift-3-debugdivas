import axios from "axios";
import { useUser } from "../context/UserContext";

const Payment = () => {
  // const [invoiceUrl, setInvoiceUrl] = useState<string>("");
  const { user } = useUser();

  const handleButtonClick = async () => {
    try {
      console.log("knappen halllåå");
      const userId = user?.userId;
      const response = await axios.get(
        `/api/stripe/generate-invoice-link?userId=${userId}`
      );
      console.log(response);
      document.location.href=(response.data.invoiceUrl);
    } catch (error) {
      console.error("Failed to generate invoice link:", error);
    }
  };

  return <button onClick={handleButtonClick}>Betala förnyelse</button>;
};

export default Payment;
