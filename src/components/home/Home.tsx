import { useEffect, useState } from "react";
import pb from "./../../lib/pocketbase";
import styles from "./Home.module.css";

type RecordModel = {
  id: string;
  name: string;
  price: number;
  site_name: string;
  site_link: string;
};

export default function Home() {
  const [itemLink, setItemLink] = useState("");
  const [items, setItems] = useState<RecordModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pb.collection("items").getFullList();
        setItems(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemLink(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/price/skytech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: itemLink,
      }),
    });
    const result = await response.json();

    console.log(result.message);
  };

  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemContainer}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.price}>{item.price}</p>
            <p className={styles.site_name}>{item.site_name}</p>
            <p className={styles.last_check}>{item.last_check}</p>
            <button className={styles.removeBtn}>Remove</button>
          </div>
        ))}
      </div>

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
