import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../services/firebase";
import { Employee } from "../types/employee";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "colaboradores"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Employee[];

        setEmployees(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { employees, loading };
};
