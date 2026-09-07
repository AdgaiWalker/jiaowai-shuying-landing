import { useEffect, useRef, useState } from "react";
import type p5Type from "p5";

/**
 * 35mm 胶片软带 · XPBD (Extended Position Based Dynamics) 物理仿真组件
 * 
 * 物理特性：
 * 1. 赛璐珞软带网格约束：距离约束（防拉伸）+ 抗剪切对角线 + 抗弯曲刚度（保证胶片卷曲韧性，绝不软瘫）；
 * 2. 惯性与风阻模拟：页面上下滑动时产生反向虚拟升力与飘扬；
 * 3. 实时拖拽与回弹：支持鼠标按住任意节拖拽、甩动、松手阻尼钟摆回位；
 * 4. 视觉工艺：暗房金属挂夹、双侧 35mm 矩形齿孔、琥珀负片透光、底片帧格与黄色胶卷批次编号（KODAK / 焦外述影 35MM）。
 */

interface Particle {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  invMass: number;
}

interface DistanceConstraint {
  p1: number;
  p2: number;
  length: number;
  compliance: number; // XPBD 柔度：0 = 绝对刚性，>0 = 弹性抗弯
}

export function FilmRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // 检查是否开启减弱动态
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setInteractive(false);
      return;
    }

    let p5Instance: p5Type | null = null;
    let isMounted = true;

    import("p5").then(({ default: p5 }) => {
      if (!isMounted || !containerRef.current) return;

      const sketch = (p: p5Type) => {
      // 物理与尺寸参数
      const canvasW = 160;
      const canvasH = 500;
      const ribbonW = 46;
      const segH = 22;
      const numSegments = 16;
      const originX = 80;
      const originY = 32;

      // 质点与约束
      let particles: Particle[] = [];
      let constraints: DistanceConstraint[] = [];
      let draggedIndex: number | null = null;
      let lastScrollY = window.scrollY;
      let scrollVelocity = 0;

      const initPhysics = () => {
        particles = [];
        constraints = [];

        // 初始化 2 列质点网格 (共 (numSegments + 1) * 2 个点)
        for (let i = 0; i <= numSegments; i++) {
          const y = originY + i * segH;
          const leftX = originX - ribbonW / 2;
          const rightX = originX + ribbonW / 2;

          // 顶点固定 (invMass = 0)
          const invMass = i === 0 ? 0 : 1.0;

          // 偶数索引 = 左点, 奇数索引 = 右点
          particles.push({ x: leftX, y, oldX: leftX, oldY: y, invMass });
          particles.push({ x: rightX, y, oldX: rightX, oldY: y, invMass });
        }

        // 构建约束
        for (let i = 0; i < numSegments; i++) {
          const l1 = i * 2;
          const r1 = i * 2 + 1;
          const l2 = (i + 1) * 2;
          const r2 = (i + 1) * 2 + 1;

          // 1. 纵向边缘结构约束 (刚性)
          constraints.push({ p1: l1, p2: l2, length: segH, compliance: 0 });
          constraints.push({ p1: r1, p2: r2, length: segH, compliance: 0 });

          // 2. 横向宽度保持约束 (刚性)
          constraints.push({ p1: l1, p2: r1, length: ribbonW, compliance: 0 });

          // 3. 对角抗剪切约束 (保持矩形，防止扭曲为菱形)
          const diagLen = Math.hypot(ribbonW, segH);
          constraints.push({ p1: l1, p2: r2, length: diagLen, compliance: 0 });
          constraints.push({ p1: r1, p2: l2, length: diagLen, compliance: 0 });

          // 4. 隔级纵向抗弯曲约束 (赋予赛璐珞胶片韧性弧度)
          if (i < numSegments - 1) {
            const l3 = (i + 2) * 2;
            const r3 = (i + 2) * 2 + 1;
            constraints.push({ p1: l1, p2: l3, length: segH * 2, compliance: 0.04 });
            constraints.push({ p1: r1, p2: r3, length: segH * 2, compliance: 0.04 });
          }
        }
        // 最底端的横向横梁
        const lastL = numSegments * 2;
        const lastR = numSegments * 2 + 1;
        constraints.push({ p1: lastL, p2: lastR, length: ribbonW, compliance: 0 });
      };

      p.setup = () => {
        p.createCanvas(canvasW, canvasH);
        p.frameRate(60);
        initPhysics();
      };

      // 监听整页滚动速度注入气流惯性力
      const handleScroll = () => {
        const sy = window.scrollY;
        const dy = sy - lastScrollY;
        lastScrollY = sy;
        // 平滑滚动冲量
        scrollVelocity += dy * 0.45;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      const solveConstraints = (dt: number) => {
        // 迭代多次保证刚性不可伸长
        const iterations = 6;
        for (let it = 0; it < iterations; it++) {
          for (const c of constraints) {
            const p1 = particles[c.p1];
            const p2 = particles[c.p2];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const diff = dist - c.length;

            const w1 = p1.invMass;
            const w2 = p2.invMass;
            const wSum = w1 + w2;
            if (wSum === 0) continue;

            // XPBD Lagrange 系数 alpha
            const alpha = c.compliance / (dt * dt);
            const deltaLagrange = diff / (wSum + alpha);

            const corrX = (dx / dist) * deltaLagrange;
            const corrY = (dy / dist) * deltaLagrange;

            if (p1.invMass > 0) {
              p1.x += corrX * (w1 / wSum);
              p1.y += corrY * (w1 / wSum);
            }
            if (p2.invMass > 0) {
              p2.x -= corrX * (w2 / wSum);
              p2.y -= corrY * (w2 / wSum);
            }
          }
        }
      };

      p.draw = () => {
        p.clear();

        const dt = 1 / 60;
        const gravity = 0.38;
        const damping = 0.982;

        // 吸收滚屏气流动量 (向上飘拂 + 轻微侧向扬起)
        scrollVelocity *= 0.88;
        const liftForce = -scrollVelocity * 0.15;
        const flutterX = scrollVelocity * 0.08;

        // 闲置状态的极其微弱正弦通风微风
        const time = p.millis() * 0.002;
        const breeze = Math.sin(time) * 0.06;

        // 1. 积分步骤 (Verlet Integration)
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          if (pt.invMass === 0) continue;

          // 拖拽中固定在光标
          if (draggedIndex === i) {
            pt.x = p.mouseX;
            pt.y = p.mouseY;
            pt.oldX = p.mouseX;
            pt.oldY = p.mouseY;
            continue;
          }

          let vx = (pt.x - pt.oldX) * damping;
          let vy = (pt.y - pt.oldY) * damping;

          pt.oldX = pt.x;
          pt.oldY = pt.y;

          // 施加外力：重力 + 滚动空气阻力 + 环境微风
          const depthRatio = Math.floor(i / 2) / numSegments;
          vx += breeze * depthRatio + flutterX * depthRatio;
          vy += gravity + liftForce * depthRatio;

          // 鼠标碰撞扰动 (若鼠标划过且未拖拽)
          if (draggedIndex === null && p.mouseX >= 0 && p.mouseX <= canvasW && p.mouseY >= 0 && p.mouseY <= canvasH) {
            const mdx = pt.x - p.mouseX;
            const mdy = pt.y - p.mouseY;
            const mdist = Math.hypot(mdx, mdy);
            if (mdist < 38 && mdist > 0.1) {
              const push = (1 - mdist / 38) * 1.6;
              vx += (mdx / mdist) * push;
              vy += (mdy / mdist) * push;
            }
          }

          pt.x += vx;
          pt.y += vy;
        }

        // 2. 求解约束
        solveConstraints(dt);

        // 3. p5.js 绘制渲染

        // A. 顶部暗房金属挂夹 (Film Hanger Clip)
        p.push();
        p.stroke(60, 64, 70);
        p.strokeWeight(1);
        p.line(originX, 0, originX, originY - 14); // 顶部悬丝
        p.fill(32, 34, 38);
        p.rectMode(p.CENTER);
        p.rect(originX, originY - 6, ribbonW + 12, 12, 2); // 夹子板
        p.fill(229, 72, 77); // 红色摄影标点
        p.noStroke();
        p.circle(originX - 16, originY - 6, 3);
        p.circle(originX + 16, originY - 6, 3);
        p.fill(200, 204, 212);
        p.circle(originX, originY - 6, 4); // 铆钉
        p.pop();

        // B. 柔和投影 (随胶片弯曲展开)
        p.push();
        p.noStroke();
        p.fill(0, 0, 0, 35);
        for (let i = 0; i < numSegments; i++) {
          const l1 = particles[i * 2];
          const r1 = particles[i * 2 + 1];
          const l2 = particles[(i + 1) * 2];
          const r2 = particles[(i + 1) * 2 + 1];

          p.beginShape();
          p.vertex(l1.x + 8, l1.y + 12);
          p.vertex(r1.x + 8, r1.y + 12);
          p.vertex(r2.x + 8, r2.y + 12);
          p.vertex(l2.x + 8, l2.y + 12);
          p.endShape(p.CLOSE);
        }
        p.pop();

        // C. 胶片主体 (琥珀深黑半透明赛璐珞 + 齿孔 + 帧格)
        for (let i = 0; i < numSegments; i++) {
          const l1 = particles[i * 2];
          const r1 = particles[i * 2 + 1];
          const l2 = particles[(i + 1) * 2];
          const r2 = particles[(i + 1) * 2 + 1];

          // 胶片底色：深棕黑微透
          p.push();
          p.stroke(48, 50, 56, 180);
          p.strokeWeight(0.75);
          p.fill(16, 17, 20, 235);
          p.beginShape();
          p.vertex(l1.x, l1.y);
          p.vertex(r1.x, r1.y);
          p.vertex(r2.x, r2.y);
          p.vertex(l2.x, l2.y);
          p.endShape(p.CLOSE);

          // 35mm 齿孔 (左右两列规则矩形)
          p.fill(10, 11, 13); // 透出底层纯黑
          p.noStroke();
          const t = 0.5;
          const holeL_x = p.lerp(l1.x, l2.x, t) + 4;
          const holeL_y = p.lerp(l1.y, l2.y, t);
          const holeR_x = p.lerp(r1.x, r2.x, t) - 4;
          const holeR_y = p.lerp(r1.y, r2.y, t);

          p.rectMode(p.CENTER);
          p.rect(holeL_x, holeL_y, 4.5, 7, 1);
          p.rect(holeR_x, holeR_y, 4.5, 7, 1);

          // 胶片边缘文字标识 (每隔 4 节印一段)
          if (i % 4 === 1) {
            p.fill(235, 170, 60, 190); // 柯达暗金黄
            p.textSize(5.5);
            p.textAlign(p.CENTER, p.CENTER);
            p.textFont("monospace");
            const midX = (l1.x + r1.x) / 2;
            const midY = (l1.y + r1.y) / 2;
            const angle = Math.atan2(r1.y - l1.y, r1.x - l1.x);
            p.push();
            p.translate(midX, midY);
            p.rotate(angle);
            p.text(i === 1 ? "KODAK 400" : i === 5 ? "焦外述影 35MM" : i === 9 ? "▶ 24A" : "SAFETY FILM", 0, 0);
            p.pop();
          }

          // 摄影作品微型样张卡格 (每 5 节形成一个完整画面)
          if (i % 5 === 2) {
            const fMidX = (l1.x + r1.x) / 2;
            const fMidY = (l1.y + r1.y) / 2;
            p.push();
            p.stroke(229, 72, 77, 90); // 细红线框
            p.strokeWeight(0.6);
            p.fill(28, 30, 36, 200);
            p.rectMode(p.CENTER);
            p.rect(fMidX, fMidY, ribbonW - 16, segH * 1.6, 1);
            // 胶片微型十字对焦标线
            p.stroke(255, 255, 255, 50);
            p.line(fMidX - 4, fMidY, fMidX + 4, fMidY);
            p.line(fMidX, fMidY - 3, fMidX, fMidY + 3);
            p.pop();
          }

          p.pop();
        }

        // 末端垂落金属小坠
        const bL = particles[numSegments * 2];
        const bR = particles[numSegments * 2 + 1];
        const tailX = (bL.x + bR.x) / 2;
        const tailY = (bL.y + bR.y) / 2;
        p.push();
        p.fill(40, 42, 48);
        p.stroke(60, 64, 70);
        p.strokeWeight(0.8);
        p.circle(tailX, tailY + 4, 6);
        p.fill(229, 72, 77);
        p.noStroke();
        p.circle(tailX, tailY + 4, 2);
        p.pop();
      };

      // 交互事件处理：抓取与拖拽
      p.mousePressed = () => {
        let minDist = 36;
        let found = -1;
        for (let i = 2; i < particles.length; i++) {
          const d = p.dist(p.mouseX, p.mouseY, particles[i].x, particles[i].y);
          if (d < minDist) {
            minDist = d;
            found = i;
          }
        }
        if (found !== -1) {
          draggedIndex = found;
          return false;
        }
      };

      p.mouseReleased = () => {
        draggedIndex = null;
      };
    };

    p5Instance = new p5(sketch, containerRef.current);
  });

    return () => {
      isMounted = false;
      p5Instance?.remove();
    };
  }, []);

  if (!interactive) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed right-2 top-14 z-30 hidden select-none md:right-8 lg:right-14 md:block pointer-events-auto"
      title="35mm 物理胶卷挂带 · 可用鼠标抓取拉扯与甩动"
      style={{ width: 160, height: 500 }}
    >
      <div ref={containerRef} className="cursor-grab active:cursor-grabbing" />
    </div>
  );
}
