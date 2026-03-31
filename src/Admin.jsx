/**
 * ADMIN.JSX — Panel de control de U.RRIOLA
 *
 * CÓMO USAR:
 * 1. Agregá en App.jsx:
 *      import Admin from './admin';
 *      <Route path="/admin" element={<Admin />} />
 * 2. Entrá a /admin en tu navegador.
 * 3. Todo lo que editás acá se guarda en localStorage y lo leerán
 *    index.jsx / products.jsx cuando los adaptes para consumir
 *    getAdminConfig() (ver el export al final de este archivo).
 *
 * SECCIONES:
 *  🖼  Hero        — imagen o video de fondo del header, overlay, textos hero
 *  📦  Productos   — precio, nombre, descripción, imágenes, stock, oferta, ton
 *  🗂  Categorías  — crear / editar / eliminar / reordenar
 *  🖼  Editorial   — imágenes, etiquetas, CTA del bloque "Glow the Korean Way"
 *  🎬  Reels       — miniaturas y URLs de los videos
 *  ✨  CTA Final   — imagen/video de fondo de "Tu rutina, elevada."
 *  ⚙️  General     — WhatsApp, textos globales, colores de marca
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Settings, Package, Grid, Image, Video, Phone,
  Plus, Trash2, Edit2, Save, X, ChevronUp, ChevronDown,
  Eye, EyeOff, Tag, ToggleLeft, ToggleRight, Upload,
  Check, AlertCircle, Layers, Palette, Move, RefreshCw
} from 'lucide-react';

// ─── DATOS POR DEFECTO (espejo de data.jsx) ───────────────────────────────────
import { MOCK_PRODUCTS, REAL_PRODUCTS, EXTRA_IMAGES, WHATSAPP_NUMBER } from './data';

const DEFAULT_CONFIG = {
  hero: {
    type: 'image',           // 'image' | 'video'
    src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/llkk.png?v=1757026476&width=1890',
    overlayOpacity: 55,      // 0-100
    tagline: 'K-Beauty · Premium',
    title: 'U.RRIOLA',
    subtitle: 'Belleza coreana al alcance de todas',
  },
  cta: {
    type: 'color',           // 'color' | 'image' | 'video'
    src: '',
    overlayOpacity: 40,
    eyebrow: 'Explorar',
    title: 'Tu rutina,',
    titleItalic: 'elevada.',
    buttonText: 'Explorar tienda',
  },
  categories: [
    { id: 'cat-1', label: 'Cuidado Facial',   img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/K-WOW-5_4.jpg?v=1759527650&width=800',                visible: true },
    { id: 'cat-2', label: 'Cuidado Capilar',  img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/WHITNEY-5_ad5fb77f-8a6a-49d5-b52e-886a87f44e81.jpg?v=1761923264&width=800', visible: true },
    { id: 'cat-3', label: 'Cuidado Corporal', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809863720054_fb49401c-039c-4ee6-a6f8-7b18e2b5a170.png?v=1748898141&width=800', visible: true },
    { id: 'cat-4', label: 'Herramientas',     img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809568744225.png?v=1757359157&width=800',            visible: true },
    { id: 'cat-5', label: 'Esenciales',       img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809820693384.jpg?v=1761923192&width=800',            visible: true },
  ],
  editorial: [
    { id: 'ed-1', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/K-WOW12.webp?v=1773419765&width=1200',  label: 'Ver todos',     tag: 'Nueva Colección', link: '/products' },
    { id: 'ed-2', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/WOW-DSC_4568.webp?v=1773419795&width=1200', label: 'Maquillaje', tag: 'Tendencia',       link: '/products' },
    { id: 'ed-3', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/ANUA_27386a3d-d0a4-41da-b6e0-0fa70956c8dc.webp?v=1773419795&width=1200', label: 'Comprar ahora', tag: 'Best Seller', link: '/products' },
  ],
  editorialTitle: 'Glow the Korean Way',
  editorialEyebrow: 'Editorial',
  reels: [
    { id: 'r-1', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/23c9b841f0954e21ba00362c3514f02d.thumbnail.0000000000_2400x.jpg?v=1771942403', src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/23c9b841f0954e21ba00362c3514f02d/23c9b841f0954e21ba00362c3514f02d.HD-720p-1.6Mbps-76489213.mp4?v=0', visible: true },
    { id: 'r-2', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/bb933e0e621a4ffb91675f500aa1b7c3.thumbnail.0000000000_2400x.jpg?v=1771942370', src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/bb933e0e621a4ffb91675f500aa1b7c3/bb933e0e621a4ffb91675f500aa1b7c3.HD-720p-1.6Mbps-76489173.mp4?v=0', visible: true },
    { id: 'r-3', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/bd08c2a6be7e4ad8a1377a6dda4d8829.thumbnail.0000000000_600x.jpg?v=1773411027',   src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/bd08c2a6be7e4ad8a1377a6dda4d8829/bd08c2a6be7e4ad8a1377a6dda4d8829.HD-1080p-2.5Mbps-77820150.mp4?v=0', visible: true },
  ],
  reelsEyebrow: 'Descubrí',
  reelsTitle: 'K-Beauty en acción',
  products: MOCK_PRODUCTS.map(p => ({
    ...p,
    description: '',
    inOffer: false,
    offerPrice: null,
    hasTon: false,
    tonValue: '',
    visible: true,
  })),
  general: {
    whatsapp: WHATSAPP_NUMBER,
    brandColor: '#c9a96e',
    darkColor: '#4a3a31',
    instagramUrl: '#',
    facebookUrl: '#',
    aboutTitle: 'El secreto coreano al alcance de todas.',
    aboutText: 'Ingredientes puros. Resultados visibles. Inspirados en la filosofía de belleza de Corea — suave, eficaz y maravillosamente simple.',
    aboutImage: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/K-WOW12.webp?v=1773419765&width=800',
  },
};

// ─── HELPERS DE PERSISTENCIA ──────────────────────────────────────────────────
const LS_KEY = 'urriola_admin_config';

export function getAdminConfig() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveConfig(cfg) {
  localStorage.setItem(LS_KEY, JSON.stringify(cfg));
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── ESTILOS COMPARTIDOS ──────────────────────────────────────────────────────
const S = {
  input: 'w-full border border-[#e8ddd0] rounded-lg px-3 py-2 text-sm text-[#1a1209] focus:outline-none focus:border-[#c9a96e] bg-white transition-colors',
  label: 'block text-[11px] font-semibold tracking-widest uppercase text-[#8a6f4e] mb-1',
  card:  'bg-white border border-[#e8ddd0] rounded-xl p-5 shadow-sm',
  btn:   'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
  btnPrimary: 'bg-[#4a3a31] text-white hover:bg-[#c9a96e]',
  btnGhost:   'border border-[#e8ddd0] text-[#4a3a31] hover:border-[#c9a96e] hover:text-[#c9a96e]',
  btnDanger:  'text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors',
};

// ─── SUBCOMPONENTES REUTILIZABLES ─────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 text-sm transition-colors ${value ? 'text-[#c9a96e]' : 'text-gray-400'}`}
    >
      {value ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      <span className="text-[#4a3a31] text-xs">{label}</span>
    </button>
  );
}

function Toast({ message, type = 'success' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-sm font-medium transition-all
      ${type === 'success' ? 'bg-[#4a3a31] text-white' : 'bg-red-500 text-white'}`}>
      {type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

function MediaField({ label, value, typeValue, onTypeChange, onSrcChange }) {
  return (
    <div className="space-y-3">
      <label className={S.label}>{label}</label>
      <div className="flex gap-2">
        {['image', 'video', 'color'].map(t => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`${S.btn} text-xs ${typeValue === t ? S.btnPrimary : S.btnGhost}`}
          >
            {t === 'image' ? <Image size={13} /> : t === 'video' ? <Video size={13} /> : <Palette size={13} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {typeValue !== 'color' && (
        <input
          className={S.input}
          placeholder={typeValue === 'video' ? 'URL del video (.mp4)' : 'URL de la imagen'}
          value={value}
          onChange={e => onSrcChange(e.target.value)}
        />
      )}
      {typeValue === 'color' && (
        <p className="text-xs text-gray-400 italic">Se usará el color de fondo de la sección (beige)</p>
      )}
      {value && typeValue === 'image' && (
        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
          <img src={value} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
        </div>
      )}
    </div>
  );
}

// ─── SECCIONES DEL PANEL ──────────────────────────────────────────────────────

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection({ config, onChange }) {
  const h = config.hero;
  const u = (key, val) => onChange({ ...config, hero: { ...h, [key]: val } });
  return (
    <div className="space-y-6">
      <MediaField
        label="Fondo del Hero (header)"
        value={h.src}
        typeValue={h.type}
        onTypeChange={v => u('type', v)}
        onSrcChange={v => u('src', v)}
      />
      <Field label={`Opacidad del overlay (${h.overlayOpacity}%)`}>
        <input type="range" min={0} max={85} value={h.overlayOpacity}
          onChange={e => u('overlayOpacity', Number(e.target.value))}
          className="w-full accent-[#c9a96e]" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Tagline pequeño">
          <input className={S.input} value={h.tagline} onChange={e => u('tagline', e.target.value)} />
        </Field>
        <Field label="Título grande">
          <input className={S.input} value={h.title} onChange={e => u('title', e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <input className={S.input} value={h.subtitle} onChange={e => u('subtitle', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
function CtaSection({ config, onChange }) {
  const c = config.cta;
  const u = (key, val) => onChange({ ...config, cta: { ...c, [key]: val } });
  return (
    <div className="space-y-6">
      <MediaField
        label='Fondo de "Tu rutina, elevada."'
        value={c.src}
        typeValue={c.type}
        onTypeChange={v => u('type', v)}
        onSrcChange={v => u('src', v)}
      />
      {c.type !== 'color' && (
        <Field label={`Opacidad del overlay (${c.overlayOpacity}%)`}>
          <input type="range" min={0} max={85} value={c.overlayOpacity}
            onChange={e => u('overlayOpacity', Number(e.target.value))}
            className="w-full accent-[#c9a96e]" />
        </Field>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Eyebrow"><input className={S.input} value={c.eyebrow}     onChange={e => u('eyebrow', e.target.value)} /></Field>
        <Field label="Título"><input className={S.input} value={c.title}       onChange={e => u('title', e.target.value)} /></Field>
        <Field label="Título (itálica)"><input className={S.input} value={c.titleItalic} onChange={e => u('titleItalic', e.target.value)} /></Field>
        <Field label="Texto del botón"><input className={S.input} value={c.buttonText}   onChange={e => u('buttonText', e.target.value)} /></Field>
      </div>
    </div>
  );
}

// ── CATEGORÍAS ────────────────────────────────────────────────────────────────
function CategoriesSection({ config, onChange }) {
  const cats = config.categories;
  const update = (newCats) => onChange({ ...config, categories: newCats });

  const move = (i, dir) => {
    const arr = [...cats];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update(arr);
  };
  const edit = (i, key, val) => {
    const arr = cats.map((c, idx) => idx === i ? { ...c, [key]: val } : c);
    update(arr);
  };
  const remove = (i) => update(cats.filter((_, idx) => idx !== i));
  const add = () => update([...cats, { id: uid(), label: 'Nueva categoría', img: '', visible: true }]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Arrastrá los botones ↑↓ para reordenar. El orden aquí es el orden en el front.</p>
      {cats.map((cat, i) => (
        <div key={cat.id} className={S.card}>
          <div className="flex items-start gap-4">
            {/* Orden */}
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => move(i, -1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronUp size={16} /></button>
              <span className="text-[10px] text-center text-gray-300 font-bold">{i+1}</span>
              <button onClick={() => move(i, 1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronDown size={16} /></button>
            </div>
            {/* Imagen preview */}
            <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {cat.img ? <img src={cat.img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="w-full h-full flex items-center justify-center"><Image size={18} className="text-gray-300" /></div>}
            </div>
            {/* Campos */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre">
                <input className={S.input} value={cat.label} onChange={e => edit(i, 'label', e.target.value)} />
              </Field>
              <Field label="URL imagen">
                <input className={S.input} placeholder="https://..." value={cat.img} onChange={e => edit(i, 'img', e.target.value)} />
              </Field>
            </div>
            {/* Acciones */}
            <div className="flex flex-col gap-2 items-end pt-1">
              <Toggle value={cat.visible} onChange={v => edit(i, 'visible', v)} label="Visible" />
              <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={15} /></button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className={`${S.btn} ${S.btnGhost} w-full justify-center border-dashed`}>
        <Plus size={15} /> Agregar categoría
      </button>
    </div>
  );
}

// ── EDITORIAL ─────────────────────────────────────────────────────────────────
function EditorialSection({ config, onChange }) {
  const eds = config.editorial;
  const update = (newEds) => onChange({ ...config, editorial: newEds });
  const edit = (i, key, val) => update(eds.map((e, idx) => idx === i ? { ...e, [key]: val } : e));
  const remove = (i) => update(eds.filter((_, idx) => idx !== i));
  const add = () => update([...eds, { id: uid(), img: '', label: 'Ver más', tag: 'Nuevo', link: '/products' }]);
  const move = (i, dir) => {
    const arr = [...eds]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; update(arr);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label='Eyebrow ("Editorial")'>
          <input className={S.input} value={config.editorialEyebrow} onChange={e => onChange({ ...config, editorialEyebrow: e.target.value })} />
        </Field>
        <Field label='Título ("Glow the Korean Way")'>
          <input className={S.input} value={config.editorialTitle} onChange={e => onChange({ ...config, editorialTitle: e.target.value })} />
        </Field>
      </div>
      <div className="border-t border-[#f0ebe4] pt-6 space-y-4">
        <p className="text-xs text-gray-400">Cada tarjeta editorial — máximo 3 recomendado.</p>
        {eds.map((ed, i) => (
          <div key={ed.id} className={S.card}>
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => move(i, -1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronUp size={16} /></button>
                <span className="text-[10px] text-center text-gray-300 font-bold">{i+1}</span>
                <button onClick={() => move(i, 1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronDown size={16} /></button>
              </div>
              <div className="w-16 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {ed.img ? <img src={ed.img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image size={18} className="text-gray-300" /></div>}
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="URL imagen"><input className={S.input} placeholder="https://..." value={ed.img} onChange={e => edit(i, 'img', e.target.value)} /></Field>
                <Field label="Etiqueta (tag)"><input className={S.input} placeholder="Best Seller" value={ed.tag} onChange={e => edit(i, 'tag', e.target.value)} /></Field>
                <Field label="Texto botón"><input className={S.input} placeholder="Ver más" value={ed.label} onChange={e => edit(i, 'label', e.target.value)} /></Field>
                <Field label="Link"><input className={S.input} placeholder="/products" value={ed.link} onChange={e => edit(i, 'link', e.target.value)} /></Field>
              </div>
              <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        <button onClick={add} className={`${S.btn} ${S.btnGhost} w-full justify-center border-dashed`}>
          <Plus size={15} /> Agregar tarjeta editorial
        </button>
      </div>
    </div>
  );
}

// ── REELS ─────────────────────────────────────────────────────────────────────
function ReelsSection({ config, onChange }) {
  const reels = config.reels;
  const update = (newR) => onChange({ ...config, reels: newR });
  const edit = (i, key, val) => update(reels.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const remove = (i) => update(reels.filter((_, idx) => idx !== i));
  const add = () => update([...reels, { id: uid(), thumb: '', src: '', visible: true }]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label='Eyebrow ("Descubrí")'>
          <input className={S.input} value={config.reelsEyebrow} onChange={e => onChange({ ...config, reelsEyebrow: e.target.value })} />
        </Field>
        <Field label='Título ("K-Beauty en acción")'>
          <input className={S.input} value={config.reelsTitle} onChange={e => onChange({ ...config, reelsTitle: e.target.value })} />
        </Field>
      </div>
      <div className="border-t border-[#f0ebe4] pt-6 space-y-4">
        {reels.map((r, i) => (
          <div key={r.id} className={S.card}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                {r.thumb ? <img src={r.thumb} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Video size={16} className="text-gray-500" /></div>}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="URL miniatura (.jpg)"><input className={S.input} placeholder="https://..." value={r.thumb} onChange={e => edit(i, 'thumb', e.target.value)} /></Field>
                <Field label="URL video (.mp4)"><input className={S.input} placeholder="https://..." value={r.src} onChange={e => edit(i, 'src', e.target.value)} /></Field>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Toggle value={r.visible} onChange={v => edit(i, 'visible', v)} label="Visible" />
                <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className={`${S.btn} ${S.btnGhost} w-full justify-center border-dashed`}>
          <Plus size={15} /> Agregar reel
        </button>
      </div>
    </div>
  );
}

// ── PRODUCTOS ─────────────────────────────────────────────────────────────────
function ProductsSection({ config, onChange }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | offer | hidden | ton
  const [editingId, setEditingId] = useState(null);
  const [editBuf, setEditBuf]   = useState(null);

  const prods = config.products;

  const filtered = prods.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'offer')  return p.inOffer;
    if (filter === 'hidden') return !p.visible;
    if (filter === 'ton')    return p.hasTon;
    return true;
  });

  const startEdit = (p) => { setEditingId(p.id); setEditBuf({ ...p }); };
  const cancelEdit = () => { setEditingId(null); setEditBuf(null); };
  const saveEdit = () => {
    onChange({ ...config, products: prods.map(p => p.id === editingId ? editBuf : p) });
    setEditingId(null); setEditBuf(null);
  };

  const quickToggle = (id, key) => {
    onChange({ ...config, products: prods.map(p => p.id === id ? { ...p, [key]: !p[key] } : p) });
  };

  const addProduct = () => {
    const newP = {
      id: Date.now(), brand: 'NUEVA MARCA', name: 'Nuevo producto', price: 0,
      image: '', images: [], stock: true, inOffer: false, offerPrice: null,
      hasTon: false, tonValue: '', visible: true, description: '',
      rating: 4.5, reviews: 0, category: 'facial',
    };
    onChange({ ...config, products: [newP, ...prods] });
    startEdit(newP);
  };

  const removeProduct = (id) => onChange({ ...config, products: prods.filter(p => p.id !== id) });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <input className={`${S.input} max-w-xs`} placeholder="Buscar por nombre o marca..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {[['all','Todos'],['offer','En oferta'],['hidden','Ocultos'],['ton','Con ton']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`${S.btn} text-xs ${filter === v ? S.btnPrimary : S.btnGhost}`}>{l}</button>
          ))}
          <button onClick={addProduct} className={`${S.btn} ${S.btnPrimary} text-xs`}><Plus size={13} /> Nuevo producto</button>
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className={`${S.card} ${!p.visible ? 'opacity-50' : ''}`}>
            {editingId === p.id && editBuf ? (
              /* ─ FORMULARIO DE EDICIÓN ─ */
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#4a3a31]">Editando: {editBuf.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className={`${S.btn} ${S.btnPrimary} text-xs`}><Save size={13} /> Guardar</button>
                    <button onClick={cancelEdit} className={`${S.btn} ${S.btnGhost} text-xs`}><X size={13} /> Cancelar</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Marca"><input className={S.input} value={editBuf.brand} onChange={e => setEditBuf(b=>({...b,brand:e.target.value}))} /></Field>
                  <Field label="Nombre" ><input className={S.input} value={editBuf.name}  onChange={e => setEditBuf(b=>({...b,name:e.target.value}))} /></Field>
                  <Field label="Precio (USD)"><input className={S.input} type="number" min={0} step={0.01} value={editBuf.price} onChange={e => setEditBuf(b=>({...b,price:Number(e.target.value)}))} /></Field>
                </div>
                <Field label="Descripción">
                  <textarea className={`${S.input} resize-none`} rows={3} value={editBuf.description} onChange={e => setEditBuf(b=>({...b,description:e.target.value}))} placeholder="Descripción del producto..." />
                </Field>
                <Field label="Imagen principal (URL)">
                  <input className={S.input} placeholder="https://..." value={editBuf.image} onChange={e => setEditBuf(b=>({...b,image:e.target.value}))} />
                </Field>
                {editBuf.image && <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100"><img src={editBuf.image} alt="" className="w-full h-full object-cover" /></div>}
                <Field label="Imágenes adicionales (URLs separadas por coma)">
                  <input className={S.input} placeholder="url1, url2, url3" value={(editBuf.images||[]).join(', ')} onChange={e => setEditBuf(b=>({...b,images:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))} />
                </Field>
                <Field label="Categoría">
                  <select className={S.input} value={editBuf.category} onChange={e => setEditBuf(b=>({...b,category:e.target.value}))}>
                    {config.categories.map(c => <option key={c.id} value={c.label.toLowerCase()}>{c.label}</option>)}
                    <option value="facial">Facial</option>
                    <option value="capilar">Capilar</option>
                    <option value="corporal">Corporal</option>
                  </select>
                </Field>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <Toggle value={editBuf.visible} onChange={v => setEditBuf(b=>({...b,visible:v}))} label="Visible en tienda" />
                  <Toggle value={editBuf.stock}   onChange={v => setEditBuf(b=>({...b,stock:v}))}   label="En stock" />
                  <Toggle value={editBuf.inOffer} onChange={v => setEditBuf(b=>({...b,inOffer:v}))} label="En oferta" />
                  <Toggle value={editBuf.hasTon}  onChange={v => setEditBuf(b=>({...b,hasTon:v}))}  label="Tiene ton" />
                </div>
                {editBuf.inOffer && (
                  <Field label="Precio de oferta (USD)">
                    <input className={S.input} type="number" min={0} step={0.01} value={editBuf.offerPrice||''} onChange={e => setEditBuf(b=>({...b,offerPrice:Number(e.target.value)}))} />
                  </Field>
                )}
                {editBuf.hasTon && (
                  <Field label="Ton / variante">
                    <input className={S.input} placeholder="Ej: 21N, 23C, Light..." value={editBuf.tonValue||''} onChange={e => setEditBuf(b=>({...b,tonValue:e.target.value}))} />
                  </Field>
                )}
              </div>
            ) : (
              /* ─ FILA DE LECTURA ─ */
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-[#c9a96e]">{p.brand}</p>
                  <p className="text-sm font-medium text-[#1a1209] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">${p.price.toFixed(2)} USD</p>
                </div>
                {/* Badges rápidos */}
                <div className="hidden md:flex gap-2 flex-shrink-0">
                  {p.inOffer && <span className="text-[9px] font-bold uppercase tracking-wider text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-full">Oferta</span>}
                  {!p.stock  && <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Sin stock</span>}
                  {p.hasTon  && <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-50 px-2 py-0.5 rounded-full">Ton</span>}
                </div>
                {/* Acciones rápidas */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => quickToggle(p.id, 'visible')} className="p-1.5 rounded-lg text-gray-300 hover:text-[#4a3a31] transition-colors" title={p.visible ? 'Ocultar' : 'Mostrar'}>
                    {p.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => quickToggle(p.id, 'stock')} className="p-1.5 rounded-lg text-gray-300 hover:text-[#4a3a31] transition-colors" title={p.stock ? 'Marcar sin stock' : 'Marcar con stock'}>
                    <Check size={15} className={p.stock ? 'text-green-400' : ''} />
                  </button>
                  <button onClick={() => quickToggle(p.id, 'inOffer')} className="p-1.5 rounded-lg text-gray-300 hover:text-[#c9a96e] transition-colors" title="Toggle oferta">
                    <Tag size={15} className={p.inOffer ? 'text-[#c9a96e]' : ''} />
                  </button>
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg text-gray-300 hover:text-[#4a3a31] transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => removeProduct(p.id)} className={S.btnDanger}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GENERAL ───────────────────────────────────────────────────────────────────
function GeneralSection({ config, onChange }) {
  const g = config.general;
  const u = (key, val) => onChange({ ...config, general: { ...g, [key]: val } });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Número de WhatsApp (con código de país)">
          <input className={S.input} placeholder="584127398442" value={g.whatsapp} onChange={e => u('whatsapp', e.target.value)} />
        </Field>
        <Field label="Color de acento (dorado)">
          <div className="flex gap-2 items-center">
            <input type="color" value={g.brandColor} onChange={e => u('brandColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-[#e8ddd0] p-0.5" />
            <input className={`${S.input} flex-1`} value={g.brandColor} onChange={e => u('brandColor', e.target.value)} />
          </div>
        </Field>
        <Field label="Color oscuro (marrón)">
          <div className="flex gap-2 items-center">
            <input type="color" value={g.darkColor} onChange={e => u('darkColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-[#e8ddd0] p-0.5" />
            <input className={`${S.input} flex-1`} value={g.darkColor} onChange={e => u('darkColor', e.target.value)} />
          </div>
        </Field>
        <Field label="Instagram URL"><input className={S.input} value={g.instagramUrl} onChange={e => u('instagramUrl', e.target.value)} /></Field>
        <Field label="Facebook URL"><input className={S.input} value={g.facebookUrl}  onChange={e => u('facebookUrl', e.target.value)} /></Field>
      </div>
      <div className="border-t border-[#f0ebe4] pt-6 space-y-4">
        <p className={S.label}>Sección Nosotros</p>
        <Field label="Imagen"><input className={S.input} value={g.aboutImage} onChange={e => u('aboutImage', e.target.value)} /></Field>
        <Field label="Título">
          <input className={S.input} value={g.aboutTitle} onChange={e => u('aboutTitle', e.target.value)} />
        </Field>
        <Field label="Texto descriptivo">
          <textarea className={`${S.input} resize-none`} rows={3} value={g.aboutText} onChange={e => u('aboutText', e.target.value)} />
        </Field>
        {g.aboutImage && (
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
            <img src={g.aboutImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PANEL PRINCIPAL ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',       label: 'Hero',        icon: Image },
  { id: 'cta',        label: 'CTA Final',   icon: Sparkle },
  { id: 'categories', label: 'Categorías',  icon: Grid },
  { id: 'editorial',  label: 'Editorial',   icon: Layers },
  { id: 'reels',      label: 'Reels',       icon: Video },
  { id: 'products',   label: 'Productos',   icon: Package },
  { id: 'general',    label: 'General',     icon: Settings },
];

function Sparkle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    </svg>
  );
}

export default function Admin() {
  const [config, setConfig] = useState(() => {
    const saved = getAdminConfig();
    // Merge para no perder productos nuevos que no están en el guardado
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      products: saved.products ?? DEFAULT_CONFIG.products,
    };
  });
  const [activeTab, setActiveTab] = useState('hero');
  const [toast, setToast] = useState(null);
  const [dirty, setDirty] = useState(false);

  const handleChange = useCallback((newCfg) => {
    setConfig(newCfg);
    setDirty(true);
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setDirty(false);
    setToast({ message: '¡Cambios guardados!' , type: 'success' });
    setTimeout(() => setToast(null), 2800);
  };

  const handleReset = () => {
    if (!window.confirm('¿Restaurar toda la configuración por defecto? Esto borrará todos tus cambios.')) return;
    localStorage.removeItem(LS_KEY);
    setConfig(DEFAULT_CONFIG);
    setDirty(false);
    setToast({ message: 'Configuración restaurada', type: 'success' });
    setTimeout(() => setToast(null), 2800);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'hero':       return <HeroSection       config={config} onChange={handleChange} />;
      case 'cta':        return <CtaSection         config={config} onChange={handleChange} />;
      case 'categories': return <CategoriesSection  config={config} onChange={handleChange} />;
      case 'editorial':  return <EditorialSection   config={config} onChange={handleChange} />;
      case 'reels':      return <ReelsSection       config={config} onChange={handleChange} />;
      case 'products':   return <ProductsSection    config={config} onChange={handleChange} />;
      case 'general':    return <GeneralSection     config={config} onChange={handleChange} />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');`}</style>

      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>U.RRIOLA</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8986a] bg-[#c9a96e]/10 px-3 py-1 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {dirty && <span className="text-[10px] text-amber-500 font-medium animate-pulse">● Cambios sin guardar</span>}
            <button onClick={handleReset} className={`${S.btn} ${S.btnGhost} text-xs`}><RefreshCw size={13} /> Restaurar</button>
            <button onClick={handleSave} className={`${S.btn} ${S.btnPrimary} text-xs`}><Save size={13} /> Guardar todo</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-8 hide-scroll">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${S.btn} flex-shrink-0 text-xs ${activeTab === tab.id ? S.btnPrimary : S.btnGhost}`}
              >
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {renderTab()}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}