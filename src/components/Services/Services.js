import Title from "@/layouts/Title";
import React from "react";
import Container from "@/layouts/Container";
import styles from "./Services.module.css";
import Card from "./Card";

const OFFERINGS_ONE = [
  {
    id: 1,
    title: "YouTube Videos",
    description:
      "YouTube videos made more engaging than ever for longer watch time and more subscribers.",
  },
  {
    id: 2,
    title: "Short Form Videos",
    description:
      "Nail your Reels, TikToks, LinkedIn and YouTube shorts to optimize engagement and shareability.",
  },
  {
    id: 3,
    title: "Podcast Editing",
    description:
      "Podcasts edited to perfection for clear sound, engaging flow, and a loyal audience.",
  },
];

const OFFERINGS_TWO = [
  {
    id: 4,
    title: "VLOGS",
    description:
      "Vlogs crafted for smooth storytelling, vibrant visuals, and an audience that keeps coming back.",
  },
  {
    id: 5,
    title: "Ad Creatives & VSLs",
    description:
      "High-converting ad creatives and VSLs crafted to grab attention, drive action, and boost sales.",
  },
  {
    id: 6,
    title: "LinkedIn Videos",
    description:
      "We interview you once and turn it into 12 punchy LinkedIn videos that build trust, authority, and inbound leads.",
  },
];

function Services() {
  return (
    <div className={styles.servicesSection}>
      <Container>
        <Title>
          Explore what we <span>offer</span>.
        </Title>
        <div className={styles.wrapper}>
          <div>
            {OFFERINGS_ONE.map((offer) => (
              <Card key={offer.id} data={offer} right />
            ))}
          </div>

          <div>
            {OFFERINGS_TWO.map((offer) => (
              <Card key={offer.id} data={offer} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Services;
