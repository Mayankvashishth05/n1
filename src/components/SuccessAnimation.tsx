/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, ShieldCheck, Clock, UserCheck } from 'lucide-react';

interface SuccessAnimationProps {
  onReset: () => void;
}

export default function SuccessAnimation({ onReset }: SuccessAnimationProps) {
  // Generate random values for beautiful particle burst
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 15 * Math.PI) / 180 + (Math.random() - 0.5) * 0.2;
    const distance = 60 + Math.random() * 80;
    const size = 3 + Math.random() * 6;
    const duration = 0.8 + Math.random() * 0.6;
    const delay = Math.random() * 0.15;
    
    // Aesthetic neon/brand palette for bursts
    const colors = ['#2cc3e6', '#6835d0', '#10b981', '#fbbf24', '#f43f5e'];
    const color = colors[i % colors.length];

    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      color,
      duration,
      delay,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center py-8 px-4 font-sans select-none"
    >
      {/* Animated Circle Wrapper */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Pulsing Backlight */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.15, 0.25] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[#10b981]/25 rounded-full filter blur-xl pointer-events-none"
        />

        {/* Outer Circular border drawing */}
        <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
          <motion.circle
            cx="56"
            cy="56"
            r="44"
            stroke="#10b981"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray="277"
            initial={{ strokeDashoffset: 277 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </svg>

        {/* Animated Check Path */}
        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.4)]">
          <svg
            className="w-8 h-8 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.35, duration: 0.45, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Particle Burst Explosion */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: '50%',
              top: '50%',
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.1, 0.8, 0.3, 1], // Custom overshoot outward burst
            }}
          />
        ))}
      </div>

      {/* Success Headings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="space-y-2.5 max-w-md"
      >
        <span className="font-mono text-[10px] tracking-widest text-[#2cc3e6] font-bold uppercase inline-flex items-center gap-1.5 bg-[#2cc3e6]/10 px-3 py-1 rounded-full border border-[#2cc3e6]/20">
          <ShieldCheck size={11} /> Pitch Confirmed
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#ece7e5]">
          Proposal Sent Successfully!
        </h3>
        <p className="text-xs sm:text-sm text-[#ece7e5]/70 leading-relaxed font-sans">
          Thank you for reaching out to <span className="text-white font-semibold">Niorpixel Design Studio</span>. Mayank or Priyansh will review your guidelines and connect with you shortly!
        </p>
      </motion.div>

      {/* SLA Speed Info Boxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="grid grid-cols-2 gap-3 w-full max-w-sm mt-6 border-t border-b border-white/5 py-4"
      >
        <div className="flex flex-col items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <Clock size={14} className="text-amber-400 mb-1" />
          <span className="text-[10px] font-mono text-white/50 uppercase">AVERAGE response</span>
          <span className="text-xs font-bold text-[#ece7e5] mt-0.5">Under 2 Hours</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <UserCheck size={14} className="text-[#2cc3e6] mb-1" />
          <span className="text-[10px] font-mono text-white/50 uppercase">ASSIGNED TO</span>
          <span className="text-xs font-bold text-[#ece7e5] mt-0.5">Studio Leads</span>
        </div>
      </motion.div>

      {/* Send Another Reset Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-7 w-full max-w-sm"
      >
        <button
          onClick={onReset}
          className="w-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white py-3 px-5 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:border-[#2cc3e6]/40"
        >
          <span>Submit Another Request</span>
          <ArrowRight size={12} className="text-white/60" />
        </button>
      </motion.div>
    </motion.div>
  );
}
