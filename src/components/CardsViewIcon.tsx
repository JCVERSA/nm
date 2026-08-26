"use client";
import { motion } from "motion/react";

const CARD_DELAY_STEP = 0.067;
const ACTIVE_ORDER = [1, 3, 0, 2];
const DEFAULT_ORDER = [0, 1, 2, 3];

export interface CardsViewIconProps {
  isActive: boolean;
  className?: string;
}

export default function CardsViewIcon({ isActive, className }: CardsViewIconProps) {
  const order = isActive ? ACTIVE_ORDER : DEFAULT_ORDER;
  return (
    <motion.span
      className={`inline-grid h-3 w-3 place-content-center grid-cols-2 gap-[2.5px] ${className ?? ""}`}
      aria-hidden="true"
    >
      {order.map((id, i) => (
        <motion.span
          key={id}
          layout
          className="size-[4px] rounded-[1px] bg-current"
          animate={isActive ? { opacity: [0.65, 1, 1] } : { opacity: 1 }}
          transition={{
            duration: 0.42,
            delay: i === 0 ? 0 : i * CARD_DELAY_STEP,
            ease: "easeOut",
            layout: { duration: 0.45, delay: i === 0 ? 0 : i * CARD_DELAY_STEP, ease: "easeInOut" },
          }}
        />
      ))}
    </motion.span>
  );
}
