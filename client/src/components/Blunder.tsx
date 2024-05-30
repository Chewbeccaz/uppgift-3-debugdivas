import { useEffect, useState } from "react";
import { Article } from "../models/Article";
import axios from "axios";

export const Blunder = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Lägga funktionen i typ utils eller ska man göra ett context för article och en för user?
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles/level/2");
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching articles");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Loading...</p>; //Kanske en kul spinner eller något?? :))
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Level 1: Blunders Bubblor</h1>
      <p>Här Är alla nyhetsartiklar i Blunders bubblor: </p>
      {articles.map((article) => (
        <div key={article.article_id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};
