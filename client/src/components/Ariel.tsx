import { useEffect, useState } from "react";
import { Article } from "../models/Article";
import axios from "axios";
import { GiSeaTurtle } from "react-icons/gi";

export const Ariel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Lägga funktionen i typ utils eller ska man göra ett context för article och en för user?
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles/level/3");
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
      <h1>Ariels Antikviteter 
        <br /><GiSeaTurtle /><GiSeaTurtle /></h1>
      {articles.map((article) => (
        <div key={article.article_id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};
