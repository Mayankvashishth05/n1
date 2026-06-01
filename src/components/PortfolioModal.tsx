/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calendar, User, Briefcase } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export default function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1b1b1b]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6 lg:p-8">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#ece7e5] text-[#1b1b1b] border-4 border-[#1b1b1b] custom-shadow-accent text-left transition-all sm:my-8 w-full max-w-4xl">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-[#1b1b1b] text-[#ece7e5] p-2 hover:bg-brand-accent hover:scale-110 transition-all border-2 border-[#1b1b1b] cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Project Image */}
            <div className="md:col-span-7 bg-[#1b1b1b] flex items-center justify-center min-h-[350px] md:min-h-[480px] border-b-4 md:border-b-0 md:border-r-4 border-[#1b1b1b] relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="relative max-w-full max-h-[480px] object-contain z-10 p-4"
              />
            </div>

            {/* Project Details */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Accent Category Label */}
                <span className="inline-block px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-[#ece7e5] bg-brand-accent rounded border-[1.5px] border-[#1b1b1b] uppercase mb-4">
                  {item.category}
                </span>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#1b1b1b] tracking-tight mb-4">
                  {item.title}
                </h3>

                <p className="text-sm text-[#1b1b1b]/80 font-sans leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Meta details list */}
              <div className="space-y-4 border-t-2 border-[#1b1b1b]/20 pt-6">
                <div className="flex items-center space-x-3 text-sm">
                  <User size={18} className="text-brand-accent shrink-0" />
                  <div>
                    <span className="font-mono text-[10px] text-brand-dark/50 block tracking-wider uppercase">CLIENT</span>
                    <span className="font-semibold text-[#1b1b1b]">{item.client || 'Niorpixel Brand Partner'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Calendar size={18} className="text-brand-accent shrink-0" />
                  <div>
                    <span className="font-mono text-[10px] text-brand-dark/50 block tracking-wider uppercase">TIMELINE</span>
                    <span className="font-semibold text-[#1b1b1b]">
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Ongoing Project'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Briefcase size={18} className="text-brand-accent shrink-0" />
                  <div>
                    <span className="font-mono text-[10px] text-brand-dark/50 block tracking-wider uppercase">MEDIUM</span>
                    <span className="font-semibold text-[#1b1b1b]">Digital Artwork & Social Collateral</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={onClose}
                  className="w-full bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] py-3 px-4 font-display font-bold text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#2cc3e6] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer"
                >
                  Close Showcase
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
