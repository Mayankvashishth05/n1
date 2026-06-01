/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, Layers, Briefcase, Calendar, User, ExternalLink } from 'lucide-react';
import { PortfolioItem } from '../types';
import { PORTFOLIO_CATEGORIES } from '../data';
import LazyImage from './LazyImage';

interface PortfolioArchiveProps {
  portfolioItems: PortfolioItem[];
  selectedItem: PortfolioItem | null;
  setSelectedItem: (item: PortfolioItem | null) => void;
  onBackToHome: () => void;
}

export default function PortfolioArchive({ 
  portfolioItems, 
  selectedItem, 
  setSelectedItem, 
  onBackToHome 
}: PortfolioArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Ensure page looks at the top when loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Distinct categories matching services
  const categories = useMemo(() => {
    return ['All', ...PORTFOLIO_CATEGORIES];
  }, []);

  // Handle combined filtering and searching
  const filteredItems = useMemo(() => {
    return portfolioItems.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [portfolioItems, activeFilter, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-[#141414] text-[#ece7e5] font-sans antialiased"
    >
      {/* Dynamic Background Flare */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#6835d0]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute top-[40vh] left-10 w-[300px] h-[300px] bg-[#2cc3e6]/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header of Archive Page */}
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
                src="/logo.png"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="space-y-4 max-w-3xl">
          <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-semibold">DIGITAL ARCHIVE</span>
          <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-[#ece7e5]">
            Full Portfolio <span className="italic font-light text-[#6835d0]">Showcase</span>
          </h1>
          <p className="text-sm sm:text-base text-[#ece7e5]/70 leading-relaxed font-sans">
            Browse through our full library of custom logos, click-optimized thumbnails, high-impact posters, flyers, bespoke banners, and premium visiting cards. Click on any creative artifact below to view full deep dive case results and specifications.
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar: Search & Filter (Desktop buttons and Mobile Dropdown) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8 border-y border-white/5 bg-[#1b1b1b]/40 backdrop-blur-sm sticky top-[72px] z-30">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* SEARCH BAR INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text"
              placeholder="Search by keyword, client name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-[#ece7e5] placeholder-white/30 focus:outline-none focus:border-[#2cc3e6] focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* DUAL FILTER SYSTEM: Buttons + Dropdown Select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Desktop Filters (Pills) */}
            <div className="hidden sm:flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-2 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                    activeFilter === cat
                      ? 'bg-[#6835d0] text-white border-[#6835d0] font-bold shadow-lg shadow-[#6835d0]/10'
                      : 'bg-white/5 text-[#ece7e5]/70 border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Mobile / Secondary Dropdown select filter */}
            <div className="sm:hidden relative flex items-center bg-[#141414] border border-white/10 rounded-full px-3.5 py-2">
              <Filter size={12} className="text-[#2cc3e6] mr-2 shrink-0" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-transparent text-xs text-[#ece7e5] font-mono focus:outline-none cursor-pointer pr-4"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#141414] text-[#ece7e5]">
                    Filter: {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-white/20 text-5xl">✦</div>
            <h3 className="text-lg font-display text-white/80">No designs match your criteria</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Try adjusting your search filters or clear your query term to view the original portfolio archive.
            </p>
            <button 
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-mono text-[#2cc3e6] hover:underline"
            >
              Reset Archive Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div 
                layout
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="glow-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                {/* Image Wrap */}
                <div className="h-64 sm:h-72 bg-[#1b1b1b]/50 overflow-hidden relative border-b border-white/5 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-35 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                  <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                    <LazyImage
                      src={item.imageUrl}
                      alt={item.title}
                      objectFit="contain"
                      className="max-w-full max-h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5 z-20">
                    <span className="text-[9px] font-mono tracking-widest font-semibold text-[#2cc3e6] inline-flex items-center space-x-1">
                      <span>OPEN SPECIFICATION CASE STUDY</span>
                      <ExternalLink size={10} />
                    </span>
                  </div>
                </div>

                {/* Info Metadata */}
                <div className="p-6 text-left space-y-3 relative">
                  <span className="inline-block font-mono text-[9px] text-[#ece7e5]/40 bg-white/5 px-2.5 py-1 rounded uppercase tracking-widest font-semibold">
                    {item.category}
                  </span>
                  <h4 className="font-display font-medium text-lg text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#ece7e5]/70 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Footer Stats summary */}
                  <div className="border-t border-white/5 pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="flex items-center space-x-1">
                      <User size={10} />
                      <span className="truncate max-w-[120px]">{item.client}</span>
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Full Footer Bar */}
      <footer className="bg-[#111111] border-t border-white/5 py-12 text-center text-xs text-[#ece7e5]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p>© 2026 NIORPIXEL Design Studio. All copyrights reserved.</p>
          <button 
            onClick={onBackToHome}
            className="text-[#6835d0] hover:text-[#2cc3e6] transition-colors font-mono uppercase tracking-widest text-[10px]"
          >
            ← Back to Main Studio Page
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
