import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Custom hook for text reveal animation with word-by-word stagger effect
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.isLoading - Loading state, animation starts when false
 * @param {number} options.delay - Delay before animation starts (in seconds)
 * @param {number} options.yOffset - Initial Y position offset (in pixels)
 * @param {number} options.blur - Initial blur amount (in pixels)
 * @param {number} options.stagger - Stagger timing between words (in seconds)
 * @param {number} options.duration - Animation duration per word (in seconds)
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.scrollTriggerStart - ScrollTrigger start position
 * @param {boolean} options.enabled - Enable/disable the animation
 *
 * @returns {React.RefObject} - Ref to attach to the target element
 */
export const useTextRevealAnimation = ({
  isLoading = false,
  delay = 0.2,
  yOffset = 40,
  blur = 10,
  stagger = 0.07,
  duration = 0.6,
  ease = "power2.out",
  scrollTriggerStart = "top bottom-=100px",
  enabled = true,
} = {}) => {
  const elementRef = useRef(null);
  const splitTextRef = useRef(null);
  const timelineRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    // Set element to opacity 0 immediately
    gsap.set(element, { opacity: 0 });

    // Wait for loading to complete
    if (isLoading) return;

    // Only run animation once
    if (hasAnimatedRef.current) return;

    // Split text into words
    splitTextRef.current = new SplitText(element, {
      type: "words",
      wordsClass: "split-word",
    });

    const words = splitTextRef.current.words;

    // Set initial state for words
    gsap.set(words, {
      opacity: 0,
      y: yOffset,
      filter: `blur(${blur}px)`,
    });

    // Create timeline with ScrollTrigger
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: scrollTriggerStart,
        once: true, // Only trigger once
        onEnter: () => {
          hasAnimatedRef.current = true;
        },
      },
      delay: delay,
    });

    // Animate words with stagger
    timelineRef.current.to(words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: duration,
      stagger: stagger,
      ease: ease,
      onStart: () => {
        // Make element visible when animation starts
        gsap.set(element, { opacity: 1 });
      },
    });

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, [
    isLoading,
    enabled,
    delay,
    yOffset,
    blur,
    stagger,
    duration,
    ease,
    scrollTriggerStart,
  ]);

  return elementRef;
};

export default useTextRevealAnimation;
