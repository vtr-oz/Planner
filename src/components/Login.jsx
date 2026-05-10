import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Falha ao iniciar sessão. Verifique se ativou o Google no painel do Firebase.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ background: 'var(--color-background-primary)', padding: '40px', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <i className="ti ti-layout-kanban" style={{ fontSize: '48px', color: 'var(--color-text-info)', marginBottom: '16px' }} />
        <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: 'var(--color-text-primary)' }}>Task Planner Pro</h1>
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Faça login para aceder e sincronizar os seus projetos na nuvem.</p>
        
        <button 
          onClick={handleLogin}
          style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
        >
          <i className="ti ti-brand-google" style={{ fontSize: '18px' }} />
          Entrar com o Google
        </button>

      </div>
    </div>
  );
}