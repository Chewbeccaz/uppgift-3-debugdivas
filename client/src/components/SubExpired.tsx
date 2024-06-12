export const SubExpired = () => {
    return (
      <div>
        <h2>Din prenumeration har löpt ut</h2>
        <p>Vänligen förnya din prenumeration för att fortsätta använda tjänsten.</p>
        <button onClick={() => {/* lägg till möjliget att köpa prenumerationen igen? */}}>Förnya prenumeration</button>
      </div>
    );
  };
