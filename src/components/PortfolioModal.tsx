/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calendar, User, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  items?: PortfolioItem[];
  onChangeItem?: (item: PortfolioItem) => void;
}

export default function PortfolioModal({ item, onClose, items, onChangeItem }: PortfolioModalProps) {
  if (!item) return null;

  const currentIndex = items && item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasNavigation = !!(items && items.length > 1 && currentIndex !== -1 && onChangeItem);

  const handlePrev = () => {
    if (!hasNavigation || !items || !onChangeItem) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onChangeItem(items[prevIndex]);
  };

  const handleNext = () => {
    if (!hasNavigation || !items || !onChangeItem) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onChangeItem(items[nextIndex]);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!hasNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNavigation, currentIndex, items]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1b1b1b]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Floating Side Nav Controls for Desktop */}
      {hasNavigation && (
        <>
          <button
            onClick={handlePrev}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#ece7e5] text-[#1b1b1b] border-2 border-[#1b1b1b] shadow-[4px_4px_0px_0px_#1b1b1b] hover:bg-brand-accent hover:text-[#ece7e5] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#2cc3e6] active:translate-x-0 active:translate-y-0 cursor-pointer"
            title="Previous Case Study (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#ece7e5] text-[#1b1b1b] border-2 border-[#1b1b1b] shadow-[4px_4px_0px_0px_#1b1b1b] hover:bg-brand-accent hover:text-[#ece7e5] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#2cc3e6] active:translate-x-0 active:translate-y-0 cursor-pointer"
            title="Next Case Study (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

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
                {/* Header Status & Categories Block */}
                <div className="flex items-center justify-between mb-4 mr-8">
                  <span className="inline-block px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-[#ece7e5] bg-brand-accent rounded border-[1.5px] border-[#1b1b1b] uppercase">
                    {item.category}
                  </span>
                  {hasNavigation && items && (
                    <span className="font-mono text-xs font-bold text-brand-dark/60 tracking-wider">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>
                  )}
                </div>

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

              {/* Direct Navigation & Close Grid */}
              <div className="mt-8">
                {hasNavigation ? (
                  <div className="grid grid-cols-5 gap-3">
                    <button
                      onClick={handlePrev}
                      className="col-span-1 flex items-center justify-center bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] py-3 rounded-lg border-2 border-[#1b1b1b] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#2cc3e6] active:translate-x-0 active:translate-y-0 cursor-pointer"
                      title="Previous Project (Left Arrow)"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={onClose}
                      className="col-span-3 bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] py-3 px-2 font-display font-bold text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#2cc3e6] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer text-center"
                    >
                      Close
                    </button>

                    <button
                      onClick={handleNext}
                      className="col-span-1 flex items-center justify-center bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] py-3 rounded-lg border-2 border-[#1b1b1b] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#2cc3e6] active:translate-x-0 active:translate-y-0 cursor-pointer"
                      title="Next Project (Right Arrow)"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] py-3 px-4 font-display font-bold text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#2cc3e6] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer"
                  >
                    Close Showcase
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
