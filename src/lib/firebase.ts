import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioItem } from '../types';
import { INITIAL_PORTFOLIO } from '../data';

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
      return bootstrapped.length > 0 ? bootstrapped : INITIAL_PORTFOLIO;
    }

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
