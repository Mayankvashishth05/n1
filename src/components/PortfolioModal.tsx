/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, User, Briefcase, ExternalLink, Trash, Lock, AlertCircle, Check } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function PortfolioModal({ item, onClose, onDelete }: PortfolioModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!item) return null;

  const handleVerifyAndDelete = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPasscode = localStorage.getItem('niorpixel_admin_passcode') || 'MayankNiorpixel2026';
    if (passcode === storedPasscode) {
      setErrorMsg('');
      setSuccessMsg('Project deleted successfully!');
      setTimeout(() => {
        if (onDelete) {
          onDelete(item.id);
        }
        onClose();
      }, 1500);
    } else {
      setErrorMsg('Invalid Passcode!');
    }
  };

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
                {onDelete && !successMsg && (
                  <>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center justify-center space-x-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 font-display font-bold text-[10px] tracking-widest uppercase py-2.5 rounded-lg border border-rose-300 hover:border-rose-700 transition-all cursor-pointer"
                      >
                        <Trash size={12} />
                        <span>Delete Project (Admin Only)</span>
                      </button>
                    ) : (
                      <form onSubmit={handleVerifyAndDelete} className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                        <div className="flex items-center space-x-1.5 text-rose-800 font-mono font-bold text-[10px] uppercase">
                          <Lock size={12} />
                          <span>Admin Passcode Required</span>
                        </div>
                        
                        {errorMsg && (
                          <p className="text-[10px] text-rose-600 font-semibold font-sans">
                            ⚠ {errorMsg}
                          </p>
                        )}
                        
                        <input
                          type="password"
                          placeholder="Studio Admin Passcode"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          className="w-full bg-white border border-rose-300 rounded p-2 text-xs font-mono text-[#1b1b1b] focus:outline-none focus:border-rose-500"
                          required
                          autoFocus
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setPasscode('');
                              setErrorMsg('');
                            }}
                            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[10px] font-bold font-display uppercase tracking-wider py-2 rounded transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold font-display uppercase tracking-wider py-2 rounded transition-all flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Trash size={10} />
                            <span>Confirm Delete</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}

                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-2 animate-pulse">
                    <Check size={16} className="text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

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
