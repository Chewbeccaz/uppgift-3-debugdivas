import axios from "axios";
import { useState } from "react";

export const Admin = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subscriptionLevel, setSubscriptionLevel] = useState("2");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle = {
      title,
      content,
      subscription_level: parseInt(subscriptionLevel),
      created_at: new Date(),
    };

    try {
      await axios.post("http://localhost:3000/create-article", newArticle);
      alert("Article created successfully");
      setTitle("");
      setContent("");
      setSubscriptionLevel("2");
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article");
    }
  };

  return (
    <>
      <h1>Admin</h1>
    </>
  );
};
