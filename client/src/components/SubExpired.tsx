import Payment from "./Payment";

export const SubExpired = () => {
    return (
      <div>
        <h2>Din prenumeration har löpt ut</h2>
        <p>Vänligen förnya din prenumeration för att fortsätta använda tjänsten.</p>
        <Payment />
      </div>
    );
  };
