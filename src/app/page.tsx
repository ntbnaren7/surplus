import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans overflow-hidden relative">
      
      {/* ─── Background Crate & Shelter Image ─── */}
      <div className="absolute top-0 right-0 w-[65%] h-[120vh] z-0 pointer-events-none">
        <Image
          src="/images/shelter-crates.png"
          alt="Food crates and shelter"
          fill
          priority
          className="object-cover object-[80%_center]"
          sizes="100vw"
        />
        {/* Soft fade-out to cream on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-transparent to-[#FDFBF7]" />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="flex items-center justify-between px-10 py-8 relative z-50 max-w-[1440px] mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            {/* Green Leaf Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239C12.4835 4.67139 13.914 4 15.5 4C18.5376 4 21 6.46243 21 9.5C21 16 12 21.5 12 21.5Z" fill="#153F2D"/>
              <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239L12 21.5Z" fill="#5DB06D"/>
            </svg>
            <span className="text-[22px] font-bold text-[#153F2D] tracking-tight">Surplus</span>
          </div>
          <span className="text-[11px] text-[#153F2D]/50 mt-1 font-medium pl-[34px]">Zero waste. Zero hunger.</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="#" className="text-[14px] font-semibold text-[#153F2D]">How it works</Link>
          <Link href="/donor" className="text-[14px] font-medium text-[#153F2D]/70 hover:text-[#153F2D]">For Donors</Link>
          <Link href="/receiver" className="text-[14px] font-medium text-[#153F2D]/70 hover:text-[#153F2D]">For NGOs</Link>
          <Link href="/driver" className="text-[14px] font-medium text-[#153F2D]/70 hover:text-[#153F2D]">Impact</Link>
          <Link href="#" className="text-[14px] font-medium text-[#153F2D]/70 hover:text-[#153F2D]">About us</Link>
        </div>
        
        <div className="flex items-center gap-8">
          <Link href="/donor" className="text-[14px] font-medium text-[#153F2D]">Log in</Link>
          <Link href="/donor" className="bg-[#153F2D] text-white text-[14px] font-medium px-7 py-3 rounded-full hover:bg-[#0f2d20] transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <div className="relative max-w-[1440px] mx-auto px-10 pt-16 pb-40 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* ── LEFT COLUMN: Typography & Content ── */}
          <div className="max-w-[600px]">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E9F3EB] px-4 py-2 rounded-full mb-8 shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239C12.4835 4.67139 13.914 4 15.5 4C18.5376 4 21 6.46243 21 9.5C21 16 12 21.5 12 21.5Z" fill="#5DB06D"/></svg>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#5DB06D]">AI for Sustainable Development Goals</span>
            </div>

            {/* Headline */}
            <h1 className="text-[5.5rem] font-bold leading-[1.05] tracking-[-0.03em] mb-6">
              <span className="block text-[#153F2D]">From surplus</span>
              <span className="block text-[#153F2D]">to someone's</span>
              <span className="block text-[#5DB06D]">next meal</span>
            </h1>

            {/* Subtext */}
            <p className="text-[16px] text-[#153F2D]/70 leading-relaxed mb-10 max-w-[460px]">
              Surplus uses AI to match perishable food with those who need it — in real time, with expiry-aware routing that minimizes waste and maximizes impact.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mb-14">
              <Link href="/donor" className="bg-[#153F2D] text-white text-[15px] font-medium px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#0f2d20] transition-colors shadow-md">
                See how it works
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <button className="flex items-center gap-3 text-[15px] font-medium text-[#153F2D] hover:text-[#5DB06D] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-[#153F2D]/20 flex items-center justify-center group-hover:border-[#5DB06D]/50">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="#153F2D" className="group-hover:fill-[#5DB06D]"><path d="M11.5 6.13397C12.1667 6.51887 12.1667 7.48113 11.5 7.86603L1.75 13.4952C1.08333 13.8801 0.25 13.399 0.25 12.6292L0.25 1.37083C0.25 0.601035 1.08333 0.11991 1.75 0.50481L11.5 6.13397Z"/></svg>
                </div>
                Watch demo
              </button>
            </div>

            {/* Trust Avatars */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FDFBF7] bg-[#E9F3EB] overflow-hidden">
                    <Image src={`/images/hero-bg.jpg`} alt={`Avatar ${i}`} width={32} height={32} className="object-cover opacity-50" />
                  </div>
                ))}
              </div>
              <span className="text-[13px] text-[#153F2D]/70 font-medium">Trusted by 1,200+ donors & NGOs</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Floating UI Cards ── */}
          <div className="relative h-[640px] w-full max-w-[550px] ml-auto hidden lg:block">
            
            {/* Card 2: Live Map (Center Base) */}
            <div className="absolute top-[80px] left-[20px] w-[480px] h-[380px] bg-[#FDFBF7] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(21,63,45,0.08)] z-10 rotate-[2deg] overflow-hidden border border-[#153F2D]/5 p-6 flex items-center justify-center">
              {/* City Map Background */}
              <div className="absolute inset-0 z-0">
                {/* Secondary Roads */}
                <svg className="w-full h-full opacity-10" viewBox="0 0 480 380">
                  <path d="M 0 80 L 480 80 M 0 180 L 480 180 M 0 280 L 480 280" stroke="#153F2D" strokeWidth="2" />
                  <path d="M 120 0 L 120 380 M 240 0 L 240 380 M 360 0 L 360 380" stroke="#153F2D" strokeWidth="2" />
                  <path d="M 0 0 L 480 380 M 480 0 L 0 380" stroke="#153F2D" strokeWidth="1" />
                </svg>
                {/* City Blocks (Abstract) */}
                <div className="absolute top-[20px] left-[20px] w-[80px] h-[40px] bg-[#153F2D] opacity-[0.02] rounded-md" />
                <div className="absolute top-[100px] left-[140px] w-[80px] h-[60px] bg-[#153F2D] opacity-[0.03] rounded-md" />
                <div className="absolute top-[200px] left-[40px] w-[60px] h-[60px] bg-[#153F2D] opacity-[0.02] rounded-md" />
                <div className="absolute top-[40px] left-[260px] w-[100px] h-[40px] bg-[#153F2D] opacity-[0.02] rounded-md" />
                <div className="absolute top-[200px] left-[380px] w-[60px] h-[100px] bg-[#153F2D] opacity-[0.03] rounded-md" />
                <div className="absolute top-[280px] left-[260px] w-[80px] h-[40px] bg-[#5DB06D] opacity-[0.05] rounded-md" /> {/* Park */}
              </div>
              
              {/* Routing Path SVG - S-Curve */}
              <svg className="absolute inset-0 w-full h-full z-10 drop-shadow-md" viewBox="0 0 480 380">
                <path d="M 100 110 C 140 250, 260 210, 360 310" fill="none" stroke="#5DB06D" strokeWidth="5" strokeLinecap="round" strokeDasharray="12 12" />
                <path d="M 100 110 C 140 250, 200 230, 230 250" fill="none" stroke="#5DB06D" strokeWidth="5" strokeLinecap="round" />
              </svg>

              {/* Pin 1: Restaurant */}
              <div className="absolute top-[70px] left-[30px] bg-white rounded-[1.2rem] px-5 py-3 flex items-center gap-3 shadow-[0_12px_32px_-4px_rgba(21,63,45,0.12)] z-20">
                <div className="w-6 h-6 rounded-full bg-[#E9F3EB] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-[#153F2D] leading-tight mb-0.5 tracking-wide">Restaurant</p>
                  <p className="text-[11px] font-medium text-[#153F2D]/50 tracking-wide">2.4 km away</p>
                </div>
              </div>

              {/* Truck Marker */}
              <div className="absolute top-[220px] left-[210px] bg-[#2A2A2A] rounded-xl p-2.5 shadow-[0_16px_32px_-4px_rgba(0,0,0,0.3)] z-20 -rotate-[15deg]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
              </div>

              {/* Pin 2: Shelter Home */}
              <div className="absolute top-[290px] right-[50px] bg-white rounded-[1.2rem] px-5 py-3 flex items-center gap-3 shadow-[0_12px_32px_-4px_rgba(21,63,45,0.12)] z-20">
                <div className="w-6 h-6 rounded-full bg-[#E9F3EB] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-[#153F2D] leading-tight mb-0.5 tracking-wide">Shelter Home</p>
                  <p className="text-[11px] font-medium text-[#153F2D]/50 tracking-wide">ETA 18 min</p>
                </div>
              </div>
            </div>

            {/* Card 1: Available Surplus (Top Left) */}
            <div className="absolute top-[0px] left-[-190px] w-[250px] bg-white rounded-[2rem] p-5 shadow-[0_32px_64px_-12px_rgba(21,63,45,0.15)] z-30 border border-[#153F2D]/[0.03]">
              <p className="text-[13px] font-extrabold text-[#153F2D] mb-4 px-1 tracking-wide">Available Surplus</p>
              <div className="w-full h-[140px] rounded-2xl overflow-hidden mb-5 relative shadow-sm border border-[#153F2D]/5">
                <Image src="/images/cooked-meals.png" alt="Cooked Meals" fill className="object-cover" />
              </div>
              <div className="px-1">
                <h3 className="text-[17px] font-extrabold text-[#153F2D] mb-1.5 tracking-tight">Cooked Meals</h3>
                <p className="text-[12px] text-[#153F2D]/60 mb-5 font-medium tracking-wide">20 kg • Serves 80</p>
                <p className="text-[11px] text-[#153F2D]/50 mb-1 font-medium">Expires in</p>
                <p className="text-[16px] font-bold text-[#D9534F] mb-6 tracking-tight">2h 15m</p>
                <button className="w-full bg-[#5DB06D] text-white text-[14px] font-bold py-3.5 rounded-xl hover:bg-[#4A9E5C] transition-colors shadow-sm">
                  Donate Now
                </button>
              </div>
            </div>

            {/* Card 3: Delivery in progress (Top Right Stack) */}
            <div className="absolute top-[20px] right-[-30px] w-[250px] bg-white rounded-[2rem] p-6 shadow-[0_32px_64px_-12px_rgba(21,63,45,0.12)] z-30 border border-[#153F2D]/[0.03]">
              <p className="text-[14px] font-extrabold text-[#153F2D] mb-1 tracking-wide">Delivery in progress</p>
              <p className="text-[12px] text-[#153F2D]/50 mb-7 font-medium">Live tracking</p>
              
              <div className="relative w-full h-1.5 bg-[#E9F3EB] rounded-full mb-4">
                <div className="absolute top-0 left-0 w-[70%] h-full bg-[#153F2D] rounded-full shadow-sm" />
                <div className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 bg-white rounded-md p-1 shadow-md border border-[#153F2D]/10">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="#153F2D" stroke="#153F2D" strokeWidth="1"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
                </div>
                {/* Dots */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-[#5DB06D] border-[3px] border-white shadow-sm" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-[#153F2D] border-[3px] border-white shadow-sm" />
              </div>
              
              <p className="text-[13px] font-extrabold text-[#153F2D] text-center mb-3 mt-2">18 min</p>
              <p className="text-[11px] text-[#153F2D]/50 text-center font-medium tracking-wide">On time • Safe • Impactful</p>
            </div>

            {/* Card 4: Impact today (Bottom Right Stack) */}
            <div className="absolute top-[250px] right-[-30px] w-[250px] bg-white rounded-[2rem] p-7 shadow-[0_32px_64px_-12px_rgba(21,63,45,0.12)] z-30 border border-[#153F2D]/[0.03]">
              <p className="text-[14px] font-extrabold text-[#153F2D] mb-7 tracking-wide">Impact today</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span className="text-[12px] text-[#153F2D]/70 font-medium tracking-wide">Meals delivered</span>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#153F2D]">1,248</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239C12.4835 4.67139 13.914 4 15.5 4C18.5376 4 21 6.46243 21 9.5C21 16 12 21.5 12 21.5Z"/></svg>
                    <span className="text-[12px] text-[#153F2D]/70 font-medium tracking-wide">Food saved</span>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#153F2D]">312 kg</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5DB06D" strokeWidth="3"><circle cx="12" cy="12" r="9"/></svg>
                    <span className="text-[12px] text-[#153F2D]/70 font-medium tracking-wide">CO₂ avoided</span>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#153F2D]">783 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM FEATURE BAR ─── */}
      <div className="relative max-w-[1440px] mx-auto px-10 pb-16 z-30 mt-10">
        
        {/* Floating Circular Badge */}
        <div className="absolute top-[-70px] left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[#153F2D] rounded-full flex flex-col items-center justify-center border-[6px] border-[#FDFBF7] shadow-xl z-40">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="#5DB06D" className="mb-2"><path d="M12 2L15 8L21 9L16 14L18 20L12 17L6 20L8 14L3 9L9 8L12 2Z"/></svg>
           <span className="text-[12px] font-bold text-white uppercase tracking-wider mb-1">AI Powered</span>
           <span className="text-[9px] text-[#5DB06D] font-medium leading-relaxed text-center px-4">
             Real-time matching<br/>Expiry-aware routing
           </span>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="#5DB06D" className="mt-1 opacity-50"><path d="M12 2L15 8L21 9L16 14L18 20L12 17L6 20L8 14L3 9L9 8L12 2Z"/></svg>
        </div>

        {/* Dark Green Container */}
        <div className="bg-[#153F2D] rounded-[2.5rem] px-12 py-14 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239C12.4835 4.67139 13.914 4 15.5 4C18.5376 4 21 6.46243 21 9.5C21 16 12 21.5 12 21.5Z"/></svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-1">Reduce Waste</h3>
                <p className="text-[12px] text-white/60">Keep food out of landfills</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5DB06D"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-1">Fight Hunger</h3>
                <p className="text-[12px] text-white/60">Deliver meals to those in need</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5DB06D" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-1">Lower Emissions</h3>
                <p className="text-[12px] text-white/60">Fewer miles, lower impact</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5DB06D"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-1">Stronger Communities</h3>
                <p className="text-[12px] text-white/60">Together, we create change</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
