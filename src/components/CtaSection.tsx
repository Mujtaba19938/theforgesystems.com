import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeUp } from "./FadeUp";
import { PrimaryButton } from "./PrimaryButton";
import { CtaDashboardMock } from "./CtaDashboardMock";
import { useIsMobile } from "../hooks/useIsMobile";

const GRASS_SRC =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1780586778/cta-bg_mlwy5s.png";

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], ["120px", "-120px"]);
  const grassY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["80px", "-40px"] : ["200px", "-200px"]
  );

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, transparent 0%, #14191E 100%)",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-[440px] sm:pb-[520px] md:pb-[440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          {/* Left column */}
          <div className="relative z-20 max-w-[340px]">
            <FadeUp delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.05] text-white">
                Learn how can one go from Invisible to Unforgettable.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-6 text-landing-text text-base sm:text-lg leading-[1.5] max-w-[340px]">
                Discover how a professionally engineered AI agents can become the foundation of your
                marketing, sales, and long-term business growth.
              </p>
            </FadeUp>
            <FadeUp delay={0.2} className="mt-10">
              <PrimaryButton as="button">Start for free</PrimaryButton>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Dashboard pinned to right edge, behind grass, parallax Y */}
      <motion.div
        style={{ y: dashboardY }}
        className="absolute top-[440px] sm:top-[460px] md:top-[500px] lg:top-20 left-4 right-4 sm:left-[45%] sm:right-4 md:left-[42%] md:right-6 lg:left-auto lg:right-[4%] z-10 sm:w-auto md:w-auto lg:w-[53%]"
      >
        <CtaDashboardMock />
      </motion.div>

      {/* Foreground grass — in front of dashboard, parallax Y */}
      <motion.img
        src={GRASS_SRC}
        alt=""
        aria-hidden
        style={{ y: grassY }}
        className="pointer-events-none select-none absolute left-0 right-0 bottom-[-40px] sm:bottom-[-80px] lg:bottom-[-140px] w-full z-30 object-cover"
      />
    </section>
  );
}
