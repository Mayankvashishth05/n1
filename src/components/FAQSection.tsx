/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string | React.ReactNode;
  category: 'General' | 'Process' | 'Pricing' | 'Support' | 'Bonus';
}

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Process' | 'Pricing' | 'Support' | 'Bonus'>('All');
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFAQ = (id: number) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const faqData: FAQItem[] = useMemo(() => [
    {
      id: 1,
      category: 'General',
      question: 'What services does Niorpixel Design Studio offer?',
      answer: 'We provide logo design, branding, social media creatives, posters, flyers, business cards, packaging design, YouTube thumbnails, marketing materials, and other graphic design solutions.'
    },
    {
      id: 2,
      category: 'Process',
      question: 'How do I start a project?',
      answer: "Simply contact us through WhatsApp, email, or the contact form on our website. We'll discuss your requirements, provide a quotation, and begin once the advance payment is received."
    },
    {
      id: 3,
      category: 'Process',
      question: 'Who will handle my project?',
      answer: 'Your project will be personally managed by either Mayank Sharma (Founder & Creative Director) or Priyansh Sharma (Co-Founder & Digital Growth Strategist), depending on the project requirements.'
    },
    {
      id: 4,
      category: 'Pricing',
      question: 'How much do your design services cost?',
      answer: "Pricing depends on the project's scope, complexity, and timeline. A customized quotation will be provided after understanding your requirements."
    },
    {
      id: 5,
      category: 'Pricing',
      question: 'Do I need to pay in advance?',
      answer: 'Yes. We require a 50% advance payment before starting any project. The remaining balance must be cleared before the final files are delivered.'
    },
    {
      id: 6,
      category: 'Process',
      question: 'How long does a project take?',
      answer: (
        <div className="space-y-1">
          <p>Project timelines vary depending on the service:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#ece7e5]/80 text-xs mt-1">
            <li><strong>Social Media Post:</strong> 1–3 days (depends on the number)</li>
            <li><strong>Logo Design:</strong> 1–3 days</li>
            <li><strong>Branding Projects:</strong> 1–2 weeks</li>
            <li><strong>Custom Projects:</strong> As discussed during consultation</li>
          </ul>
        </div>
      )
    },
    {
      id: 7,
      category: 'Process',
      question: 'How many revisions are included?',
      answer: 'The number of revisions depends on the package or proposal agreed upon before the project starts. Additional revisions may incur extra charges.'
    },
    {
      id: 8,
      category: 'Process',
      question: 'What information do you need from me?',
      answer: (
        <div className="space-y-1">
          <p>Typically, we require:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#ece7e5]/80 text-xs mt-1">
            <li>Business name</li>
            <li>Project objectives</li>
            <li>Brand preferences</li>
            <li>Reference designs (if any)</li>
            <li>Content and images (if applicable)</li>
          </ul>
        </div>
      )
    },
    {
      id: 9,
      category: 'General',
      question: 'Will I own the final design?',
      answer: 'Yes. Full ownership rights are transferred after complete payment has been received.'
    },
    {
      id: 10,
      category: 'General',
      question: 'Do you provide editable/source files?',
      answer: 'Editable source files can be provided upon request and may involve an additional fee depending on the project.'
    },
    {
      id: 11,
      category: 'Process',
      question: 'Can I request urgent delivery?',
      answer: 'Yes, rush delivery may be available depending on our workload. Additional charges may apply for expedited projects.'
    },
    {
      id: 12,
      category: 'Pricing',
      question: 'What happens if I cancel my project?',
      answer: 'If the project is canceled after work has begun, the advance payment is non-refundable as stated in our Terms and Conditions.'
    },
    {
      id: 13,
      category: 'General',
      question: 'Do you offer printing services?',
      answer: 'We primarily provide design services. However, we may coordinate with printing vendors if required. Printing costs are separate from design fees.'
    },
    {
      id: 14,
      category: 'General',
      question: 'How do you protect my information?',
      answer: 'We follow industry-standard security practices to protect your project files, personal information, and business data.'
    },
    {
      id: 15,
      category: 'General',
      question: 'Will my designs be used in your portfolio?',
      answer: 'Unless otherwise agreed, completed projects may be showcased in our portfolio and marketing materials. If confidentiality is required, please inform us before the project begins.'
    },
    {
      id: 16,
      category: 'General',
      question: 'What file formats will I receive?',
      answer: (
        <div className="space-y-1">
          <p>Depending on the project, you may receive:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#ece7e5]/80 text-xs mt-1 font-mono">
            <li>PNG</li>
            <li>JPG / JPEG</li>
            <li>PDF</li>
            <li>SVG</li>
            <li>Source Files (if purchased)</li>
          </ul>
        </div>
      )
    },
    {
      id: 17,
      category: 'Support',
      question: 'Do you work with startups and small businesses?',
      answer: 'Absolutely. We specialize in helping startups, NGOs, entrepreneurs, and small businesses establish a professional visual identity.'
    },
    {
      id: 18,
      category: 'Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, bank transfers, and other mutually agreed payment methods.'
    },
    {
      id: 19,
      category: 'Support',
      question: 'Do you provide ongoing design support?',
      answer: 'Yes. We offer ongoing design support and monthly creative services for businesses that require regular graphic design work.'
    },
    {
      id: 20,
      category: 'Support',
      question: 'How can I contact Niorpixel Design Studio?',
      answer: (
        <div className="space-y-1.5">
          <p>You can reach us via:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#ece7e5]/80 text-xs mt-1">
            <li><strong>WhatsApp:</strong> <a href="tel:+919354200231" className="text-[#2cc3e6] hover:underline">+91 9354200231</a>, <a href="tel:+918595822549" className="text-[#2cc3e6] hover:underline">+91 8595822549</a></li>
            <li><strong>Contact Form</strong> on the website</li>
            <li><strong>Email</strong></li>
          </ul>
        </div>
      )
    },
    {
      id: 21,
      category: 'Bonus',
      question: 'Bonus: Why should I choose Niorpixel Design Studio?',
      answer: 'Niorpixel Design Studio combines creative design, branding expertise, and practical business-focused solutions to help brands stand out. We focus on creating designs that are visually appealing, professional, and aligned with your business goals.'
    }
  ], []);

  // Filter FAQs based on query and selected category
  const filteredFAQs = useMemo(() => {
    return faqData.filter(item => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [faqData, searchQuery, activeCategory]);

  return (
    <section className="py-24 bg-[#1b1b1b] border-b border-white/5 relative overflow-hidden">
      {/* Background Soft Flare Accent */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#6835d0]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="font-mono text-xs tracking-widest uppercase text-[#2cc3e6] font-bold">HELP & RESOLUTIONS</span>
          <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#ece7e5]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#ece7e5]/75 font-sans tracking-tight max-w-xl mx-auto">
            Find immediate answers regarding pricing, service scopes, priority support channels, and design revisions.
          </p>
          <div className="w-12 h-1 bg-[#6835d0] mx-auto mt-2 rounded" />
        </div>

        {/* Searching & Categorization Tools */}
        <div className="mb-10 space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search through questions and answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-white/5 focus:border-[#2cc3e6] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#ece7e5] placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['All', 'General', 'Process', 'Pricing', 'Support', 'Bonus'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#6835d0] text-white border-[#6835d0]'
                    : 'bg-[#141414] text-[#ece7e5]/65 border-white/5 hover:border-white/20'
                }`}
              >
                {cat === 'Bonus' ? '🔥 Why Choose Us' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3.5">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div 
                  key={faq.id}
                  className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-md hover:border-white/10 transition-colors leading-relaxed"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-5 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer select-none"
                  >
                    <span className="text-sm font-sans font-medium text-[#ece7e5] pr-4 leading-snug flex items-center gap-2">
                      {faq.category === 'Bonus' && <Sparkles size={14} className="text-yellow-400 shrink-0" />}
                      {faq.question}
                    </span>
                    <span className="text-[#2cc3e6] shrink-0 bg-white/5 p-1 rounded-lg border border-white/5">
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs text-[#ece7e5]/80 font-sans leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#141414] border border-white/5 rounded-2xl">
              <HelpCircle size={32} className="mx-auto text-white/15 mb-2.5" />
              <p className="text-xs text-[#ece7e5]/50 font-sans">No questions found matching your search. Try another query.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
