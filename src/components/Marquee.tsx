/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Marquee() {
  const announcements = [
    "🔥 Get 20% OFF on your first Project",
    "📈 Explore Our Latest Designing Portfolio",
    "⚡ Transforming Pixels To Perfection",
    "🎨 Designing Brands That Stand Out"
  ];

  // Repeat items to fill seamless transitions
  const repeatedAnnouncements = Array(12).fill(announcements).flat();

  return (
    <div className="bg-brand-accent text-brand-light py-3.5 border-b-2 border-brand-dark overflow-hidden relative select-none">
      <div className="flex w-max relative">
        <div className="animate-marquee-slow flex whitespace-nowrap items-center space-x-12">
          {repeatedAnnouncements.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 font-display font-bold text-xs sm:text-sm uppercase tracking-[0.15em]">
              <span>{item}</span>
              <span className="text-brand-shadow mx-6">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
