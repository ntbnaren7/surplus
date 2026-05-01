"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"

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
  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1A3C34] overflow-hidden">

      {/* ═══════════════ NAVBAR (CAPSULE DOCK) ═══════════════ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4"
      >
        <div className="bg-[#1A3C34]/95 backdrop-blur-2xl p-1.5 rounded-full shadow-[0_20px_40px_-10px_rgba(26,60,52,0.4)] flex items-center gap-12 transition-transform hover:scale-[1.02] duration-300 border border-white/10">
          {/* Logo Circle */}
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[#1A3C34] font-bold text-[18px] leading-none -mt-0.5" style={{ fontFamily: 'var(--font-playfair)' }}>S</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                {link}
              </Link>
            ))}
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

        {/* Background Image — Full Bleed, HIGH VISIBILITY */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-immersive-bg.jpg"
            alt="Food redistribution network"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Reduced gradient: let the image breathe */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB]/95 via-[#F5F0EB]/40 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5F0EB] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-72px)] items-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >

            {/* ── Left: Editorial Headline (expanded to 7 cols) ── */}
            <div className="lg:col-span-7 py-20 lg:py-0">

              {/* Headline — LARGER, fills the space */}
              <motion.h1 variants={fadeUp} className="mb-8 mt-12 lg:mt-0">
                <span className="block text-[clamp(3.5rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em] text-[#1A3C34]">
                  FROM <span className="italic font-normal" style={{ fontFamily: 'var(--font-playfair)' }}>SURPLUS</span>
                </span>
                <span className="block text-[clamp(3.5rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em] text-[#1A3C34] mt-2">
                  TO NEXT <span className="italic font-normal text-[#2D7A3A]" style={{ fontFamily: 'var(--font-playfair)' }}>MEAL<span className="text-[#2D7A3A]/30 align-super text-[0.4em] ml-1">®</span></span>
                </span>
              </motion.h1>

              {/* Tagline — extended, multi-line */}
              <motion.p
                variants={fadeUp}
                className="text-[15px] text-[#1A3C34]/45 mb-10 max-w-[420px] leading-[1.7]"
              >
                Surplus uses AI to match perishable food with those who need it — in real time, with expiry-aware routing that minimizes waste and maximizes impact.
              </motion.p>

              {/* Single CTA — Forest Green */}
              <motion.div variants={fadeUp}>
                <Link
                  href="/donor"
                  className="inline-block bg-[#1A3C34] text-white text-[13px] font-medium tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-[#152E28] transition-all duration-500 shadow-[0_4px_24px_rgba(26,60,52,0.25)]"
                >
                  Start
                </Link>
              </motion.div>
            </div>

            {/* ── Right: Discovery Card (5 cols, anchored lower-right) ── */}
            <motion.div variants={fadeIn} className="lg:col-span-5 relative h-[520px] hidden lg:block">

              {/* The "Discovery Card" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[20px] right-0 w-[360px] bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] p-7 z-30"
              >
                {/* Tab pills */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[11px] text-[#1A3C34]/50 px-3.5 py-1.5 rounded-full border border-[#1A3C34]/10">Matching</span>
                  <span className="text-[11px] text-[#1A3C34]/50 px-3.5 py-1.5 rounded-full border border-[#1A3C34]/10">Routing</span>
                  <span className="text-[11px] text-white bg-[#1A3C34] px-3.5 py-1.5 rounded-full">Live</span>
                </div>

                {/* Card headline */}
                <h3 className="text-[19px] font-semibold text-[#1A3C34] leading-[1.3] mb-2 tracking-[-0.01em]">
                  Real-time matching
                  <br />& smart routing
                </h3>
                <p className="text-[12px] text-[#1A3C34]/30 mb-5">From surplus to delivery.</p>

                {/* Inline preview */}
                <div className="flex items-center gap-4">
                  {/* Play button */}
                  <div className="w-12 h-12 rounded-full bg-[#1A3C34] flex items-center justify-center cursor-pointer hover:bg-[#152E28] transition-all duration-300 shrink-0 shadow-[0_2px_12px_rgba(26,60,52,0.3)]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="white"/>
                    </svg>
                  </div>
                  {/* Preview thumb */}
                  <div className="flex-1 h-[56px] rounded-xl overflow-hidden bg-[#E8E2DA]">
                    <Image
                      src="/images/cooked-meals.png"
                      alt="Live route preview"
                      width={200}
                      height={56}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-[#1A3C34]/25 uppercase tracking-[0.15em]">Live</p>
                    <p className="text-[9px] text-[#1A3C34]/25 uppercase tracking-[0.15em]">Demo</p>
                  </div>
                </div>
              </motion.div>

              {/* Supplier hotspot */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute top-[300px] left-[20px] z-20"
              >
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                  <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-white/40 animate-ping" />
                </div>
                <p className="text-[9px] text-white/80 mt-2 uppercase tracking-[0.15em] whitespace-nowrap font-medium">Supplier</p>
              </motion.div>

              {/* Connecting line */}
              <svg className="absolute top-[300px] left-[32px] w-[280px] h-[120px] z-10 pointer-events-none" viewBox="0 0 280 120">
                <path
                  d="M 0 8 Q 90 15, 140 60 T 280 90"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>

              {/* Shelter hotspot */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-[80px] right-[30px] z-20"
              >
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                  <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-white/40 animate-ping" style={{ animationDelay: '1s' }} />
                </div>
                <p className="text-[9px] text-white/80 mt-2 uppercase tracking-[0.15em] whitespace-nowrap font-medium">Shelter</p>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM BAR ═══════════════ */}
      <section className="relative z-20 -mt-8">
        <motion.div
          className="bg-[#1A3C34] rounded-t-[2.5rem] px-10 py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">

            {/* Left — Feature callout */}
            <div>
              <p className="text-[18px] font-semibold text-white/90 mb-2 leading-[1.4]">
                We use expiry-aware
                <br />matching!
              </p>
              <p className="text-[12px] text-white/35 leading-relaxed">
                Working with verified donors.
              </p>
            </div>

            {/* Center — Stat with avatars */}
            <div className="flex flex-col items-center text-center">
              <div className="flex -space-x-2 mb-3">
                {["#2D7A3A", "#4A9E5C"].map((bg, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-[2.5px] border-[#1A3C34] flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ backgroundColor: bg, zIndex: 2 - i }}
                  >
                    {["S", "N"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[36px] font-light text-white/90 tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                1.2m<span className="text-white/40 text-[20px] align-super">+</span>
              </p>
              <p className="text-[11px] text-white/35 uppercase tracking-[0.15em] mt-1">Meals Delivered</p>
            </div>

            {/* Right — Mission statement */}
            <div className="text-right">
              <p className="text-[16px] font-semibold text-white/90 uppercase tracking-[0.05em] leading-[1.5]">
                We combine
                <br />technology & human
                <br />compassion
              </p>
              <Link
                href="/donor"
                className="inline-block text-[11px] text-white/50 uppercase tracking-[0.15em] mt-4 border-b border-white/20 pb-1 hover:text-white/80 hover:border-white/40 transition-all duration-300"
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
