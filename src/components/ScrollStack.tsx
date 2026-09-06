import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

/**
 * 改造自 react-bits ScrollStack（TS-TW 变体），本项目落地时做了两处关键调整：
 *  1. 移除 Lenis 依赖：原版在整页模式下会创建全局平滑滚动实例（syncTouch 劫持触摸），
 *     在微信内置浏览器上有滚动卡顿风险，改为原生 scroll/resize 被动监听；
 *  2. 仅保留整页滚动模式（本站唯一用法），卡片查询收敛到组件根节点内部，
 *     内边距按本项目节奏重设。直角体系由使用方通过 itemClassName 提供。
 * 「减弱动态」时不渲染本组件（见 WhyJoin 的回退分支）。
 */

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  /** 卡片之间的滚动间距（px），由脚本注入为 marginBottom */
  itemDistance?: number;
  /** 每深一层卡片多缩小的比例 */
  itemScale?: number;
  /** 堆叠后相邻卡片错开的纵向距离（px） */
  itemStackDistance?: number;
  /** 卡片顶边滚动到视口高度百分之几时开始堆叠（如 '18%'） */
  stackPosition?: string;
  /** 缩放动画在视口高度百分之几处完成（如 '10%'） */
  scaleEndPosition?: string;
  /** 堆叠后最底层卡片的最终缩放（越早的卡片缩得越小） */
  baseScale?: number;
  /** 每层卡片的旋转量（deg），0 = 不旋转 */
  rotationAmount?: number;
  /** 被盖住的卡片每层叠加的模糊（px），做景深效果 */
  blurAmount?: number;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 70,
  itemScale = 0.012,
  itemStackDistance = 24,
  stackPosition = '18%',
  scaleEndPosition = '10%',
  baseScale = 0.925,
  rotationAmount = 0,
  blurAmount = 0.45,
  onStackComplete
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  /**
   * 取卡片在文档中的布局位置。必须走 offsetTop 链：
   * getBoundingClientRect 会把已应用的 transform 算进去，
   * 用它反推 translateY 会形成反馈循环（卡片在堆叠位与原位间来回震荡）。
   */
  const getElementOffset = useCallback((element: HTMLElement) => {
    let top = 0;
    let node: HTMLElement | null = element;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return top;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = rootRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null;
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getElementOffset
  ]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    if (!cards.length) return;
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
    });

    updateCardTransforms();

    const onScroll = () => updateCardTransforms();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, updateCardTransforms]);

  return (
    <div className={`relative w-full ${className}`.trim()} ref={rootRef}>
      <div className="scroll-stack-inner pt-[14vh] pb-[32vh]">
        {children}
        {/* 尾部占位：让最后一张卡片也能短暂停住再随页面滚走 */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
