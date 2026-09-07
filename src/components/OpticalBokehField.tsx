import React, { useEffect, useRef } from "react";

interface BokehOrb {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  phaseSpeed: number;
  driftRangeX: number;
  driftRangeY: number;
}

interface SilverHalideParticle {
  x: number;
  y: number;
  z: number; // 0.2 (far) ~ 1.8 (near)
  baseRadius: number;
  alpha: number;
  vx: number;
  vy: number;
  trail: number;
}

export const OpticalBokehField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // 检查用户系统是否设置了减弱动画
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 状态量：滚动速度与阻尼
    let lastScrollY = window.scrollY;
    let targetVelocity = 0;
    let currentVelocity = 0;
    let lastScrollTime = performance.now();

    // 鼠标/触控交互
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;

    // 色谱定义：琥珀金、北国冷青、暗房深红、月白柔光、深海靛蓝
    const colors = [
      "rgba(245, 158, 11, ", // 琥珀暖金 (Leica/钨丝灯)
      "rgba(56, 189, 248, ", // 北国冷青 (哈工大霜雪/极夜)
      "rgba(239, 68, 68, ",  // 暗室深红 (Kodak/安全灯)
      "rgba(244, 244, 241, ", // 月白微光
      "rgba(99, 102, 241, ",  // 深空靛蓝
    ];

    let orbs: BokehOrb[] = [];
    let particles: SilverHalideParticle[] = [];

    // 初始化光斑群
    const initOrbs = (w: number, h: number) => {
      orbs = [
        {
          baseX: w * 0.2,
          baseY: h * 0.25,
          x: w * 0.2,
          y: h * 0.25,
          radius: Math.min(w, h) * 0.28,
          color: colors[0],
          phase: 0,
          phaseSpeed: 0.0006,
          driftRangeX: w * 0.08,
          driftRangeY: h * 0.06,
        },
        {
          baseX: w * 0.82,
          baseY: h * 0.2,
          x: w * 0.82,
          y: h * 0.2,
          radius: Math.min(w, h) * 0.32,
          color: colors[1],
          phase: 2.1,
          phaseSpeed: 0.0005,
          driftRangeX: w * 0.06,
          driftRangeY: h * 0.08,
        },
        {
          baseX: w * 0.5,
          baseY: h * 0.55,
          x: w * 0.5,
          y: h * 0.55,
          radius: Math.min(w, h) * 0.38,
          color: colors[2],
          phase: 4.2,
          phaseSpeed: 0.0004,
          driftRangeX: w * 0.07,
          driftRangeY: h * 0.07,
        },
        {
          baseX: w * 0.15,
          baseY: h * 0.8,
          x: w * 0.15,
          y: h * 0.8,
          radius: Math.min(w, h) * 0.3,
          color: colors[3],
          phase: 1.2,
          phaseSpeed: 0.0007,
          driftRangeX: w * 0.09,
          driftRangeY: h * 0.05,
        },
        {
          baseX: w * 0.85,
          baseY: h * 0.78,
          x: w * 0.85,
          y: h * 0.78,
          radius: Math.min(w, h) * 0.34,
          color: colors[4],
          phase: 3.5,
          phaseSpeed: 0.0005,
          driftRangeX: w * 0.08,
          driftRangeY: h * 0.09,
        },
      ];
    };

    // 初始化银盐悬浮粒子
    const initParticles = (w: number, h: number) => {
      const count = Math.min(Math.floor((w * h) / 9000), 160);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.3 + Math.random() * 1.4, // 景深
          baseRadius: 0.8 + Math.random() * 1.6,
          alpha: 0.15 + Math.random() * 0.6,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.1, // 微弱自然上浮
          trail: 0,
        });
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // 限制 DPR 最高为 1.5，避免高刷 Retina 屏算力过载发热
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initOrbs(width, height);
      initParticles(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // 滚动速度采样
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 8);
      const currentScroll = window.scrollY;
      const dy = currentScroll - lastScrollY;

      // 瞬时速度：像素/毫秒
      const rawV = dy / dt;
      // 限制速度峰值并累加到目标速度
      targetVelocity = Math.max(Math.min(rawV * 24, 18), -18);

      lastScrollY = currentScroll;
      lastScrollTime = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // 触摸/鼠标微波感应
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      pointerActive = true;
      if ("touches" in e && e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        pointerX = (e as MouseEvent).clientX;
        pointerY = (e as MouseEvent).clientY;
      }
    };

    const onPointerLeave = () => {
      pointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("touchend", onPointerLeave);

    // 渲染主循环
    let lastFrameTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      const delta = Math.min(time - lastFrameTime, 32);
      lastFrameTime = time;

      // 速度弹簧阻尼衰减
      currentVelocity += (targetVelocity - currentVelocity) * 0.08;
      targetVelocity *= 0.92; // 阻尼自然归零

      // 减弱动态时锁定速度为 0
      const effectiveVelocity = prefersReducedMotion ? 0 : currentVelocity;
      const warpFactor = Math.min(Math.abs(effectiveVelocity) * 0.04, 0.4);

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. 底色：深墨胶片黑 (#08080a)
      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, width, height);

      // 2. 渲染焦外光斑 (Macro Bokeh Orbs)
      // 使用 "screen" 滤色混合，营造多重光源交叠的高通透感
      ctx.globalCompositeOperation = "screen";

      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        if (!prefersReducedMotion) {
          orb.phase += orb.phaseSpeed * (delta / 16);
        }

        // 自然漂移量
        const driftX = Math.sin(orb.phase) * orb.driftRangeX;
        const driftY = Math.cos(orb.phase * 0.85) * orb.driftRangeY;

        // 滑动推轨力学：
        // 下滑（effectiveVelocity > 0）：光斑从视心向外推开并膨胀 (Dolly-In)
        // 上滑（effectiveVelocity < 0）：光斑向视心微聚拢 (Dolly-Out)
        const pushX = (orb.baseX - centerX) * warpFactor * 0.35;
        const pushY = (orb.baseY - centerY) * warpFactor * 0.35 - effectiveVelocity * 1.5;

        orb.x = orb.baseX + driftX + pushX;
        orb.y = orb.baseY + driftY + pushY;

        // 动态半径膨胀
        const dynRadius = Math.max(orb.radius * (1 + warpFactor * 0.25), 40);

        // 柔和径向渐变
        const grad = ctx.createRadialGradient(orb.x, orb.y, dynRadius * 0.08, orb.x, orb.y, dynRadius);
        // 中心柔和，外缘完全羽化透明
        grad.addColorStop(0, `${orb.color}0.14)`);
        grad.addColorStop(0.4, `${orb.color}0.08)`);
        grad.addColorStop(0.8, `${orb.color}0.02)`);
        grad.addColorStop(1, `${orb.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, dynRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. 渲染银盐悬浮粒子 (Silver Halide Emulsion)
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx * p.z;
          // 粒子受滑动力学牵引（近大远小，高 Z 深度拉扯更剧烈）
          p.y += (p.vy - effectiveVelocity * 0.6) * p.z;

          // 触摸/鼠标微排斥波纹
          if (pointerActive) {
            const dx = p.x - pointerX;
            const dy = p.y - pointerY;
            const distSq = dx * dx + dy * dy;
            const repulseDist = 130;
            if (distSq < repulseDist * repulseDist && distSq > 4) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / repulseDist) * 3.5;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }
        }

        // 边缘环绕循环 (Seamless Wrap)
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const r = p.baseRadius * p.z;
        const currentAlpha = Math.min(p.alpha * (0.8 + Math.sin(time * 0.002 + i) * 0.2), 0.95);

        // 如果滑动速度大，拉出微小的运动拖尾光丝 (Streak)
        const streak = Math.abs(effectiveVelocity) * p.z * 1.8;

        if (streak > 1.2 && !prefersReducedMotion) {
          ctx.strokeStyle = `rgba(244, 244, 241, ${currentAlpha * 0.6})`;
          ctx.lineWidth = r * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          // 拖尾方向相反于运动速度
          ctx.lineTo(p.x, p.y + (effectiveVelocity > 0 ? -streak : streak));
          ctx.stroke();
        } else {
          // 常态微粒：中心光核 + 微晕
          ctx.fillStyle = `rgba(244, 244, 241, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. 镜头边缘自然失光暗角 (Lens Vignette)
      ctx.globalCompositeOperation = "source-over";
      const vignetteGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        Math.min(width, height) * 0.35,
        centerX,
        centerY,
        Math.max(width, height) * 0.72
      );
      vignetteGrad.addColorStop(0, "rgba(8, 8, 10, 0)");
      vignetteGrad.addColorStop(0.7, "rgba(8, 8, 10, 0.45)");
      vignetteGrad.addColorStop(1, "rgba(8, 8, 10, 0.88)");

      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    // 监听页面可见性，切到后台时自动挂起降低能耗
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastFrameTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchend", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 select-none"
    />
  );
};
