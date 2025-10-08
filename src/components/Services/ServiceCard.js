"use client";

import Image from "next/image";
import React from "react";
import { useScroll } from "@/layouts/ScrollContext";
import styles from "./ServiceCard.module.css";
import * as icons from "@/icons/Icons";
import BackgroundGlow from "@/layouts/BackgroundGlow";

function ServiceCard({ data }) {
  const { refresh } = useScroll();
  return (
    <div className={styles.card}>
      <BackgroundGlow width="85%" minWidth="auto" left="50%" />
      <div className={styles.imageContainer}>
        <Image
          width={50}
          height={50}
          onLoadStart={refresh()}
          src={data.image}
          alt={data.title}
        />
      </div>

      <div className={styles.textContainer}>
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.description}>{data.description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;
