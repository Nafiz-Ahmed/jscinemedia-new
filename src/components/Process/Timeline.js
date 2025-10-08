"use client";

import React, { useRef, useMemo } from "react";
import styles from "./Timeline.module.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScroll } from "@/layouts/ScrollContext";
import BackgroundGlow from "@/layouts/BackgroundGlow";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const TEXT_DATA = Object.freeze([
  {
    id: 1,
    heading: "Creativity",
    title: "Content Analysis",
    description:
      "Spotting strengths, fixing flaws, and aligning your content with audience expectations.",
  },
  {
    id: 2,
    heading: "Editing",
    title: "Editing the Video",
    description:
      "Using cutting-edge motion graphics, we create premium videos that make your message unforgettable.",
  },
  {
    id: 3,
    heading: "Thumbnail",
    title: "Creating Thumbnail",
    description:
      "We study top-performing thumbnails in your niche and replicate proven results.",
  },
]);

const ANIMATION_CONFIG_BAR_ANIMATION = Object.freeze({
  1: {
    initial: { left: "40%", top: "45%" },
    animate: { left: "30%", top: "35%" },
  },
  2: {
    initial: { left: "40%", top: "55%" },
    animate: { left: "30%", top: "65%" },
  },
  3: {
    initial: { left: "60%", top: "45%" },
    animate: { left: "70%", top: "35%" },
  },
  4: {
    initial: { left: "60%", top: "55%" },
    animate: { left: "70%", top: "65%" },
  },
});

const ANIMATION_CONFIG_ITEM_TWO = Object.freeze({
  prImage: {
    initial: { left: "50%", top: "60%" },
    animate: { left: "50%", top: "35%" },
  },
  aeImage: {
    initial: { left: "70%", top: "60%" },
    animate: { left: "80%", top: "45%" },
  },
});

const ANIMATION_CONFIG_ITEM_THREE = Object.freeze({
  image: {
    initial: { left: "0%", top: "60%" },
    animate: { left: "-50%", top: "60%" },
  },
  icon: {
    initial: { left: "50%", top: "30%" },
    animate: { left: "50%", top: "40%" },
  },
});

const TextOne = React.memo(() => (
  <TextItem
    heading={TEXT_DATA[0].heading}
    title={TEXT_DATA[0].title}
    description={TEXT_DATA[0].description}
  />
));
TextOne.displayName = "TextOne";

const TextTwo = React.memo(() => (
  <TextItem
    heading={TEXT_DATA[1].heading}
    title={TEXT_DATA[1].title}
    description={TEXT_DATA[1].description}
  />
));
TextTwo.displayName = "TextTwo";

const TextThree = React.memo(() => (
  <TextItem
    heading={TEXT_DATA[2].heading}
    title={TEXT_DATA[2].title}
    description={TEXT_DATA[2].description}
  />
));
TextThree.displayName = "TextThree";

function Timeline() {
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);
  const triggerRef = useRef([]); // Store multiple triggers
  const animationContainerRef = useRef(null);
  const { waitForReady, isReady, isMobile, isTablet } = useScroll();
  const animateI2I1 = useRef(null);
  const animateI2I2 = useRef(null);
  const img = useRef(null);
  const icon = useRef(null);

  useGSAP(
    () => {
      if (!isReady) return;

      waitForReady(() => {
        // Clean up existing triggers
        if (triggerRef.current && triggerRef.current.length > 0) {
          triggerRef.current.forEach((trigger) => {
            if (trigger) trigger.kill();
          });
          triggerRef.current = [];
        }

        if (!progressBarRef.current || !containerRef.current) return;

        // Progress bar animation
        const progressTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top+=150",
          end: `bottom center-=${progressBarRef.current.offsetHeight - 32}`,
          pin: progressBarRef.current,
          scrub: 1,
          invalidateOnRefresh: true,
        });
        triggerRef.current.push(progressTrigger);

        // Animation bars entrance animation
        if (animationContainerRef.current) {
          const animationBars = animationContainerRef.current.querySelectorAll(
            "[data-animation-bar]"
          );

          animationBars.forEach((bar, index) => {
            const barId = parseInt(bar.dataset.animationBar);
            const config = ANIMATION_CONFIG_BAR_ANIMATION[barId];

            // Set initial state
            gsap.set(bar, {
              left: config.initial.left,
              top: config.initial.top,
              autoAlpha: 1,
            });

            // Create scroll-triggered animation
            const barTrigger = gsap.to(bar, {
              left: config.animate.left,
              top: config.animate.top,
              scrollTrigger: {
                trigger: animationContainerRef.current,
                start: "top bottom-=100",
                end: "bottom center",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });

            triggerRef.current.push(barTrigger);
          });
        }

        // Animation for images in Item 2
        if (animateI2I1.current) {
          gsap.set(animateI2I1.current, {
            top: ANIMATION_CONFIG_ITEM_TWO.prImage.initial.top,
            left: ANIMATION_CONFIG_ITEM_TWO.prImage.initial.left,
            autoAlpha: 1,
          });
        }

        if (animateI2I2.current) {
          gsap.set(animateI2I2.current, {
            top: ANIMATION_CONFIG_ITEM_TWO.aeImage.initial.top,
            left: ANIMATION_CONFIG_ITEM_TWO.aeImage.initial.left,
            autoAlpha: 1,
          });
        }

        const imageTrigger1 = gsap.to(animateI2I1.current, {
          top: ANIMATION_CONFIG_ITEM_TWO.prImage.animate.top,
          left: ANIMATION_CONFIG_ITEM_TWO.prImage.animate.left,
          scrollTrigger: {
            trigger: animateI2I1.current,
            start: "center bottom",
            end: "top top+=200",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        triggerRef.current.push(imageTrigger1);

        const imageTrigger2 = gsap.to(animateI2I2.current, {
          top: ANIMATION_CONFIG_ITEM_TWO.aeImage.animate.top,
          left: ANIMATION_CONFIG_ITEM_TWO.aeImage.animate.left,
          scrollTrigger: {
            trigger: animateI2I2.current,
            start: "center bottom",
            end: "top center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        triggerRef.current.push(imageTrigger2);

        // Animation for images in Item 3
        if (img.current) {
          gsap.set(img.current, {
            top: ANIMATION_CONFIG_ITEM_THREE.image.initial.top,
            left: ANIMATION_CONFIG_ITEM_THREE.image.initial.left,
            autoAlpha: 1,
          });
        }

        if (icon.current) {
          gsap.set(icon.current, {
            top: ANIMATION_CONFIG_ITEM_THREE.icon.initial.top,
            left: ANIMATION_CONFIG_ITEM_THREE.icon.initial.left,
            autoAlpha: 1,
          });
        }

        // if (!isTablet) {
        const imageTrigger3 = gsap.to(img.current, {
          top: ANIMATION_CONFIG_ITEM_THREE.image.animate.top,
          left: ANIMATION_CONFIG_ITEM_THREE.image.animate.left,
          scrollTrigger: {
            trigger: img.current,
            start: "center bottom-=100",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        triggerRef.current.push(imageTrigger3);
        // }

        const iconTrigger = gsap.to(icon.current, {
          top: ANIMATION_CONFIG_ITEM_THREE.icon.animate.top,
          left: ANIMATION_CONFIG_ITEM_THREE.icon.animate.left,
          scrollTrigger: {
            trigger: icon.current,
            start: "center bottom",
            end: "top top+=100",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        triggerRef.current.push(iconTrigger);
      });

      // Cleanup function
      return () => {
        if (triggerRef.current && triggerRef.current.length > 0) {
          triggerRef.current.forEach((trigger) => {
            if (trigger) trigger?.kill();
          });
          triggerRef.current = [];
        }
      };
    },
    {
      dependencies: [isReady],
      scope: containerRef,
    }
  );

  // Responsive image sizes
  const getImageSize = (desktop, tablet, mobile) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return (
    <div className={styles.timelineSection}>
      {/* Timeline Container */}
      <div className={styles.timelineContainer} ref={containerRef}>
        <div className={styles.timelineProgress}>
          <div
            className={styles.timelineProgressBar}
            ref={progressBarRef}
          ></div>
        </div>

        {/* Timeline Item 1 */}
        <div className={styles.timelineItem}>
          {(isMobile || isTablet) && (
            <div className={styles.timelineCount}>1</div>
          )}
          <div
            className={`${styles.timelineLeft} ${styles.timelineLeftWithText}`}
          >
            <TextOne />
          </div>
          {!(isMobile || isTablet) && (
            <div className={styles.timelineCount}>1</div>
          )}
          <div className={styles.timelineRight}>
            <div
              className={styles.timelineAnimation}
              ref={animationContainerRef}
            >
              <BackgroundGlow
                width="80%"
                minWidth="auto"
                left="50%"
                top="50%"
              />
              <AnimationBar text="Coaches" id={1} />
              <AnimationBar text="Personal Brand" id={2} />
              <AnimationBar text="E-commerce" id={3} />
              <AnimationBar text="Fashion" id={4} />
            </div>
          </div>
        </div>

        {/* Timeline Item 2 */}
        <div className={styles.timelineItem}>
          {(isMobile || isTablet) && (
            <div className={styles.timelineCount}>2</div>
          )}
          {(isMobile || isTablet) && (
            <div
              className={`${styles.timelineRight} ${styles.timelineRightWithText}`}
            >
              <div>
                <TextTwo />
              </div>
            </div>
          )}
          <div
            className={`${styles.timelineLeft} ${styles.timelineLeftWithAnimation}`}
          >
            <div className={styles.timelineAnimation}>
              <BackgroundGlow
                width="80%"
                minWidth="auto"
                left="50%"
                top="50%"
              />

              <div className={styles.animationItemTwo}>
                <div className={styles.canvasImage}>
                  <Image
                    src="/images/processAnimate/canvas.avif"
                    alt="Canvas"
                    width={getImageSize(400, 350, 280)}
                    height={getImageSize(250, 200, 190)}
                  />
                </div>

                <div className={styles.toolBarImage}>
                  <Image
                    src="/images/processAnimate/toolBar.avif"
                    alt="Tool Bar"
                    width={getImageSize(100, 90, 80)}
                    height={getImageSize(280, 200, 160)}
                  />
                </div>

                <div ref={animateI2I1} className={styles.prImage}>
                  <Image
                    src="/images/processAnimate/pr.png"
                    alt="Premiere Pro"
                    width={getImageSize(200, 150, 90)}
                    height={getImageSize(200, 150, 90)}
                  />
                </div>

                <div ref={animateI2I2} className={styles.aeImage}>
                  <Image
                    src="/images/processAnimate/ae.png"
                    alt="Adobe After Effects"
                    width={getImageSize(110, 90, 60)}
                    height={getImageSize(110, 90, 60)}
                  />
                </div>
              </div>
            </div>
          </div>
          {!(isMobile || isTablet) && (
            <div className={styles.timelineCount}>2</div>
          )}

          {!(isMobile || isTablet) && (
            <div
              className={`${styles.timelineRight} ${styles.timelineRightWithText}`}
            >
              <div>
                <TextTwo />
              </div>
            </div>
          )}
        </div>

        {/* Timeline Item 3 */}
        <div className={styles.timelineItem}>
          {(isMobile || isTablet) && (
            <div className={styles.timelineCount}>3</div>
          )}
          <div
            className={`${styles.timelineLeft} ${styles.timelineLeftWithText}`}
          >
            <TextThree />
          </div>
          {!(isMobile || isTablet) && (
            <div className={styles.timelineCount}>3</div>
          )}
          <div className={styles.timelineRight}>
            <div
              className={`${styles.timelineAnimation} ${styles.animationItemThree} `}
            >
              <BackgroundGlow
                width="80%"
                minWidth="auto"
                left="50%"
                top="50%"
              />

              <div ref={img} className={styles.imageHolder}>
                <Image
                  src="/images/processAnimate/thumbnail1.avif"
                  alt="thumbnail1"
                  width={getImageSize(300, 230, 200)}
                  height={getImageSize(180, 140, 120)}
                />

                <Image
                  src="/images/processAnimate/thumbnail2.avif"
                  alt="thumbnail2"
                  width={getImageSize(300, 230, 200)}
                  height={getImageSize(180, 140, 120)}
                />
              </div>
              <div ref={icon} className={styles.iconHolder}>
                <Image
                  src="/images/processAnimate/thumbnailIcon.avif"
                  alt="icon1"
                  width={getImageSize(100, 90, 80)}
                  height={getImageSize(100, 90, 80)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Timeline);

const TextItem = React.memo(({ heading, title, description }) => {
  return (
    <div className={styles.textItem}>
      <h3>{heading}</h3>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
});
TextItem.displayName = "TextItem";

const AnimationBar = React.memo(({ text, id }) => (
  <div
    className={`${styles.animationBar} ${styles[`animationBar_${id}`]}`}
    data-animation-bar={id}
  >
    {text}
  </div>
));
AnimationBar.displayName = "AnimationBar";
