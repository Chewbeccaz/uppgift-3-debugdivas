// NotFound.jsx

import "../styles/notFound.css";

export const NotFound = () => {
  return (
    <>
      <div className="container-lostatsea">
        <div className="container-notfound">
          <h1>Oj, det verkar som att vi seglat vilse på de digitala haven!</h1>
          <p>Men oroa dig inte, vi har några alternativ för att komma tillbaka på rätt kurs:</p>
          <br />
          <ul>
            <li>Kasta ankar och besök vår <a href="/">startsida</a>.</li>
            <li>Utforska våra senaste nyhetsbrev <a href="/">här</a>.</li>
            <li>Kanske vill du dyka ner i vårt arkiv av <a href="/">artiklar?</a>.</li>
          </ul>
          <p>Om du känner dig som en riktig sjöfarare, kan du försöka navigera tillbaka till det du letade efter, eller varför inte skriva till oss så guidar vi dig rätt.</p>
          <br />
          <p>Tack för ditt tålamod och happy sailing! ⛵️</p>
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
};
