// src/components/mouse_animation/mouse_animation.jsx
import React, { useEffect, useRef } from 'react';
import './mouse_animation.css';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

const SLICE_PARAMS = [
  { dx: -260, dy: -110, spin: -200, delay: 0.00, size: 1.05, top: '20%' },
  { dx: 230,  dy: 130,  spin: 180,  delay: 0.02, size: 0.95, top: '26%' },
  { dx: -300, dy: -160, spin: -230, delay: 0.05, size: 0.9,  top: '32%' },
  { dx: 280,  dy: 150,  spin: 210,  delay: 0.03, size: 1.0,  top: '38%' },
  { dx: -220, dy: -200, spin: -160, delay: 0.07, size: 0.85, top: '44%' },
  { dx: 260,  dy: 190,  spin: 200,  delay: 0.045,size: 0.92, top: '50%' },
  { dx: -280, dy: -230, spin: -220, delay: 0.09, size: 0.8,  top: '56%' },
  { dx: 240,  dy: 220,  spin: 170,  delay: 0.06, size: 0.88, top: '62%' },
  { dx: -200, dy: -250, spin: -190, delay: 0.11, size: 0.78, top: '68%' },
  { dx: 300,  dy: 260,  spin: 230,  delay: 0.08, size: 0.83, top: '74%' },
  { dx: -250, dy: -280, spin: -210, delay: 0.13, size: 0.75, top: '80%' },
  { dx: 210,  dy: 270,  spin: 190,  delay: 0.10, size: 0.8,  top: '86%' },
];

const LEAF_PARAMS = [
  { dx: -130, dy: -170, spin: -160, delay: 0.00, size: 0.95, color: '#1a5c28' },
  { dx: 110,  dy: -190, spin: 150,  delay: 0.02, size: 0.85, color: '#2d8a3e' },
  { dx: -160, dy: -110, spin: -140, delay: 0.04, size: 0.8,  color: '#2d8a3e' },
  { dx: 150,  dy: -140, spin: 170,  delay: 0.03, size: 0.9,  color: '#1a5c28' },
  { dx: -90,  dy: -220, spin: -120, delay: 0.06, size: 0.72, color: '#1a5c28' },
  { dx: 100,  dy: -230, spin: 130,  delay: 0.05, size: 0.78, color: '#2d8a3e' },
];

const MouseAnimation = () => {
  const wrapperRef = useRef(null);
  const headingRef = useRef(null);
  const knifeRef = useRef(null);
  const wholeCarrotRef = useRef(null);
  const slicesWrapRef = useRef(null);
  const leafSlicesWrapRef = useRef(null);
  const lineTopRef = useRef(null);
  const lineBottomRef = useRef(null);
  const glowRef = useRef(null);
  const boardShadowRef = useRef(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const computeProgress = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) {
        targetProgress.current = 0;
        return;
      }
      const scrolled = -rect.top;
      targetProgress.current = clamp(scrolled / scrollableDistance, 0, 1);
    };

    const applyStyles = (p) => {
      // KNIFE — sirf EK descend mapping (p: 0.05 -> 0.30). Uske baad
      // knife wahi "neeche" position pe permanently reh jaati hai
      // (koi auto-retract nahi) jab tak p wapas 0.30 se neeche na jaye.
      // Yani: scroll down pe chaku neeche jaake ruk jaati hai (correct),
      // aur sirf scroll UP karne pe — jab p 0.30 se kam ho — chaku
      // wapas upar jaati hai. Chunke pura system p ka pure function hai,
      // ye reverse pe apne aap sahi order mein hoga: pehle carrot ke
      // pieces judte hain (p: 1 -> 0.30), phir chaku upar jaati hai
      // (p: 0.30 -> 0.05).
      if (knifeRef.current) {
        // Phase 1 — quick initial cut descend (upar se cut point tak)
        const down1 = smoothstep(mapRange(p, 0.05, 0.28, 0, 1));
        // Phase 2 — continued SLOW drift neeche, poore scatter-range ke
        // sath overlap karta hua (0.28 -> 0.88). Isse chaku kabhi bhi
        // "stuck/wait" nahi lagti — wo hamesha thodi thodi move karti
        // rehti hai jab tak pieces bikharte/judte hain. Chunke ye p ka
        // pure function hai, reverse scroll pe yehi range chaku ko
        // carrot ke reassemble hone ke EXACT sath-sath upar le jayega.
        const down2 = smoothstep(mapRange(p, 0.28, 0.88, 0, 1));
        const translateY = lerp(-230, 106, down1) + down2 * 42;
        const rotate = down1 * 20 + down2 * 7;
        const fadeIn = mapRange(p, 0, 0.08, 0, 1);
        knifeRef.current.style.opacity = fadeIn;
        knifeRef.current.style.transform =
          `translateX(-50%) translateY(${translateY}px) rotate(${rotate}deg)`;
      }

      // Cutting board contact shadow — knife jab exactly touch kare (p ~0.30) tab punch
      if (boardShadowRef.current) {
        const hit = mapRange(p, 0.24, 0.30, 0, 1) * (1 - mapRange(p, 0.34, 0.42, 0, 1));
        boardShadowRef.current.style.opacity = 0.25 + hit * 0.35;
        boardShadowRef.current.style.transform = `translateX(-50%) scale(${1 + hit * 0.12})`;
      }

      // Whole carrot (realistic image) — page load pe fully visible,
      // knife jab pohanche (p ~0.30) tab vanish ho jaati hai
      const appear = mapRange(p, 0, 0.05, 0.92, 1);
      const vanish = mapRange(p, 0.28, 0.34, 0, 1);
      const wholeOpacity = appear * (1 - vanish);
      if (wholeCarrotRef.current) {
        wholeCarrotRef.current.style.opacity = wholeOpacity;
        wholeCarrotRef.current.style.transform =
          `translateY(${(1 - appear) * 30}px) scale(${0.94 + appear * 0.06})`;
      }

      // Slice flash lines — cut ke exact moment pe flash
      const flash = mapRange(p, 0.27, 0.31, 0, 1) * (1 - mapRange(p, 0.34, 0.40, 0, 1));
      if (lineTopRef.current) {
        lineTopRef.current.style.width = `${40 + flash * 90}px`;
        lineTopRef.current.style.opacity = flash;
      }
      if (lineBottomRef.current) {
        lineBottomRef.current.style.width = `${40 + flash * 90}px`;
        lineBottomRef.current.style.opacity = flash;
      }

      // Carrot slices — knife pohanchne ke baad hi bikharna shuru hote hain,
      // aur reverse scroll pe yahi range unhe wapas jodta hai (carrot "band" hona)
      if (slicesWrapRef.current) {
        const children = slicesWrapRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          const cfg = SLICE_PARAMS[i];
          const raw = mapRange(p, 0.32 + cfg.delay, 0.82 + cfg.delay, 0, 1);
          const s = smoothstep(raw);
          const fadeIn = mapRange(p, 0.28 + cfg.delay, 0.34 + cfg.delay, 0, 1);
          const fadeSoften = mapRange(p, 0.88 + cfg.delay, 1, 1, 0.82);
          const x = cfg.dx * s;
          const y = cfg.dy * s;
          const rot = cfg.spin * s;
          const scale = cfg.size * (0.65 + s * 0.35);
          el.style.opacity = fadeIn * fadeSoften;
          el.style.transform =
            `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
        }
      }

      // Leaf slices — carrot slices se thoda pehle scatter/reassemble hote hain
      if (leafSlicesWrapRef.current) {
        const children = leafSlicesWrapRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          const cfg = LEAF_PARAMS[i];
          const raw = mapRange(p, 0.24 + cfg.delay, 0.70 + cfg.delay, 0, 1);
          const s = smoothstep(raw);
          const fadeIn = mapRange(p, 0.20 + cfg.delay, 0.26 + cfg.delay, 0, 1);
          const fadeSoften = mapRange(p, 0.80 + cfg.delay, 1, 1, 0.8);
          const x = cfg.dx * s;
          const y = cfg.dy * s;
          const rot = cfg.spin * s;
          const scale = cfg.size * (0.6 + s * 0.4);
          el.style.opacity = fadeIn * fadeSoften;
          el.style.transform =
            `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
        }
      }

      // Ambient glow warmth
      if (glowRef.current) {
        const t = mapRange(p, 0, 0.6, 0.06, 0.24);
        glowRef.current.style.opacity = t;
      }
    };

    const tick = () => {
      currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.065);
      applyStyles(currentProgress.current);
      rafId.current = requestAnimationFrame(tick);
    };

    const onScroll = () => computeProgress();
    const onResize = () => computeProgress();

    computeProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="scroll-wrapper" ref={wrapperRef}>
      <div className="sticky-stage">
        <div className="ambient-glow" ref={glowRef}></div>

        <div className="content-row">
          <div className="animation-heading" ref={headingRef}>
            <p className="eyebrow">CRAFTED FOR THE KITCHEN</p>
            <h2>Precision in Every Cut.</h2>
            <p className="heading-subtitle">
              Premium tools for chefs who value perfection.
            </p>
          </div>

          <div className="carrot-stage">
            <div className="board-shadow" ref={boardShadowRef}></div>

            <img
              className="knife-svg"
              ref={knifeRef}
              src="/images/animate.png"
              alt="Chef's knife"
            />

            <div className="whole-carrot" ref={wholeCarrotRef}>
              <img className="carrot-real-img" src="/images/carrottt.png" alt="Fresh carrot" />
              <div className="slice-line line-top" ref={lineTopRef}></div>
              <div className="slice-line line-bottom" ref={lineBottomRef}></div>
            </div>

            <div className="carrot-slices-wrap" ref={slicesWrapRef}>
              {SLICE_PARAMS.map((cfg, i) => (
                <svg
                  key={i}
                  className="carrot-slice"
                  style={{ top: cfg.top }}
                  viewBox="0 0 60 60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id={`sliceOuter${i}`} cx="42%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#ff9a5e" />
                      <stop offset="60%" stopColor="#f1651f" />
                      <stop offset="100%" stopColor="#c1440c" />
                    </radialGradient>
                    <radialGradient id={`sliceInner${i}`} cx="42%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#ffd9ad" />
                      <stop offset="70%" stopColor="#ffb578" />
                      <stop offset="100%" stopColor="#f0854a" />
                    </radialGradient>
                  </defs>
                  <circle cx="30" cy="30" r="28" fill={`url(#sliceOuter${i})`} stroke="#a83a0c" strokeWidth="0.8" />
                  <circle cx="30" cy="30" r="19" fill={`url(#sliceInner${i})`} />
                  <circle cx="30" cy="30" r="19" fill="none" stroke="#e0834a" strokeWidth="0.6" opacity="0.6" />
                  <circle cx="30" cy="30" r="11" fill="none" stroke="#e0834a" strokeWidth="0.5" opacity="0.5" />
                  <circle cx="30" cy="30" r="4.5" fill="#8a4420" opacity="0.55" />
                </svg>
              ))}
            </div>

            <div className="leaf-slices-wrap" ref={leafSlicesWrapRef}>
              {LEAF_PARAMS.map((cfg, i) => (
                <svg
                  key={i}
                  className="leaf-slice"
                  viewBox="0 0 30 34"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 34 C4 24, 6 8, 15 0 C20 10, 19 24, 15 34 Z"
                    fill={cfg.color}
                  />
                  <path
                    d="M15 2 L15 30"
                    stroke="#0d3a17"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MouseAnimation;