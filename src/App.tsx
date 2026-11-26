import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import {
  Menu,
  X,
  Check,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
const Shader3 = lazy(() => import('./Shader3').then((m) => ({ default: m.Shader3 })))
import { CtaSection } from './components/CtaSection'
import { BOOK_CALL_URL, PORTFOLIO_URL } from './lib/links'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'How we work', href: '#solutions' },
  { label: 'Work', href: '#work' },
]


const STATS = [
  'Fixed-scope MVPs',
  'Delivered in 4–6 weeks',
  'Web, mobile, and AI',
  'Price agreed before we start',
]

const SANS = 'system-ui, sans-serif'

function HeroShaderBackground() {
  const ref = useRef<HTMLDivElement>(null)
  // Mount the WebGL canvas only while the hero is near the viewport, so it
  // never renders at the same time as the CTA background scene.
  const inView = useInView(ref, { margin: '300px' })
  return (
    <div ref={ref} className="absolute top-0 left-0 w-full h-full z-[1]">
      {inView && (
        <Suspense fallback={null}>
          <Shader3 />
        </Suspense>
      )}
    </div>
  )
}

/* ---------------------------------- */
/* Shared animation components        */
/* ---------------------------------- */

type Segment = { text: string; className?: string }

function WordsPullUpMultiStyle({
  segments,
  className = '',
  justify = 'justify-center',
}: {
  segments: Segment[]
  className?: string
  justify?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' })),
  )
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${justify} ${className}`}>
      {words.map((w, i) => (
        <motion.span
          key={`${w.word}-${i}`}
          className={`whitespace-pre ${w.className}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {i < words.length - 1 ? `${w.word} ` : w.word}
        </motion.span>
      ))}
    </span>
  )
}

function AnimatedLetter({
  char,
  progress,
  range,
}: {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })
  const chars = text.split('')
  return (
    <p ref={ref} className={className} style={{ fontFamily: SANS }}>
      {chars.map((char, i) => {
        const charProgress = i / chars.length
        return (
          <AnimatedLetter
            key={i}
            char={char}
            progress={scrollYProgress}
            range={[charProgress - 0.1, charProgress + 0.05]}
          />
        )
      })}
    </p>
  )
}

function useInViewAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, animClass: visible ? 'animate-fade-in-up' : 'opacity-0' }
}

/* ---------------------------------- */
/* Section 1: Hero                    */
/* ---------------------------------- */

function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animated shader background */}
      <HeroShaderBackground />

      {/* Content layer */}
      <div className="relative z-[2] flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <a href="#" className="text-white italic text-xl sm:text-2xl">
            ForgeSystems
          </a>

          {/* Desktop nav */}
          <div
            className="hidden md:flex items-center gap-1 liquid-glass-legacy rounded-full p-1.5 pl-3"
            style={{ fontFamily: SANS }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 bg-white text-black text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors cursor-pointer"
            >
              Book a call
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden liquid-glass-legacy rounded-full p-3 text-white cursor-pointer z-[60]"
          >
            <span className="relative block w-5 h-5">
              <Menu
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  menuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-white">
            We build your MVP in weeks,
            <br />
            at a fixed price.
          </h1>

          <p
            className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-white/85"
            style={{ fontFamily: SANS }}
          >
            Forge Systems is a studio for founders and small businesses. We design and build web
            apps, mobile apps, and AI automation, with a clear scope and price agreed before we
            start.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
            style={{ fontFamily: SANS }}
          >
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Book a free 20-min call
            </a>
            <a
              href="#work"
              className="liquid-glass-legacy text-white text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              See our work
            </a>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/70 text-xs sm:text-sm"
          style={{ fontFamily: SANS }}
        >
          {STATS.map((stat, i) => (
            <span key={stat} className="flex items-center gap-4">
              {i > 0 && <span className="hidden sm:inline text-white/30">|</span>}
              {stat}
            </span>
          ))}
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${
            menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full flex flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-white text-3xl transition-all duration-500 ${
                  menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                  transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className={`mt-4 bg-white text-black px-6 py-3 rounded-full text-base cursor-pointer transition-all duration-500 ${
                menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{
                fontFamily: SANS,
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                transitionDelay: menuOpen ? '300ms' : '0ms',
              }}
            >
              Book a free 20-min call
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Section 2: About                   */
/* ---------------------------------- */

const ABOUT_PARAGRAPH =
  'Every project begins with understanding your business, not just your requirements. From high-converting marketing websites and custom web applications to AI automation and business software, we partner with ambitious brands to build reliable, high-performance digital products that are designed to scale alongside their success.'

function AboutSection() {
  return (
    <section id="about" className="bg-black px-4 sm:px-8 py-16 sm:py-24">
      <div className="liquid-glass-legacy bg-[#101010] rounded-3xl max-w-6xl mx-auto text-center px-6 sm:px-12 py-16 sm:py-24">
        <div
          className="text-primary text-[10px] sm:text-xs uppercase tracking-[0.25em]"
          style={{ fontFamily: SANS }}
        >
          About us
        </div>

        <h2 className="mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-white">
          <WordsPullUpMultiStyle
            segments={[
              {
                text: 'At ForgeSystems, we craft digital experiences where',
                className: 'font-normal',
              },
              { text: 'timeless design meets modern engineering.', className: 'italic' },
              {
                text: 'From premium websites and custom software to AI-powered solutions, every product we build is engineered for performance, scalability, and lasting business impact.',
                className: 'font-normal',
              },
            ]}
          />
        </h2>

        <ScrollRevealText
          text={ABOUT_PARAGRAPH}
          className="mt-10 sm:mt-14 max-w-2xl mx-auto text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed"
        />
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Section 3: Features                */
/* ---------------------------------- */

const FEATURE_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

const FEATURE_CARDS = [
  {
    number: '01',
    title: 'MVP builds.',
    result: 'Idea to working product in 4–6 weeks.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: ['Web and mobile apps', 'Fixed scope and price', 'Yours to own and grow'],
  },
  {
    number: '02',
    title: 'AI automation.',
    result: 'Chatbots and workflows that remove manual work.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: ['Customer support chatbots', 'Back-office workflows', 'Connected to your tools'],
  },
  {
    number: '03',
    title: 'Websites & e-commerce.',
    result: 'Fast sites that turn visitors into customers.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: ['Business sites and landing pages', 'Online stores', 'Built for speed and search'],
  },
]

function FeatureCardShell({
  index,
  className = '',
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section id="services" className="relative min-h-screen bg-black overflow-hidden">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
          <WordsPullUpMultiStyle
            className="w-full"
            segments={[{ text: 'Services we offer', className: 'text-cream' }]}
          />
          <WordsPullUpMultiStyle
            className="w-full"
            segments={[
              {
                text: 'One main offer, two that support it.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        {/* Card grid */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1 — video */}
          <FeatureCardShell
            index={0}
            className="relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-full"
          >
            <video
              src={FEATURE_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-lg sm:text-xl text-[#E1E0CC]">
              Scoped, built, launched.
            </p>
          </FeatureCardShell>

          {/* Cards 2–4 — checklists */}
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCardShell
              key={card.number}
              index={i + 1}
              className="liquid-glass-legacy bg-[#141414] rounded-2xl p-5 sm:p-6 flex flex-col"
            >
              <img
                src={card.icon}
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
              />
              <h3 className="mt-5 text-xl sm:text-2xl text-cream">
                {card.title}{' '}
                <sup className="text-xs text-gray-500" style={{ fontFamily: SANS }}>
                  ({card.number})
                </sup>
              </h3>
              <p className="mt-3 text-base text-white/85" style={{ fontFamily: SANS }}>
                {card.result}
              </p>
              <ul className="mt-5 space-y-3 flex-1" style={{ fontFamily: SANS }}>
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-cream hover:text-white transition-colors group"
                style={{ fontFamily: SANS }}
              >
                Talk to us
                <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:rotate-0" />
              </a>
            </FeatureCardShell>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Section 4: Solution                */
/* ---------------------------------- */

const SOLUTION_FEATURES = [
  {
    title: '1. Free 20-min call',
    description: 'You tell us the idea and the problem it solves. We ask the questions that shape the scope.',
  },
  {
    title: '2. Written scope and price',
    description: 'You get a feature list, a timeline, and one fixed price. Nothing starts until you agree.',
  },
  {
    title: '3. Build in weeks',
    description: 'Weekly demos so you see progress and give feedback while it still costs nothing to change.',
  },
  {
    title: '4. Launch and support',
    description: 'We ship it, hand over the code, and stay on for fixes and the next round of features.',
  },
]

function SolutionSection() {
  return (
    <section
      id="solutions"
      className="bg-black py-32 md:py-44 border-t border-white/10 px-6 sm:px-8 md:px-28"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="text-xs tracking-[3px] uppercase text-gray-500"
          style={{ fontFamily: SANS }}
        >
          How we work
        </div>

        <h2 className="mt-6 text-4xl md:text-6xl text-white leading-tight max-w-3xl">
          <WordsPullUpMultiStyle
            justify="justify-start"
            segments={[
              { text: 'No surprise invoices,', className: 'font-normal' },
              { text: 'no open-ended timelines.', className: 'italic' },
            ]}
          />
        </h2>

        <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {SOLUTION_FEATURES.map((feature) => (
            <div key={feature.title} style={{ fontFamily: SANS }}>
              <h3 className="font-semibold text-base text-cream">{feature.title}</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Section 5: CTA — imported from     */
/*   ./components/CtaSection           */
/* ---------------------------------- */

/* ---------------------------------- */
/* Section 6: Work / case studies     */
/* ---------------------------------- */

// Our own products used as case studies. Swap in client projects (with real
// results) as they come in. Keep every claim here something you can show.
const CASE_STUDIES = [
  {
    tag: 'AI automation',
    title: 'AR automation agent',
    problem: 'Chasing unpaid invoices by hand eats hours every week.',
    built: 'An AI agent that tracks open invoices, sends reminders, and flags accounts that need a person.',
    result: 'Our own product, built and run end to end by Forge Systems.',
  },
  {
    tag: 'Mobile app',
    title: 'Farmers-market app',
    problem: 'Local growers had no simple way to list produce or take pre-orders.',
    built: 'A mobile app where vendors post stock and shoppers reserve items before market day.',
    result: 'Our own product, designed and shipped as a fixed-scope MVP.',
  },
]

function WorkSection() {
  const header = useInViewAnimation<HTMLDivElement>()
  const grid = useInViewAnimation<HTMLDivElement>()
  return (
    <section id="work" className="bg-black py-20 sm:py-28 border-t border-white/10">
      <div
        ref={header.ref}
        className={`max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${header.animClass}`}
      >
        <h2 className="text-4xl md:text-6xl text-white leading-tight">
          Selected <span className="italic">work</span>
        </h2>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-cream hover:text-white transition-colors"
          style={{ fontFamily: SANS }}
        >
          Full portfolio <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div
        ref={grid.ref}
        className={`mt-12 max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 ${grid.animClass}`}
        style={{ fontFamily: SANS, animationDelay: '0.2s' }}
      >
        {CASE_STUDIES.map((c) => (
          <article
            key={c.title}
            className="liquid-glass-legacy bg-[#141414] rounded-3xl p-6 sm:p-8 flex flex-col"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary">{c.tag}</span>
            <h3 className="mt-3 text-2xl text-cream" style={{ fontFamily: 'inherit' }}>
              {c.title}
            </h3>
            <dl className="mt-6 space-y-4 text-sm leading-relaxed">
              <div>
                <dt className="text-gray-500">Problem</dt>
                <dd className="text-white/85">{c.problem}</dd>
              </div>
              <div>
                <dt className="text-gray-500">What we built</dt>
                <dd className="text-white/85">{c.built}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Result</dt>
                <dd className="text-white/85">{c.result}</dd>
              </div>
            </dl>
          </article>
        ))}

        {/* Pilot program */}
        <article className="rounded-3xl p-6 sm:p-8 flex flex-col border border-dashed border-white/20">
          <span className="inline-flex self-start items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 1 spot open
          </span>
          <h3 className="mt-4 text-2xl text-cream">Pilot program</h3>
          <p className="mt-4 text-sm text-white/85 leading-relaxed flex-1">
            We build one small product for free. In return you give us an honest testimonial and
            let us publish the project as a case study.
          </p>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 self-start bg-white text-black rounded-full px-5 py-2.5 text-sm hover:bg-white/90 transition-colors"
          >
            Apply for the pilot
          </a>
        </article>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Footer                             */
/* ---------------------------------- */

const FOOTER_LINKS = [
  { label: 'Services', href: '#services', external: false },
  { label: 'Work', href: PORTFOLIO_URL, external: true },
  { label: 'About', href: '#about', external: false },
]

const FOOTER_SOCIALS = [
  { label: 'x.com', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mujtaba-khanani' },
  { label: 'GitHub', href: 'https://github.com/Mujtaba19938' },
]

function Footer() {
  const anim = useInViewAnimation<HTMLElement>()
  const [arrowY, setArrowY] = useState(0)
  const moveArrow = (e: React.MouseEvent<HTMLAnchorElement>) =>
    setArrowY(e.currentTarget.offsetTop)
  return (
    <footer
      ref={anim.ref}
      className={`bg-black border-t border-white/10 ${anim.animClass}`}
      style={{ fontFamily: SANS }}
    >
      <div className="max-w-[1200px] mx-auto py-12 px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <a
          href="https://wa.me/923302921404"
          target="_blank"
          rel="noreferrer"
          className="self-start bg-white text-black rounded-full px-6 py-3 text-sm hover:bg-white/90 transition-colors"
        >
          Start a chat
        </a>

        <div className="flex items-start gap-8" onMouseLeave={() => setArrowY(0)}>
          <ArrowUpRight
            className="w-6 h-6 text-white transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${arrowY}px)` }}
          />
          <div className="relative flex flex-col gap-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                onMouseEnter={moveArrow}
                className="text-base text-white hover:opacity-70 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="relative flex flex-col gap-3">
            {FOOTER_SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={moveArrow}
                className="text-base text-white hover:opacity-70 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between text-sm text-gray-500">
        <span>Forge Systems</span>
        <span>Dubai, UAE</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <main className="bg-black">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <SolutionSection />
      <CtaSection />
      <WorkSection />
      <Footer />
    </main>
  )
}
