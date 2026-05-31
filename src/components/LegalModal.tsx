/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, FileText, ShieldAlert } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="legal-modal-title" role="dialog" aria-modal="true">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#141414] text-[#ece7e5] border border-white/10 text-left transition-all sm:my-8 w-full max-w-2xl shadow-2xl p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#6835d0]/10 rounded-lg text-[#6835d0] border border-[#6835d0]/30">
                {type === 'privacy' ? <FileText size={20} /> : <ShieldAlert size={20} />}
              </div>
              <div>
                <h3 className="font-display font-medium text-xl text-[#ece7e5]" id="legal-modal-title">
                  {type === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Niorpixel Design Studio</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-full bg-white/5 hover:bg-white/10 p-2 text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 font-sans text-sm text-white/80 leading-relaxed scrollbar-thin">
            {type === 'privacy' ? (
              <>
                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  1. Overview
                </div>
                <p>Niorpixel Design Studio specializes in graphic design services and respects your privacy.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  2. Information Collected
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Name and contact details</li>
                  <li>Design preferences and project materials</li>
                  <li>Billing information</li>
                </ul>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  3. Purpose of Collection
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Deliver graphic design services</li>
                  <li>Communicate project updates</li>
                  <li>Process transactions</li>
                  <li>Improve customer experience</li>
                </ul>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  4. Data Protection
                </div>
                <p>We maintain security measures to protect personal data.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  5. Data Sharing
                </div>
                <p>Data may be shared with payment gateways, printing vendors (if required), and cloud storage providers.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  6. Your Rights
                </div>
                <p>You may request access, correction, or deletion of your data.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  7. Policy Updates
                </div>
                <p>We reserve the right to modify this policy.</p>

                <div className="border-l-2 border-[#2cc3e6] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  8. Contact
                </div>
                <p className="font-mono bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>WhatsApp Contact:</span>
                  <a href="https://wa.me/919354200231" target="_blank" rel="noopener noreferrer" className="text-[#2cc3e6] hover:underline font-bold">
                    +91 9354200231
                  </a>
                </p>
              </>
            ) : (
              <>
                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  1. Services
                </div>
                <p>Logo design, branding, print design, social media graphics, packaging, and related services.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  2. Quotes & Pricing
                </div>
                <p>All quotes valid for 15–30 days unless stated otherwise.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  3. Payments
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>50% advance before project start</li>
                  <li>Remaining balance due before final files release</li>
                </ul>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  4. Revisions Policy
                </div>
                <p>Revisions limited as specified in proposal. Extra revisions billable.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  5. Ownership
                </div>
                <p>Ownership transfers after full payment. Editable/source files may require additional fees.</p>

                <div className="border-l-2 border-[#6835d0] pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  6. Cancellations
                </div>
                <p>Client cancellation after work begins forfeits deposit.</p>

                <div className="border-l-2 border-red-500/50 pl-3 py-1 font-semibold text-[#ece7e5] text-base">
                  7. Liability
                </div>
                <p>Not responsible for printing errors once designs are client-approved.</p>
              </>
            )}
          </div>

          {/* Footer of modal */}
          <div className="border-t border-white/5 pt-4 mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#6835d0] hover:brightness-110 text-white px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
            >
              Acknowledge
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
