"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import styles from "./Slide.module.css";
import { LeftArrow, RightArrow } from "@/utils/Icons";
import Image from "next/image";
import { useScroll } from "@/layouts/ScrollContext";
import Video from "../VideoPlayer/Video";
import InfiniteScrollCarousel from "../../layouts/InfiniteScrollCarousel";

const CLIENT_DATA = [
  {
    id: 1,
    name: "Joe Sinclair",
    role: "Co-founder/NattyPLUS",
    photo: "/images/TestimonialImages/avater1.jpg",
    video: "I4yjCR3AjOP4ozKXf701WX4DE6NaIoed9UuqUTksWYVQ",
    poster: "/images/TestimonialImages/image1.jpg",
  },

  {
    id: 2,
    name: "James Barker",
    role: "Founder/GTM Hive",
    photo: "/images/TestimonialImages/avater2.jpg",
    video: "5IDKG2e00x702zA201TzEumSQlV18twudMqoCq91nBKwMM",
    poster: "/images/TestimonialImages/image2.jpg",
  },
  {
    id: 3,
    name: "Ali Dar",
    role: "Senior Academic & Career Strategist",
    photo: "/images/TestimonialImages/avater3.jpg",
    video: "WWnwvHlQw9tCoCbzQ94iQxDTsjQQ5dBN4LFPfIr9T1o",
    poster: "/images/TestimonialImages/image3.jpg",
  },
  {
    id: 4,
    name: "Gavin Speaks",
    role: "Spiritual Life Coach & Consciousness Mentor",
    photo: "/images/TestimonialImages/avater4.png",
    video: "Uw79TttQmTsUljSgoKv1Eyn024BjqtBwUtXVDfi2IQ6E",
    poster: "/images/TestimonialImages/image4.png",
  },
  {
    id: 5,
    name: "Derek",
    role: "Owner of Functional Decor",
    photo: "/images/TestimonialImages/avater5.jpg",
    video: "BYxX402Lnm95q87RTkgLwJtiXqAroRwAZntsJeN01DXKQ",
    poster: "/images/TestimonialImages/image5.jpg",
  },
  {
    id: 6,
    name: "Jessica Phillips",
    role: "Founder & CEO, The Social Standard",
    photo: "/images/TestimonialImages/avater6.png",
    video: "rhr2sKVJHVU5wzBwtkz2NEWM3dJwiwTbyqyZWZVi4YY",
    poster: "/images/TestimonialImages/image6.png",
  },
];

function Slide() {
  return (
    <div className={`${styles.carouselWrapper}`}>
      <div id="overlay" className={styles.container}>
        <InfiniteScrollCarousel
          axis="x"
          gap={20}
          speed={1}
          pauseOnHover={true}
          dragAble={true}
          wheelGesture={true}
        >
          {CLIENT_DATA.map((client, i) => (
            <div key={i} className={styles.slide}>
              <div className={styles.slideContent}>
                <Video
                  maxWidth={false}
                  playbackId={client.video}
                  poster={client.poster}
                />
              </div>

              <div className={styles.clientsData}>
                <div className={styles.client}>
                  <div className={styles.clientPhoto}>
                    <Image
                      src={client.photo}
                      alt={client.name}
                      width={50}
                      height={50}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className={styles.clientInfo}>
                    <div className={styles.clientName}>{client.name}</div>
                    <div className={styles.clientRole}>{client.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScrollCarousel>
      </div>
    </div>
  );
}

export default Slide;
