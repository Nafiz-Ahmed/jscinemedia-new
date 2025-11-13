"use client";

import React, { useState } from "react";
import PricingCard from "./PricingCard";
import Container from "@/layouts/Container";
import styles from "./Subscriptions.module.css";
import Title from "@/layouts/Title";
import CustomTab from "../CustomTab/CustomTab";
import { useNavigateToId } from "@/layouts/ScrollContext";
import goWP from "@/utils/goWP";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

// Plan data with monthly and yearly pricing + period
const PLANS = [
  {
    id: 1,
    name: "Basic",
    price: {
      monthly: 350,
      yearly: 350 * 12 * 0.85, // 15% discount
    },
    period: {
      monthly: "month",
      yearly: "year",
    },
    description:
      "For Creators/Businesses ready to scale with professional video content",
    recommended: false,
    features: [
      "2 long-form videos",
      "10 mins of running time",
      "Unlimited revision",
      "24/7 Communication support",
    ],
  },
  {
    id: 2,
    name: "Professional",
    price: {
      monthly: 999,
      yearly: 999 * 12 * 0.85, // 15% discount
    },
    period: {
      monthly: "month",
      yearly: "year",
    },
    description:
      "For Creators/Businesses looking to outperform their competition with strategic video content",
    recommended: true,
    features: [
      "4 long-form videos",
      "3 shorts/reels from each long-form video",
      "4 eye-catchy thumbnails",
      "10-15 mins of running time",
      "Unlimited revision",
      "24/7 Communication support",
      "1-on-1 Consultancy",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: {
      monthly: 1999,
      yearly: 1999 * 12 * 0.85, // 15% discount
    },
    period: {
      monthly: "month",
      yearly: "year",
    },
    description:
      "For Creators/Businesses looking to fully leverage video to become an industry leader",
    recommended: false,
    features: [
      "8 long-form videos",
      "3 shorts/reels from each long-form video",
      "8 eye-catchy thumbnails",
      "10-15 mins of running time",
      "Unlimited revision",
      "24/7 Communication support",
      "1-on-1 Consultancy",
    ],
  },
];

// Main component showing all plans
const Subscriptions = () => {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });
  const [period, setPeriod] = useState("monthly");
  const navigateToId = useNavigateToId();

  const handleMonthly = () => {
    setPeriod("monthly");
  };

  const handleYearly = () => {
    setPeriod("yearly");
  };

  const TABDATA = [
    {
      id: 1,
      label: "monthly",
      accessibility: handleMonthly,
    },
    {
      id: 2,
      label: "yearly / 15% off",
      accessibility: handleYearly,
    },
  ];

  return (
    <Container>
      <div className={styles.wrapper}>
        <div ref={titleRef}>
          <Title>
            Choose your <span>perfect plan</span>.
          </Title>
        </div>
        <CustomTab elements={TABDATA} defaultSelected={1} />
        <div className={styles.pricingPlan}>
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} period={period} />
          ))}
        </div>
        <h1 className={styles.highlighted}>
          <span
            className={styles.highlight}
            onClick={() => navigateToId("contact")}
          >
            Schedule a Call
          </span>{" "}
          for a personalized editing solution — or{" "}
          <span
            onClick={() => {
              goWP();
            }}
            className={styles.wp}
          >
            let&apos;s chat.
          </span>
        </h1>
      </div>
    </Container>
  );
};

export default Subscriptions;
