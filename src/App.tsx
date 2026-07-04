import { useEffect, useRef, useState } from 'react'
import {
  Menu,
  X,
  Check,
  ArrowRight,
  ArrowUpRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Testimonials', href: '#testimonials' },
]

const STATS = [
  'Web & Mobile Experts',
  '15+ Successful Deployments',
  '4.8 User Satisfaction',
  'Intentional-First Design',
]

const SANS = 'system-ui, sans-serif'

const AURA_SRCDOC = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; background: #000; }
    .aura { position: absolute; inset: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="aura" data-us-project="NMlvqnkICwYYJ6lYb064"></div>
  <script type="text/javascript">
    !function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();
  </script>
</body>
</html>`

function AuraBackground() {
  const ref = useRef<HTMLDivElement>(null)
  // Mount the WebGL iframe only while its section is near the viewport, so
  // the hero and CTA scenes never render simultaneously.
  const inView = useInView(ref, { margin: '300px' })
  return (
    <div ref={ref} className="absolute top-0 left-0 w-full h-full z-[1]">
      {inView && (
        <iframe
          title="Animated aura background"
          srcDoc={AURA_SRCDOC}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
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
      {/* Animated aura background */}
      <AuraBackground />

      {/* Content layer */}
      <div className="relative z-[2] flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <a href="#" className="text-white italic text-xl sm:text-2xl">
            ForgeSystems
          </a>

          {/* Desktop nav */}
          <div
            className="hidden md:flex items-center gap-1 liquid-glass rounded-full p-1.5 pl-3"
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
            <button className="ml-2 bg-white text-black text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors cursor-pointer">
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden liquid-glass rounded-full p-3 text-white cursor-pointer z-[60]"
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
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs sm:text-sm text-white">
            Over 10,000 minds already finding their clarity
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-white">
            We build websites, apps,
            <br />
            and platforms user-first,
            <br />
            outcome-driven.
          </h1>

          <p
            className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-white/85"
            style={{ fontFamily: SANS }}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands.
            Discover how to protect your presence and create with intention.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 w-full max-w-[320px] sm:max-w-sm liquid-glass rounded-full flex items-center p-1.5 pl-5"
            style={{ fontFamily: SANS }}
          >
            <input
              type="email"
              placeholder="Your Best Email"
              className="hero-input flex-1 min-w-0 bg-transparent outline-none text-sm text-white"
            />
            <button
              type="submit"
              className="text-sm px-4 py-2.5 rounded-full whitespace-nowrap cursor-pointer bg-white text-black hover:bg-white/90 transition-colors"
            >
              Get Early Access
            </button>
          </form>
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
            <button
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
              Get Started
            </button>
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
      <div className="liquid-glass bg-[#101010] rounded-3xl max-w-6xl mx-auto text-center px-6 sm:px-12 py-16 sm:py-24">
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
    title: 'Project Storyboard.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Map every scene before you shoot',
      'Drag-and-drop shot sequencing',
      'Shared boards for your whole crew',
      'Full version history, always',
    ],
  },
  {
    number: '02',
    title: 'Smart Critiques.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'Instant AI analysis on every cut',
      'Creative notes, right where you work',
      'Integrates with the tools you love',
    ],
  },
  {
    number: '03',
    title: 'Immersion Capsule.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Silences every notification',
      'Ambient soundscapes for deep work',
      'Syncs with your daily schedule',
    ],
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
                text: 'Everything you need to establish, automate, and grow your digital presence.',
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
              Your creative canvas.
            </p>
          </FeatureCardShell>

          {/* Cards 2–4 — checklists */}
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCardShell
              key={card.number}
              index={i + 1}
              className="liquid-glass bg-[#141414] rounded-2xl p-5 sm:p-6 flex flex-col"
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
              <ul className="mt-5 space-y-3 flex-1" style={{ fontFamily: SANS }}>
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-cream hover:text-white transition-colors group"
                style={{ fontFamily: SANS }}
              >
                Learn more
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
    title: 'Premium Websites',
    description:
      'We design and develop fast, responsive websites that strengthen your brand, engage visitors, and convert them into customers.',
  },
  {
    title: 'AI Solutions',
    description:
      'Automate repetitive tasks, improve customer experiences, and streamline operations with intelligent AI-powered systems.',
  },
  {
    title: 'Custom Software',
    description:
      'From internal dashboards to full-scale web applications, we build secure, scalable software tailored to your business.',
  },
  {
    title: 'Ongoing Partnership',
    description:
      "We don't disappear after launch. From maintenance and optimization to future enhancements, we're invested in your long-term success.",
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
          Solution
        </div>

        <h2 className="mt-6 text-4xl md:text-6xl text-white leading-tight max-w-3xl">
          <WordsPullUpMultiStyle
            justify="justify-start"
            segments={[
              { text: 'The platform for building', className: 'font-normal' },
              { text: 'your online presence.', className: 'italic' },
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
/* Section 5: CTA                     */
/* ---------------------------------- */

function CtaSection() {
  return (
    <section className="relative bg-black py-32 md:py-44 border-t border-white/10 overflow-hidden">
      <AuraBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Concentric circles logo */}
        <div className="w-10 h-10 rounded-full border border-white/70 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border border-white/70" />
        </div>

        <h2 className="mt-8 text-4xl md:text-6xl text-white italic">Start Your Journey</h2>

        <p
          className="mt-4 max-w-md text-sm sm:text-base text-gray-300 leading-relaxed"
          style={{ fontFamily: SANS }}
        >
          Your next customer is online. Let's make sure they find you.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4" style={{ fontFamily: SANS }}>
          <button className="bg-white text-black rounded-lg px-8 py-3.5 text-sm hover:bg-white/90 transition-colors cursor-pointer">
            Subscribe Now
          </button>
          <button className="liquid-glass rounded-lg px-8 py-3.5 text-sm text-white hover:text-white/80 transition-colors cursor-pointer">
            Start Writing
          </button>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Section 6: Testimonials            */
/* ---------------------------------- */

const TESTIMONIALS = [
  {
    name: 'Marcus Anderson',
    role: 'CEO, Data.storage',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=96',
    quote:
      'With very little guidance the team delivered designs that were consistently spot on — polished, on-brand, and ready to ship.',
  },
  {
    name: 'alexwu',
    role: 'Founder, Nexgate',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=96',
    quote:
      'ForgeSystems led the creation of our best fundraising deck to date! Clear, confident, and beautifully designed.',
  },
  {
    name: 'James Mitchell',
    role: 'VP Product, LaunchPad',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=96',
    quote:
      'Working with ForgeSystems transformed our product vision into something users genuinely love.',
  },
  {
    name: 'Rachel Foster',
    role: 'Co-founder, Nexus Labs',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=96',
    quote:
      'The design quality exceeded our expectations at every turn — fast, thoughtful, and detail-obsessed.',
  },
  {
    name: 'David Zhang',
    role: 'Head of Design, Paradigm Labs',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=96',
    quote:
      'Incredible work from start to finish. Communication was effortless and the results speak for themselves.',
  },
]

function QuoteMark() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 24V14.4C0 6.45 4.95 1.2 13.05 0l1.35 3.6c-4.5 1.2-7.05 3.75-7.35 7.2h6.15V24H0Zm18.75 0V14.4c0-7.95 4.95-13.2 13.05-14.4l1.35 3.6c-4.5 1.2-7.05 3.75-7.35 7.2h6.15V24H18.75Z"
        fill="#b5c99a"
      />
    </svg>
  )
}

function TestimonialsSection() {
  const N = TESTIMONIALS.length
  const tripled = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  const [index, setIndex] = useState(N)
  const [instant, setInstant] = useState(false)
  const [paused, setPaused] = useState(false)
  const [step, setStep] = useState(451.5)
  const trackRef = useRef<HTMLDivElement>(null)

  const header = useInViewAnimation<HTMLDivElement>()
  const carousel = useInViewAnimation<HTMLDivElement>()

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.children[0] as HTMLElement | undefined
      if (first) setStep(first.offsetWidth + 24)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => i + 1), 3000)
    return () => clearInterval(id)
  }, [paused])

  // After sliding past a copy boundary, snap back to the middle copy
  // without a transition so the loop is seamless.
  const handleTransitionEnd = () => {
    setIndex((i) => {
      if (i >= 2 * N) {
        setInstant(true)
        return i - N
      }
      if (i < N) {
        setInstant(true)
        return i + N
      }
      return i
    })
  }

  useEffect(() => {
    if (!instant) return
    const id = setTimeout(() => setInstant(false), 50)
    return () => clearTimeout(id)
  }, [instant])

  return (
    <section id="testimonials" className="bg-black py-20 border-t border-white/10 overflow-hidden">
      {/* Header row */}
      <div
        ref={header.ref}
        className={`max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${header.animClass}`}
      >
        <h2 className="text-4xl md:text-6xl text-white leading-tight">
          What <span className="italic">clients</span> say
        </h2>
        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex items-center gap-2" style={{ fontFamily: SANS }}>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-5 h-5 text-white fill-white" />
              ))}
            </span>
            <span className="text-white text-sm">Clutch 5/5</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIndex((i) => i - 1)}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIndex((i) => i + 1)}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carousel.ref}
        className={`mt-12 pl-6 sm:pl-8 ${carousel.animClass}`}
        style={{ animationDelay: '0.2s' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-6"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${index * step}px)`,
            transition: instant ? 'none' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {tripled.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="shrink-0 w-[calc(100vw-48px)] md:w-[427.5px] liquid-glass bg-[#141414] rounded-[32px] md:rounded-[40px] px-6 md:pl-10 md:pr-16 py-8 flex flex-col"
            >
              <QuoteMark />
              <p
                className="mt-5 text-base text-white/90 leading-relaxed flex-1"
                style={{ fontFamily: SANS }}
              >
                {t.quote}
              </p>
              <div className="mt-8 flex items-center gap-4" style={{ fontFamily: SANS }}>
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-sm text-cream">{t.name}</div>
                  <div className="text-sm text-gray-400">→ {t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* Footer                             */
/* ---------------------------------- */

const FOOTER_LINKS = [
  { label: 'Services', href: '#services', external: false },
  { label: 'Work', href: 'https://portfolio-mzrs.vercel.app/', external: true },
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
        <span>ForgeSystems</span>
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
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
