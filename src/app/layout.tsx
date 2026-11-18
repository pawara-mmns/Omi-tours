import type { Metadata } from "next";
import { Header, Footer } from "@/components/Shell";
import "./globals.css";
import "./journal.css";

export const metadata: Metadata = {
  title: {
    default: "OMI TOURS • Tailor-made journeys in Sri Lanka",
    template: "%s | OMI TOURS",
  },
  description:
    "Discover Sri Lanka through OMI TOURS’ customizable ten-day journey, from Negombo and the hill-country railway to the southern coast.",
  icons: { icon: "/images/omi-mark.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
