import GlowingButton from "@/layouts/GlowingButton";
import styles from "./PricingCard.module.css";
import { CheckMark } from "@/icons/Icons";
import GradientText from "@/layouts/GradientText";
import BackgroundGlow from "@/layouts/BackgroundGlow";
import Button from "@/layouts/Button";

// Check icon component
// const CheckIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="20,6 9,17 4,12"></polyline>
//   </svg>
// );

// Individual Plan Card Component
const PricingCard = ({ plan, period }) => {
  const formatPrice = (price) => price.toLocaleString();

  return (
    <div
      className={`${styles.planCard} ${
        plan.recommended ? styles.recommendedCard : ""
      }`}
    >
      <BackgroundGlow
        width="70%"
        minWidth="auto"
        left={
          (plan.id === 1 && "100%") ||
          (plan.id === 2 && "50%") ||
          (plan.id === 3 && "0")
        }
      />

      <div className={styles.planName}>
        {plan.name}{" "}
        {plan.recommended && (
          <div className={styles.recommendedBadge}>Recommended</div>
        )}
      </div>

      <div className={styles.priceContainer}>
        <div className={styles.price}>
          <GradientText
            style={{
              fontSize: "var(--secondary-title-text)",
              fontWeight: "500",
            }}
          >
            ${formatPrice(Math.round(plan.price[period]))}
          </GradientText>
          <span className={styles.period}>/{plan.period[period]}</span>
        </div>
      </div>

      <div className={styles.description}>{plan.description}</div>

      {/* <GlowingButton whatsApp width="100%">
        Choose this plan
      </GlowingButton> */}
      <Button
        variant={plan.recommended ? "default" : "dark"}
        shadow="subtle"
        whatsApp
        style={{ width: "100%" }}
      >
        Choose this plan
      </Button>

      <div className={styles.featuresContainer}>
        <ul className={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <div className={styles.checkIcon}>
                <CheckMark width={14} height={14} />
              </div>
              <span className={styles.featureText}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
