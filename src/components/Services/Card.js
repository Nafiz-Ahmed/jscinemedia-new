import BackgroundGlow from "@/layouts/BackgroundGlow";
import React from "react";
import styles from "./Card.module.css";
import Button from "@/layouts/Button";

function Card({ data, right }) {
  return (
    <div className={styles.wrapper}>
      <BackgroundGlow minWidth="none" width="100%" left={right && "100%"} />
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <Button shadow="subtle" whatsApp>
        Explore Pricing →
      </Button>
    </div>
  );
}

export default Card;
