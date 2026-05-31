/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Clock, Shield, Sparkles } from 'lucide-react';

interface PackagesPageProps {
  onBackToHome: () => void;
  onSelectPackage: (planName: string) => void;
}

export default function PackagesPage({ onBackToHome, onSelectPackage }: PackagesPageProps) {
  // Ensure page looks at the top when loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-[#141414] text-[#ece7e5] font-sans antialiased relative overflow-hidden"
    >
      {/* Immersive Background Flares */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#6835d0]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#2cc3e6]/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Sticky Navigation Subheader */}
      <header className="sticky top-0 z-40 bg-[#1b1b1b]/90 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#ece7e5]/80 hover:text-[#2cc3e6] transition-colors font-mono cursor-pointer bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={12} />
            <span>Back to Studio</span>
          </button>

          <div className="flex items-center space-x-3 select-none">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-white/10 flex items-center justify-center bg-black/45">
              <img
                src="/src/assets/images/NDS LOGO R.png"
                alt="NIORPIXEL Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-extrabold tracking-tighter text-sm uppercase">NIORPIXEL</span>
          </div>
        </div>
      </header>

      {/* Hero Header block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-semibold">PRICING PACKAGES</span>
          <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-[#ece7e5]">
            Niorpixel's <span className="italic font-light text-[#6835d0]">Designing Packages</span>
          </h1>
          <p className="text-sm sm:text-base text-[#ece7e5]/70 leading-relaxed font-sans max-w-2xl mx-auto">
            Flexible monthly plans to power your brand’s growth. Level up with consistent, high-vibe creative design assets.
          </p>
          <div className="w-12 h-1 bg-[#6835d0] mx-auto mt-2 rounded" />
        </div>
      </div>

      {/* Main Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          
          {/* Package 1: Starter */}
          <div className="glow-card p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/5 shadow-2xl transition-all duration-305 hover:scale-[1.01] hover:border-white/10 group bg-[#111] leading-relaxed">
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#ece7e5]/50 uppercase block mb-1">Starter Plan</span>
                  <h3 className="text-2xl font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Starter</h3>
                </div>
                <span className="bg-white/5 px-2.5 py-1 rounded-full text-[9px] font-mono text-[#ece7e5]/60 border border-white/10 uppercase tracking-widest font-bold shrink-0">
                  Best for Beginners
                </span>
              </div>
              
              <p className="text-xs text-[#ece7e5]/70 font-sans leading-relaxed min-h-[40px]">
                Build a professional presence with essential design support for your brand. Perfect for small businesses getting started.
              </p>

              <div className="pt-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-display font-bold text-[#ece7e5]">₹799</span>
                  <span className="text-xs font-mono text-[#ece7e5]/40 line-through">₹999</span>
                  <span className="text-[10px] uppercase font-mono text-[#2cc3e6] tracking-wider shrink-0 font-bold">/ month</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-3.5 text-left">
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>6 Social Media Posts</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>2 Promotional Posters / Flyers</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>Basic Image Editing</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>JPG / PNG / Canva Template</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>2 Revisions per design</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/85 pt-3 border-t border-white/5">
                  <Clock size={14} className="text-[#2cc3e6]/70 mt-0.5 shrink-0" />
                  <span className="font-mono text-[9px] uppercase tracking-wide">⏱ 24–48 Hours Delivery</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPackage('Starter')}
                className="w-full bg-[#ece7e5] hover:bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>👉 Get Started</span>
              </button>
            </div>
          </div>

          {/* Package 2: Growth */}
          <div className="glow-card p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border-2 border-[#6835d0]/50 bg-[#161320]/60 shadow-[0_0_30px_rgba(104,53,208,0.15)] transition-all duration-300 hover:scale-[1.01] group leading-relaxed">
            {/* Highlighted subtle flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6835d0]/10 rounded-full filter blur-[40px] pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#2cc3e6] uppercase block mb-1">Scale Up</span>
                  <h3 className="text-2xl font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors font-bold">Growth</h3>
                </div>
                <span className="bg-[#6835d0]/20 text-[#2cc3e6] px-2.5 py-1 rounded-full text-[9px] font-mono border border-[#6835d0]/40 uppercase tracking-widest font-bold shrink-0">
                  🔥 Most Popular
                </span>
              </div>
              
              <p className="text-xs text-[#ece7e5]/75 font-sans leading-relaxed min-h-[40px]">
                Scale your brand with regular, engaging, and strategic design content. Consistent content for growing brands.
              </p>

              <div className="pt-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-display font-bold text-[#ece7e5]">₹1,999</span>
                  <span className="text-xs font-mono text-[#ece7e5]/40 line-through">₹2,499</span>
                  <span className="text-[10px] uppercase font-mono text-[#2cc3e6] tracking-wider shrink-0 font-bold">/ month</span>
                </div>
              </div>

              <div className="border-t border-[#6835d0]/20 pt-6 space-y-3.5 text-left">
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>12 Social Media Posts</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>4 Carousels (5 slides each)</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>4 Posters</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>4 Story Designs</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>2 Thumbnails <span className="opacity-60 text-[9px] block sm:inline">(Optional, You can choose other 2 designs if you don't want Thumbnails)</span></span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>3 Revisions</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/85 pt-3 border-t border-[#6835d0]/20">
                  <Clock size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span className="font-mono text-[9px] uppercase tracking-wide text-[#2cc3e6] font-bold">⚡ 24-36 Hours Priority</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPackage('Growth')}
                className="w-full bg-[#6835d0] hover:brightness-110 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>👉 Choose Growth</span>
              </button>
            </div>
          </div>

          {/* Package 3: Premium */}
          <div className="glow-card p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/5 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group bg-[#111] leading-relaxed">
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#ece7e5]/50 uppercase block mb-1">Enterprise</span>
                  <h3 className="text-2xl font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Premium</h3>
                </div>
                <span className="bg-[#2cc3e6]/10 text-[#2cc3e6] px-2.5 py-1 rounded-full text-[9px] font-mono border border-[#2cc3e6]/25 uppercase tracking-widest font-bold shrink-0">
                  🚀 Best Value
                </span>
              </div>
              
              <p className="text-xs text-[#ece7e5]/70 font-sans leading-relaxed min-h-[40px]">
                Complete branding & high-volume content. For brands that want aggressive growth with premium-quality visuals.
              </p>

              <div className="pt-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-display font-bold text-[#ece7e5]">₹3,999</span>
                  <span className="text-xs font-mono text-[#ece7e5]/40 line-through">₹4,999</span>
                  <span className="text-[10px] uppercase font-mono text-[#2cc3e6] tracking-wider shrink-0 font-bold">/ month</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-3.5 text-left">
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>20 Social Media Posts</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>8 Carousels</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>8 Posters / Flyers</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>10 Story Designs</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>4 Thumbnails</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>Brand Identity Setup</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/80">
                  <Check size={14} className="text-[#2cc3e6] mt-0.5 shrink-0" />
                  <span>Unlimited Revisions</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-[#ece7e5]/85 pt-3 border-t border-white/5">
                  <Clock size={14} className="text-[#2cc3e6]/75 mt-0.5 shrink-0" />
                  <span className="font-mono text-[9px] uppercase tracking-wide text-white/95 font-semibold">⚡ 24 Hours Priority</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPackage('Premium')}
                className="w-full bg-[#ece7e5] hover:bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>👉 Go Premium</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
          <div className="flex items-center space-x-3 bg-white/[0.02] rounded-2xl p-5 border border-white/5 text-left leading-normal">
            <div className="w-10 h-10 rounded-xl bg-[#6835d0]/10 border border-[#6835d0]/20 flex items-center justify-center text-[#6835d0] shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-xs font-sans text-[#ece7e5]/90 font-semibold mb-0.5">No long-term contracts. Cancel anytime.</p>
              <span className="text-[10px] font-mono text-[#ece7e5]/50 block">Flexible Monthly Plans</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/[0.02] rounded-2xl p-5 border border-white/5 text-left leading-normal">
            <div className="w-10 h-10 rounded-xl bg-[#2cc3e6]/10 border border-[#2cc3e6]/20 flex items-center justify-center text-[#2cc3e6] shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-sans text-[#ece7e5]/90 font-semibold mb-0.5">Limited slots available this month.</p>
              <span className="text-[10px] font-mono text-[#ece7e5]/50 block">Strict Quality Speed Guarantee</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/[0.02] rounded-2xl p-5 border border-white/5 text-left leading-normal">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-sans text-[#ece7e5]/90 font-semibold mb-0.5">Trusted by growing businesses & startups.</p>
              <span className="text-[10px] font-mono text-[#ece7e5]/50 block">Elite Strategic Output</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
