import { useState } from "react";

export default function Home() {
  const [itemLink, setItemLink] = useState("");

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemLink(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/valid/varlelt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    console.log(result);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength={2000}
          value={itemLink}
          onChange={handleLinkChange}
        />
        <button type="submit">Add item</button>
      </form>
    </div>
  );
}
