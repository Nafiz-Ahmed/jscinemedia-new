"use client";

import Container from "@/layouts/Container";
import Title from "@/layouts/Title";
import React from "react";
import InfiniteScrollCarousel from "@/layouts/InfiniteScrollCarousel";
import styles from "./Testimonials.module.css";
import TestimonialCard from "./TestimonialCard";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

const TESTIMONIALS = [
  {
    name: "jonathanh108",
    review:
      "This is our third project together, and he's been great every time. I switched up the video format for this one, gave him a sample—and he nailed it fast. Not only did he match the new style, he made sure it still felt personal and unique to me. He's super versatile, takes feedback well, and I don't have to give much direction. He just gets it—and makes my life easier. Highly recommend!",
    ratings: 5,
    pin: "/images/pin/red.png",
  },
  {
    name: "petepolgar",
    review:
      "From start to finish, communication was clear and professional. They understood my vision right away and brought it to life even better than I imagined. The video quality was outstanding—crisp visuals, smooth transitions, and perfectly synced audio. They delivered on time (actually earlier than expected!) and were more than willing to make small adjustments to ensure everything was perfect. I appreciated their creativity, attention to detail, and ability to add that extra touch that made the final product truly stand out. I'll definitely be coming back for more projects in the future. Highly recommend to anyone looking for top-notch video work on Fiverr!",
    ratings: 5,
    pin: "/images/pin/purple.png",
  },
  {
    name: "yeetat8787",
    review:
      "I can't thank Sazzad enough for the incredible work he did in creating professional videos for me! His talent, creativity, and attention to detail truly brought my vision to life. Sazzad was a pleasure to work with—responsive, professional, and dedicated to delivering top-notch results. The videos exceeded my expectations, with stunning visuals and flawless editing that perfectly captured the vibe I was going for. If you're looking for someone to craft high-quality, professional videos, Sazzad is your go-to! Highly recommend, and I'll definitely be working with him again. Thank you, Sazzad, for making this such an amazing experience!",
    ratings: 5,
    pin: "/images/pin/green.png",
  },
  {
    name: "dmathewvws1",
    review:
      "Sazzad went over and beyond what I expected for the 2 videos we worked on. 🙌 I highly recommend him for anyone needing top-tier video editing, especially in the Business / Education domain.",
    ratings: 5,
    pin: "/images/pin/blue.png",
  },
  {
    name: "derekwestra495",
    review:
      "Loved it! Sazzad is so good and I've used him so many times as a professional video editor. He is adding in little things that I just love and touches of humor and just great editing! Thanks Sazzad!",
    ratings: 5,
    pin: "/images/pin/red.png",
  },
  {
    name: "karayancharayah",
    review:
      "Sazzad H. delivered an OUTSTANDING video that truly exceeded expectations with his professionalism and creativity! Working with him was seamless; his cooperation and quick responsiveness made the process a breeze. I highly recommend him to anyone in need of expert video editing—he went above and beyond!👏",
    ratings: 5,
    pin: "/images/pin/purple.png",
  },
  {
    name: "lozoya123",
    review:
      "Working with Sazzad H. was a truly EXCEPTIONAL experience! His attention to detail and professionalism resulted in a visually stunning video that exceeded all expectations. His cooperative nature & deep understanding of the project, made the collaboration smooth and enjoyable.",
    ratings: 5,
    pin: "/images/pin/green.png",
  },
  {
    name: "klronden0",
    review:
      "Sazzad H. is a MASTER in video editing! His professional work and storytelling skills not only met but EXCEEDED my expectations. Working with him was a breeze, thanks to his politeness and prompt delivery—he truly went above and beyond!👏",
    ratings: 5,
    pin: "/images/pin/blue.png",
  },
];

function Testimonials() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  return (
    <div className={styles.testimonialSection}>
      <Container>
        <div ref={titleRef} style={{ marginBottom: "40px" }}>
          <Title>
            Simply, they <span>believe</span> in us.
          </Title>
        </div>

        <div className={styles.testimonials} id="overlay">
          <InfiniteScrollCarousel speed={0.3} gap={50} padding={"40px 0"}>
            {TESTIMONIALS.map((review, index) => (
              <TestimonialCard key={index} data={review} index={index + 1} />
            ))}
          </InfiniteScrollCarousel>
        </div>
      </Container>
    </div>
  );
}

export default Testimonials;
