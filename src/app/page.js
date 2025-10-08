import Hero from "@/components/Hero/Hero";
import styles from "./page.module.css";
import Entry from "@/components/AnimatedEntry/Entry";
import Reviews from "@/components/ClientReviews/Reviews";
import Work from "@/components/Works/Work";
import AgencyComparison from "@/components/AgencyComparison/page";
import Process from "@/components/Process/Process";
import Services from "@/components/Services/Services";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contacts from "@/components/Contacts/Contacts";
import Team from "@/components/Team/Team";
import Subscriptions from "@/components/Subscriptions/Subscriptions";
import FAQ from "@/components/FAQ/FAQ";

/**
 * The main page of the website
 * @returns {ReactElement} The home page
 */
export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero section */}
      <div id="home">
        <Hero />
      </div>

      {/* Animated Entry section */}
      <Entry />

      <div id="work">
        <Work />
      </div>

      <div>
        <AgencyComparison />
      </div>

      <div id="process">
        <Process />
      </div>

      {/* Client Reviews section */}
      <div id="review">
        <Reviews />
      </div>

      <div id="services">
        <Services />
      </div>

      <div>
        <Testimonials />
      </div>

      <div id="subscribe">
        <Subscriptions />
      </div>

      <div id="contact">
        <Contacts />
      </div>

      {/* <div id="team">
        <Team />
      </div> */}

      <div id="faq">
        <FAQ />
      </div>
    </div>
  );
}
