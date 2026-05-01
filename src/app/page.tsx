"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useMotionValue, useTransform, type Variants } from "framer-motion"

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
}
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
}

/* ─── Data ─── */
const navLinks = ["How it works", "For Donors", "For NGOs", "Impact"]

export default function LandingPage() {
  // Parallax Setup
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Background shifts slightly
  const bgX = useTransform(mouseX, [-800, 800], [15, -15])
  const bgY = useTransform(mouseY, [-500, 500], [15, -15])

  // Foreground (cards) shift slightly opposite to background
  const cardX = useTransform(mouseX, [-800, 800], [-10, 10])
  const cardY = useTransform(mouseY, [-500, 500], [-10, 10])

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1A3C34] overflow-hidden">

      {/* ═══════════════ NAVBAR (CAPSULE DOCK) ═══════════════ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4"
      >
        <div className="bg-[#1A3C34]/95 backdrop-blur-[40px] p-1.5 rounded-full shadow-glass flex items-center gap-12 transition-transform hover:scale-[1.02] duration-300 ring-1 ring-white/15">
          {/* Logo Circle */}
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[#1A3C34] font-bold text-[18px] leading-none -mt-0.5" style={{ fontFamily: 'var(--font-playfair)' }}>S</span>
          </div>

          {/* Center Links (Demo Switcher) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/donor" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap">Donor Portal</Link>
            <Link href="/receiver" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap">Receiver Feed</Link>
            <Link href="/driver" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap">Driver Hub</Link>
          </div>

          {/* Right Action — White Pill */}
          <Link
            href="/donor"
            className="bg-white text-[#1A3C34] text-[13px] font-semibold px-7 py-3 rounded-full hover:bg-[#F5F0EB] transition-all duration-300 shrink-0 whitespace-nowrap"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen pt-[72px]">

        {/* Background Image — Parallax & Vignette */}
        <motion.div 
          className="absolute inset-[-40px] z-0" 
          style={{ x: bgX, y: bgY }}
        >
          <div className="absolute inset-0 vignette z-10 pointer-events-none" />
          <Image
            src="/images/hero-immersive-bg.jpg"
            alt="Food redistribution network"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Refined gradient for filmic contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB] via-[#F5F0EB]/30 to-transparent z-10" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5F0EB] to-transparent z-10" />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-72px)] items-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >

            {/* ── Left: Editorial Headline ── */}
            <div className="lg:col-span-7 py-20 lg:py-0 relative">
              
              {/* Hairline Divider linking to content */}
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute left-[-24px] top-[20%] bottom-[20%] w-[1px] bg-[#1A3C34]/10 origin-top hidden lg:block" 
              />

              {/* Headline — Masked Slide-In */}
              <div className="mb-8 mt-12 lg:mt-0 space-y-1">
                <div className="overflow-hidden pb-2">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  >
                    <span className="block text-[clamp(3.5rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.05em] text-[#1A3C34]">
                      FROM <span className="italic font-light" style={{ fontFamily: 'var(--font-playfair)' }}>SURPLUS</span>
                    </span>
                  </motion.div>
                </div>
                <div className="overflow-hidden pt-2 pb-4">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  >
                    <span className="block text-[clamp(3.5rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.05em] text-[#1A3C34]">
                      TO NEXT <span className="italic font-light text-[#2D7A3A]" style={{ fontFamily: 'var(--font-playfair)' }}>MEAL<span className="text-[#2D7A3A]/30 align-super text-[0.4em] ml-1">®</span></span>
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Tagline */}
              <motion.p
                variants={fadeUp}
                className="text-[15px] text-[#1A3C34]/50 mb-12 max-w-[420px] leading-[1.7]"
              >
                Surplus uses AI to match perishable food with those who need it — in real time, with expiry-aware routing that minimizes waste and maximizes impact.
              </motion.p>

              {/* Actions & Floating Anchor */}
              <motion.div variants={fadeUp} className="flex items-center gap-8 relative">
                <Link
                  href="/donor"
                  className="inline-block bg-[#1A3C34] text-white text-[13px] font-medium tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-[#152E28] transition-all duration-500 shadow-[0_8px_30px_rgba(26,60,52,0.3)]"
                >
                  Start
                </Link>
                
                {/* Floating Micro-Stat */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#1A3C34]/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2D7A3A] animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#1A3C34]/40 uppercase">Efficiency</span>
                    <span className="text-[14px] font-semibold text-[#1A3C34]">+94%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Right: Discovery Card & Visualization ── */}
            <motion.div variants={fadeIn} className="lg:col-span-5 relative h-[520px] hidden lg:block" style={{ x: cardX, y: cardY }}>

              {/* The "Discovery Card" — Glassmorphism 2.0 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[20px] right-0 w-[360px] bg-white/70 backdrop-blur-[40px] rounded-[2rem] shadow-glass p-7 z-30 ring-1 ring-white/40 glass-noise"
              >
                {/* Tab pills */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[11px] font-medium text-[#1A3C34]/60 px-3.5 py-1.5 rounded-full border border-[#1A3C34]/10">Matching</span>
                  <span className="text-[11px] font-medium text-[#1A3C34]/60 px-3.5 py-1.5 rounded-full border border-[#1A3C34]/10">Routing</span>
                  <span className="text-[11px] font-medium text-white bg-[#1A3C34] px-3.5 py-1.5 rounded-full shadow-sm">Live</span>
                </div>

                {/* Card headline */}
                <h3 className="text-[20px] font-bold text-[#1A3C34] leading-[1.25] mb-2 tracking-[-0.02em]">
                  Real-time matching
                  <br />& smart routing
                </h3>
                <p className="text-[12px] text-[#1A3C34]/40 mb-6">From surplus to delivery.</p>

                {/* Inline preview */}
                <div className="flex items-center gap-4">
                  {/* Play button */}
                  <div className="w-12 h-12 rounded-full bg-[#1A3C34] flex items-center justify-center cursor-pointer hover:bg-[#152E28] transition-all duration-300 shrink-0 shadow-[0_4px_16px_rgba(26,60,52,0.4)]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="white"/>
                    </svg>
                  </div>
                  {/* Preview thumb */}
                  <div className="flex-1 h-[56px] rounded-xl overflow-hidden bg-[#E8E2DA] ring-1 ring-black/5">
                    <Image
                      src="/images/cooked-meals.png"
                      alt="Live route preview"
                      width={200}
                      height={56}
                      className="w-full h-full object-cover mix-blend-multiply opacity-90"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-[#1A3C34]/30 uppercase tracking-[0.2em] mb-0.5">Live</p>
                    <p className="text-[9px] font-bold text-[#1A3C34]/30 uppercase tracking-[0.2em]">Demo</p>
                  </div>
                </div>
              </motion.div>

              {/* Supplier hotspot */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute top-[300px] left-[20px] z-20 group"
              >
                <div className="relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.6)] border-[1.5px] border-white" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/50 animate-ping" />
                  {/* Hover Tooltip */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-glass whitespace-nowrap">
                    <span className="text-[10px] font-bold text-[#1A3C34]">12kg Available</span>
                  </div>
                </div>
                <p className="text-[9px] text-white/90 mt-2 uppercase tracking-[0.2em] whitespace-nowrap font-bold drop-shadow-md">Supplier</p>
              </motion.div>

              {/* Connecting line — Pulsing Data Flow */}
              <svg className="absolute top-[308px] left-[32px] w-[280px] h-[120px] z-10 pointer-events-none" viewBox="0 0 280 120">
                {/* Background track */}
                <path
                  d="M 0 0 Q 90 7, 140 52 T 280 82"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.2"
                />
                {/* Moving Pulse */}
                <motion.path
                  d="M 0 0 Q 90 7, 140 52 T 280 82"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray="30 350"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ strokeDashoffset: [380, 0] }}
                  transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                  style={{ filter: 'drop-shadow(0px 0px 6px rgba(255,255,255,0.8))' }}
                />
              </svg>

              {/* Shelter hotspot */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-[80px] right-[30px] z-20 group"
              >
                <div className="relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.6)] border-[1.5px] border-white" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/50 animate-ping" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-glass whitespace-nowrap">
                    <span className="text-[10px] font-bold text-[#1A3C34]">ETA 14m</span>
                  </div>
                </div>
                <p className="text-[9px] text-white/90 mt-2 uppercase tracking-[0.2em] whitespace-nowrap font-bold drop-shadow-md">Shelter</p>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM BAR ═══════════════ */}
      <section className="relative z-20 -mt-8">
        <motion.div
          className="bg-[#1A3C34] rounded-t-[2.5rem] px-10 py-12 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">

            {/* Left — Feature callout */}
            <div>
              <p className="text-[18px] font-bold text-white/95 mb-2 leading-[1.3] tracking-tight">
                We use expiry-aware
                <br />matching!
              </p>
              <p className="text-[12px] font-medium text-white/40 leading-relaxed tracking-wide">
                Working with verified donors.
              </p>
            </div>

            {/* Center — Stat with avatars */}
            <div className="flex flex-col items-center text-center">
              <div className="flex -space-x-2 mb-3">
                {["#2D7A3A", "#4A9E5C"].map((bg, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-[2px] border-[#1A3C34] flex items-center justify-center text-[11px] font-bold text-white shadow-md"
                    style={{ backgroundColor: bg, zIndex: 2 - i }}
                  >
                    {["S", "N"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[36px] font-normal text-white/95 tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                1.2m<span className="text-white/40 text-[20px] align-super">+</span>
              </p>
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.25em] mt-1.5">Meals Delivered</p>
            </div>

            {/* Right — Mission statement */}
            <div className="text-right">
              <p className="text-[16px] font-bold text-white/95 uppercase tracking-[0.05em] leading-[1.4]">
                We combine
                <br />technology & human
                <br />compassion
              </p>
              <Link
                href="/donor"
                className="inline-block text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mt-5 border-b border-white/10 pb-1 hover:text-white/80 hover:border-white/40 transition-all duration-300"
              >
                Learn more
              </Link>
            </div>

          </div>
        </motion.div>
      </section>

    </div>
  )
}
