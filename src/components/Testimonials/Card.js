"use client";
import React from "react";
import styles from "./Card.module.css";
import Image from "next/image";
import BackgroundGlow from "@/layouts/BackgroundGlow";

function Card({ text, name, role, avatar }) {
  return (
    <div className={styles.card}>
      <BackgroundGlow width="60%" minWidth="auto" />
      <p className={styles.text}>{text}</p>

      <div className={styles.user}>
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h4 className={styles.name}>{name}</h4>
          <p className={styles.role}>{role}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
