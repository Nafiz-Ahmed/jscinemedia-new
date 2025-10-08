"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";
import Container from "@/layouts/Container";
import { RightArrow } from "@/utils/Icons";
import BackgroundGlow from "@/layouts/BackgroundGlow";
import Title from "@/layouts/Title";
import Button from "@/layouts/Button";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

const FAQ = () => {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  const faqData = [
    {
      question: "What if I don’t like the first edit?",
      answer:
        "We include unlimited revisions in all packages until you’re happy with the final result. Our process is collaborative, and we always welcome your feedback.",
    },
    {
      question: "Do I own the rights to my videos?",
      answer:
        "Yes, once we deliver your project and payment is complete, you have full ownership of all edited content. We do not claim any rights over your videos.",
    },
    {
      question:
        "Can you match a specific style (like Ali Abdaal, Hormozi, or brand guidelines)?",
      answer:
        "Absolutely. We study your references, brand colors, and niche influencers to match your desired style while keeping it unique to your brand.",
    },
    {
      question: "Do you work with international clients?",
      answer:
        "Yes, we work with creators and businesses worldwide. Payments are accepted securely through Stripe, PayPal, or bank transfer.",
    },
    {
      question: "What if I need ongoing videos every week?",
      answer:
        "We offer monthly editing plans designed for consistent content creators and businesses. You’ll get priority service and predictable delivery times.",
    },
    {
      question: "How do revisions work?",
      answer:
        "After we deliver the first draft, you can request changes via timestamped notes, comments, or Loom recordings. We’ll revise until it perfectly fits your vision.",
    },
    {
      question: "What’s included in your packages?",
      answer:
        "All packages include editing, color correction, sound design, music licensing, captions, and motion graphics. Higher tiers include priority support, creative consulting, and more complex edits.",
    },
    {
      question: "Do you provide refunds?",
      answer:
        "Due to the time and effort required in video editing, we don’t offer refunds once work has started. However, we guarantee satisfaction through unlimited revisions until you’re happy.",
    },
  ];

  // Split faqData into two halves
  const middleIndex = Math.ceil(faqData.length / 2);
  const firstHalf = faqData.slice(0, middleIndex);
  const secondHalf = faqData.slice(middleIndex);

  const handleClick = (e) => {
    e.currentTarget.classList.toggle(styles.open);
  };

  const renderFAQ = (data) =>
    data.map((faq, index) => (
      <div key={index} onClick={handleClick} className={styles.faqItem}>
        <div className={styles.faqQuestion}>
          <div className={styles.questionText}>{faq.question}</div>
          <div className={`${styles.faqIcon}`}>
            <RightArrow width={18} height={18} fill="white" />
          </div>
        </div>

        <div className={styles.faqAnswer}>
          <p className={styles.answerText}>{faq.answer}</p>
        </div>
      </div>
    ));

  return (
    <Container>
      <div className={styles.wrapper}>
        <div ref={titleRef}>
          <Title>
            Frequently Asked <span>Questions</span>.
          </Title>
        </div>
        <div className={styles.faqContainer}>
          <div className={styles.faqColumn}>{renderFAQ(firstHalf)}</div>
          <div className={styles.faqColumn}>{renderFAQ(secondHalf)}</div>
          <div className={styles.extra}>
            <h1>Still have questions?</h1>
            <p>
              If you have any other questions, feel free to reach out.
              We&apos;re here to help!
            </p>
            <Button whatsApp shadow="subtle">
              Let&apos;s Chat
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FAQ;
