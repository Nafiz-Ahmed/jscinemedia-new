import React from "react";
import styles from "./MemberCard.module.css";
import GradientText from "@/layouts/GradientText";
import Image from "next/image";
import BackgroundGlow from "@/layouts/BackgroundGlow";

function MemberCard({ data }) {
  return (
    <div className={styles.card}>
      <BackgroundGlow width="50%" minWidth="auto" />
      <div className={styles.image}>
        <Image alt={data.name} src={data.image} width={120} height={120} />
      </div>
      <div className={styles.details}>
        <GradientText style={{ fontSize: "var(--small-text)" }}>
          {data.role}
        </GradientText>
        <h1>{data.name}</h1>
      </div>
    </div>
  );
}

export default MemberCard;
