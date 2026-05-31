/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, Target, Compass, ArrowRight, User, Phone, 
  Mail, MapPin, Instagram, Facebook, Calendar, MessageSquare, ShieldCheck, Lock,
  Image, FileText, Layout, CreditCard, Check, Clock, Flame, Shield
} from 'lucide-react';

import Header from './components/Header';
import Marquee from './components/Marquee';
import PortfolioModal from './components/PortfolioModal';
import AdminPanel from './components/AdminPanel';
import ReviewsList from './components/ReviewsList';
import LegalModal from './components/LegalModal';
import PortfolioArchive from './components/PortfolioArchive';
import PackagesPage from './components/PackagesPage';
import WhatsAppButton from './components/WhatsAppButton';
import FAQSection from './components/FAQSection';
import SuccessAnimation from './components/SuccessAnimation';
import LazyImage from './components/LazyImage';

import { PortfolioItem, ClientReview, QuoteRequest } from './types';
import { 
  getStoredPortfolio, saveStoredPortfolio, getStoredReviews, getStoredQuotes, saveStoredQuotes, PORTFOLIO_CATEGORIES
} from './data';

export default function App() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Quote Form State
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Active Portfolio Filter category
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio' | 'packages'>('home');

  const handleSelectPackage = (planName: string) => {
    setUserMessage(`Hi, I am interested in Niorpixel's "${planName}" Designing Package. Let's discuss details and start working together to transform our brand!`);
    scrollToAnchor('contact');
    setTimeout(() => {
      const el = document.querySelector('textarea') as HTMLTextAreaElement;
      if (el) {
        el.focus({ preventScroll: true });
        el.selectionStart = el.selectionEnd = el.value.length;
      }
    }, 300);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, '');
    return digits.length >= 10 && digits.length <= 15;
  };

  const getEmailBorderClass = () => {
    if (!emailAddress) return 'border-white/10 focus:border-[#2cc3e6] focus:ring-[#2cc3e6]/20';
    return isEmailValid(emailAddress)
      ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/25'
      : 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/25';
  };

  const getPhoneBorderClass = () => {
    if (!mobileNo) return 'border-white/10 focus:border-[#2cc3e6] focus:ring-[#2cc3e6]/20';
    return isPhoneValid(mobileNo)
      ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/25'
      : 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/25';
  };

  // Load custom stored data
  const refreshStateData = () => {
    setPortfolioItems(getStoredPortfolio());
    setClientReviews(getStoredReviews());
  };

  const handleDeletePortfolioItem = (id: string) => {
    const updated = portfolioItems.filter(item => item.id !== id);
    setPortfolioItems(updated);
    saveStoredPortfolio(updated);
  };

  useEffect(() => {
    refreshStateData();

    // Setup global backdoor keyboard trigger: Shift + A
    const handleBackdoorKeys = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleBackdoorKeys);
    return () => window.removeEventListener('keydown', handleBackdoorKeys);
  }, []);

  // Smooth scroll method
  const scrollToAnchor = (id: string) => {
    if (id === 'packages') {
      setCurrentPage('packages');
      return;
    }
    
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -90; // precise offset to clear sticky header
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 200);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -90; // precise offset to clear sticky header
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Submit quote request helper
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !mobileNo || !userMessage) {
      alert('Please complete all form inputs to transform your brand!');
      return;
    }

    const newRequest: QuoteRequest = {
      id: `quote-${Date.now()}`,
      fullName,
      email: emailAddress,
      mobile: mobileNo,
      message: userMessage,
      timestamp: new Date().toLocaleString(),
      status: 'pending'
    };

    // Save Quote
    const existingQuotes = getStoredQuotes();
    const updated = [newRequest, ...existingQuotes];
    saveStoredQuotes(updated);

    // Dynamic feedback to user
    setFormSuccess(true);
    setFullName('');
    setEmailAddress('');
    setMobileNo('');
    setUserMessage('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 5000);
  };

  // Distinct categories based on current portfolio
  const categories: string[] = ['All', ...PORTFOLIO_CATEGORIES];

  const filteredPortfolio = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const visiblePortfolio = isPortfolioExpanded 
    ? filteredPortfolio 
    : filteredPortfolio.slice(0, 3);

  if (currentPage === 'portfolio') {
    return (
      <div className="selection:bg-[#6835d0] selection:text-white">
        <PortfolioArchive 
          portfolioItems={portfolioItems}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onBackToHome={() => setCurrentPage('home')}
        />
        {/* Dynamic Showcase Detail Overlay Modal */}
        {selectedItem && (
          <PortfolioModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onDelete={handleDeletePortfolioItem}
          />
        )}
        <WhatsAppButton />
      </div>
    );
  }

  if (currentPage === 'packages') {
    return (
      <div className="selection:bg-[#6835d0] selection:text-white">
        <PackagesPage 
          onBackToHome={() => setCurrentPage('home')}
          onSelectPackage={handleSelectPackage}
        />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div id="home" className="min-h-screen bg-[#1b1b1b] text-[#ece7e5] font-sans antialiased selection:bg-[#6835d0] selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header onScrollTo={scrollToAnchor} onOpenAdmin={() => setShowAdmin(true)} />

      {/* 2. Scrolling Marquee Promotions */}
      <Marquee />

      {/* 3. Hero Section with dynamic design showcase loop */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 border-b border-white/5 bg-gradient-to-b from-[#1b1b1b] to-[#141414]">
        {/* Absolute branding grids */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ece7e5_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Colorful spotlights matching Immersive theme */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6835d0]/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#2cc3e6]/10 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto space-y-6 sm:space-y-8 select-none">
            
            <div className="inline-flex items-center space-x-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10 text-xs font-mono font-medium tracking-widest uppercase shadow-inner shadow-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-black/45 border border-white/10 flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="NIORPIXEL Logo Badge"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[#ece7e5]/95 text-[11px] font-semibold tracking-wider flex items-center space-x-1.5">
                <span>NIORPIXEL STUDIO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2cc3e6] animate-pulse inline-block"></span>
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[92px] font-display font-light text-[#ece7e5] tracking-tighter leading-[0.95] max-w-4xl text-center">
              Designing Brands <br />
              <span className="italic text-[#6835d0] font-bold">
                That Stand Out
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-lg text-[#ece7e5]/70 max-w-2xl leading-relaxed text-center">
              We build stunning designs that create beautiful experiences, elevating your brand through creative execution, bold layouts, and deep strategy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('portfolio');
                }}
                className="bg-white text-black hover:bg-[#ece7e5] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] cursor-pointer text-center"
              >
                View Full Portfolio
              </button>

              <button
                onClick={() => scrollToAnchor('contact')}
                className="border border-white/20 hover:bg-white/5 text-[#ece7e5] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] cursor-pointer text-center"
              >
                Start Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section className="py-24 bg-[#141414] text-[#ece7e5] border-b border-white/5 relative overflow-hidden">
        {/* Subtle color highlight circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6835d0]/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-80 h-80 bg-[#2cc3e6]/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-bold">NIORPIXEL VIBE & FOCUS</span>
            <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight">Our Vision & Mission</h2>
            <div className="w-12 h-1 bg-[#6835d0] mx-auto mt-2 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Vision card */}
            <div className="glow-card p-8 sm:p-10 rounded-2xl flex flex-col justify-between hover:border-[#6835d0]/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Compass className="text-[#6835d0]" size={22} />
                </div>
                <h3 className="text-2xl font-display font-semibold tracking-tight text-[#ece7e5]">Our Vision</h3>
                <p className="font-sans text-[#ece7e5]/80 text-sm leading-relaxed">
                  To become a recognized creative design studio known for building distinctive and memorable brand identities. We aim to inspire global partners through clean aesthetics and precise executions.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                <span className="text-[9px] tracking-widest font-mono text-[#2cc3e6] uppercase">PIXELS TO PERFECTION</span>
              </div>
            </div>

            {/* Mission card */}
            <div className="glow-card p-8 sm:p-10 rounded-2xl flex flex-col justify-between hover:border-[#2cc3e6]/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Target className="text-[#2cc3e6]" size={22} />
                </div>
                <h3 className="text-2xl font-display font-semibold tracking-tight text-[#ece7e5]">Our Mission</h3>
                
                <ul className="space-y-3 text-[#ece7e5]/80 text-sm font-sans">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#6835d0] mt-1.5 shrink-0">■</span>
                    <span>To design impactful and consistent brand visuals that tell powerful brand narratives.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#6835d0] mt-1.5 shrink-0">■</span>
                    <span>To help businesses express their identity through high-quality creative assets.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#6835d0] mt-1.5 shrink-0">■</span>
                    <span>To maintain design excellence across all brand touchpoints.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#6835d0] mt-1.5 shrink-0">■</span>
                    <span>To deliver creative solutions that align perfectly with business and conversion goals.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5">
                <span className="text-[9px] tracking-widest font-mono text-[#6835d0] uppercase">STRATEGIC BRANDING CO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Services Section */}
      <section id="services" className="py-24 bg-[#1b1b1b] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs tracking-widest uppercase text-[#6835d0] font-bold">STUDIO ARCHITECTURE</span>
            <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">Our Services</h2>
            <div className="w-12 h-1 bg-[#2cc3e6] mx-auto mt-2 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Logo Design */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 01 / CREATIVE ]</span>
              <div className="w-10 h-10 bg-[#6835d0]/10 rounded flex items-center justify-center border border-[#6835d0]/30 text-white mb-4">
                <Sparkles size={18} className="text-[#6835d0]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Logo Design</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                Unique and memorable logos designed from scratch, custom tailored to represent your company identity and core values effectively to target consumers.
              </p>
            </div>

            {/* Social Media Design */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 02 / ENGAGE ]</span>
              <div className="w-10 h-10 bg-[#2cc3e6]/10 rounded flex items-center justify-center border border-[#2cc3e6]/30 text-white mb-4">
                <MessageSquare size={18} className="text-[#2cc3e6]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Social Media Design</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                High performing, highly engaging post designs, banner ads, and custom video templates optimized for absolute visibility, clickability, and platform growth.
              </p>
            </div>

            {/* Brand Kits */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 03 / SYSTEM ]</span>
              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center border border-white/10 text-white mb-4">
                <Layers size={18} className="text-white/80" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Brand Kits</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                Fully articulated complete brand guideline books, matching color spectrum systems, bespoke typography guidelines, and responsive corporate assets.
              </p>
            </div>

            {/* Thumbnail Design */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 04 / ENGAGE ]</span>
              <div className="w-10 h-10 bg-[#2cc3e6]/10 rounded flex items-center justify-center border border-[#2cc3e6]/30 text-white mb-4">
                <Image size={18} className="text-[#2cc3e6]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Thumbnail Design</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                High-contrast, click-optimized custom video and stream thumbnails designed to maximize CTR, engage audiences, and boost platform visibility.
              </p>
            </div>

            {/* Posters and Flyers */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 05 / PRINT ]</span>
              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center border border-white/10 text-white mb-4">
                <FileText size={18} className="text-white/80" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Posters & Flyers</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                Stunning, high-impact poster and flyer graphic concepts designed for commercial product launches, physical advertising, events, and print media.
              </p>
            </div>

            {/* Banners */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 06 / DISPLAY ]</span>
              <div className="w-10 h-10 bg-[#6835d0]/10 rounded flex items-center justify-center border border-[#6835d0]/30 text-white mb-4">
                <Layout size={18} className="text-[#6835d0]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Banners</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                Bespoke digital and physical banners, high-resolution display ads, and custom header graphic assets meticulously aligned to elevate your brand presence.
              </p>
            </div>

            {/* Visiting Cards */}
            <div className="glow-card p-6 rounded-2xl group duration-300">
              <span className="text-[9px] font-mono text-white/40 block mb-4">[ SERVICE 07 / IDENTITY ]</span>
              <div className="w-10 h-10 bg-[#2cc3e6]/10 rounded flex items-center justify-center border border-[#2cc3e6]/30 text-white mb-4">
                <CreditCard size={18} className="text-[#2cc3e6]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors">Visiting Cards</h3>
              <p className="text-xs text-[#ece7e5]/70 font-sans mt-2.5 leading-relaxed">
                Premium, high-end visiting and business card layouts crafted with exquisite typography pairing, material textures in mind, and distinctive layouts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5.5. Niorpixel's Designing Packages Section Teaser */}
      <section id="packages" className="py-24 bg-[#141414] border-b border-white/5 relative overflow-hidden">
        {/* Soft immersive ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6835d0]/5 rounded-full filter blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-bold">NIORPIXEL PRICING</span>
            <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">Designing Packages</h2>
            <p className="text-xs sm:text-sm text-[#ece7e5]/70 font-sans tracking-tight max-w-xl mx-auto">
              Flexible monthly plans to power your brand’s growth.
            </p>
            <div className="w-12 h-1 bg-[#6835d0] mx-auto mt-2 rounded" />
          </div>

          <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Elegant visual line accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#6835d0] to-transparent" />
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex p-3 bg-white/5 rounded-2xl border border-white/10 text-[#2cc3e6] mb-2">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#ece7e5]">
                Flexible Monthly Plans & Pricing
              </h3>
              <p className="text-sm text-[#ece7e5]/70 leading-relaxed font-sans">
                Choose between our <strong className="text-white font-semibold">Starter</strong>, <strong className="text-white font-semibold">Growth</strong>, or <strong className="text-white font-semibold">Premium</strong> subscription plans. Built for startups, growing creators, and busy agencies needing reliable, lightning-fast design executions.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-[#ece7e5]/50 font-mono pt-2">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Check size={12} className="text-[#2cc3e6]" /> No long-term contracts
                </span>
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Check size={12} className="text-[#2cc3e6]" /> Priority delivery support
                </span>
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Check size={12} className="text-[#2cc3e6]" /> Professional file outputs
                </span>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setCurrentPage('packages');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="bg-[#6835d0] text-white hover:brightness-110 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] shadow-lg cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>View Designing Packages</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Selected Portfolio Work Grid */}
      <section id="portfolio" className="py-24 bg-[#141414] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left space-y-2">
              <span className="font-mono text-xs tracking-widest uppercase text-[#6835d0] font-bold">STUDIO ARCHIVE</span>
              <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">Selected Work</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                    activeFilter === cat 
                      ? 'bg-white text-black border-white font-bold' 
                      : 'bg-white/5 text-[#ece7e5]/75 border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePortfolio.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="glow-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                {/* Image Wrap */}
                <div className="h-64 sm:h-72 bg-[#1b1b1b] overflow-hidden relative border-b border-white/5">
                  <LazyImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] font-mono tracking-widest font-semibold text-[#2cc3e6]">CLICK TO VIEW SHOWCASE DETAILS</span>
                  </div>
                </div>

                {/* Meta block */}
                <div className="p-5 text-left space-y-2 relative">
                  <span className="font-mono text-[9px] text-[#2cc3e6] uppercase tracking-widest font-semibold">
                    {item.category}
                  </span>
                  <h4 className="font-display font-semibold text-lg text-[#ece7e5] group-hover:text-[#6835d0] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#ece7e5]/70 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredPortfolio.length > 3 && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  setCurrentPage('portfolio');
                }}
                className="px-8 py-3.5 border border-white/10 bg-white/5 hover:bg-white hover:text-black text-white font-display font-medium text-xs rounded-full tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md inline-flex items-center space-x-2"
              >
                <span>View Full Portfolio</span>
                <span className="text-[10px] translate-y-[1.5px] transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 7. About Section */}
      <section id="about" className="py-24 bg-[#1b1b1b] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Descriptive Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="font-mono text-xs tracking-widest uppercase text-[#6835d0] font-bold">CREATIVE FOUNDRY</span>
              <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">
                Creating Designs That <br />Tell Your Story
              </h2>
              
              <div className="w-12 h-1 bg-[#2cc3e6] rounded" />

              <div className="space-y-4 text-xs sm:text-sm text-[#ece7e5]/85 font-sans leading-relaxed">
                <p className="font-semibold text-[#ece7e5]">
                  Niorpixel Design Studio is a creative hub founded with a mission to blend art, strategy, and innovation. From pixels to perfection.
                </p>
                <p>
                  Our mission is to blend art, strategy, and innovation to transform brands from pixels to perfection. We believe that stunning aesthetics are only useful when connected deeply to product purpose and brand performance values.
                </p>
                <p>
                  Our approach combines creative thinking with strategic execution. We take the time to understand your business, your goals, and your audience to deliver custom crafted solutions that are both phenomenally beautiful and highly effective.
                </p>
              </div>

              <div className="pt-4 flex items-center space-x-6">
                <div>
                  <span className="font-display font-semibold italic text-3xl sm:text-4xl text-[#6835d0]">100%</span>
                  <span className="text-[10px] block font-mono text-[#ece7e5]/60 uppercase tracking-widest">Pixel Perfection</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="font-display font-semibold text-3xl sm:text-4xl text-[#2cc3e6] drop-shadow-[0_0_8px_rgba(44,195,230,0.3)]">2026</span>
                  <span className="text-[10px] block font-mono text-[#ece7e5]/60 uppercase tracking-widest mt-1">Creative Standard</span>
                </div>
              </div>
            </div>

            {/* Generated Design Logo Canvas Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="glow-card p-3 rounded-2xl max-w-sm rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                <div className="relative border border-white/10 overflow-hidden rounded-xl bg-zinc-900">
                  <img
                    src="/logo.png"
                    alt="Niorpixel's Logo Detail"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1b1b1b]/90 text-brand-light p-2 rounded-lg text-[9px] font-mono tracking-widest uppercase border border-white/10">
                    Niorpixel's Logo identifier
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Testimonials Section (What Our Clients Say) */}
      <section className="py-24 bg-[#141414] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-bold">CLIENT LOGS & ACCLAIM</span>
            <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">What Our Clients Say</h2>
            <div className="w-12 h-1 bg-[#6835d0] mx-auto mt-2 rounded" />
          </div>

          <ReviewsList 
            reviews={clientReviews} 
            onAddReview={(newRev) => {
              const updated = [newRev, ...clientReviews];
              setClientReviews(updated);
              // Save
              localStorage.setItem('niorpixel_reviews', JSON.stringify(updated));
            }} 
          />

        </div>
      </section>

      {/* Frequently Asked Questions (FAQs) Section */}
      <FAQSection />

      {/* 9. Contact form / Get in touch ("Ready To Transform Your Brand?") */}
      <section id="contact" className="py-24 relative bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact Details Card */}
            <div className="lg:col-span-5 glow-card p-8 sm:p-10 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6]">DIRECT CONNECT</span>
                  <h3 className="text-3xl font-display font-medium tracking-tight mt-1">Get In Touch</h3>
                  <div className="w-12 h-1 bg-[#6835d0] mt-2 rounded" />
                </div>

                <div className="space-y-5 text-xs font-sans pt-4">
                  <div className="flex items-center space-x-3.5 group">
                    <div className="w-10 h-10 bg-[#6835d0]/10 rounded-lg flex items-center justify-center border border-[#6835d0]/30 shrink-0">
                      <User size={18} className="text-[#ece7e5]" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-[#ece7e5]/50 block">FOUNDER AND CREATIVE ANALYST</span>
                      <span className="font-bold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors block">Mayank Sharma</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 group">
                    <div className="w-10 h-10 bg-[#6835d0]/10 rounded-lg flex items-center justify-center border border-[#6835d0]/30 shrink-0">
                      <User size={18} className="text-[#ece7e5]" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-[#ece7e5]/50 block">CO-FOUNDER AND DIGITAL GROWTH STRATEGIST</span>
                      <span className="font-bold text-[#ece7e5] group-hover:text-[#2cc3e6] transition-colors block">Priyansh Sharma</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 group">
                    <div className="w-10 h-10 bg-[#6835d0]/10 rounded-lg flex items-center justify-center border border-[#6835d0]/30 shrink-0">
                      <MapPin size={18} className="text-[#ece7e5]" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-[#ece7e5]/50 block">LOCATION HQ</span>
                      <span className="font-semibold leading-tight block">Sector 104, Gurugram, India 122001</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 group">
                    <div className="w-10 h-10 bg-[#1b1b1b] rounded-lg flex items-center justify-center border border-white/10 shrink-0 mt-0.5">
                      <Phone size={18} className="text-[#ece7e5]" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-[#ece7e5]/50 block">PHONE / WHATSAPP</span>
                      <div className="flex flex-col space-y-1 bg-transparent">
                        <a href="tel:+919354200231" className="font-bold text-xs hover:text-[#2cc3e6] transition-colors block leading-tight">
                          +91 9354200231 <span className="text-[9px] font-mono font-normal text-white/40">(Mayank)</span>
                        </a>
                        <a href="tel:+918595822549" className="font-bold text-xs hover:text-[#2cc3e6] transition-colors block leading-tight">
                          +91 8595822549 <span className="text-[9px] font-mono font-normal text-white/40">(Priyansh)</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 group">
                    <div className="w-10 h-10 bg-[#1b1b1b] rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                      <Mail size={18} className="text-[#ece7e5]" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-[#ece7e5]/50 block">STUDIO EMAIL</span>
                      <a href="mailto:DESIGNSTUDIONIORPIXEL@GMAIL.COM" className="font-bold hover:text-[#2cc3e6] transition-colors break-all">
                        DESIGNSTUDIONIORPIXEL@GMAIL.COM
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels \& Footer tag */}
              <div className="pt-8 border-t border-white/5 mt-8 space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-[#ece7e5]/50 uppercase">Follow Our Updates</span>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.instagram.com/niorpixelstudio/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#ece7e5] transition-all flex items-center space-x-2 text-xs font-mono"
                  >
                    <Instagram size={13} />
                    <span>Instagram</span>
                  </a>
                  <a 
                    href="https://www.facebook.com/share/1Eb6r4KswP/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#ece7e5] transition-all flex items-center space-x-2 text-xs font-mono"
                  >
                    <Facebook size={13} />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Transform Form */}
            <div className="lg:col-span-7 glow-card p-8 sm:p-10 rounded-2xl text-left flex flex-col justify-center min-h-[500px]">
              {formSuccess ? (
                <SuccessAnimation onReset={() => setFormSuccess(false)} />
              ) : (
                <>
                  <div className="mb-6 space-y-1">
                    <h3 className="text-3xl font-display font-medium tracking-tight">
                      Ready To Transform Your Brand?
                    </h3>
                    <p className="text-xs text-[#ece7e5]/60 font-sans">
                      Have a packaging, logo, or dynamic branding project in mind? Let's work together.
                    </p>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono font-medium tracking-wider uppercase text-white/40 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Bhuvnesh Pasrija"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs sm:text-sm text-[#ece7e5] placeholder:text-white/20 focus:outline-none focus:border-[#2cc3e6] focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono font-medium tracking-wider uppercase text-white/40 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. partner@agency.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className={`w-full bg-white/5 border rounded-lg p-3 text-xs sm:text-sm text-[#ece7e5] placeholder:text-white/20 focus:outline-none focus:ring-1 transition-all ${getEmailBorderClass()}`}
                          required
                        />
                        {emailAddress && (
                          isEmailValid(emailAddress) ? (
                            <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1 font-sans">
                              <Check size={12} /> Valid email format
                            </p>
                          ) : (
                            <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 font-sans">
                              <span>⚠ Please enter a valid email address</span>
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-medium tracking-wider uppercase text-white/40 mb-1.5">Mobile No.</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 93542 00231"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className={`w-full bg-white/5 border rounded-lg p-3 text-xs sm:text-sm text-[#ece7e5] placeholder:text-white/20 focus:outline-none focus:ring-1 transition-all ${getPhoneBorderClass()}`}
                        required
                      />
                      {mobileNo && (
                        isPhoneValid(mobileNo) ? (
                          <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1 font-sans">
                            <Check size={12} /> Valid number format
                          </p>
                        ) : (
                          <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 font-sans">
                            <span>⚠ Please enter 10 to 15 digits</span>
                          </p>
                        )
                      )}
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-medium tracking-wider uppercase text-white/40 mb-1.5">Your Message & Requirements</label>
                      <textarea
                        placeholder="Describe design guidelines, brand kits, timeline expectations, or desired visual layouts..."
                        rows={4}
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs sm:text-sm text-[#ece7e5] placeholder:text-white/20 focus:outline-none focus:border-[#2cc3e6] focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-[#6835d0] hover:brightness-110 text-white px-6 py-3.5 w-full font-display font-medium text-xs rounded-full tracking-widest uppercase transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 10. Footer Footer */}
      <footer className="bg-[#141414] text-[#ece7e5] p-12 sm:p-16 border-t border-white/5 relative z-10 text-left select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToAnchor('home')}>
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/10 flex items-center justify-center bg-black/45 hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="NIORPIXEL Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-brand-light">
                NIORPIXEL Design Studio
              </span>
            </div>
            
            <p className="text-xs text-[#ece7e5]/70 leading-relaxed font-sans max-w-sm">
              We’re NIORPIXEL Design Studio – your one-stop creative studio for posters, logos, social media, and more. Creating designs that tell your brand story from pixels to perfection.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2cc3e6]">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-xs font-medium font-sans">
              <button onClick={() => scrollToAnchor('home')} className="hover:text-[#2cc3e6] transition-colors text-left cursor-pointer">Home</button>
              <button onClick={() => scrollToAnchor('services')} className="hover:text-[#2cc3e6] transition-colors text-left cursor-pointer">Services</button>
              <button onClick={() => scrollToAnchor('portfolio')} className="hover:text-[#2cc3e6] transition-colors text-left cursor-pointer">Portfolio</button>
              <button onClick={() => scrollToAnchor('contact')} className="hover:text-[#2cc3e6] transition-colors text-left cursor-pointer">Contact</button>
              <button onClick={() => scrollToAnchor('contact')} className="hover:text-[#2cc3e6] transition-colors text-left cursor-pointer">Get a Quote</button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2cc3e6]">Legal</h4>
            <div className="flex flex-col space-y-2 text-xs font-sans items-start">
              <button onClick={() => setActiveLegalModal('privacy')} className="cursor-pointer hover:text-[#2cc3e6] transition-colors text-left bg-transparent border-0 p-0">Privacy Policy</button>
              <button onClick={() => setActiveLegalModal('terms')} className="cursor-pointer hover:text-[#2cc3e6] transition-colors text-left bg-transparent border-0 p-0">Terms & Conditions</button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2cc3e6]">Get in Touch</h4>
            <div className="space-y-2 text-xs text-[#ece7e5]/70 font-sans">
              <p className="flex items-center space-x-2">
                <MapPin size={12} className="text-[#6835d0]" />
                <span>Gurugram, Haryana, India</span>
              </p>
              <div className="flex items-start space-x-2">
                <Phone size={12} className="text-[#ece7e5]/40 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href="tel:+919354200231" className="hover:text-[#2cc3e6] transition-colors leading-none">+91 9354200231 <span className="opacity-50 text-[10px]">(Mayank)</span></a>
                  <a href="tel:+918595822549" className="hover:text-[#2cc3e6] transition-colors leading-none">+91 8595822549 <span className="opacity-50 text-[10px]">(Priyansh)</span></a>
                </div>
              </div>
              <p className="flex items-center space-x-2 break-all">
                <Mail size={12} className="text-[#ece7e5]/40" />
                <span>designstudioniorpixel@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar with copyright and hidden backdoor lock trigger */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#ece7e5]/40">
          <p>© 2026 NIORPIXEL Design Studio. All Rights Reserved.</p>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Indication of our secure access */}
            <span className="text-[10px] font-mono">SECURE KEYBOARD PORTAL: SHIFT + A</span>
            
            <button
              onClick={() => setShowAdmin(true)}
              className="hover:text-[#2cc3e6] flex items-center space-x-1.5 font-sans font-medium text-xs py-1 px-2.5 border border-white/10 hover:border-[#2cc3e6] rounded-lg transition-all cursor-pointer bg-white/5"
            >
              <Lock size={12} className="text-[#2cc3e6]" />
              <span>Studio Board Access</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 11. Modal Detail Lightbox Overlay */}
      <PortfolioModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onDelete={handleDeletePortfolioItem}
      />

      {/* 12. Hidden Private Backdoor Dashboard */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          onRefreshData={refreshStateData}
        />
      )}

      {/* 13. Policy & Terms Legal Modals */}
      <LegalModal 
        type={activeLegalModal} 
        onClose={() => setActiveLegalModal(null)} 
      />

      {/* WhatsApp Floating Instant Chat Button */}
      <WhatsAppButton />

    </div>
  );
}
