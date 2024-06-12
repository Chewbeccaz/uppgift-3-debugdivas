interface SubscriptionInfo {
    subscriptionLevel: string;
    lastPaymentDate: number;
    nextPaymentDate: number;
  }


export const UpgradeConfirm = () => {
    const subscriptionInfo: SubscriptionInfo = {
        subscriptionLevel: "your_subscription_level",
        lastPaymentDate: 0,
        nextPaymentDate: 0
    };

    return (
        <>
            {subscriptionInfo ?
                <p>
                    Grattis till din nya prenumeration!
                    <br />
                    Nu har tillgång till {subscriptionInfo.subscriptionLevel} 
                </p>
                : null}
        </>
    );
}
  
export default UpgradeConfirm;
  