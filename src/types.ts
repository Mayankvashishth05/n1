/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  date: string;
  client: string;
  isFeatured?: boolean;
}

export interface ClientReview {
  id: string;
  name: string;
  role?: string;
  reviewText: string;
  date?: string;
  rating?: number;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'contacted';
}

export interface Branch {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}
