import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface UserMetadata {
  photoURL?: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  userMetadata: UserMetadata | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userMetadata: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserMetadata(null);
        setLoading(false);
        return;
      }

      const unsubMetadata = onSnapshot(
        doc(db, "users_metadata", currentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setUserMetadata(docSnap.data() as UserMetadata);
            setLoading(false);
            return;
          }

          setUserMetadata({
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
          });
          setLoading(false);
        }
      );

      return () => unsubMetadata();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userMetadata, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
