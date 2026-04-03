import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, ChevronRight,
  Volume2, VolumeX, Instagram, Facebook, ArrowRight, Sparkles, MapPin
} from 'lucide-react';
import { getAdminConfig } from './Admin';

const BRANDS = ['ABIB','ANUA','APLB','BEAUTY OF JOSEON','COSRX','INNISFREE','SOME BY MI','ISNTREE','KLAIRS','ROUND LAB','TORRIDEN','AXIS-Y','PURITO','DR. JART+','MEDIHEAL'];

const NAV_LINKS = [
  { label: 'Inicio',    path: '/' },
  { label: 'Productos', path: '/products' },
  { label: 'Nosotros',  path: '#nosotros' },
];

// ─── REEL CARD ────────────────────────────────────────────────────────────────
function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [muted,   setMuted]   = useState(true);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  };

  return (
    <div className="relative flex-shrink-0 w-[190px] md:w-[230px] overflow-hidden cursor-pointer bg-gray-900 shadow-xl rounded-2xl"
      style={{ aspectRatio: '9/16' }} onClick={togglePlay}>
      <video ref={videoRef} src={reel.src} poster={reel.thumb}
        muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-1"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
      <button onClick={toggleMute}
        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-black/60 transition-colors">
        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
      </button>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Index({ cartCount = 0, onOpenCart }) {
  const navigate    = useNavigate();
  const heroImgRef  = useRef(null);
  const heroVideoRef = useRef(null);
  const reelsRef    = useRef(null);
  const isDragging  = useRef(false);
  const dragStartX  = useRef(0);
  const dragScrollL = useRef(0);
  const lastScrollY = useRef(0);

  const [scrolled,        setScrolled]        = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [shopByVisible,   setShopByVisible]   = useState(true);
  const [activeEditorial, setActiveEditorial] = useState(0);

  const cfg = getAdminConfig();
  const { hero, cta, categories, editorial, reels, general } = cfg;
  const editorialTitle   = cfg.editorialTitle   || 'Glow the Korean Way';
  const editorialEyebrow = cfg.editorialEyebrow || 'Editorial';
  const reelsTitle       = cfg.reelsTitle       || 'K-Beauty en acción';
  const reelsEyebrow     = cfg.reelsEyebrow     || 'Descubrí';

  const visibleCats  = categories.filter(c => c.visible);
  const visibleReels = reels.filter(r => r.visible);

  // ── Scroll / parallax ──────────────────────────────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const onScroll = () => {
      const sy = window.scrollY;
      // Parallax solo en desktop (en mobile causa lag)
      if (!isMobile && heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${sy * 0.28}px)`;
      }
      setScrolled(sy > 60);
      setShopByVisible(sy <= lastScrollY.current || sy < 180);
      lastScrollY.current = sy;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Forzar reproducción del video hero en iOS ─────────────────────────────
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    document.addEventListener('touchstart', tryPlay, { once: true });
    return () => document.removeEventListener('touchstart', tryPlay);
  }, [hero.type, hero.src]);

  // ── Autoplay editorial ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!editorial.length) return;
    const t = setInterval(() => setActiveEditorial(p => (p + 1) % editorial.length), 4500);
    return () => clearInterval(t);
  }, [editorial.length]);

  // ── Drag reels ─────────────────────────────────────────────────────────────
  const onDragStart = (e) => {
    isDragging.current  = true;
    dragStartX.current  = e.pageX - reelsRef.current.offsetLeft;
    dragScrollL.current = reelsRef.current.scrollLeft;
    reelsRef.current.style.cursor = 'grabbing';
  };
  const onDragEnd  = () => { isDragging.current = false; if (reelsRef.current) reelsRef.current.style.cursor = 'grab'; };
  const onDragMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    reelsRef.current.scrollLeft = dragScrollL.current - (e.pageX - reelsRef.current.offsetLeft - dragStartX.current) * 1.2;
  };

  // ── Navegar con fade ───────────────────────────────────────────────────────
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ── Hero background ────────────────────────────────────────────────────────
  const renderHeroBg = () => {
    if (hero.type === 'video' && hero.src) {
      return (
        /*
         * iOS Safari requiere:
         *  - muted como atributo HTML (no solo prop)
         *  - playsinline en minúsculas como atributo HTML
         *  - webkit-playsinline para Safari antiguo
         *  - autoplay sin pausa
         * Usamos ref callback para forzar el play inmediato.
         */
        <video
          ref={el => {
            heroVideoRef.current = el;
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.setAttribute('muted', '');
              el.setAttribute('playsinline', '');
              el.setAttribute('webkit-playsinline', '');
              el.play().catch(() => {
                // Si falla (política de autoplay), intentar en primer touch
                const retry = () => { el.play().catch(() => {}); document.removeEventListener('touchstart', retry); };
                document.addEventListener('touchstart', retry, { once: true });
              });
            }
          }}
          src={hero.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        />
      );
    }
    return (
      <div ref={heroImgRef} className="absolute w-full will-change-transform" style={{ top: '-10%', height: '120%' }}>
        <img src={hero.src || ''} alt="U.RRIOLA" className="w-full h-full object-cover object-center" loading="eager" />
      </div>
    );
  };

  // ── CTA background ─────────────────────────────────────────────────────────
  const ctaBgStyle = () => {
    if (cta.type === 'image' && cta.src) return { backgroundImage: `url(${cta.src})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  };

  const isDark = cta.type !== 'color';

  return (
    <div className="bg-[#faf8f5] overflow-x-hidden" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .anim-fade-up  { animation: fadeUp .9s ease both; }
        .anim-delay-1  { animation-delay: .25s; }
        .anim-delay-2  { animation-delay: .5s; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { scrollbar-width: none; }
        /* Fix: sin borde blanco en navbar transparente */
        header.nav-transparent { border-bottom: none !important; }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#e8ddd0]'
            : 'bg-transparent nav-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Izquierda */}
          <div className="flex items-center gap-6 flex-1">
            <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen
                ? <X    size={22} strokeWidth={1.5} className={scrolled ? 'text-[#1a1209]' : 'text-white'} />
                : <Menu size={22} strokeWidth={1.5} className={scrolled ? 'text-[#1a1209]' : 'text-white'} />}
            </button>
            <nav className="hidden md:flex gap-7">
              {NAV_LINKS.map(l => (
                <button key={l.label}
                  onClick={() => l.path.startsWith('/') ? goTo(l.path) : document.querySelector(l.path)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`text-[12px] font-medium tracking-widest uppercase transition-colors duration-300 hover:text-[#c9a96e] ${scrolled ? 'text-[#4a3a31]' : 'text-white/90'}`}>
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Logo */}
          <button onClick={() => goTo('/')}
            className={`font-display text-2xl md:text-3xl tracking-[0.15em] font-semibold transition-colors duration-300 ${scrolled ? 'text-[#1a1209]' : 'text-white'}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            U.RRIOLA
          </button>

          {/* Derecha */}
          <div className="flex items-center justify-end gap-5 flex-1">
            <button onClick={() => goTo('/products')}
              className={`hidden md:block text-[12px] font-medium tracking-widest uppercase transition-colors duration-300 hover:text-[#c9a96e] ${scrolled ? 'text-[#4a3a31]' : 'text-white/90'}`}>
              Tienda
            </button>
            <button onClick={onOpenCart}
              className={`relative transition-colors hover:text-[#c9a96e] ${scrolled ? 'text-[#1a1209]' : 'text-white'}`}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#c9a96e] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`md:hidden bg-white overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-72 border-t border-[#e8ddd0]' : 'max-h-0'}`}>
          <nav className="flex flex-col px-6 py-4 gap-4">
            {[...NAV_LINKS, { label: 'Tienda', path: '/products' }].map(l => (
              <button key={l.label}
                onClick={() => { setMenuOpen(false); l.path.startsWith('/') ? goTo(l.path) : document.querySelector(l.path)?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-left text-[12px] font-medium tracking-widest uppercase text-[#4a3a31] hover:text-[#c9a96e] transition-colors py-1">
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#1a1209]" style={{ height: '100dvh' }}>
        {renderHeroBg()}

        {/* Overlay oscuro */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `rgba(0,0,0,${(hero.overlayOpacity || 55) / 100})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

        {/* Texto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="anim-fade-up text-[#c9a96e] text-[10px] tracking-[0.45em] uppercase mb-5">
            {hero.tagline || 'K-Beauty · Premium'}
          </p>
          <h1 className="anim-fade-up anim-delay-1 text-6xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {hero.title || 'U.RRIOLA'}
          </h1>
          <p className="anim-fade-up anim-delay-2 text-white/70 text-xs md:text-sm tracking-[0.3em] uppercase">
            {hero.subtitle || 'Belleza coreana al alcance de todas'}
          </p>
        </div>

        {/* Shop by flecha */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${shopByVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button onClick={() => goTo('/products')} className="flex flex-col items-center gap-3 group">
            <span className="text-white/75 text-[10px] tracking-[0.4em] uppercase">Shop By</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent group-hover:h-14 transition-all duration-500" />
          </button>
        </div>

        {/* Redes */}
        <div className="absolute left-4 md:left-8 bottom-10 flex flex-col gap-4">
          <a href={general.instagramUrl || '#'} className="text-white/40 hover:text-[#c9a96e] transition-colors"><Instagram size={17} strokeWidth={1.5} /></a>
          <a href={general.facebookUrl  || '#'} className="text-white/40 hover:text-[#c9a96e] transition-colors"><Facebook  size={17} strokeWidth={1.5} /></a>
        </div>
      </section>

      {/* ══ CATEGORÍAS ══════════════════════════════════════════════════════ */}
      {visibleCats.length > 0 && (
        <section className="py-20 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10 text-center">
              <p className="text-[#b8986a] text-[10px] tracking-[0.35em] uppercase mb-2">Colecciones</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#1a1209]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Shop by <em className="italic text-[#c9a96e]">categoría</em>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {visibleCats.map((cat) => (
                <div key={cat.id} onClick={() => goTo('/products')}
                  className="group relative overflow-hidden rounded-xl cursor-pointer" style={{ aspectRatio: '3/4' }}>
                  <img src={cat.img} alt={cat.label} loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                    <p className="text-white text-sm font-semibold tracking-wide leading-tight">{cat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ EDITORIAL ═══════════════════════════════════════════════════════ */}
      {editorial.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-[#b8986a] text-[10px] tracking-[0.35em] uppercase mb-2">{editorialEyebrow}</p>
                <h2 className="text-4xl md:text-5xl font-light text-[#1a1209]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {editorialTitle.split(' ').slice(0, -2).join(' ')}{' '}
                  <em className="italic text-[#c9a96e]">{editorialTitle.split(' ').slice(-2).join(' ')}</em>
                </h2>
              </div>
              <button onClick={() => goTo('/products')}
                className="hidden md:flex items-center gap-2 text-sm text-[#4a3a31] hover:gap-4 transition-all duration-300 font-medium">
                Ver colección <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {editorial.map((s, i) => (
                <div key={s.id}
                  onClick={() => goTo(s.link || '/products')}
                  className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ${activeEditorial === i ? 'ring-2 ring-[#c9a96e]' : 'opacity-80 hover:opacity-100'}`}
                  style={{ aspectRatio: activeEditorial === i ? '4/5' : '3/4' }}>
                  <img src={s.img} alt={s.label} loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      {s.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{s.label}</span>
                    <ChevronRight size={16} className="text-white/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ REELS ═══════════════════════════════════════════════════════════ */}
      {visibleReels.length > 0 && (
        <section className="py-20 bg-[#0e0b07] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
            <p className="text-[#b8986a] text-[10px] tracking-[0.35em] uppercase mb-2">{reelsEyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {reelsTitle.split(' ').slice(0, -2).join(' ')}{' '}
              <em className="italic text-[#c9a96e]">{reelsTitle.split(' ').slice(-2).join(' ')}</em>
            </h2>
          </div>
          <div ref={reelsRef} className="flex gap-4 px-4 md:px-8 overflow-x-auto pb-2 hide-scroll select-none"
            style={{ cursor: 'grab' }}
            onMouseDown={onDragStart} onMouseUp={onDragEnd} onMouseLeave={onDragEnd} onMouseMove={onDragMove}>
            {[...visibleReels, ...visibleReels.slice(0, 2)].map((r, i) => <ReelCard key={i} reel={r} />)}
          </div>
        </section>
      )}

      {/* ══ MARCAS ══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f7f3ee] border-y border-[#e8ddd0] overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-[#8a6f4e] text-[10px] tracking-[0.35em] uppercase">Las marcas que trabajamos</p>
        </div>
        <div className="relative flex overflow-hidden">
          {[0, 1].map(copy => (
            <div key={copy} className="flex gap-10 items-center whitespace-nowrap flex-shrink-0"
              style={{ animation: 'marquee 30s linear infinite', animationDelay: copy === 1 ? '-15s' : '0s' }}>
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={i} className="text-sm font-bold tracking-[0.2em] text-[#4a3a31]/50 uppercase hover:text-[#4a3a31] transition-colors duration-300 cursor-default">{b}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══ NOSOTROS ════════════════════════════════════════════════════════ */}
      <section id="nosotros" className="py-24 bg-[#1a1209] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#b8986a] text-[10px] tracking-[0.35em] uppercase mb-4">Nuestra filosofía</p>
            <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {general.aboutTitle || 'El secreto coreano al alcance de todas.'}
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-8">
              {general.aboutText || 'Ingredientes puros. Resultados visibles.'}
            </p>
            <button onClick={() => goTo('/products')} className="flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-[#c9a96e] hover:gap-5 transition-all duration-300">
              Ver productos <ArrowRight size={15} />
            </button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img src={general.aboutImage || ''} alt="U.RRIOLA" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-5 -left-5 w-28 h-28 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/25 flex items-center justify-center text-center p-3">
              <span className="text-[#c9a96e] text-[9px] font-bold tracking-widest uppercase leading-tight">K-Beauty<br />Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 text-center px-4 overflow-hidden" style={ctaBgStyle()}>
        {cta.type === 'video' && cta.src && (
          <video src={cta.src} autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        {isDark && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `rgba(26,18,9,${(cta.overlayOpacity || 40) / 100})` }} />
        )}
        <div className="relative z-10">
          <p className="text-[#b8986a] text-[10px] tracking-[0.4em] uppercase mb-4">
            {cta.eyebrow || 'Explorar'}
          </p>
          <h2 className="text-5xl md:text-7xl font-light mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: isDark ? 'white' : '#1a1209' }}>
            {cta.title || 'Tu rutina,'}<br />
            <em className="italic text-[#c9a96e]">{cta.titleItalic || 'elevada.'}</em>
          </h2>
          <button onClick={() => goTo('/products')}
            className="inline-flex items-center gap-3 bg-[#4a3a31] text-white text-sm font-medium tracking-widest uppercase px-10 py-4 rounded-full hover:bg-[#c9a96e] transition-all duration-500 shadow-lg hover:shadow-xl">
            <Sparkles size={15} />
            {cta.buttonText || 'Explorar tienda'}
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#1a1209] text-white/55 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="text-2xl text-white tracking-widest mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>U.RRIOLA</p>
            <p className="text-sm leading-relaxed max-w-xs">K-Beauty premium. Ingredientes puros, resultados visibles, inspirados en la filosofía coreana de belleza.</p>
            <div className="flex gap-4 mt-5">
              <a href={general.instagramUrl || '#'} className="hover:text-[#c9a96e] transition-colors"><Instagram size={17} strokeWidth={1.5} /></a>
              <a href={general.facebookUrl  || '#'} className="hover:text-[#c9a96e] transition-colors"><Facebook  size={17} strokeWidth={1.5} /></a>
            </div>
          </div>

          <div>
            <p className="text-white text-[10px] tracking-[0.25em] uppercase font-semibold mb-4">Navegación</p>
            <ul className="space-y-2 text-sm">
              {[['Inicio','/'],['Productos','/products'],['Nosotros','#nosotros']].map(([l, p]) => (
                <li key={l}>
                  <button onClick={() => p.startsWith('/') ? goTo(p) : document.querySelector(p)?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-[#c9a96e] transition-colors text-left">
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white text-[10px] tracking-[0.25em] uppercase font-semibold mb-4">Contacto</p>
            <ul className="space-y-2 text-sm">
              {general.whatsapp && (
                <li>
                  <a href={`https://wa.me/${general.whatsapp}`} target="_blank" rel="noreferrer"
                    className="hover:text-[#c9a96e] transition-colors">
                    WhatsApp: +{general.whatsapp}
                  </a>
                </li>
              )}
              <li>Envío a domicilio</li>
              <li>Retiro en tienda</li>
            </ul>
            <div className="mt-5 flex items-start gap-2 text-sm">
              <MapPin size={14} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed text-xs">
                CC El Sambil Valencia<br />
                Nivel 1, Local 115<br />
                Valencia, Estado Carabobo
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} U.RRIOLA. Todos los derechos reservados.</p>
          <p>K-Beauty · Premium · Venezuela</p>
        </div>
      </footer>
    </div>
  );
}