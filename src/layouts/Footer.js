"use client";

import { useNavigateToId } from "@/layouts/ScrollContext";
import React from "react";
import Container from "./Container";
import styles from "@/styles/Footer.module.css";
import Logo from "./Logo";
import GradientText from "./GradientText";
import Link from "next/link";
import { Instagram, LinkedIn, Facebook } from "@/icons/Icons";

const LINKS = Object.freeze([
  { name: "Work", id: "work" },
  { name: "Services", id: "services" },
  { name: "Pricing", id: "subscribe" },
  { name: "Contact", id: "contact" },
  { name: "FAQ", id: "faq" },
]);

const SOCIALS = Object.freeze([
  {
    name: "Instagram",
    url: "https://www.instagram.com/sazzadedits?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/sazzadh2024/",
    icon: LinkedIn,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61571576564872",
    icon: Facebook,
  },
]);

function Footer() {
  const navigateToId = useNavigateToId();

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlob1}>
        <svg
          viewBox="0 0 200 200"
          className={styles.blob}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#B4D429"
            d="M26.7,-45.3C34.9,-41.5,42.1,-34.9,47.5,-27C53,-19,56.7,-9.5,62.4,3.3C68.1,16.1,75.9,32.2,73.6,45.6C71.3,59.1,58.9,69.8,44.9,77.3C31,84.8,15.5,89.1,1.6,86.3C-12.3,83.6,-24.7,73.8,-36,64.8C-47.3,55.8,-57.6,47.5,-61.4,36.8C-65.2,26.1,-62.4,13.1,-59.5,1.6C-56.7,-9.8,-53.8,-19.6,-51.4,-32.6C-48.9,-45.6,-46.9,-61.7,-38.5,-65.5C-30,-69.2,-15,-60.5,-2.9,-55.5C9.2,-50.5,18.5,-49.2,26.7,-45.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className={styles.backgroundBlob2}>
        <svg
          viewBox="0 0 200 200"
          className={styles.blob}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#B4D429"
            d="M26,-51.2C26.7,-44.6,15.4,-23.5,19.9,-12.6C24.3,-1.6,44.4,-0.8,51.6,4.1C58.8,9.1,53,18.2,45.8,24.2C38.5,30.2,29.6,33.1,21.8,36.4C13.9,39.7,6.9,43.3,-0.4,44C-7.7,44.6,-15.3,42.2,-15.9,34.7C-16.5,27.2,-10,14.6,-7.7,8C-5.4,1.3,-7.4,0.7,-21,-7.9C-34.7,-16.4,-60,-32.8,-66.6,-47.1C-73.3,-61.3,-61.4,-73.5,-47.1,-72.2C-32.9,-71,-16.5,-56.5,-1.9,-53.2C12.6,-49.9,25.3,-57.8,26,-51.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <footer className={styles.footer}>
        <Container>
          <div className={styles.wrapper}>
            {/* Footer Content */}
            <div className={styles.content}>
              {/* 
                

                LEFT COLUMN
                
                */}
              <div className={styles.left}>
                {/* Links Column */}
                <div className={styles.column}>
                  <h3 className={styles.columnTitle}>
                    <GradientText
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      Links
                    </GradientText>
                  </h3>
                  <ul className={styles.linkList}>
                    {LINKS.map((link) => (
                      <li key={link.id} className={styles.linkItem}>
                        <div
                          onClick={() => navigateToId(link.id)}
                          className={styles.link}
                        >
                          {link.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 
                
                
                CENTER COLUMN
                
                
                */}

              <div className={styles.center}>
                {/* Logo */}
                <div className={styles.logo}>
                  <div
                    onClick={() => navigateToId("home")}
                    style={{ cursor: "pointer", width: "fit-content" }}
                  >
                    <Logo width={150} height="auto" />
                  </div>
                </div>

                <p className={styles.description}>
                  J&S Cinemedia crafts cinematic, high-end video content that
                  elevates your brand and captivates audiences.
                </p>
              </div>

              {/* 
                
                
                RIGHT COLUMN
                
                
                */}

              <div className={styles.right}>
                {/* Socials Column */}
                {SOCIALS.map((social, index) => (
                  <Link
                    href={social.url}
                    key={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialItem}
                  >
                    <div className={styles.socialName}>{social.name}</div>
                    <div className={styles.iconWrapper}>
                      <social.icon
                        width={16}
                        height={16}
                        fill="rgba(255, 255, 255, 0.7)"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
              © {new Date().getFullYear()}, J&S Cinemedia - All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
