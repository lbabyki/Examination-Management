import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

export default function RequireAuth({ children }) {
  const [user, setUser] = React.useState(undefined);
  const location = useLocation();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  if (user === undefined) return null; // hoặc loading indicator
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
