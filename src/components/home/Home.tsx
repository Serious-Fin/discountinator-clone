import { useEffect, useState } from "react";
import pb from "./../../lib/pocketbase";
import styles from "./Home.module.css";
import { formatDate, formatPrice } from "../../helpers/formats";
import matchHost from "../../helpers/matchHost";

export default function Home() {
  const [itemLink, setItemLink] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pb.authStore.model == null) {
          return;
        }

        const response = await pb.collection("items").getList(1, 30, {
          filter: `user_id = "` + pb.authStore.model.id + `"`,
        });
        setItems(response.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const checkVerification = async () => {
      if (pb.authStore.model == null) {
        return;
      }
      const id = pb.authStore.model.id;
      const userdata = await pb.collection("users").getOne(id);
      setIsVerified(userdata.verified);
    };

    checkVerification();
    fetchData();
  }, [refresh]);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemLink(e.target.value);
  };

  const createItemRecord = async (
    name: string,
    price: number,
    site_name: string,
    site_link: string,
    last_check: string,
    user_id: string
  ) => {
    const data = {
      name: name,
      price: price,
      site_name: site_name,
      site_link: site_link,
      last_check: last_check,
      user_id: user_id,
    };

    try {
      await pb.collection("items").create(data);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (items.length >= 10) {
      setLoading(false);
      setError("Maximum item count reached");
      return;
    }

    const host = matchHost(itemLink);

    if (host == "Invalid link" || host == "No match found") {
      setLoading(false);
      setItemLink("");
      setError("Make sure it's a valid varle.lt, pigu.lt or skytech.lt link");
      return;
    }

    const extractHost = host.split(".")[0];

    try {
      const response = await fetch(
        `http://localhost:3001/api/price/` + extractHost,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: itemLink,
          }),
        }
      );
      const result = await response.json();
      const currentUtcTime = new Date().toUTCString();

      if (pb.authStore.model == null) {
        return;
      }

      createItemRecord(
        result.name,
        result.price,
        extractHost,
        itemLink,
        currentUtcTime,
        pb.authStore.model.id
      );
      setRefresh(!refresh);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      setItemLink("");
    }

    setLoading(false);
    setItemLink("");
  };

  const handleDelete = (record_id: string) => {
    pb.collection("items").delete(record_id);
    setRefresh(!refresh);
  };

  const updateRecords = async () => {
    try {
      const asyncOperations = items.map(async (item) => {
        // get new price
        const response = await fetch(
          `http://localhost:3001/api/price/` + item.site_name,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: item.site_link,
            }),
          }
        );
        const result = await response.json();
        const currentUtcTime = new Date().toUTCString();

        // update with new price
        await pb.collection("items").update(item.id, {
          name: result.name,
          price: result.price,
          last_check: currentUtcTime,
        });
      });

      await Promise.all(asyncOperations);
    } catch (error) {
      console.error("Error while updating: ", error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    updateRecords()
      .then(() => setRefresh((prev) => !prev))
      .then(() => setLoading(false));
  };

  if (!isVerified) {
    return (
      <div className={styles.outer}>
        <div className={styles.inner}>
          <p>Please verify your email address</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outer}>
      <div className={styles.navbar}>
        <p className={styles.counter}>{items.length}/10 items</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            maxLength={2000}
            value={itemLink}
            onChange={handleLinkChange}
            className={styles.input}
            placeholder="Enter link"
          />
          <button type="submit" disabled={isLoading} className={styles.refresh}>
            Add item
          </button>
          <p className={styles.error}>{error}</p>
        </form>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={styles.refresh}
        >
          Refresh
        </button>
      </div>
      <div className={styles.inner}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className={styles.itemContainer}>
              <div className={styles.name}>
                <p className={styles.header}>Item name</p>
                <p>{item.name}</p>
              </div>

              <div className={styles.price}>
                <p className={styles.header}>Price</p>
                <p>{formatPrice(item.price.toString())}</p>
              </div>

              <div className={styles.site_name}>
                <p className={styles.header}>Vendor</p>
                <p>{item.site_name}</p>
              </div>

              <div className={styles.last_check}>
                <p className={styles.header}>Last Updated</p>
                <p id="lastCheck">{formatDate(item.last_check)}</p>
              </div>

              <button
                className={styles.removeBtn}
                onClick={() => handleDelete(item.id)}
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <p>No items are being tracked.</p>
            <p>To add a new item paste a link into the above field.</p>
            <p>Link from these websites currently work:</p>
            <ul>
              <li>
                <a href="https://pigu.lt/lt/" target="_blank">
                  Pigu.lt
                </a>
              </li>
              <li>
                <a href="https://www.varle.lt/" target="_blank">
                  Varle.lt
                </a>
              </li>
              <li>
                <a href="https://www.skytech.lt/" target="_blank">
                  Skytech.lt
                </a>
              </li>
            </ul>
            <p>
              Simply find an item you like, copy the page URL, paste into the
              above field and click "Add Item"
            </p>
          </div>
        )}
      </div>

      {isLoading && <p>Loading...</p>}
    </div>
  );
}
