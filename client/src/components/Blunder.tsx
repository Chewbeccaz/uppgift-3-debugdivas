import { useEffect, useState } from "react";
import { Article } from "../models/Article";
import axios from "axios";
import { GiSeaTurtle } from "react-icons/gi";

export const Blunder = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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
    return <p>Loading...</p>; 
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Blunders Bubblor 
        <br /><GiSeaTurtle /></h1>
      {articles.map((article) => (
        <div key={article.article_id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};
