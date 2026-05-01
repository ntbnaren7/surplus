"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight, Play, Heart, Leaf, Users, MapPin,
  Truck, CheckCircle, TrendingDown, Wind
} from "lucide-react"

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
}
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}
const cardFloat = (delay: number) => ({
  y: [0, -6, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
})

/* ─── Data ─── */
const navLinks = ["How it works", "For Donors", "For NGOs", "Impact", "About us"]
const pillars = [
  { icon: Leaf, title: "Reduce Waste", desc: "Keep food out of landfills" },
  { icon: Heart, title: "Fight Hunger", desc: "Deliver meals to those in need" },
  { icon: Wind, title: "Lower Emissions", desc: "Fewer miles, lower impact" },
  { icon: Users, title: "Stronger Communities", desc: "Together, we create change" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1A3C34] overflow-hidden">

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F0]/70 backdrop-blur-2xl border-b border-[#1A3C34]/[0.04]">
        <div className="max-w-[1400px] mx-auto px-10 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D7A3A] flex items-center justify-center shadow-[0_2px_12px_rgba(45,122,58,0.3)]">
              <Heart className="w-[18px] h-[18px] text-white fill-white" />
            </div>
            <div className="leading-tight">
              <span className="text-[17px] font-bold tracking-tight text-[#1A3C34]">Surplus</span>
              <p className="text-[10px] text-[#1A3C34]/40 tracking-[0.05em] uppercase -mt-0.5">Zero waste. Zero hunger.</p>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-[13px] font-medium text-[#1A3C34]/50 hover:text-[#1A3C34] transition-colors duration-300"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[13px] font-medium text-[#1A3C34]/50 hover:text-[#1A3C34] transition-colors">
              Log in
            </Link>
            <Link
              href="/donor"
              className="bg-[#1A3C34] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full hover:bg-[#152E28] transition-all duration-300 shadow-[0_2px_16px_rgba(26,60,52,0.25)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO — IMMERSIVE ═══════════════ */}
      <section className="relative min-h-screen pt-[72px]">

        {/* Background Image — Full Bleed */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-immersive-bg.jpg"
            alt="Surplus food redistribution — cityscape at golden hour"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient mask: heavy on left for text readability, fading on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F0] via-[#F8F6F0]/85 to-[#F8F6F0]/30" />
          {/* Bottom fade to blend into the Impact section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F8F6F0] to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-72px)] items-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* ── Left Column: Editorial Headline (7 cols) ── */}
            <div className="lg:col-span-7 py-16 lg:py-0">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-[#2D7A3A]/10 text-[#2D7A3A] text-[12px] font-semibold px-4 py-2 rounded-full mb-10 backdrop-blur-sm border border-[#2D7A3A]/10">
                  <CheckCircle className="w-3.5 h-3.5" />
                  AI for Sustainable Development Goals
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mb-10"
              >
                <span className="block text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#1A3C34]">
                  From
                </span>
                <span className="block text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-[#1A3C34] font-[var(--font-playfair)] italic" style={{ fontFamily: 'var(--font-playfair)' }}>
                  surplus
                </span>
                <span className="block text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#1A3C34] mt-1">
                  to someone&apos;s
                </span>
                <span className="block text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <span className="text-[#2D7A3A] italic">next meal</span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-[16px] leading-[1.7] text-[#1A3C34]/55 mb-12 max-w-[440px]"
              >
                Surplus uses AI to match perishable food with those who
                need it — in real time, with expiry-aware routing that
                minimizes waste and maximizes impact.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex items-center gap-8 mb-14">
                <Link
                  href="/donor"
                  className="inline-flex items-center gap-3 bg-[#1A3C34] text-white text-[14px] font-semibold px-8 py-4 rounded-full hover:bg-[#152E28] transition-all duration-300 shadow-[0_4px_24px_rgba(26,60,52,0.3)] hover:shadow-[0_8px_40px_rgba(26,60,52,0.4)] group"
                >
                  See how it works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button className="inline-flex items-center gap-3 text-[14px] font-medium text-[#1A3C34]/60 hover:text-[#1A3C34] transition-colors duration-300 group">
                  <div className="w-10 h-10 rounded-full border-2 border-[#1A3C34]/15 flex items-center justify-center group-hover:border-[#1A3C34]/30 group-hover:bg-[#1A3C34]/5 transition-all duration-300">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  Watch demo
                </button>
              </motion.div>

              {/* Trust Bar */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["#C8847E", "#7EA8C8", "#8BC89E", "#C8B87E"].map((bg, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-[2.5px] border-[#F8F6F0] flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: bg, zIndex: 4 - i }}
                    >
                      {["S", "K", "R", "N"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-[#1A3C34]/45">
                  Trusted by <span className="font-semibold text-[#1A3C34]/65">1,200+</span> donors & NGOs
                </p>
              </motion.div>
            </div>

            {/* ── Right Column: Floating System Cards (5 cols) ── */}
            <motion.div variants={fadeIn} className="lg:col-span-5 relative h-[560px] hidden lg:block">

              {/* Available Surplus Card */}
              <motion.div
                animate={cardFloat(0)}
                className="absolute top-[20px] left-0 w-[220px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] p-5 z-30 border border-white/60"
              >
                <p className="text-[10px] font-semibold text-[#1A3C34]/40 uppercase tracking-[0.15em] mb-3">Available Surplus</p>
                <div className="w-full h-[90px] rounded-2xl overflow-hidden mb-3">
                  <Image
                    src="/images/cooked-meals.png"
                    alt="Cooked meals"
                    width={220}
                    height={90}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <p className="text-[14px] font-semibold text-[#1A3C34]">Cooked Meals</p>
                <p className="text-[11px] text-[#1A3C34]/40 mb-1">20 kg · Serves 80</p>
                <p className="text-[10px] text-[#1A3C34]/30 uppercase tracking-wider mb-0.5">Expires in</p>
                <p className="text-[20px] font-bold text-[#D32F2F] tracking-tight mb-3">2h 15m</p>
                <Link
                  href="/donor"
                  className="block w-full text-center bg-[#2D7A3A] text-white text-[12px] font-semibold py-2.5 rounded-xl hover:bg-[#256B31] transition-all duration-300 shadow-[0_2px_12px_rgba(45,122,58,0.25)]"
                >
                  Donate Now
                </Link>
              </motion.div>

              {/* Restaurant Pin — floating on the background */}
              <motion.div
                animate={cardFloat(0.3)}
                className="absolute top-[80px] left-[200px] bg-white/90 backdrop-blur-lg rounded-xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center gap-2 z-20 border border-white/50"
              >
                <div className="w-6 h-6 rounded-full bg-[#2D7A3A]/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-[#2D7A3A]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#1A3C34]">Restaurant</p>
                  <p className="text-[9px] text-[#1A3C34]/35">2.4 km away</p>
                </div>
              </motion.div>

              {/* Route SVG — connecting dots */}
              <svg className="absolute top-[120px] left-[180px] w-[200px] h-[200px] z-10 pointer-events-none" viewBox="0 0 200 200">
                <path
                  d="M 30 10 C 60 40, 100 60, 120 100 S 160 160, 170 190"
                  stroke="#2D7A3A"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <circle cx="30" cy="10" r="4" fill="#2D7A3A" opacity="0.6" />
                <circle cx="170" cy="190" r="4" fill="#2D7A3A" opacity="0.6" />
              </svg>

              {/* Shelter Pin */}
              <motion.div
                animate={cardFloat(0.8)}
                className="absolute bottom-[195px] right-[30px] bg-white/90 backdrop-blur-lg rounded-xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center gap-2 z-20 border border-white/50"
              >
                <div className="w-6 h-6 rounded-full bg-[#2D7A3A]/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-[#2D7A3A]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#1A3C34]">Shelter Home</p>
                  <p className="text-[9px] text-[#1A3C34]/35">ETA 18 min</p>
                </div>
              </motion.div>

              {/* Delivery Progress Card */}
              <motion.div
                animate={cardFloat(0.4)}
                className="absolute top-[10px] right-0 w-[210px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] p-5 z-30 border border-white/60"
              >
                <p className="text-[13px] font-semibold text-[#1A3C34] mb-0.5">Delivery in progress</p>
                <p className="text-[10px] text-[#1A3C34]/35 uppercase tracking-wider mb-3">Live tracking</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-[#E8F5E9] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#2D7A3A] rounded-full"
                      initial={{ width: "30%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const }}
                    />
                  </div>
                  <Truck className="w-4 h-4 text-[#2D7A3A]" />
                </div>
                <p className="text-[22px] font-bold text-[#1A3C34] tracking-tight">18 min</p>
                <p className="text-[10px] text-[#1A3C34]/35 mt-0.5">On time · Safe · Impactful</p>
              </motion.div>

              {/* Impact Today Card */}
              <motion.div
                animate={cardFloat(1)}
                className="absolute top-[210px] right-0 w-[200px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] p-5 z-30 border border-white/60"
              >
                <p className="text-[13px] font-semibold text-[#1A3C34] mb-4">Impact today</p>
                <div className="space-y-3">
                  {[
                    { icon: Heart, label: "Meals delivered", value: "1,248" },
                    { icon: TrendingDown, label: "Food saved", value: "312 kg" },
                    { icon: Wind, label: "CO₂ avoided", value: "783 kg" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <stat.icon className="w-3.5 h-3.5 text-[#2D7A3A]" />
                        <span className="text-[11px] text-[#1A3C34]/45">{stat.label}</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#1A3C34] tabular-nums">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Shelter Photo — grounding element */}
              <div className="absolute bottom-0 left-[40px] right-[20px] h-[170px] rounded-[1.5rem] overflow-hidden z-20 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-white/30">
                <Image
                  src="/images/shelter-crates.png"
                  alt="Food distribution at Shelter Home"
                  width={500}
                  height={200}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ AI BADGE — Floating Divider ═══════════════ */}
      <div className="relative z-30 flex justify-center -mt-16 mb-[-36px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 20 }}
          className="bg-[#1A3C34] text-white rounded-full px-7 py-3.5 shadow-[0_8px_40px_rgba(26,60,52,0.35)] flex items-center gap-4"
        >
          <span className="bg-[#2D7A3A] text-white text-[11px] font-bold px-3 py-1 rounded-full">AI Powered</span>
          <span className="text-[12px] font-medium opacity-80">Real-time matching</span>
          <span className="text-white/20">·</span>
          <span className="text-[12px] font-medium opacity-80">Expiry-aware routing</span>
        </motion.div>
      </div>

      {/* ═══════════════ IMPACT PILLARS ═══════════════ */}
      <section className="mt-14">
        <motion.div
          className="bg-[#1A3C34] rounded-t-[3rem] px-10 py-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        >
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {pillars.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#2D7A3A] flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(45,122,58,0.3)]">
                  <p.icon className="w-[18px] h-[18px] text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white mb-1">{p.title}</p>
                  <p className="text-[12px] text-white/40 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  )
}
