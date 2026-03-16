import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { Employee } from "../types/employee";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const employeeService = {
  async getAll() {
    const q = query(collection(db, "colaboradores"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Employee[];
  },

  async save(employee: Employee) {
    const { id, ...data } = employee;
    if (id) {
      const docRef = doc(db, "colaboradores", id);
      return await updateDoc(docRef, data as any);
    }
    return await addDoc(collection(db, "colaboradores"), data);
  },

  async update(id: string, data: Partial<Employee>) {
    const docRef = doc(db, "colaboradores", id);
    return await updateDoc(docRef, data as any);
  },

  async delete(id: string) {
    return await deleteDoc(doc(db, "colaboradores", id));
  },

  async deleteMany(ids: string[]) {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, "colaboradores", id);
      batch.delete(docRef);
    });
    return await batch.commit();
  },
};

export const storage = getStorage(app);
