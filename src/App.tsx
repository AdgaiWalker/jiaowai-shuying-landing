import { useEffect } from "react";
import { MobileCtaBar } from "./components/MobileCtaBar";
import { SiteHeader } from "./components/SiteHeader";
import { About } from "./sections/About";
import { Activities } from "./sections/Activities";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { Highlights } from "./sections/Highlights";
import { Join } from "./sections/Join";
import { SiteFooter } from "./sections/SiteFooter";
import { StatsStrip } from "./sections/StatsStrip";
import { Works } from "./sections/Works";
import { WhyJoin } from "./sections/WhyJoin";

export default function App() {
  // 直链带锚点（如 /#join）时，等 React 渲染完成再滚动到位
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView();
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="grain min-h-[100dvh]">
      <SiteHeader />
      <main>
        <Hero />
        <StatsStrip />
        <About />
        <WhyJoin />
        <Highlights />
        <Activities />
        <Works />
        <Faq />
        <Join />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
