/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, Unlock, Database, Plus, Trash, Eye, 
  Settings, MessageSquare, Layers, Check, Download, AlertCircle, FileText, Mail, Phone,
  Upload, Image, Pencil, Clock
} from 'lucide-react';
import { PortfolioItem, ClientReview, QuoteRequest } from '../types';
import { 
  getStoredPortfolio, saveStoredPortfolio, 
  getStoredReviews, saveStoredReviews, 
  getStoredQuotes, saveStoredQuotes,
  PORTFOLIO_CATEGORIES
} from '../data';
import {
  getFirebasePortfolio,
  saveFirebasePortfolioItem,
  deleteFirebasePortfolioItem,
  getFirebaseReviews,
  saveFirebaseReview,
  deleteFirebaseReview,
  getFirebaseQuotes,
  saveFirebaseQuote,
  deleteFirebaseQuote,
  setPortfolioBootstrapped,
  subscribeFirebaseQuotes
} from '../lib/firebase';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export default function AdminPanel({ onClose, onRefreshData }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'quotes' | 'settings'>('portfolio');

  // Shared state copies inside Admin
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [customPasscode, setCustomPasscode] = useState('');
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form states for adding Portfolio
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Logo Design');
  const [newDesc, setNewDesc] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('/src/assets/images/burger_creative_1780153108585.png');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressAndSetImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setNewImgUrl(compressedDataUrl);
        } else {
          setNewImgUrl(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndSetImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      compressAndSetImage(file);
    }
  };

  // Form states for adding Review
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revText, setRevText] = useState('');
  const [revRating, setRevRating] = useState(5);

  // Status message alerts
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Load state
    getFirebasePortfolio()
      .then(items => {
        setPortfolio(items);
      })
      .catch(err => {
        console.error('Failed to load portfolio items from Firebase:', err);
        setPortfolio(getStoredPortfolio());
      });
    
    getFirebaseReviews()
      .then(items => {
        setReviews(items);
      })
      .catch(err => {
        console.error('Failed to load reviews from Firebase:', err);
        setReviews(getStoredReviews());
      });

    // Real-time listener for incoming lead quotes/submissions
    const unsubscribeQuotes = subscribeFirebaseQuotes(
      (items) => {
        setQuotes(items);
      },
      (err) => {
        console.error('Failed to subscribe to real-time quotes from Firebase. Loading offline fallback.', err);
        setQuotes(getStoredQuotes());
      }
    );
    
    // Default or stored custom passcode
    const storedPasscode = localStorage.getItem('niorpixel_admin_passcode');
    if (storedPasscode) {
      setCustomPasscode(storedPasscode);
    } else {
      setCustomPasscode('MayankNiorpixel2026');
    }

    return () => {
      unsubscribeQuotes();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === customPasscode) {
      setIsAuthenticated(true);
      setLoginError('');
      setSuccessMsg('Successfully Authenticated');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setLoginError('Invalid Passcode!');
    }
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      alert('Please fill out Project Title and Description');
      return;
    }

    if (editingItem) {
      const updatedItem: PortfolioItem = {
        ...editingItem,
        title: newTitle,
        category: newCategory,
        description: newDesc,
        imageUrl: newImgUrl,
        client: newClient || 'Niorpixel Client'
      };

      const updated = portfolio.map(item => item.id === editingItem.id ? updatedItem : item);
      setPortfolio(updated);

      setEditingItem(null);
      setNewTitle('');
      setNewDesc('');
      setNewClient('');
      setNewImgUrl('/logo.png');
      setSuccessMsg('Portfolio item modified in draft. Click "Save & Publish Portfolio" below to submit changes.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      const newItem: PortfolioItem = {
        id: `custom-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        description: newDesc,
        imageUrl: newImgUrl,
        date: new Date().toISOString().split('T')[0],
        client: newClient || 'Niorpixel Client',
        isFeatured: true
      };

      const updated = [newItem, ...portfolio];
      setPortfolio(updated);

      // Reset fields
      setNewTitle('');
      setNewDesc('');
      setNewClient('');
      setNewImgUrl('/logo.png');
      setSuccessMsg('New item queued in draft. Click "Save & Publish Portfolio" below to submit changes.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setNewDesc(item.description);
    setNewClient(item.client || '');
    setNewImgUrl(item.imageUrl);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewTitle('');
    setNewDesc('');
    setNewClient('');
    setNewImgUrl('/logo.png');
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm('Are you sure you want to remove this project? It will be deleted from your screen and permanently deleted upon publishing.')) {
      const updated = portfolio.filter(item => item.id !== id);
      setPortfolio(updated);
      setDeletedIds(prev => [...prev, id]);
      setSuccessMsg('Deleted project from screen. Click "Save & Publish Portfolio" below to publish live.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handlePublishPortfolio = async () => {
    setIsSavingAll(true);
    try {
      // 1. Delete deleted items from Firestore
      for (const id of deletedIds) {
        try {
          await deleteFirebasePortfolioItem(id);
        } catch (err) {
          console.error(`Failed to delete portfolio item ${id} during publish:`, err);
        }
      }

      // 2. Save all current portfolio items to Firestore
      for (const item of portfolio) {
        await saveFirebasePortfolioItem(item);
      }

      // 3. Mark in portfolio_settings that we bootstrapped
      await setPortfolioBootstrapped(true);

      // 4. Save to local fallback storage
      saveStoredPortfolio(portfolio);

      // 5. Reset states and sync main application
      setDeletedIds([]);
      onRefreshData();
      setSuccessMsg('All portfolio changes successfully published & saved live to Firebase!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to publish portfolio to Firebase:', err);
      alert('Failed to save to Firebase database: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revText) {
      alert('Please fill out Reviewer Name and Review Text');
      return;
    }

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      name: revName,
      role: revRole || 'Customer Partner',
      reviewText: revText,
      rating: revRating
    };

    try {
      await saveFirebaseReview(newRev);
    } catch (err) {
      console.error('Failed to save review to Firebase:', err);
    }

    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
    onRefreshData();

    // Reset Fields
    setRevName('');
    setRevRole('');
    setRevText('');
    setSuccessMsg('Review added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteFirebaseReview(id);
      } catch (err) {
        console.error('Failed to delete review from Firebase:', err);
      }
      const updated = reviews.filter(rev => rev.id !== id);
      setReviews(updated);
      saveStoredReviews(updated);
      onRefreshData();
    }
  };

  const handleUpdateQuoteStatus = async (id: string, nextStatus: 'pending' | 'reviewed' | 'contacted') => {
    const quoteToUpdate = quotes.find(q => q.id === id);
    if (!quoteToUpdate) return;
    const updatedQuote: QuoteRequest = { ...quoteToUpdate, status: nextStatus };

    try {
      await saveFirebaseQuote(updatedQuote);
    } catch (err) {
      console.error('Failed to update quote status on Firebase:', err);
    }

    const updated = quotes.map(quote => 
      quote.id === id ? updatedQuote : quote
    );
    setQuotes(updated);
    saveStoredQuotes(updated);
  };

  const handleDeleteQuote = async (id: string) => {
    if (confirm('Are you sure you want to delete this quote request?')) {
      try {
        await deleteFirebaseQuote(id);
      } catch (err) {
        console.error('Failed to delete quote from Firebase:', err);
      }
      const updated = quotes.filter(quote => quote.id !== id);
      setQuotes(updated);
      saveStoredQuotes(updated);
      setSelectedQuoteIds(prev => prev.filter(qId => qId !== id));
    }
  };

  const handleToggleSelectQuote = (id: string) => {
    setSelectedQuoteIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleSelectAllQuotes = () => {
    if (selectedQuoteIds.length === quotes.length) {
      setSelectedQuoteIds([]);
    } else {
      setSelectedQuoteIds(quotes.map(q => q.id));
    }
  };

  const handleBatchDeleteQuotes = async () => {
    if (selectedQuoteIds.length === 0) return;
    const count = selectedQuoteIds.length;
    if (confirm(`Are you sure you want to delete all ${count} selected quote request(s)?`)) {
      for (const id of selectedQuoteIds) {
        try {
          await deleteFirebaseQuote(id);
        } catch (err) {
          console.error(`Failed to delete quote ${id} from Firebase:`, err);
        }
      }
      const updated = quotes.filter(quote => !selectedQuoteIds.includes(quote.id));
      setQuotes(updated);
      saveStoredQuotes(updated);
      setSelectedQuoteIds([]);
      setSuccessMsg(`Successfully deleted ${count} quote request(s).`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPasscode.trim()) {
      alert('Passcode cannot be empty');
      return;
    }
    localStorage.setItem('niorpixel_admin_passcode', customPasscode);
    setSuccessMsg('Admin custom passcode updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const downloadQuotesExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `niorpixel_quote_leads_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="admin-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#1b1b1b]/90 backdrop-blur-md" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#ece7e5] text-[#1b1b1b] border-4 border-[#1b1b1b] custom-shadow-accent text-left transition-all sm:my-8 w-full max-w-5xl">
          
          {/* Header Area */}
          <div className="bg-[#1b1b1b] text-[#ece7e5] p-5 sm:p-6 flex items-center justify-between border-b-4 border-[#1b1b1b]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-brand-accent rounded-lg border-2 border-[#1b1b1b] custom-shadow-brand">
                <Settings className="text-[#ece7e5]" size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl tracking-tight flex items-center space-x-2">
                  <span>NIORPIXEL Admin Dashboard</span>
                  {isAuthenticated && <span className="text-[10px] bg-brand-shadow text-[#1b1b1b] font-mono px-2 py-0.5 rounded-full uppercase font-bold">SECURE CHANNEL</span>}
                </h3>
                <p className="text-xs text-[#ece7e5]/70 font-mono">Hidden backoffice control system</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-full bg-brand-accent p-2 text-[#ece7e5] hover:bg-brand-shadow border-2 border-[#1b1b1b] hover:scale-105 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Core Content Area */}
          {!isAuthenticated ? (
            /* Login Form */
            <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center border-2 border-[#1b1b1b] custom-shadow-dark">
                <Lock size={28} className="text-brand-accent" />
              </div>

              <div>
                <h4 className="text-xl font-display font-bold">Verification Needed</h4>
                <p className="text-xs text-[#1b1b1b]/70 font-sans mt-1">
                  Enter Mayank's studio password to configure dynamic graphic layouts.
                </p>
              </div>

              {loginError && (
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-3 text-red-700 text-xs flex items-center space-x-2 font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-brand-dark/60 tracking-wider uppercase mb-1">
                    STUDIO MANAGER PASSCODE
                  </label>
                  <input
                    type="password"
                    placeholder="Enter security passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono transition-all"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-accent hover:bg-brand-accent/90 text-[#ece7e5] py-3 font-display font-bold text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] custom-shadow-dark transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#1b1b1b] cursor-pointer"
                >
                  Unlock Access
                </button>
              </form>
            </div>
          ) : (
            /* Main Dashboard Interface */
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
              
              {/* Sidebar Tabs */}
              <div className="md:col-span-3 bg-[#1b1b1b]/5 border-r-4 border-[#1b1b1b] p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar">
                
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full text-left p-3 rounded-lg font-display text-xs tracking-wider uppercase font-bold border-2 transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    activeTab === 'portfolio' 
                      ? 'bg-brand-accent text-[#ece7e5] border-[#1b1b1b] custom-shadow-dark translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-transparent text-[#1b1b1b]/80 border-transparent hover:bg-brand-accent/10'
                  }`}
                >
                  <Layers size={16} />
                  <span>Portfolio Items</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left p-3 rounded-lg font-display text-xs tracking-wider uppercase font-bold border-2 transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    activeTab === 'reviews' 
                      ? 'bg-brand-accent text-[#ece7e5] border-[#1b1b1b] custom-shadow-dark translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-transparent text-[#1b1b1b]/80 border-transparent hover:bg-brand-accent/10'
                  }`}
                >
                  <MessageSquare size={16} />
                  <span>Client Reviews</span>
                </button>

                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`w-full text-left p-3 rounded-lg font-display text-xs tracking-wider uppercase font-bold border-2 transition-all flex items-center space-x-2 relative shrink-0 cursor-pointer ${
                    activeTab === 'quotes' 
                      ? 'bg-brand-accent text-[#ece7e5] border-[#1b1b1b] custom-shadow-dark translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-transparent text-[#1b1b1b]/80 border-transparent hover:bg-brand-accent/10'
                  }`}
                >
                  <Database size={16} />
                  <span>Lead Quotes</span>
                  {quotes.filter(q => q.status === 'pending').length > 0 && (
                    <span className="absolute right-2 bg-brand-shadow text-[#1b1b1b] text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black border border-[#1b1b1b]">
                      {quotes.filter(q => q.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left p-3 rounded-lg font-display text-xs tracking-wider uppercase font-bold border-2 transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'bg-brand-accent text-[#ece7e5] border-[#1b1b1b] custom-shadow-dark translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-transparent text-[#1b1b1b]/80 border-transparent hover:bg-brand-accent/10'
                  }`}
                >
                  <Settings size={16} />
                  <span>System Settings</span>
                </button>
              </div>

              {/* Main Tab Panels */}
              <div className="md:col-span-9 p-6 sm:p-8 overflow-y-auto max-h-[580px]">
                
                {successMsg && (
                  <div className="bg-emerald-100 text-emerald-800 border-2 border-emerald-500 rounded-lg p-3.5 mb-6 text-sm flex items-center space-x-2 font-semibold">
                    <Check size={18} className="text-emerald-600 rounded-full bg-emerald-200 p-0.5 border border-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* 1. PORTFOLIO MANAGER */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-display font-bold">Dynamic Portfolio Updates</h4>
                      <p className="text-xs text-[#1b1b1b]/70 font-sans">
                        Add or remove studio projects which appear instantly on the main portfolio section of the website.
                      </p>
                    </div>

                    {/* Add/Edit Item Form */}
                    <form onSubmit={handleAddPortfolio} className="bg-[#1b1b1b]/5 p-5 rounded-xl border-2 border-[#1b1b1b] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#1b1b1b]/10 pb-2 mb-2">
                        <div className="flex items-center space-x-2">
                          {editingItem ? (
                            <Pencil size={16} className="text-brand-accent animate-pulse" />
                          ) : (
                            <Plus size={16} className="text-brand-accent" />
                          )}
                          <span className="font-display font-bold text-xs tracking-wide uppercase">
                            {editingItem ? `Edit Studio Project: ${editingItem.title}` : 'Add New Graphic Suite/Design'}
                          </span>
                        </div>
                        {editingItem && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-[10px] font-mono text-[#6835d0] hover:underline uppercase font-bold cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">PROJECT TITLE</label>
                          <input
                            type="text"
                            placeholder="Burger House, Rolex Custom, etc."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">CATEGORY</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          >
                            {PORTFOLIO_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">PROJECT IMAGE</label>
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative cursor-pointer border-2 border-dashed rounded-lg p-3 transition-all flex flex-col items-center justify-center min-h-[95px] ${
                              isDragging 
                                ? 'border-[#6835d0] bg-[#6835d0]/5' 
                                : 'border-[#1b1b1b]/30 hover:border-brand-accent bg-[#ece7e5]'
                            }`}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileChange} 
                              accept="image/*" 
                              className="hidden" 
                            />
                            
                            {newImgUrl ? (
                              <div className="flex items-center space-x-3 w-full">
                                <div className="relative w-14 h-11 bg-black/10 rounded overflow-hidden shrink-0 border border-[#1b1b1b]/20">
                                  <img 
                                    src={newImgUrl} 
                                    alt="Uploaded preview" 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="text-left overflow-hidden">
                                  <span className="text-[10px] font-sans font-bold text-brand-dark block truncate">Image Loaded</span>
                                  <span className="text-[9px] font-mono text-[#6835d0] flex items-center space-x-1 uppercase font-semibold">
                                    <Upload size={10} />
                                    <span>Click/Drop to Change</span>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center space-y-1">
                                <Upload size={18} className="text-[#1b1b1b]/40 mx-auto" />
                                <div className="text-[10px] font-sans font-bold text-brand-dark/60">
                                  Drag & drop or <span className="text-[#6835d0] underline">browse</span>
                                </div>
                                <div className="text-[8px] font-mono text-brand-dark/40">PNG, JPG, SVG, WebP</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">CLIENT NAME</label>
                          <input
                            type="text"
                            placeholder="e.g. MamaEarth India"
                            value={newClient}
                            onChange={(e) => setNewClient(e.target.value)}
                            className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">PROJECT DESCRIPTION</label>
                        <textarea
                          placeholder="Provide a high-fidelity description about aesthetic details, core visual language, layout philosophy..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          rows={3}
                          className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="submit"
                          className="bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] px-5 py-2.5 font-display font-medium text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] custom-shadow-brand transition-all cursor-pointer"
                        >
                          {editingItem ? 'Save Changes' : 'Add to Gallery'}
                        </button>
                        {editingItem && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-transparent border-2 border-dashed border-[#1b1b1b]/30 hover:border-[#1b1b1b] text-brand-dark px-5 py-2.5 font-display font-medium text-xs rounded-lg tracking-widest uppercase transition-all cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Manage List Grid */}
                    <div className="space-y-3">
                      <span className="font-display font-bold text-xs tracking-wide uppercase text-brand-dark/50">Current Studio Portfolio ({portfolio.length})</span>
                      <div className="space-y-2">
                        {portfolio.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3.5 bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-xl hover:shadow-[4px_4px_0px_0px_#1b1b1b] transition-all">
                            <div className="flex items-center space-x-3.5">
                              <img src={item.imageUrl} alt="" className="w-12 h-12 rounded object-cover border-2 border-[#1b1b1b]" />
                              <div>
                                <h5 className="font-display font-bold text-sm text-brand-dark">{item.title}</h5>
                                <div className="flex space-x-2 text-[10px] font-mono text-brand-dark/60 mt-0.5">
                                  <span>{item.category}</span>
                                  <span>•</span>
                                  <span>{item.client}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className={`p-2 border rounded-lg transition-all cursor-pointer ${
                                  editingItem?.id === item.id
                                    ? 'bg-brand-accent text-white border-brand-accent shadow'
                                    : 'text-brand-dark hover:bg-[#1b1b1b]/10 hover:text-[#1b1b1b] border-transparent'
                                }`}
                                title="Edit Item"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-600 rounded-lg transition-all cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Draft Publish Panel */}
                    <div className="bg-[#6835d0]/10 border-2 border-[#1b1b1b] p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                      <div className="space-y-1 text-left">
                        <h4 className="font-display font-bold text-sm text-brand-dark flex items-center space-x-1.5 leading-none">
                          <Database size={15} className="text-[#6835d0]" />
                          <span>Publish Outstanding Portfolio Changes</span>
                        </h4>
                        <p className="text-[10px] font-sans text-brand-dark/70 leading-relaxed max-w-xl">
                          Your additions, edits, and deletions are saved locally as a draft. Click this button to save and publish those changes permanently to your Firebase cloud database.
                        </p>
                      </div>
                      
                      <button
                        onClick={handlePublishPortfolio}
                        disabled={isSavingAll}
                        className="w-full md:w-auto bg-[#6835d0] hover:bg-[#5224b0] disabled:opacity-50 text-[#ece7e5] px-5 py-3 font-display font-bold text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] custom-shadow-brand transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        {isSavingAll ? (
                          <>
                            <Clock size={12} className="animate-spin" />
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <>
                            <Check size={12} />
                            <span>Save & Publish Portfolio</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

                {/* 2. REVIEWS MANAGER */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-display font-bold">Client Review Portal</h4>
                      <p className="text-xs text-[#1b1b1b]/70 font-sans">
                        Control are we showing actual real testimonials. Add validated client messages or remove inappropriate items.
                      </p>
                    </div>

                    {/* Add Review */}
                    <form onSubmit={handleAddReview} className="bg-[#1b1b1b]/5 p-5 rounded-xl border-2 border-[#1b1b1b] space-y-4">
                      <div className="flex items-center space-x-2 border-b border-[#1b1b1b]/10 pb-2 mb-2">
                        <Plus size={16} className="text-brand-accent" />
                        <span className="font-display font-bold text-xs tracking-wide uppercase">Add Client Review</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1 font-semibold">CLIENT NAME</label>
                          <input
                            type="text"
                            placeholder="e.g. Bhuvnesh Pasrija"
                            value={revName}
                            onChange={(e) => setRevName(e.target.value)}
                            className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">ROLE / TITLE</label>
                          <input
                            type="text"
                            placeholder="e.g. Founder & CEO"
                            value={revRole}
                            onChange={(e) => setRevRole(e.target.value)}
                            className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">RATING</label>
                        <select
                          value={revRating}
                          onChange={(e) => setRevRating(Number(e.target.value))}
                          className="w-48 bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2 text-xs focus:outline-none font-mono"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-dark/60 mb-1">CLIENT FEEDBACK TEXT</label>
                        <textarea
                          placeholder="Paste client's exactly worded statement..."
                          value={revText}
                          onChange={(e) => setRevText(e.target.value)}
                          rows={3}
                          className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-2.5 text-xs focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-[#1b1b1b] hover:bg-brand-accent text-[#ece7e5] px-5 py-2.5 font-display font-medium text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] custom-shadow-brand transition-all cursor-pointer"
                      >
                        Publish Testimonial
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-3">
                      <span className="font-display font-bold text-xs tracking-wide uppercase text-brand-dark/50">Stored Dashboard Testimonials ({reviews.length})</span>
                      <div className="space-y-3">
                        {reviews.map((rev) => (
                          <div key={rev.id} className="p-4 bg-brand-light border-2 border-[#1b1b1b] rounded-xl flex items-start justify-between">
                            <div className="space-y-1 text-left max-w-lg">
                              <div className="flex items-center space-x-2">
                                <span className="font-display font-bold text-sm text-brand-dark">{rev.name}</span>
                                <span className="text-xs text-brand-dark/50">• {rev.role}</span>
                              </div>
                              <p className="text-xs text-brand-dark/80 italic font-sans leading-relaxed">
                                "{rev.reviewText}"
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. LEADS & QUOTES */}
                {activeTab === 'quotes' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-display font-bold">Inbound Quote Requests ({quotes.length})</h4>
                        <p className="text-xs text-[#1b1b1b]/70 font-sans">
                          Every project request filled by user in the Quote form arrives here in real time.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {quotes.length > 0 && (
                          <button
                            onClick={downloadQuotesExport}
                            className="flex items-center space-x-2 bg-[#1b1b1b] hover:bg-[#1b1b1b]/90 text-[#ece7e5] text-xs font-mono font-bold px-3.5 py-2 rounded-lg border-2 border-[#1b1b1b] custom-shadow-dark transition-all cursor-pointer"
                          >
                            <Download size={14} />
                            <span>EXPORT JSON</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {quotes.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between bg-[#1b1b1b]/5 p-3.5 rounded-xl border-2 border-[#1b1b1b] gap-3">
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-mono font-bold text-[#1b1b1b] select-none">
                            <input
                              type="checkbox"
                              checked={quotes.length > 0 && selectedQuoteIds.length === quotes.length}
                              ref={input => {
                                if (input) {
                                  input.indeterminate = selectedQuoteIds.length > 0 && selectedQuoteIds.length < quotes.length;
                                }
                              }}
                              onChange={handleSelectAllQuotes}
                              className="w-4 h-4 accent-[#6835d0] border-2 border-[#1b1b1b] rounded cursor-pointer"
                            />
                            <span>
                              {selectedQuoteIds.length === quotes.length ? "DESELECT ALL" : "SELECT ALL"} ({selectedQuoteIds.length}/{quotes.length} SELECTED)
                            </span>
                          </label>
                        </div>

                        {selectedQuoteIds.length > 0 && (
                          <button
                            onClick={handleBatchDeleteQuotes}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-black px-4 py-2 rounded-lg border-2 border-[#1b1b1b] custom-shadow-brand transition-all cursor-pointer shadow-sm animate-pulse"
                          >
                            <Trash size={13} />
                            <span>DELETE SELECTED ({selectedQuoteIds.length})</span>
                          </button>
                        )}
                      </div>
                    )}

                    {quotes.length === 0 ? (
                      <div className="border-4 border-dashed border-[#1b1b1b]/20 rounded-2xl p-12 text-center text-brand-dark/60">
                        <AlertCircle className="mx-auto text-brand-dark/40 mb-3" size={32} />
                        <p className="font-display font-bold text-sm">No quote leads found yet</p>
                        <p className="text-xs font-sans mt-1">Submit test messages on the homepage form to see them live here!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quotes.map((quote) => {
                          const isSelected = selectedQuoteIds.includes(quote.id);
                          return (
                            <div 
                              key={quote.id} 
                              className={`p-5 rounded-xl border-2 border-[#1b1b1b] transition-all relative flex items-start gap-4 ${
                                quote.status === 'contacted' ? 'opacity-70 border-dashed bg-[#ece7e5]' : 'bg-[#ece7e5]'
                              } ${
                                isSelected ? 'ring-2 ring-[#6835d0]/50 bg-[#6835d0]/5 shadow-[2px_2px_0px_0px_#1b1b1b]' : 'shadow-sm'
                              }`}
                            >
                              {/* Checkbox selector inside each quote box */}
                              <div className="flex items-center justify-center shrink-0 pt-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectQuote(quote.id)}
                                  className="w-5 h-5 accent-[#6835d0] border-2 border-[#1b1b1b] rounded cursor-pointer"
                                />
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 border-[#1b1b1b]/10 gap-2">
                                  <div>
                                    <h5 className="font-display font-bold text-base text-brand-dark flex items-center space-x-2">
                                      <span>{quote.fullName}</span>
                                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border uppercase tracking-wider ${
                                        quote.status === 'contacted' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' :
                                        quote.status === 'reviewed' ? 'bg-amber-100 text-amber-800 border-amber-400' :
                                        'bg-indigo-100 text-indigo-800 border-indigo-400'
                                      }`}>
                                        {quote.status}
                                      </span>
                                    </h5>
                                    <span className="text-[10px] font-mono text-brand-dark/50">{quote.timestamp}</span>
                                  </div>

                                  {/* Action controls */}
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-mono font-bold text-brand-dark/50">Mark:</span>
                                    <button
                                      onClick={() => handleUpdateQuoteStatus(quote.id, 'reviewed')}
                                      className="text-xs bg-[#ece7e5] hover:bg-amber-100 px-2 py-1 rounded border border-[#1b1b1b] transition-all cursor-pointer font-sans"
                                    >
                                      Reviewed
                                    </button>
                                    <button
                                      onClick={() => handleUpdateQuoteStatus(quote.id, 'contacted')}
                                      className="text-xs bg-[#ece7e5] hover:bg-emerald-100 px-2 py-1 rounded border border-[#1b1b1b] transition-all cursor-pointer font-sans"
                                    >
                                      Contacted
                                    </button>
                                    <button
                                      onClick={() => handleDeleteQuote(quote.id)}
                                      className="text-[#1b1b1b] hover:text-red-600 p-1 bg-red-100/50 rounded hover:bg-red-100 border border-transparent hover:border-red-300 transition-all cursor-pointer"
                                      title="Delete Lead"
                                    >
                                      <Trash size={14} />
                                    </button>
                                  </div>
                                </div>

                                {/* Info grid & message */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-brand-dark/80">
                                  <p className="font-mono flex items-center space-x-2">
                                    <Mail size={13} className="text-brand-accent" />
                                    <span className="font-semibold text-brand-dark">{quote.email}</span>
                                  </p>
                                  <p className="font-mono flex items-center space-x-2">
                                    <Phone size={13} className="text-brand-accent" />
                                    <span className="font-semibold text-brand-dark">{quote.mobile}</span>
                                  </p>
                                </div>

                                <div className="bg-[#1b1b1b]/5 p-3.5 rounded-lg border border-[#1b1b1b]/10">
                                  <span className="text-[9px] font-mono font-bold text-brand-dark/50 block tracking-widest uppercase mb-1">CLIENT STATEMENT MESSAGE</span>
                                  <p className="text-xs font-sans text-brand-dark/95 leading-relaxed whitespace-pre-line">
                                    {quote.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SECURITY SETTINGS */}
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-display font-bold">Admin Security Locks</h4>
                      <p className="text-xs text-[#1b1b1b]/70 font-sans">
                        Configure custom credentials to secure your graphical updates.
                      </p>
                    </div>

                    <form onSubmit={handleChangePasscode} className="bg-brand-light p-6 rounded-xl border-2 border-[#1b1b1b] max-w-md space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono font-bold text-brand-dark/60 tracking-wider uppercase mb-1">
                          CONFIGURE NEW SIGN-IN PASSCODE
                        </label>
                        <input
                          type="text"
                          placeholder="Set custom password"
                          value={customPasscode}
                          onChange={(e) => setCustomPasscode(e.target.value)}
                          className="w-full bg-[#ece7e5] border-2 border-[#1b1b1b] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-brand-accent hover:bg-brand-accent/90 text-[#ece7e5] px-5 py-3 font-display font-medium text-xs rounded-lg tracking-widest uppercase border-2 border-[#1b1b1b] custom-shadow-dark transition-all cursor-pointer"
                      >
                        Update Security Guard
                      </button>
                    </form>

                    <div className="p-4 bg-brand-shadow/20 border-2 border-brand-shadow/50 text-brand-dark/90 rounded-xl space-y-2 text-xs">
                      <h5 className="font-bold flex items-center space-x-1">
                        <AlertCircle size={15} />
                        <span>Security Information</span>
                      </h5>
                      <p className="font-sans leading-relaxed">
                        To lock dashboard out again, simply exit this window. Anyone entering Mayank's portfolio update suite will require the configured secret key.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
