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

  const formatDate = (date: string) => {
    const dateTime = date.split(".")[0];
    return dateTime;
  };

  const formatPrice = (price: string) => {
    return price + " €";
  };

  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemContainer}>
            <div className={styles.name}>
              <p className={styles.header}>Item name</p>
              <p>{item.name}</p>
            </div>

            <div className={styles.price}>
              <p className={styles.header}>Price</p>
              <p>{formatPrice(item.price)}</p>
            </div>

            <div className={styles.site_name}>
              <p className={styles.header}>Vendor</p>
              <p>{item.site_name}</p>
            </div>

            <div className={styles.last_check}>
              <p className={styles.header}>Last Updated</p>
              <p id="lastCheck">{formatDate(item.last_check)}</p>
            </div>

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
