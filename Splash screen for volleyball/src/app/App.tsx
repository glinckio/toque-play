import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import centerLogo from "../imports/ChatGPT_Image_10_de_jun._de_2026__16_23_42.png";

// Clean white-tile version of the TP monogram, inspired by the brand sheet's
// "APLICAÇÕES — light" variant: white rounded square with purple TP + play triangle
// and the small volleyball-net curves at the lower-right corner.
function BrandMarkOnLight({ size = 140 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: "linear-gradient(160deg, #ffffff 0%, #f1e8fb 100%)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45), inset 0 -2px 0 rgba(0,0,0,0.04)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="tp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AD3" />
            <stop offset="100%" stopColor="#5320A0" />
          </linearGradient>
        </defs>

        {/* Letter T — thick crossbar + stem */}
        <path d="M14 18 H 56 V 30 H 42 V 82 H 28 V 30 H 14 Z" fill="url(#tp-fill)" />

        {/* Letter P — stem + bowl */}
        <path
          d="M50 18 H 70 C 84 18, 90 28, 90 40 C 90 52, 84 60, 70 60 H 60 V 82 H 50 Z M 60 30 V 50 H 70 C 76 50, 80 46, 80 40 C 80 34, 76 30, 70 30 Z"
          fill="url(#tp-fill)"
        />

        {/* Play triangle inside the P bowl */}
        <path d="M64 34 L 76 40 L 64 46 Z" fill="#ffffff" />

        {/* Volleyball-net curves at lower-right */}
        <g stroke="url(#tp-fill)" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M52 86 C 62 78, 74 76, 86 80" />
          <path d="M58 92 C 68 84, 80 82, 92 86" opacity="0.7" />
          <path d="M70 96 C 78 90, 86 88, 94 90" opacity="0.45" />
        </g>
      </svg>
    </div>
  );
}

const PRIMARY = "#6D2EC0";

function StatusBar() {
  return (
    <div className="flex h-[48px] items-center justify-between pl-[35px] pr-[16px] py-[16px] w-full">
      <p style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontWeight: 500 }} className="text-[#150000] text-[14px]">
        9:41
      </p>
      <div className="flex gap-[6px] items-center text-[#150000]">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.5"/><rect x="5" y="4" width="3" height="6" rx="0.5"/><rect x="10" y="2" width="3" height="8" rx="0.5"/><rect x="15" y="0" width="3" height="10" rx="0.5"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2C5 2 2.5 3 0.5 4.5L2 6C3.5 4.8 5.6 4 8 4C10.4 4 12.5 4.8 14 6L15.5 4.5C13.5 3 11 2 8 2ZM8 6C6.3 6 4.7 6.6 3.5 7.5L5 9C5.8 8.4 6.9 8 8 8C9.1 8 10.2 8.4 11 9L12.5 7.5C11.3 6.6 9.7 6 8 6ZM8 10C7.2 10 6.5 10.3 6 10.8L8 12L10 10.8C9.5 10.3 8.8 10 8 10Z"/></svg>
        <div className="relative w-[24px] h-[12px]">
          <div className="absolute inset-0 border border-[#150000]/40 rounded-[3px]"/>
          <div className="absolute left-[1.5px] top-[1.5px] bottom-[1.5px] w-[17px] bg-[#150000] rounded-[1.5px]"/>
          <div className="absolute right-[-2px] top-[3.5px] w-[1.5px] h-[5px] bg-[#150000]/40 rounded-r-sm"/>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-[7px] px-[16px] py-[8px]">
      <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
        <circle cx="14" cy="12" r="11" stroke={PRIMARY} strokeWidth="2.2" fill="none"/>
        <path d="M14 1 C 8 7, 8 17, 14 23" stroke={PRIMARY} strokeWidth="2.2" fill="none"/>
        <path d="M14 1 C 20 7, 20 17, 14 23" stroke={PRIMARY} strokeWidth="2.2" fill="none"/>
        <path d="M3 12 H 25" stroke={PRIMARY} strokeWidth="2.2" fill="none"/>
      </svg>
      <p
        className="text-[#150000] text-[21px] uppercase"
        style={{ fontFamily: "'Azeret Mono', monospace", fontWeight: 600, letterSpacing: "-0.5px" }}
      >
        Toqueplay
      </p>
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="size-full flex items-center justify-center bg-neutral-200 min-h-screen p-4">
      <div className="relative w-[390px] h-[844px] bg-white overflow-hidden shadow-2xl rounded-[40px] flex flex-col">
        <StatusBar />
        <Logo />
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", color: PRIMARY }} className="text-[40px] leading-none">
            Welcome back
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif" }} className="text-[15px] text-neutral-600 text-center -mt-3">
            Sign in to keep following every match
          </p>
          <div className="w-full flex flex-col gap-3 mt-4">
            <input placeholder="Email" className="h-12 px-4 rounded-xl border border-neutral-200 outline-none focus:border-[#6D2EC0]" style={{ fontFamily: "'Manrope', sans-serif" }} />
            <input placeholder="Password" type="password" className="h-12 px-4 rounded-xl border border-neutral-200 outline-none focus:border-[#6D2EC0]" style={{ fontFamily: "'Manrope', sans-serif" }} />
            <button className="h-12 rounded-xl text-white mt-2" style={{ backgroundColor: PRIMARY, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplashScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="size-full flex items-center justify-center bg-neutral-200 min-h-screen p-4">
      <div
        className="relative w-[390px] h-[844px] bg-[#fafafa] overflow-hidden shadow-2xl rounded-[40px] cursor-pointer"
        onClick={onContinue}
      >
        {/* Purple blob behind the image */}
        <div className="absolute -top-10 -right-10 w-[460px] h-[500px] pointer-events-none">
          <svg viewBox="0 0 460 500" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M230 0 C 360 20, 460 90, 450 240 C 440 360, 360 460, 230 470 C 110 480, 20 380, 30 240 C 40 110, 110 -10, 230 0 Z"
              fill={PRIMARY}
            />
          </svg>
        </div>

        {/* Volleyball hero image */}
        <div className="absolute top-[10px] left-0 w-full h-[520px] overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1686753767715-37cb0c34212c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Volleyball player reaching for the ball"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Status + logo overlay */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <StatusBar />
          <Logo />
        </div>

        {/* Heading + description */}
        <div className="absolute left-[17px] top-[500px] w-[327px] text-[#150000]">
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: "0.95" }} className="text-[64px]">
            own every point on the court
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif" }} className="text-[16px] mt-3">
            Watch matches live or highlights, follow every spike, set and block from your smartphone
          </p>
        </div>

        {/* Tap to continue */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ backgroundColor: PRIMARY }} />
            <span className="w-2 h-2 rounded-full animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" style={{ backgroundColor: PRIMARY }} />
            <span className="w-2 h-2 rounded-full animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" style={{ backgroundColor: PRIMARY }} />
          </div>
          <p
            className="text-[#150000]/60"
            style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, letterSpacing: 1 }}
          >
            TAP TO CONTINUE
          </p>
        </div>
      </div>
    </div>
  );
}

const LOADER_PHOTOS = [
  "https://images.unsplash.com/photo-1686753767715-37cb0c34212c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  "https://images.unsplash.com/photo-1601512986351-9b0e01780eef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  "https://images.unsplash.com/photo-1706206817521-6d74effeb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
];

function VolleyballBall({ size = 88 }: { size?: number }) {
  const id = `vb-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`${id}-body`} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f6f1fb" />
          <stop offset="100%" stopColor="#b89ad8" />
        </radialGradient>
        <radialGradient id={`${id}-spec`} cx="32%" cy="25%" r="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>

      {/* Ball body */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-body)`} />

      {/* Panels — 3 pairs of curved seams that meet at top and bottom poles */}
      <g clipPath={`url(#${id}-clip)`} stroke={PRIMARY} strokeWidth="1.6" fill="none" strokeLinecap="round">
        {/* Pair 1 — left-leaning */}
        <path d="M50 3 C 18 22, 18 78, 50 97" />
        <path d="M50 3 C 30 22, 30 78, 50 97" />
        {/* Pair 2 — right-leaning */}
        <path d="M50 3 C 82 22, 82 78, 50 97" />
        <path d="M50 3 C 70 22, 70 78, 50 97" />
        {/* Pair 3 — horizontal-ish arcs across the ball (front face) */}
        <path d="M3 50 C 22 18, 78 18, 97 50" />
        <path d="M3 50 C 22 30, 78 30, 97 50" />
        {/* Pair 3 mirrored below */}
        <path d="M3 50 C 22 82, 78 82, 97 50" opacity="0.25" />
        <path d="M3 50 C 22 70, 78 70, 97 50" opacity="0.25" />
      </g>

      {/* Highlight */}
      <ellipse cx="36" cy="32" rx="18" ry="11" fill={`url(#${id}-spec)`} />

      {/* Outer rim shading */}
      <circle cx="50" cy="50" r="47" fill="none" stroke={PRIMARY} strokeWidth="2" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="black" strokeOpacity="0.12" strokeWidth="1.5" />
    </svg>
  );
}

function AppLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 3000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Deterministic floating particles
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: (i * 53) % 100,
    y: (i * 71) % 100,
    size: 1 + ((i * 7) % 3),
    delay: (i % 8) * 0.25,
    duration: 4 + (i % 5),
  }));

  // Concentric "shockwave" rings
  const rings = [0, 0.4, 0.8];

  return (
    <div className="size-full flex items-center justify-center bg-neutral-200 min-h-screen p-4">
      <div
        className="relative w-[390px] h-[844px] overflow-hidden shadow-2xl rounded-[40px]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 35%, #2a0a55 0%, #150428 55%, #08030f 100%)",
        }}
      >
        {/* Subtle vignette + grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 35%, transparent 40%, rgba(0,0,0,.7) 100%)",
          }}
        />

        {/* Stadium spotlight cone from top */}
        

        {/* Animated court lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 390 844"
          preserveAspectRatio="none"
        >
          {/* Net line */}
          <motion.line
            x1="0"
            y1="422"
            x2="390"
            y2="422"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="3 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
          />
          {/* Perspective court trapezoid */}
          <motion.path
            d="M 60 760 L 330 760 L 280 540 L 110 540 Z"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.4, ease: "easeOut" }}
          />
          <motion.line
            x1="195"
            y1="540"
            x2="195"
            y2="760"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          />

          {/* Signature streak that crosses the screen */}
          <motion.path
            d="M -50 730 Q 130 200 460 60"
            stroke="url(#streakGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 10"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.9, 0.5] }}
            transition={{ duration: 2.6, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="streakGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#6D2EC0" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#B47CFF" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              filter: "blur(0.3px)",
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [-10, -40, -70] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Status bar (just the clock for splash feel) */}
        <div className="absolute top-0 left-0 right-0 z-20 flex h-[48px] items-center justify-between pl-[35px] pr-[16px] py-[16px] text-white/80">
          <p style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }} className="text-[14px]">
            9:41
          </p>
        </div>

        {/* Center logo with shockwave rings + shimmer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-10 text-center gap-10">
          <div className="relative" style={{ width: 240, height: 240 }}>
            {/* Shockwave rings */}
            {rings.map((delay, idx) => (
              <motion.span
                key={idx}
                className="absolute inset-0 m-auto rounded-full border"
                style={{ borderColor: "rgba(180,124,255,0.45)", width: 240, height: 240 }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.4], opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2.6,
                  delay: 0.4 + delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Logo */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.3, type: "spring", stiffness: 130, damping: 14 }}
            >
              <div
                className="relative"
                style={{
                  filter:
                    "drop-shadow(0 0 24px rgba(180,124,255,0.55)) drop-shadow(0 12px 40px rgba(0,0,0,0.55))",
                }}
              >
                <img src={centerLogo} alt="Toqueplay" className="w-[170px] h-auto" />
                {/* Shimmer sweep across the logo */}
                
              </div>
            </motion.div>
          </div>

          {/* Tagline with animated separators */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex items-center gap-3 text-white/90 uppercase"
            style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: 4 }}
          >
            <span>Every Spike</span>
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#B47CFF]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span>Every Set</span>
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#B47CFF]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
            />
            <span>Every Block</span>
          </motion.div>
        </div>

        {/* Segmented progress at bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-16 left-0 right-0 z-20 px-14 flex flex-col items-center gap-4"
        >
          <div className="flex gap-1.5 w-full">
            {Array.from({ length: 8 }).map((_, i) => {
              const segStart = i / 8;
              const fill = Math.max(0, Math.min(1, (progress - segStart) * 8));
              return (
                <div key={i} className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${fill * 100}%`,
                      background:
                        "linear-gradient(90deg, #6D2EC0 0%, #B47CFF 100%)",
                      boxShadow: "0 0 10px rgba(180,124,255,0.7)",
                      transition: "width 80ms linear",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <p
            className="text-white/50"
            style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: 3 }}
          >
            ENTRANDO EM QUADRA…
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  if (loading) return <AppLoader />;
  return showSplash ? <SplashScreen onContinue={() => setShowSplash(false)} /> : <LoginScreen />;
}
