import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * 滚动淡入：克制动效（MOTION_INTENSITY 4）的唯一入场形式。
 * 尊重系统「减弱动态」设置：开启时直接静态显示。
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
