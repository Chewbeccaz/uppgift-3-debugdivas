// import "../styles/plan.css";
// import { GiSeaTurtle } from "react-icons/gi";

// export const Plan = () => {
//   return (
//     <div className="plan-container">
//       <div className="plan-box 1">
//         <div className="top-box">
//           <h2>
//             BLUNDERS BUBBLOR
//             <br />
//             <GiSeaTurtle />
//           </h2>
//           <p className="price">25 KR/VECKA</p>
//         </div>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>

//         <button className="buy-btn">BUY NOW</button>
//       </div>
//       <div className="plan-box 2">
//         <h2>
//           ARIELS ANTIKVITETER
//           <br />
//           <GiSeaTurtle />
//           <GiSeaTurtle />
//         </h2>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p className="price">50 kr/vecka</p>
//         <button className="buy-btn">BUY NOW</button>
//       </div>
//       <div className="plan-box 3">
//         <h2>
//           TRITIONS TREUDD
//           <br />
//           <GiSeaTurtle />
//           <GiSeaTurtle />
//           <GiSeaTurtle />
//         </h2>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p>LOREM IPSUM DOLOR SIT AMET</p>
//         <p className="price">100 kr/vecka</p>
//         <button className="buy-btn">BUY NOW</button>
//       </div>
//     </div>
//   );
// };

import "../styles/plan.css";
import { GiSeaTurtle } from "react-icons/gi";

export const Plan = () => {
  return (
    <div className="plan-container">
      <div className="plan-box 1">
        <div className="top-box">
          <img src="https://example.com/image1.jpg" alt="Plan Image" />
          <h2>BLUNDERS BUBBLOR</h2>
          <h3>För dig som precis börjat doppa tårna</h3>
          <p className="price">25 KR/VECKA</p>
        </div>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <button className="buy-btn">BUY NOW</button>
      </div>
      <div className="plan-box 2">
        <div className="top-box">
          <img src="https://example.com/image2.jpg" alt="Plan Image" />
          <h2>ARIELS ANTIKVITETER</h2>
          <h3>För dig som är nyfiken på havets alla djurarter</h3>
          <p className="price">50 KR/VECKA</p>
        </div>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <button className="buy-btn">BUY NOW</button>
      </div>
      <div className="plan-box 3">
        <div className="top-box">
          <img src="https://example.com/image3.jpg" alt="Plan Image" />
          <h2>TRITIONS TREUDD</h2>
          <h3>För dig som är redo att finkamma havsbotten med oss</h3>
          <p className="price">100 KR/VECKA</p>
        </div>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <p>LOREM IPSUM DOLOR SIT AMET</p>
        <button className="buy-btn">BUY NOW</button>
      </div>
    </div>
  );
};
