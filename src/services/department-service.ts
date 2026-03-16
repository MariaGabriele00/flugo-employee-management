import {
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
import { db } from "./firebase";
import { DepartmentData } from "../schemas/department";

const COLLECTION_NAME = "departments";

export const departmentService = {
  async getAll() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DepartmentData[];
  },

  async create(data: DepartmentData) {
    return await addDoc(collection(db, COLLECTION_NAME), data);
  },

  async update(id: string, data: DepartmentData) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, { ...data });
  },

  async delete(id: string) {
    return await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  async deleteMany(ids: string[]) {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.delete(docRef);
    });
    return await batch.commit();
  },
};
