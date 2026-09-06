import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

/**
 * 改造自 react-bits ScrollStack（TS-TW 变体），本项目落地时做了几处关键调整：
 *  1. 移除 Lenis 依赖：原版在整页模式下会创建全局平滑滚动实例（syncTouch 劫持触摸），
 *     在微信内置浏览器上有滚动卡顿风险，改为原生 scroll/resize 被动监听；
 *  2. 仅保留整页滚动模式（本站唯一用法），卡片查询收敛到组件根节点内部；
 *  3. 卡片位置用 offsetTop 链计算：getBoundingClientRect 会把已应用的 transform 算进去，
 *     反用它反推 translateY 会形成反馈循环（卡片在堆叠位与原位间震荡）；
 *  4. 间距支持渐进（ramp）：传 itemDistanceEnd / itemStackDistanceEnd 后，
 *     卡片间距随索引线性拉开——前紧后松的叙事节奏（见 WhyJoin）。
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
  /** 第一张卡片之后的滚动间距（px） */
  itemDistance?: number;
  /** 最后一张卡片之后的滚动间距（px）；设置后间距随索引线性拉开（前紧后松） */
  itemDistanceEnd?: number;
  /** 每深一层卡片多缩小的比例 */
  itemScale?: number;
  /** 堆叠后相邻卡片错开的纵向距离（px），作用于第 0 层 */
  itemStackDistance?: number;
  /** 堆叠错位的末端值（px）；设置后错位随深度线性加深 */
  itemStackDistanceEnd?: number;
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
  itemDistance = 32,
  itemDistanceEnd,
  itemScale = 0.012,
  itemStackDistance = 16,
  itemStackDistanceEnd,
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

  /** 第 i 张卡片（共 total 张）在 start~end 间的线性插值；未设 end 时恒为 start */
  const ramp = useCallback(
    (start: number, end: number | undefined, i: number, total: number) => {
      if (end === undefined || total <= 1) return start;
      return start + (end - start) * (i / (total - 1));
    },
    []
  );

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
   * 取卡片在文档中的布局位置（offsetTop 链，不受 transform 影响）。
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
    const total = cardsRef.current.length;

    // 每层的堆叠错位，以及前 i 层的累计错位（决定各卡片的触发与停泊位）
    const stackDists = cardsRef.current.map((_, i) => ramp(itemStackDistance, itemStackDistanceEnd, i, total));
    const cumulative = (i: number) => stackDists.slice(0, i).reduce((sum, d) => sum + d, 0);

    const endElement = rootRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null;
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const cumStack = cumulative(i);
      const triggerStart = cardTop - stackPositionPx - cumStack;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < total; j++) {
          const jCard = cardsRef.current[j];
          if (!jCard) continue;
          const jCardTop = getElementOffset(jCard);
          const jTriggerStart = jCardTop - stackPositionPx - cumulative(j);
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
        translateY = scrollTop - cardTop + stackPositionPx + cumStack;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + cumStack;
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

      if (i === total - 1) {
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
    itemStackDistanceEnd,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    ramp,
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
    const total = cards.length;

    cards.forEach((card, i) => {
      if (i < total - 1) {
        card.style.marginBottom = `${ramp(itemDistance, itemDistanceEnd, i, total)}px`;
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
  }, [itemDistance, itemDistanceEnd, updateCardTransforms, ramp]);

  return (
    <div className={`relative w-full ${className}`.trim()} ref={rootRef}>
      <div className="scroll-stack-inner pt-[10vh] pb-[24vh]">
        {children}
        {/* 尾部占位：让最后一张卡片也能短暂停住再随页面滚走 */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
