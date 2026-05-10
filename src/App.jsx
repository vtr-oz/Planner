import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Planner from "./components/Planner";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', background: 'var(--color-background-tertiary)' }}>
        A verificar a sessão...
      </div>
    );
  }

  // PASSAMOS A VARIÁVEL "user" AQUI PARA O PLANNER:
  return user ? <Planner user={user} /> : <Login />;
}