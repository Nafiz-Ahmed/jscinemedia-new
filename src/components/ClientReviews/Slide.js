"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import styles from "./Slide.module.css";
import { LeftArrow, RightArrow } from "@/utils/Icons";
import Image from "next/image";
import { useScroll } from "@/layouts/ScrollContext";
import Video from "../VideoPlayer/Video";

const CLIENT_DATA = [
  {
    name: "Joe Sinclair",
    role: "Co-founder/NattyPLUS",
    photo: "/images/clientPhotos/t1.png",
    video: "I4yjCR3AjOP4ozKXf701WX4DE6NaIoed9UuqUTksWYVQ",
  },

  {
    name: "James Barker",
    role: "Founder/GTM Hive",
    photo: "/images/clientPhotos/t2.png",
    video: "5IDKG2e00x702zA201TzEumSQlV18twudMqoCq91nBKwMM",
  },
];

function Slide() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    WheelGesturesPlugin(),
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const { isMobile, isTablet } = useScroll();

  // Controls
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Track drag state
  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => setIsDragging(true);
    const onPointerUp = () => setIsDragging(false);

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi]);

  return (
    <div
      className={`${styles.carouselWrapper} ${
        isDragging ? styles.dragging : ""
      }`}
    >
      <div
        id={`${!isMobile && "overlay"}`}
        className={styles.wrapper}
        ref={emblaRef}
      >
        <div className={styles.container}>
          {CLIENT_DATA.map((client, i) => (
            <div key={i} className={styles.slide}>
              <div className={styles.slideContent}>
                <Video maxWidth={false} playbackId={client.video} />
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
        </div>
      </div>

      <div onClick={scrollPrev} className={styles.prevButton}>
        <LeftArrow fill="var(--white)" />
      </div>
      <div onClick={scrollNext} className={styles.nextButton}>
        <RightArrow fill="var(--white)" />
      </div>
    </div>
  );
}

export default Slide;
