/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ChevronDown, MapPin, Phone, Mail, Lock, Sparkles } from 'lucide-react';
import { BRANCHES_DATA } from '../data';

interface HeaderProps {
  onScrollTo: (elementId: string) => void;
  onOpenAdmin: () => void;
}

export default function Header({ onScrollTo, onOpenAdmin }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBranches, setShowBranches] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Packages', id: 'packages' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    onScrollTo(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1b1b1b]/80 backdrop-blur-md border-b border-white/5 text-[#ece7e5] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/10 flex items-center justify-center bg-black/45">
              <img
                src="/src/assets/images/NDS LOGO R.png"
                alt="NIORPIXEL Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-tighter text-lg uppercase block text-[#ece7e5]">
                NIORPIXEL
              </span>
              <p className="text-[9px] tracking-widest text-[#2cc3e6] uppercase font-mono font-medium -mt-1.5 opacity-80">
                Design Studio
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-sans font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-[11px] uppercase tracking-widest opacity-75 hover:opacity-100 hover:text-[#2cc3e6] transition-all duration-200 cursor-pointer relative py-2"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Secret Backdoor shortcut indicator (or direct trigger for users that know code) */}
            <button
              onClick={onOpenAdmin}
              title="Admin Backdoor (Press Shift + A to trigger)"
              className="p-2 text-[#ece7e5]/30 hover:text-[#2cc3e6] transition-colors duration-200"
            >
              <Lock size={14} />
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="bg-[#6835d0] text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wide hover:brightness-110 transition-all cursor-pointer"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onOpenAdmin}
              title="Admin"
              className="p-1 px-2 text-xs border border-brand-accent/50 rounded text-[#ece7e5]/60 hover:text-brand-shadow transition-colors duration-200"
            >
              <Lock size={14} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#ece7e5] p-2 hover:text-[#2cc3e6] focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1b1b1b] border-t-2 border-brand-accent/50 py-4 px-4 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2.5 text-base font-medium rounded-lg text-[#ece7e5]/90 hover:bg-brand-accent/20 hover:text-[#ece7e5] transition-all"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 px-3">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-center bg-brand-accent text-[#ece7e5] py-3 font-display font-bold text-xs rounded-lg tracking-widest uppercase border border-[#1b1b1b] custom-shadow-brand transition-all"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
