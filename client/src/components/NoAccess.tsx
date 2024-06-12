import Payment from "./Payment";

// interface NoAccessProps {
//     handleUpgrade: (newPriceId: string) => Promise<void>;
//     priceId: string;
//     loading: boolean;
//   }

export const NoAccess = () => {
  return (
    <div className="restricted-content">
      <div className="overlay">
        <p>
          Du har inte tillgång till prenumerationsinnehållet. Vänligen starta en
          ny eller återuppta din gamla prenumeration.
        </p>
        {/* <Payment /> */}
      </div>
    </div>
  );
};
