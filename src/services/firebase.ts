import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Employee } from "../types/employee";

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

export const employeeService = {
  async save(employee: Employee) {
    if (employee.id) {
      const docRef = doc(db, "colaboradores", employee.id);
      const { id, ...data } = employee;
      return await updateDoc(docRef, data);
    }

    return await addDoc(collection(db, "colaboradores"), employee);
  },

  async delete(id: string) {
    return await deleteDoc(doc(db, "colaboradores", id));
  },
};
