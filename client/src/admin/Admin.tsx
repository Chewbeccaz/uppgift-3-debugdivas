import axios from "axios";
import { useState } from "react";
import { Article } from "../models/Article";
import { Blunder } from "../components/Blunder";
import { Ariel } from "../components/Ariel";
import { Triton } from "../components/Triton";
import "../styles/admin.css";
import { Plan } from "../components/Plan";

export const Admin = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subscriptionLevel, setSubscriptionLevel] = useState("2");

  const handleCreateArticle = async (article: Article) => {
    try {
      console.log("Adding article:", article);
      const response = await axios.post("/api/articles/create", article, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Article added:", response.data);
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      title,
      content,
      subscription_level: parseInt(subscriptionLevel),
      created_at: new Date(),
    };

    console.log(newArticle);
    await handleCreateArticle(newArticle);
    alert("Article created successfully");
    setTitle("");
    setContent("");
    setSubscriptionLevel("2");
  };

  return (
    <>
      <h1>Admin</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required></textarea>
        </div>
        <div>
          <label htmlFor="subscriptionLevel">Subscription Level</label>
          <select
            id="subscriptionLevel"
            value={subscriptionLevel}
            onChange={(e) => setSubscriptionLevel(e.target.value)}
            required>
            <option value="2">Blunders Bubblor</option>
            <option value="3">Ariels Antikviteter</option>
            <option value="4">Tritons Treudd</option>
          </select>
        </div>
        <button type="submit">Create Article</button>
      </form>
    </>
  );
};
