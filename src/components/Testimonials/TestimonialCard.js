import React from "react";
import styles from "./TestimonialCard.module.css";
import { Star } from "@/icons/Icons";
import Image from "next/image";

function TestimonialCard({ data, index }) {
  const isEven = index % 2 === 0;

  return (
    <div className={`${styles.wrapper} ${isEven && styles.evenWrapper}`}>
      <div className={styles.pin}>
        <Image
          src={data.pin}
          alt={index}
          width={20}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.user}>
        <div>{data.name[0]}</div>
        <h1>{data.name}</h1>
      </div>

      <div className={styles.ratings}>
        Ratings :
        <span>
          <Star width="15px" height="15px" />
          <Star width="15px" height="15px" />
          <Star width="15px" height="15px" />
          <Star width="15px" height="15px" />
          <Star width="15px" height="15px" />
        </span>
      </div>
      <div className={styles.review}>{data.review}</div>
    </div>
  );
}

export default TestimonialCard;
