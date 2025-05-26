import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useUserRole() {
  const [role, setRole] = useState(undefined);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setRole(docSnap.data().role);
        else setRole("user");
      } else {
        setRole(undefined);
      }
    });
    return unsubscribe;
  }, []);

  return role;
}
