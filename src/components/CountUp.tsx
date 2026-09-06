import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * 数字滚动计数：进入视口后从 0 计数到目标值。
 * 仅对纯数字生效（如 "56"）；占位符（"20XX" / "XX"）原样显示，
 * 社长填入真实数字后动画自动生效。系统开启「减弱动态」时直接显示最终值。
 */
export function CountUp({ value }: { value: string }) {
  const target = Number(value);
  const valid = value.trim() !== "" && !Number.isNaN(target);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => String(Math.round(v)));

  useEffect(() => {
    if (!valid || !inView) return;
    if (reduce) {
      mv.set(target);
      return;
    }
    const controls = animate(mv, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [valid, inView, reduce, target, mv]);

  if (!valid) return <>{value}</>;
  return (
    <motion.span ref={ref}>
      {text}
    </motion.span>
  );
}
