import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocFromServer, collection, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioItem, ClientReview, QuoteRequest } from '../types';
import { INITIAL_PORTFOLIO, INITIAL_REVIEWS } from '../data';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test database connection on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check if portfolio bootstrap has already been performed
export async function isPortfolioBootstrapped(): Promise<boolean> {
  try {
    const docSnap = await getDoc(doc(db, 'portfolio_settings', 'config'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return !!data.bootstrapped;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function setPortfolioBootstrapped(status: boolean): Promise<void> {
  try {
    await setDoc(doc(db, 'portfolio_settings', 'config'), { bootstrapped: status });
  } catch (error) {
    console.error('Failed to update portfolio settings:', error);
  }
}

// Fetch all portfolio items from Firestore (bootstraps with initial static ones if database collection is empty)
export async function getFirebasePortfolio(): Promise<PortfolioItem[]> {
  const collectionName = 'portfolio';
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as PortfolioItem;
      items.push({
        ...data,
        id: doc.id
      });
    });

    if (items.length === 0) {
      const alreadyDeletions = await isPortfolioBootstrapped();
      if (alreadyDeletions) {
        return [];
      }

      console.log('Firestore /portfolio is empty. Auto-populating with initial portfolio items...');
      const bootstrapped: PortfolioItem[] = [];
      for (const item of INITIAL_PORTFOLIO) {
        try {
          await setDoc(doc(db, collectionName, item.id), item);
          bootstrapped.push(item);
        } catch (err) {
          console.error('Failed to bootstrap item:', item.id, err);
        }
      }
      await setPortfolioBootstrapped(true);
      return bootstrapped.length > 0 ? bootstrapped : INITIAL_PORTFOLIO;
    }

    await setPortfolioBootstrapped(true);
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

// Create or update portfolio item in Firestore
export async function saveFirebasePortfolioItem(item: PortfolioItem): Promise<void> {
  const path = `portfolio/${item.id}`;
  try {
    await setDoc(doc(db, 'portfolio', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete portfolio item from Firestore
export async function deleteFirebasePortfolioItem(id: string): Promise<void> {
  const path = `portfolio/${id}`;
  try {
    await deleteDoc(doc(db, 'portfolio', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- Client Reviews -----------------
export async function getFirebaseReviews(): Promise<ClientReview[]> {
  const collectionName = 'reviews';
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: ClientReview[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ClientReview;
      items.push({
        ...data,
        id: doc.id
      });
    });

    if (items.length === 0) {
      console.log('Firestore /reviews is empty. Auto-populating with initial reviews...');
      const bootstrapped: ClientReview[] = [];
      for (const r of INITIAL_REVIEWS) {
        try {
          await setDoc(doc(db, collectionName, r.id), r);
          bootstrapped.push(r);
        } catch (err) {
          console.error('Failed to bootstrap review item:', r.id, err);
        }
      }
      return bootstrapped.length > 0 ? bootstrapped : INITIAL_REVIEWS;
    }
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveFirebaseReview(review: ClientReview): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFirebaseReview(id: string): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------- Quotes (Leads) -----------------
export async function getFirebaseQuotes(): Promise<QuoteRequest[]> {
  const collectionName = 'quotes';
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: QuoteRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as QuoteRequest;
      items.push({
        ...data,
        id: doc.id
      });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export async function saveFirebaseQuote(quote: QuoteRequest): Promise<void> {
  const path = `quotes/${quote.id}`;
  try {
    await setDoc(doc(db, 'quotes', quote.id), quote);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFirebaseQuote(id: string): Promise<void> {
  const path = `quotes/${id}`;
  try {
    await deleteDoc(doc(db, 'quotes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeFirebaseQuotes(
  onUpdate: (quotes: QuoteRequest[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const collectionName = 'quotes';
  const q = collection(db, collectionName);
  return onSnapshot(
    q,
    (querySnapshot) => {
      const items: QuoteRequest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as QuoteRequest;
        items.push({
          ...data,
          id: doc.id
        });
      });
      // Sort by timestamp descending
      items.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Real-time snapshot error for quotes:', error);
      if (onError) onError(error);
    }
  );
}
