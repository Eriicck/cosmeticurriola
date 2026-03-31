import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate  = useNavigate();
  const auth      = getAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        .anim-fade-up { animation: fadeUp .7s ease both; }
        .anim-delay-1 { animation-delay: .15s; }
        .anim-delay-2 { animation-delay: .3s; }
        .anim-delay-3 { animation-delay: .45s; }
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 14px;
          padding: 10px 0;
          outline: none;
          transition: border-color .3s;
          font-family: 'Jost', sans-serif;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.3); }
        .input-field:focus { border-bottom-color: rgba(201,169,110,0.8); }
      `}</style>

      {/* Panel izquierdo — imagen decorativa */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0e0b07]">
        <img
          src="https://k-wowcosmetics.myshopify.com/cdn/shop/files/K-WOW12.webp?v=1773419765&width=1200"
          alt="U.RRIOLA"
          className="w-full h-full object-cover object-center opacity-50"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b07]/80 via-[#0e0b07]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b07]/90 via-transparent to-transparent" />

        {/* Texto decorativo */}
        <div className="absolute bottom-12 left-12">
          <p className="text-[#b8986a] text-[10px] tracking-[0.4em] uppercase mb-3">Panel de administración</p>
          <h2 className="text-white text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            U.RRIOLA<br /><em className="italic text-[#c9a96e]">Studio</em>
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-xs leading-relaxed">
            Gestioná tu tienda, productos y pedidos desde un solo lugar.
          </p>
        </div>

        {/* Partículas decorativas */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#c9a96e]"
            style={{
              left: `${15 + i * 14}%`,
              top:  `${20 + (i % 3) * 20}%`,
              animation: `shimmer ${2 + i * .5}s ease-in-out infinite`,
              animationDelay: `${i * .3}s`,
            }}
          />
        ))}
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 bg-[#1a1209] flex items-center justify-center px-8 py-12 relative overflow-hidden">

        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#c9a96e]/3 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4a3a31]/20 blur-3xl" />
        </div>

        <div className="w-full max-w-sm relative z-10">

          {/* Logo */}
          <div className="anim-fade-up text-center mb-12">
            <p className="text-[#b8986a] text-[9px] tracking-[0.5em] uppercase mb-2">Panel Admin</p>
            <h1 className="text-white text-4xl font-light tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              U.RRIOLA
            </h1>
            <div className="mt-3 h-px w-12 bg-[#c9a96e]/50 mx-auto" />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Email */}
            <div className="anim-fade-up anim-delay-1">
              <label className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#b8986a] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input-field"
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div className="anim-fade-up anim-delay-2">
              <label className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#b8986a] block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-8"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="anim-fade-up anim-delay-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-[#c9a96e] text-[#1a1209] py-4 text-[11px] font-bold tracking-[0.3em] uppercase rounded-lg hover:bg-[#d4b87a] transition-all duration-300 shadow-lg shadow-[#c9a96e]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Ingresar al panel'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-white/20 text-[10px] tracking-widest uppercase mt-16">
            U.RRIOLA © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}