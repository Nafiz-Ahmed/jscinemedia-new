import "@/styles/reset.css";
import "@/styles/variables.css";
import "@/styles/globals.css";
import { ubuntu, instrumentSerif, satoshi } from "@/fonts/fonts";
import Layout from "@/layouts/Layout";

export const metadata = {
  title: "J&S Cinemedia - Expert Video Editing & Post-Production Services",
  description:
    "With over 4 years of experience, J&S Cinemedia provides professional video editing and post-production services for clients worldwide, specializing in compelling visual storytelling from Bangladesh.",
  keywords: [
    "video editing services",
    "post-production",
    "video editor",
    "cinematic editing",
    "freelance video editor",
    "corporate video",
    "documentary editing",
    "social media video",
    "motion graphics",
    "Bangladesh video editing",
  ],
  author: "J&S Cinemedia",
  openGraph: {
    title: "J&S Cinemedia - Expert Video Editing & Post-Production Services",
    description:
      "With over 4 years of experience, J&S Cinemedia provides professional video editing and post-production services for clients worldwide, specializing in compelling visual storytelling from Bangladesh.",
    url: "https://www.jscinemedia-lts.vercel.app", // **Important: Replace with your actual website URL when available**
    siteName: "J&S Cinemedia",
    images: [
      {
        url: "https://www.jscinemedia-lts.vercel.app/og-image.jpg", // **Placeholder: You'll need to upload an image and use its URL here**
        width: 1200,
        height: 630,
        alt: "J&S Cinemedia - Professional Video Editing",
      },
    ],
    locale: "en_US", // Changed to a more general English locale for international reach
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "J&S Cinemedia - Expert Video Editing & Post-Production Services",
    description:
      "With over 4 years of experience, J&S Cinemedia provides professional video editing and post-production services for clients worldwide, specializing in compelling visual storytelling from Bangladesh.",
    creator: "@jscinemedia", // Replace with your company's Twitter handle if applicable
    images: ["https://www.jscinemedia-lts.vercel.app/twitter-image.jpg"], // **Placeholder: You'll need to upload an image and use its URL here**
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${instrumentSerif.variable} ${satoshi.variable}`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
