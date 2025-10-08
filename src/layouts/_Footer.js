// components/Footer/Footer.jsx
"use client";

import { useNavigateToId } from "@/layouts/ScrollContext";
import styles from "@/styles/Footer.module.css";
import Container from "./Container";
import Logo from "./Logo";
import GradientText from "./GradientText";
import Link from "next/link";
import React, { useRef } from "react"; // Import useRef
import Image from "next/image";
import { Facebook, Instagram, LinkedIn } from "@/icons/Icons";
import BackgroundGlow from "./BackgroundGlow";

const Footer = () => {
  const navigateToId = useNavigateToId();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.container}>
          {/* Footer Content */}
          <div className={styles.content}>
            {/* Logo */}
            <div className={styles.logo}>
              <div
                onClick={() => navigateToId("home")}
                style={{ cursor: "pointer", width: "fit-content" }}
              >
                <Logo width={180} height="auto" />
              </div>

              <div className={styles.cardContainer}>
                <ProfileCard
                  name="Sazzad H."
                  title="Founder & Creative Director"
                  image="/images/memberPhotos/member1.png"
                  socialLinks={{
                    facebook: "https://facebook.com/username",
                    instagram: "https://instagram.com/username",
                    linkedin: "https://linkedin.com/in/username",
                  }}
                />

                <ProfileCard
                  name="Shah M. Jabir"
                  title="Co-Founder & Project Manager"
                  image="/images/memberPhotos/member3.png"
                  socialLinks={{
                    facebook: "https://facebook.com/username",
                    instagram: "https://instagram.com/username",
                    linkedin: "https://linkedin.com/in/username",
                  }}
                />
              </div>
            </div>

            <div className={styles.columns}>
              <div className={styles.column}>
                <h3 className={styles.columnTitle}>
                  <GradientText
                    style={{
                      fontSize: "var(--normal-text)",
                    }}
                  >
                    Socials
                  </GradientText>
                </h3>
                <ul className={styles.linkList}>
                  <li>
                    <Link
                      href="https://www.instagram.com/"
                      className={styles.link}
                    >
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.linkedin.com/"
                      className={styles.link}
                      target="_blank"
                    >
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.facebook.com/"
                      target="_blank"
                      className={styles.link}
                    >
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Links Column */}
              <div className={styles.column}>
                <h3 className={styles.columnTitle}>
                  <GradientText
                    style={{
                      fontSize: "var(--normal-text)",
                    }}
                  >
                    Links
                  </GradientText>
                </h3>
                <ul className={styles.linkList}>
                  <li>
                    <div
                      onClick={() => navigateToId("services")}
                      className={styles.link}
                    >
                      Services
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => navigateToId("subscribe")}
                      className={styles.link}
                    >
                      Pricing
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => navigateToId("faq")}
                      className={styles.link}
                    >
                      FAQ
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className={styles.copyright}>
            © 2025, J&S Cinemedia - All rights reserved.
          </div>
        </div>
        {/* Popups are now rendered globally in ScrollProvider */}
      </Container>
    </footer>
  );
};

export default Footer;

function ProfileCard({ name, title, image, socialLinks }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = card.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const rotateX = ((centerY - clientY) / height) * 15; // Max 15deg rotation
    const rotateY = ((clientX - centerX) / width) * 15; // Max 15deg rotation

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
  };

  return (
    <div
      className={styles.profileCard_card}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundGlow minWidth="none" left="100%" />
      <div className={styles.profileCard_content}>
        <div className={styles.profileCard_info}>
          <h2 className={styles.profileCard_name}>{name}</h2>
          <p className={styles.profileCard_title}>{title}</p>
          {/* 
          <div className={styles.profileCard_socialLinks}>
            {socialLinks.facebook && (
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileCard_socialIcon}
                aria-label="Facebook"
              >
                <Facebook width={24} height={24} fill="white" />
              </Link>
            )}
            {socialLinks.instagram && (
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileCard_socialIcon}
                aria-label="Instagram"
              >
                <Instagram width={24} height={24} fill="white" />
              </Link>
            )}
            {socialLinks.linkedin && (
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileCard_socialIcon}
                aria-label="LinkedIn"
              >
                <LinkedIn width={24} height={24} fill="white" />
              </Link>
            )}
          </div> */}
        </div>

        <div className={styles.profileCard_imageWrapper}>
          <Image
            src={image}
            alt={name}
            width={160}
            height={160}
            className={styles.profileCard_image}
          />
        </div>
      </div>
    </div>
  );
}
