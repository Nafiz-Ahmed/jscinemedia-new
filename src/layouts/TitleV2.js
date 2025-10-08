import React from "react";
import styles from "@/styles/titleV2.module.css";
import GradientText from "./GradientText";

/**
 * A function component to render a title with an optional subtitle.
 * @param {object} props The component props.
 * @param {string} props.title The title string.
 * @param {string} [props.subTitle] The subtitle string.
 *
 * @returns {JSX.Element}
 */

function TitleV2({ title, subTitle }) {
  return (
    <div className={styles.title}>
      <h2 className={styles.titleText}>
        <GradientText
          style={{
            fontSize: "var(--secondary-title-text)",
            fontFamily: "var(--font-satoshi)",
            textTransform: "capitalize",
            fontWeight: "600",
          }}
        >
          {title}
        </GradientText>
      </h2>
      <p className={styles.subtitleGray}>{subTitle && subTitle}</p>
    </div>
  );
}

export default TitleV2;
