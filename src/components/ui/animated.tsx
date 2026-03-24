import { ReactNode, CSSProperties } from 'react';
import { useScrollAnimation, useCountAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

// Tipos de animação disponíveis
type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-left'
  | 'blur-in';

interface AnimatedProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

// Estilos base para cada tipo de animação
const animationStyles: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    hidden: { opacity: 0, transform: 'scale(0.8)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    hidden: { opacity: 0, transform: 'scale(1.2)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'flip-up': {
    hidden: { opacity: 0, transform: 'perspective(1000px) rotateX(45deg)' },
    visible: { opacity: 1, transform: 'perspective(1000px) rotateX(0)' },
  },
  'flip-left': {
    hidden: { opacity: 0, transform: 'perspective(1000px) rotateY(-45deg)' },
    visible: { opacity: 1, transform: 'perspective(1000px) rotateY(0)' },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0)' },
  },
};

export function Animated({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className,
  once = true,
}: AnimatedProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: once });
  const styles = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        ...(isVisible ? styles.visible : styles.hidden),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}

// Contador animado
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const { ref, count } = useCountAnimation(value, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

// Grid com stagger animation
interface AnimatedGridProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animation?: AnimationType;
}

export function AnimatedGrid({
  children,
  className,
  itemClassName,
  staggerDelay = 100,
  animation = 'fade-up',
}: AnimatedGridProps) {
  const { ref, isVisible, getDelay } = useStaggerAnimation(children.length, staggerDelay);
  const styles = animationStyles[animation];

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn('transition-all duration-500', itemClassName)}
          style={{
            ...(isVisible ? styles.visible : styles.hidden),
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            ...getDelay(index),
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Section wrapper com animação
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

// Texto com highlight animado
interface AnimatedHighlightProps {
  children: ReactNode;
  className?: string;
  highlightColor?: string;
}

export function AnimatedHighlight({
  children,
  className,
  highlightColor = 'bg-amarelo/30'
}: AnimatedHighlightProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLSpanElement>();

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      <span
        className={cn(
          'absolute inset-0 -skew-x-3 transition-transform duration-700',
          highlightColor,
          isVisible ? 'scale-x-100' : 'scale-x-0'
        )}
        style={{ transformOrigin: 'left', zIndex: -1 }}
      />
      {children}
    </span>
  );
}
