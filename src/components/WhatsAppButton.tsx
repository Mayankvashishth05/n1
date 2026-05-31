/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = "https://wa.me/919354200231?text=Hello%20Niorpixel%2C%20I%20want%20to%20discuss%20a%20project.";

  return (
    <div id="whatsapp-portal" className="fixed bottom-6 right-6 z-50 flex items-end justify-end select-none">
      <AnimatePresence>
        {/* Interactive hover tooltip card */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 mb-2 w-72 bg-[#1b1b1b] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-l-4 border-l-emerald-500"
          >
            <div className="flex items-start space-x-3 text-left">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-black/45">
                  <img
                    src="/logo.png"
                    alt="NIORPIXEL Logo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1b1b1b] animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#ece7e5] tracking-tight">Niorpixel Studio</h4>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTooltip(false);
                    }}
                    className="text-[#ece7e5]/40 hover:text-[#ece7e5] transition-colors p-0.5 rounded cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide uppercase flex items-center gap-1">
                  <span>● Online</span>
                </p>
                <p className="text-[11px] text-[#ece7e5]/70 leading-relaxed font-sans">
                  Need a design, package upgrade, or brand strategy? Chat with us instantly!
                </p>
              </div>
            </div>
            
            <div className="mt-3.5 border-t border-white/5 pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
              >
                <span>Start Conversation</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glistening Floating WhatsApp Button Container */}
      <div className="relative group">
        {/* Pulsing Outer Radiance Aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/30 transition-all duration-500 animate-ping pointer-events-none" />
        <span className="absolute -inset-1.5 rounded-full bg-emerald-500/10 blur-sm group-hover:bg-emerald-500/20 transition-all duration-300 pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.5)] transform hover:scale-108 transition-all duration-300 cursor-pointer border border-white/20 active:scale-95"
          onClick={(e) => {
            // Let normal link trigger, but close tooltip
            setShowTooltip(false);
          }}
        >
          {/* Main Icon */}
          <MessageCircle size={24} className="stroke-[2.25px]" />
          
          {/* Notification dot indicator */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border border-white flex items-center justify-center animate-bounce">
            <span className="w-1 h-1 bg-white rounded-full" />
          </span>
        </a>
      </div>
    </div>
  );
}
