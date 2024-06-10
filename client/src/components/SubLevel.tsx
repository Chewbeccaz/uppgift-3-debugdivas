import React from "react";
import { useUser } from "../context/UserContext";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";

export const SubLevel = () => {
  const { user } = useUser();

  // Dummydata för prenumerationsnivån - ersätt med användarens verkliga prenumerationsnivå
  const subscriptionLevel = user ? user.subscriptionLevel : null;

  return (
    <div>
      <h1>SubLevel</h1>
      {subscriptionLevel === 2 && <Blunder />}
      {subscriptionLevel === 3 && <Ariel />}
      {subscriptionLevel === 4 && <Triton />}
    </div>
  );
};















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Article } from "../models/Article";
// import { Blunder } from "../components/Blunder";
// import { Ariel } from "../components/Ariel";
// import { Triton } from "../components/Triton";

// export const SubLevel: React.FC = () => {
//   const [subscriptionLevel, setSubscriptionLevel] = useState<number | null>(null);
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserSubscriptionLevel = async () => {
//       try {
//         const userId = "123"; // Hämta detta från användarens session eller annan källa
//         const response = await axios.get<{ data: { subscriptionLevelId: number } }>(`/api/user-membership?userId=${userId}`);
//         setSubscriptionLevel(response.data.data.subscriptionLevelId);
//       } catch (error) {
//         setError("An error occurred while fetching subscription level");
//         setLoading(false);
//       }
//     };
  
//     fetchUserSubscriptionLevel();
//   }, []);

//   useEffect(() => {
//     if (subscriptionLevel !== null) {
//       const fetchArticles = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get<Article[]>(`/api/articles/level/${subscriptionLevel}`);
//           setArticles(response.data);
//         } catch (error) {
//           setError("An error occurred while fetching articles");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchArticles();
//     }
//   }, [subscriptionLevel]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <h1>Welcome, your subscription level is: {subscriptionLevel}</h1>
//       <div>
//         {articles.map((article) => (
//           <div key={article.article_id}>
//             <h2>{article.title}</h2>
//             <p>{article.content}</p>
//           </div>
//         ))}
//       </div>
//       {subscriptionLevel === 2 && <Blunder />}
//       {subscriptionLevel === 3 && <Ariel />}
//       {subscriptionLevel === 4 && <Triton />}
//     </>
//   );
// };
