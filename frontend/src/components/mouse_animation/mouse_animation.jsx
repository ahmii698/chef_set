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

const getContainedRect = (img) => {
  const cw = img.clientWidth;
  const ch = img.clientHeight;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!cw || !ch || !nw || !nh) return { left: 0, top: 0, width: cw, height: ch };

  const containerRatio = cw / ch;
  const imageRatio = nw / nh;
  let renderWidth, renderHeight;
  if (imageRatio > containerRatio) {
    renderWidth = cw;
    renderHeight = cw / imageRatio;
  } else {
    renderHeight = ch;
    renderWidth = ch * imageRatio;
  }
  return {
    left: (cw - renderWidth) / 2,
    top: (ch - renderHeight) / 2,
    width: renderWidth,
    height: renderHeight,
  };
};

const MouseAnimation = ({ exploreHref = '/products' }) => {
  const wrapperRef = useRef(null);
  const knifeRef = useRef(null);
  const glowRef = useRef(null);
  const sheathWrapRef = useRef(null);
  const sheathImgRef = useRef(null);
  const sheathGlowRef = useRef(null);
  const sheathTargetRef = useRef(null);
  const debugDotRef = useRef(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef(null);

  // Testing ke liye true karo to red dot dikhega — tuning ke baad
  // wapis false kar dena.
  const DEBUG_RETRACT = false;

  // Sheath image ke andar (actual visible pixels ke against) target
  // point — X: left-right, Y: 0 = sheath ka top (opening).
  const SHEATH_TARGET_X_RATIO = 0.42;
  const SHEATH_TARGET_Y_RATIO = 0.12;

  // Retract ke end pe knife ki HEIGHT kitni chhoti ho — bohot chhoti
  // (0.3) to "gayab" jaisi lagti hai, bohot badi (0.8+) to sheath ke
  // opening se wider ho ke side se poke karti hai.
  const RETRACT_END_SCALE_Y = 0.55;

  // Retract ke end pe knife ki WIDTH kitni chhoti/badi ho — height se
  // alag isliye rakha hai taake end pe blade thori chaurhi/thick
  // dikhe (jaisa maanga gaya tha), height chhoti hi rahe.
  // 1.0 = original width, isse zyada = width badhegi.
  const RETRACT_END_SCALE_X = 0.75;

  // Knife ko target se thoda upar/neeche shift karne ke liye (px).
  // 0 = pure target-point-match. Zaroorat par hi chhote steps (20-30)
  // mein tune karna, warna blade aur sheath ke beech gap ban jata hai.
  const HANDLE_PEEK_OFFSET = 0;

  // Knife ko end pe left/right shift karne ke liye (px).
  // Negative = left, positive = right. Sirf retract phase mein apply
  // hota hai taake knife sheath ke mid mein aa kar settle ho.
  // -20 confirm ho chuka hai ke sahi position deta hai.
  const RETRACT_X_OFFSET = -20;

  const retractTarget = useRef({ dx: 0, dy: 0 });

  useEffect(() => {
    const positionSheathTarget = () => {
      if (!sheathImgRef.current || !sheathTargetRef.current) return;
      const img = sheathImgRef.current;
      if (!img.naturalWidth) return false;

      const rect = getContainedRect(img);
      sheathTargetRef.current.style.left = `${rect.left + rect.width * SHEATH_TARGET_X_RATIO}px`;
      sheathTargetRef.current.style.top = `${rect.top + rect.height * SHEATH_TARGET_Y_RATIO}px`;
      return true;
    };

    const measureRetractTarget = () => {
      if (!knifeRef.current || !sheathWrapRef.current || !sheathTargetRef.current) return;
      positionSheathTarget();

      const knife = knifeRef.current;
      const sheath = sheathWrapRef.current;

      const knifePrevTransform = knife.style.transform;
      const knifePrevOpacity = knife.style.opacity;
      const sheathPrevTransform = sheath.style.transform;
      const sheathPrevOpacity = sheath.style.opacity;

      knife.style.opacity = '1';
      knife.style.transform = 'translateX(-50%) translateY(45px) rotate(4deg) scale(1)';

      sheath.style.opacity = '1';
      sheath.style.transform = 'rotate(-14deg) translateY(0px)';

      void knife.offsetWidth;

      const knifeRect = knife.getBoundingClientRect();
      const knifeCenterX = knifeRect.left + knifeRect.width / 2;
      const knifeCenterY = knifeRect.top + knifeRect.height / 2;

      const targetRect = sheathTargetRef.current.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      retractTarget.current = {
        dx: targetX - knifeCenterX,
        dy: targetY - knifeCenterY,
      };

      if (DEBUG_RETRACT && debugDotRef.current) {
        debugDotRef.current.style.left = `${targetX}px`;
        debugDotRef.current.style.top = `${targetY}px`;
        debugDotRef.current.style.display = 'block';
      }

      knife.style.transform = knifePrevTransform;
      knife.style.opacity = knifePrevOpacity;
      sheath.style.transform = sheathPrevTransform;
      sheath.style.opacity = sheathPrevOpacity;
    };

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
      // SEQUENCE:
      // 1) sheathIn (p 0    -> 0.30): sheath neeche se upar apni jagah tak aata hai + fade in.
      // 2) fallIn   (p 0.05 -> 0.38): knife upar se gir kar hover position tak aati hai, fade in.
      // 3) hold     (p 0.38 -> 0.66): halka sa neeche drift, stable/visible rehti hai.
      // 4) retract  (p 0.66 -> 1.00): knife measured target (sheath ke andar) tak slide
      //    karti hai, height chhoti ho jati hai lekin width thori chaurhi
      //    rehti/hoti hai. Ab fade-out NAHI hoti — sirf sheath ke peeche
      //    chup jati hai jahan overlap hota hai, handle upar dikhta rehta hai.

      if (sheathWrapRef.current) {
        const sheathIn = smoothstep(mapRange(p, 0, 0.30, 0, 1));
        const sheathY = lerp(200, 0, sheathIn);
        sheathWrapRef.current.style.opacity = sheathIn;
        sheathWrapRef.current.style.transform = `rotate(-14deg) translateY(${sheathY}px)`;
      }

      if (knifeRef.current) {
        const fallIn = smoothstep(mapRange(p, 0.05, 0.38, 0, 1));
        const hold = smoothstep(mapRange(p, 0.38, 0.66, 0, 1));
        const retract = smoothstep(mapRange(p, 0.66, 1, 0, 1));

        const baseY = lerp(-680, 30, fallIn);
        const holdDrift = hold * 15;
        const retractY = retract * retractTarget.current.dy;
        const handlePeek = retract * HANDLE_PEEK_OFFSET;
        const translateY = baseY + holdDrift + retractY + handlePeek;
        const translateX = retract * retractTarget.current.dx + retract * RETRACT_X_OFFSET;

        const holdRotate = lerp(-38, 0, fallIn) + hold * 4;
        const rotate = lerp(holdRotate, -14, retract);

        const scaleX = lerp(1, RETRACT_END_SCALE_X, retract);
        const scaleY = lerp(1, RETRACT_END_SCALE_Y, retract);

        const fadeIn = mapRange(p, 0.05, 0.38, 0, 1);
        knifeRef.current.style.opacity = fadeIn;
        knifeRef.current.style.transform =
          `translateX(-50%) translateY(${translateY}px) translateX(${translateX}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
      }

      if (sheathGlowRef.current) {
        const glow =
          mapRange(p, 0.70, 0.85, 0, 1) * (1 - mapRange(p, 0.90, 1, 0, 1));
        sheathGlowRef.current.style.opacity = glow * 0.75;
      }

      if (glowRef.current) {
        const t = mapRange(p, 0, 0.6, 0.05, 0.24);
        glowRef.current.style.opacity = t;
      }
    };

    const tick = () => {
      currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.065);
      applyStyles(currentProgress.current);
      rafId.current = requestAnimationFrame(tick);
    };

    const onScroll = () => computeProgress();
    const onResize = () => {
      measureRetractTarget();
      computeProgress();
    };

    // Image load hone ka wait karo (naturalWidth chahiye hota hai
    // getContainedRect ke liye), warna measurement galat aayega.
    const tryMeasure = () => {
      const ok = positionSheathTarget();
      if (ok) {
        measureRetractTarget();
      } else {
        requestAnimationFrame(tryMeasure);
      }
    };

    tryMeasure();
    computeProgress();
    applyStyles(currentProgress.current);
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
          <div className="animation-heading">
            <p className="eyebrow">CRAFTED FOR THE KITCHEN</p>

            <div className="eyebrow-divider">
              <span className="divider-line"></span>
              <span className="divider-dot"></span>
              <span className="divider-line"></span>
            </div>

            <h2>
              Precision in
              <br />
              <span className="accent-italic">Every Cut.</span>
            </h2>

            <p className="heading-subtitle">
              High quality tools designed for chefs who demand the best.
              Built for performance, crafted for perfection.
            </p>

            <div className="feature-grid">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h4>Premium Quality</h4>
                <p>Made from superior materials for long lasting use.</p>
              </div>

              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 20L15 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M13 5l6 6-2.2 2.2c-2.4 2.4-4.8 1.6-6-.4L13 5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M4 20l2.4-.6.6-2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h4>Sharp. Durable. Reliable.</h4>
                <p>Engineered for precision and built to stay sharp longer.</p>
              </div>

              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 21h10M9 21v-5h6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 9a3 3 0 013-3.4 3 3 0 015.9-.7A3 3 0 0118 9c0 3.3-2.2 5.8-6 6-3.8-.2-6-2.7-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                <h4>Chef Approved</h4>
                <p>Trusted by professionals in kitchens around the world.</p>
              </div>

              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                <h4>Elegant Design</h4>
                <p>Perfect balance of performance and style.</p>
              </div>
            </div>

            <a className="explore-btn" href={exploreHref}>
              EXPLORE COLLECTION <span className="btn-arrow">→</span>
            </a>
          </div>

          <div className="knife-stage">
            <div className="sheath-wrap" ref={sheathWrapRef}>
              <div className="sheath-glow" ref={sheathGlowRef}></div>
              <img
                src="/images/sheath.png"
                alt="Sheath"
                className="sheath-svg"
                ref={sheathImgRef}
              />
              <div className="sheath-target" ref={sheathTargetRef}></div>
            </div>

            <img
              src="/images/animate.png"
              alt="Knife"
              className="knife-svg"
              ref={knifeRef}
            />
          </div>
        </div>
      </div>

      {DEBUG_RETRACT && (
        <div
          ref={debugDotRef}
          style={{
            position: 'fixed',
            width: 10,
            height: 10,
            background: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            display: 'none',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default MouseAnimation;