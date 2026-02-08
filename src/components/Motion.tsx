"use client";

import { motion } from "framer-motion";
import { type PropsWithChildren } from "react";

export const FadeZoom = ({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);
