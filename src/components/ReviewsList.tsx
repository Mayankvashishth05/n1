/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, Quote, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientReview } from '../types';

interface ReviewsListProps {
  reviews: ClientReview[];
  onAddReview: (newReview: ClientReview) => void;
}

export default function ReviewsList({ reviews, onAddReview }: ReviewsListProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Auto scroll interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Safely get active item
  const activeReview = reviews[activeIdx] || reviews[0];

  useEffect(() => {
    if (autoplay && reviews.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % reviews.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, reviews.length]);

  const handlePrev = () => {
    setAutoplay(false); // Pause auto-rotation on user manual interaction
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setAutoplay(false); // Pause auto-rotation on user manual interaction
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const selectSlide = (idx: number) => {
    setAutoplay(false);
    setActiveIdx(idx);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewMessage) {
      alert('Please fill out Name and Feedback message.');
      return;
    }

    const newRev: ClientReview = {
      id: `review-${Date.now()}`,
      name: reviewerName,
      role: reviewerRole || 'Independent Brand Partner',
      reviewText: reviewMessage,
      rating: rating,
      date: new Date().toLocaleDateString()
    };

    onAddReview(newRev);
    setJustSubmitted(true);
    setReviewerName('');
    setReviewerRole('');
    setReviewMessage('');
    setRating(5);

    // Swap position immediately to highlight their newly placed review
    setActiveIdx(0);

    setTimeout(() => {
      setJustSubmitted(false);
      setShowReviewModal(false);
    }, 2500);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 opacity-60 font-mono text-xs">
        No approved reviews on file yet.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Testimonials Slideshow Container */}
      <div 
        className="relative max-w-4xl mx-auto"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        {/* Glow-card enclosing active review frame */}
        <div className="glow-card p-8 sm:p-12 rounded-3xl relative overflow-hidden text-center min-h-[300px] flex flex-col justify-between border border-white/5 shadow-2xl bg-[#141414]/90 backdrop-blur-md">
          
          {/* Back Elegant Watermark Quote Icon */}
          <div className="absolute top-6 left-6 text-white/[0.02] pointer-events-none">
            <Quote size={120} className="transform rotate-180" />
          </div>
          
          <div className="relative z-10 space-y-6">
            
            {/* Active Star Rating Display */}
            <div className="flex justify-center space-x-1.5">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  size={15} 
                  className={`${i < (activeReview?.rating || 5) ? 'text-[#2cc3e6] fill-[#2cc3e6]' : 'text-white/10'}`} 
                />
              ))}
            </div>

            {/* Carousel Interactive Transition */}
            <div className="min-h-[110px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview?.id || 'empty'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <blockquote className="font-display font-light text-[#ece7e5] text-base sm:text-lg md:text-xl leading-relaxed italic max-w-2xl mx-auto">
                    "{activeReview?.reviewText}"
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Client Bio block */}
          <div className="border-t border-white/5 pt-6 mt-8 flex flex-col items-center justify-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview?.id ? `bio-${activeReview.id}` : 'bio-empty'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <cite className="not-italic font-display font-bold text-[#ece7e5] text-sm tracking-wide block">
                  {activeReview?.name}
                </cite>
                {activeReview?.role && (
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#2cc3e6] mt-1.5 block font-semibold">
                    {activeReview?.role}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous/Next Manual Navigation Cheek Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-20">
            <button
              onClick={handlePrev}
              type="button"
              className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-20">
            <button
              onClick={handleNext}
              type="button"
              className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Carousel Navigation Indicators Dot list */}
        {reviews.length > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeIdx === idx 
                    ? 'w-6 bg-[#6835d0]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Leave a review button and callout */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs font-mono font-medium">
          <MessageSquare size={13} className="text-[#2cc3e6]" />
          <span>Loved working with NIORPIXEL? Your review helps us grow.</span>
        </div>

        <div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white text-white hover:text-black border border-white/15 px-6 py-3 font-display font-medium text-xs rounded-full tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg"
          >
            <PlusCircle size={14} />
            <span>Leave a Review</span>
          </button>
        </div>
      </div>

      {/* Review Composer Modal Overlay */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-[#141414]/90 backdrop-blur-md transition-opacity" onClick={() => setShowReviewModal(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <div className="relative transform overflow-hidden rounded-2xl bg-[#1b1b1b] text-[#ece7e5] border border-white/10 text-left transition-all sm:my-8 w-full max-w-lg p-6 sm:p-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-display font-medium text-xl text-[#ece7e5]" id="modal-title">
                    Write Studio Review
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Verified clients submission</p>
                </div>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-full bg-white/5 hover:bg-white/10 p-1.5 text-white transition-colors cursor-pointer border border-white/10"
                >
                  ✕
                </button>
              </div>

              {justSubmitted ? (
                /* Success state */
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#6835d0]/10 rounded-full flex items-center justify-center mx-auto border border-[#6835d0]/30 animate-pulse">
                    <Star className="text-[#2cc3e6] fill-[#2cc3e6]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg text-white">Review Submitted!</h4>
                    <p className="text-xs text-white/60 font-sans mt-1">Thank you. Your feedback is now showcased in our looping carousel.</p>
                  </div>
                </div>
              ) : (
                /* Form layout */
                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-white/40 mb-1.5">Your Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Arjit Sharma"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:border-[#2cc3e6] focus:outline-none focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-white/40 mb-1.5">Your Role / Branding Line</label>
                      <input
                        type="text"
                        placeholder="e.g. Youtuber, Creative Lead"
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:border-[#2cc3e6] focus:outline-none focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-white/40 mb-1.5">Rating Stars</label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star 
                            size={20} 
                            className={`${star <= rating ? 'text-[#2cc3e6] fill-[#2cc3e6]' : 'text-white/20'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-white/40 mb-1.5">Your Design Experience & Feedback</label>
                    <textarea
                      placeholder="Discuss how Mayank and the NIORPIXEL branding suites worked with your goals..."
                      rows={4}
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/30 focus:border-[#2cc3e6] focus:outline-none focus:ring-1 focus:ring-[#2cc3e6]/20 transition-all"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="w-1/2 py-2.5 font-display text-xs rounded-full tracking-widest uppercase transition-colors bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 font-display text-xs rounded-full tracking-widest uppercase transition-all bg-[#6835d0] hover:brightness-110 text-white font-medium shadow-lg shadow-[#6835d0]/20"
                    >
                      Publish Now
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
