// AgencyComparison.js
import React from "react";
import styles from "./AgencyComparison.module.css";
import { CheckMark, Cross } from "@/icons/Icons";
import Logo from "@/layouts/Logo";
import BackgroundGlow from "@/layouts/BackgroundGlow";

// Data variables for easy modification
const myCompanyData = {
  features: [
    "In house team of 15+ Experts",
    "Fast turnaround",
    "Unlimited Revisions",
    "Results oriented",
    "Experience with 500+ Clients",
    "24/7 Support, Anytime You Need Us",
  ],
};

const bonusData = {
  title: "Bonuses you get with us:",
  items: [
    {
      text: "Free 1-on-1 Consultancy",
    },
  ],
};

const othersData = {
  title: "Other Agencies",
  drawbacks: [
    "Unreliable Freelancers with slow turnarounds",
    "Edits that fail to convert or perform",
    "Limited revisions with no client-focused approach",
    "Guesswork instead of data-driven decisions",
    "Delayed responses and poor communication",
  ],
};

const AgencyComparison = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* My Company Section */}
        <div className={styles.myCompanyCard}>
          <BackgroundGlow width="100%" minWidth="auto" left="50%" />
          <div className={styles.logo}>
            <Logo width={200} height="auto" />
          </div>

          <div className={styles.features}>
            {myCompanyData.features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <span className={styles.checkmark}>
                  <CheckMark width={16} height={16} />
                </span>
                <span className={styles.featureText}>{feature}</span>
              </div>
            ))}
          </div>

          <div className={styles.bonusSection}>
            <BackgroundGlow width="70%" minWidth="auto" left="50%" top="50%" />
            <h3 className={styles.bonusTitle}>{bonusData.title}</h3>
            {bonusData.items.map((bonus, index) => (
              <div key={index} className={styles.bonusItem}>
                <span>
                  <CheckMark width={16} height={16} fill="green" />
                </span>
                <span className={styles.bonusText}>{bonus.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Agencies Section */}
        <div className={styles.othersCard}>
          <h2 className={styles.othersTitle}>{othersData.title}</h2>
          <div className={styles.drawbacks}>
            {othersData.drawbacks.map((drawback, index) => (
              <div key={index} className={styles.drawback}>
                <span className={styles.cross}>
                  <Cross width={24} height={24} />
                </span>
                <span className={styles.drawbackText}>{drawback}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyComparison;
