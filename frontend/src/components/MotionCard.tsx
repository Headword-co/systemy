'use client';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: 'easeOut' },
  }),
};

export default function MotionCard({
  index,
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  index: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={variants}
      initial="hidden"
      animate="visible"
      style={style}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
