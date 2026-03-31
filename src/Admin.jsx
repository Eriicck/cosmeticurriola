/**
 * ADMIN.JSX — Panel de control U.RRIOLA v2
 * getAdminConfig() es usado por index.jsx y pronbnducts.jsx
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
  Settings, Package, Grid, Image, Video, Plus, Trash2,
  Edit2, Save, X, ChevronUp, ChevronDown, Eye, EyeOff,
  Tag, ToggleLeft, ToggleRight, Check, AlertCircle, Layers,
  Palette, RefreshCw, ChevronLeft, ChevronRight, Home,
  Search, Film, FileImage, Layout, LogOut
} from 'lucide-react';
import { MOCK_PRODUCTS, WHATSAPP_NUMBER } from './data';

// ─── PERSISTENCIA ─────────────────────────────────────────────────────────────
const LS_KEY = 'urriola_admin_config';

export function getAdminConfig() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}
function saveConfig(cfg) { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); }
function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── CONFIG POR DEFECTO ───────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  hero: {
    type: 'image',
    src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/llkk.png?v=1757026476&width=1890',
    overlayOpacity: 55,
    tagline: 'K-Beauty · Premium',
    title: 'U.RRIOLA',
    subtitle: 'Belleza coreana al alcance de todas',
  },
  cta: {
    type: 'color', src: '', overlayOpacity: 40,
    eyebrow: 'Explorar', title: 'Tu rutina,',
    titleItalic: 'elevada.', buttonText: 'Explorar tienda',
  },
  categories: [
    { id: 'cat-1', label: 'Cuidado Facial',   img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/K-WOW-5_4.jpg?v=1759527650&width=800', visible: true },
    { id: 'cat-2', label: 'Cuidado Capilar',  img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/WHITNEY-5_ad5fb77f-8a6a-49d5-b52e-886a87f44e81.jpg?v=1761923264&width=800', visible: true },
    { id: 'cat-3', label: 'Cuidado Corporal', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809863720054_fb49401c-039c-4ee6-a6f8-7b18e2b5a170.png?v=1748898141&width=800', visible: true },
    { id: 'cat-4', label: 'Herramientas',     img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809568744225.png?v=1757359157&width=800', visible: true },
    { id: 'cat-5', label: 'Esenciales',       img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/collections/8809820693384.jpg?v=1761923192&width=800', visible: true },
  ],
  editorial: [
    { id: 'ed-1', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/K-WOW12.webp?v=1773419765&width=1200', label: 'Ver todos', tag: 'Nueva Colección', link: '/products' },
    { id: 'ed-2', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/WOW-DSC_4568.webp?v=1773419795&width=1200', label: 'Maquillaje', tag: 'Tendencia', link: '/products' },
    { id: 'ed-3', img: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/ANUA_27386a3d-d0a4-41da-b6e0-0fa70956c8dc.webp?v=1773419795&width=1200', label: 'Comprar ahora', tag: 'Best Seller', link: '/products' },
  ],
  editorialTitle: 'Glow the Korean Way',
  editorialEyebrow: 'Editorial',
  reels: [
    { id: 'r-1', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/23c9b841f0954e21ba00362c3514f02d.thumbnail.0000000000_2400x.jpg?v=1771942403', src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/23c9b841f0954e21ba00362c3514f02d/23c9b841f0954e21ba00362c3514f02d.HD-720p-1.6Mbps-76489213.mp4?v=0', visible: true },
    { id: 'r-2', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/bb933e0e621a4ffb91675f500aa1b7c3.thumbnail.0000000000_2400x.jpg?v=1771942370', src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/bb933e0e621a4ffb91675f500aa1b7c3/bb933e0e621a4ffb91675f500aa1b7c3.HD-720p-1.6Mbps-76489173.mp4?v=0', visible: true },
    { id: 'r-3', thumb: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/preview_images/bd08c2a6be7e4ad8a1377a6dda4d8829.thumbnail.0000000000_600x.jpg?v=1773411027', src: 'https://k-wowcosmetics.myshopify.com/cdn/shop/videos/c/vp/bd08c2a6be7e4ad8a1377a6dda4d8829/bd08c2a6be7e4ad8a1377a6dda4d8829.HD-1080p-2.5Mbps-77820150.mp4?v=0', visible: true },
  ],
  reelsEyebrow: 'Descubrí',
  reelsTitle: 'K-Beauty en acción',
  products: MOCK_PRODUCTS.map(p => ({
    ...p, description: '', inOffer: false, offerPrice: null,
    hasTon: false, tonValue: '', visible: true,
  })),
  general: {
    whatsapp: WHATSAPP_NUMBER,
    brandColor: '#c9a96e', darkColor: '#4a3a31',
    instagramUrl: '#', facebookUrl: '#',
    aboutTitle: 'El secreto coreano al alcance de todas.',
    aboutText: 'Ingredientes puros. Resultados visibles. Inspirados en la filosofía de belleza de Corea.',
    aboutImage: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/K-WOW12.webp?v=1773419765&width=800',
  },
};

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const S = {
  input:      'w-full border border-[#e8ddd0] rounded-lg px-3 py-2 text-sm text-[#1a1209] focus:outline-none focus:border-[#c9a96e] bg-white transition-colors',
  label:      'block text-[11px] font-semibold tracking-widest uppercase text-[#8a6f4e] mb-1',
  card:       'bg-white border border-[#e8ddd0] rounded-xl p-5 shadow-sm',
  btn:        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
  btnPrimary: 'bg-[#4a3a31] text-white hover:bg-[#c9a96e]',
  btnGhost:   'border border-[#e8ddd0] text-[#4a3a31] hover:border-[#c9a96e] hover:text-[#c9a96e]',
  btnDanger:  'text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors',
};

function Field({ label, children }) {
  return <div><label className={S.label}>{label}</label>{children}</div>;
}
function Toggle({ value, onChange, label }) {
  return (
    <button onClick={() => onChange(!value)} className={`flex items-center gap-2 transition-colors ${value ? 'text-[#c9a96e]' : 'text-gray-400'}`}>
      {value ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      <span className="text-[#4a3a31] text-xs">{label}</span>
    </button>
  );
}
function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-sm font-medium bg-[#4a3a31] text-white">
      <Check size={15} />{message}
    </div>
  );
}
function MediaField({ label, value, typeValue, onTypeChange, onSrcChange, hideColor }) {
  const types = hideColor ? ['image', 'video'] : ['image', 'video', 'color'];
  return (
    <div className="space-y-3">
      <label className={S.label}>{label}</label>
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => onTypeChange(t)} className={`${S.btn} text-xs ${typeValue === t ? S.btnPrimary : S.btnGhost}`}>
            {t === 'image' ? <Image size={13} /> : t === 'video' ? <Video size={13} /> : <Palette size={13} />}
            {t === 'image' ? 'Imagen' : t === 'video' ? 'Video' : 'Color sólido'}
          </button>
        ))}
      </div>
      {typeValue !== 'color' && (
        <input className={S.input} placeholder={typeValue === 'video' ? 'URL video .mp4' : 'URL imagen'}
          value={value} onChange={e => onSrcChange(e.target.value)} />
      )}
      {typeValue === 'color' && <p className="text-xs text-gray-400 italic">Usará el fondo beige de la sección</p>}
      {value && typeValue === 'image' && (
        <div className="w-full h-28 rounded-lg overflow-hidden bg-gray-100">
          <img src={value} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS DRAWER ─────────────────────────────────────────────────────────
function SettingsDrawer({ isOpen, onClose, config, onChange }) {
  const [tab, setTab] = useState('hero');
  const h = config.hero, c = config.cta, g = config.general;
  const uHero = (k, v) => onChange({ ...config, hero: { ...h, [k]: v } });
  const uCta  = (k, v) => onChange({ ...config, cta:  { ...c, [k]: v } });
  const uGen  = (k, v) => onChange({ ...config, general: { ...g, [k]: v } });

  const TABS = [
    { id: 'hero', label: 'Hero', icon: FileImage },
    { id: 'cta', label: 'CTA Final', icon: Layout },
    { id: 'editorial', label: 'Editorial', icon: Layers },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'general', label: 'General', icon: Settings },
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto flex flex-col bg-white shadow-2xl" style={{ width: 'min(660px, 96vw)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ddd0] bg-white">
          <div>
            <p className="font-semibold text-[#1a1209]">Configuración avanzada</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Ajustes de estética y estructura del sitio</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex gap-0 border-b border-[#f0ebe4] overflow-x-auto bg-white px-4 pt-3">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2
                  ${tab === t.id ? 'border-[#4a3a31] text-[#4a3a31] bg-[#faf8f5]' : 'border-transparent text-gray-400 hover:text-[#4a3a31]'}`}>
                <Icon size={13} />{t.label}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#faf8f5]">

          {tab === 'hero' && <>
            <MediaField label="Fondo del Hero (imagen o video)" value={h.src} typeValue={h.type}
              onTypeChange={v => uHero('type', v)} onSrcChange={v => uHero('src', v)} hideColor />
            <Field label={`Opacidad overlay — ${h.overlayOpacity}%`}>
              <input type="range" min={0} max={85} value={h.overlayOpacity}
                onChange={e => uHero('overlayOpacity', Number(e.target.value))} className="w-full accent-[#c9a96e]" />
            </Field>
            <Field label="Tagline pequeño"><input className={S.input} value={h.tagline} onChange={e => uHero('tagline', e.target.value)} /></Field>
            <Field label="Título grande"><input className={S.input} value={h.title} onChange={e => uHero('title', e.target.value)} /></Field>
            <Field label="Subtítulo"><input className={S.input} value={h.subtitle} onChange={e => uHero('subtitle', e.target.value)} /></Field>
          </>}

          {tab === 'cta' && <>
            <MediaField label='Fondo sección "Tu rutina, elevada."' value={c.src} typeValue={c.type}
              onTypeChange={v => uCta('type', v)} onSrcChange={v => uCta('src', v)} />
            {c.type !== 'color' && (
              <Field label={`Opacidad overlay — ${c.overlayOpacity}%`}>
                <input type="range" min={0} max={85} value={c.overlayOpacity}
                  onChange={e => uCta('overlayOpacity', Number(e.target.value))} className="w-full accent-[#c9a96e]" />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eyebrow"><input className={S.input} value={c.eyebrow} onChange={e => uCta('eyebrow', e.target.value)} /></Field>
              <Field label="Título"><input className={S.input} value={c.title} onChange={e => uCta('title', e.target.value)} /></Field>
              <Field label="Título itálica"><input className={S.input} value={c.titleItalic} onChange={e => uCta('titleItalic', e.target.value)} /></Field>
              <Field label="Botón"><input className={S.input} value={c.buttonText} onChange={e => uCta('buttonText', e.target.value)} /></Field>
            </div>
          </>}

          {tab === 'editorial' && (() => {
            const eds = config.editorial;
            const upd = nw => onChange({ ...config, editorial: nw });
            const edit = (i, k, v) => upd(eds.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
            const remove = i => upd(eds.filter((_, idx) => idx !== i));
            const move = (i, d) => { const arr=[...eds],j=i+d; if(j<0||j>=arr.length)return; [arr[i],arr[j]]=[arr[j],arr[i]]; upd(arr); };
            const add = () => upd([...eds, { id: uid(), img:'', label:'Ver más', tag:'Nuevo', link:'/products' }]);
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Eyebrow"><input className={S.input} value={config.editorialEyebrow} onChange={e => onChange({ ...config, editorialEyebrow: e.target.value })} /></Field>
                  <Field label="Título sección"><input className={S.input} value={config.editorialTitle} onChange={e => onChange({ ...config, editorialTitle: e.target.value })} /></Field>
                </div>
                {eds.map((ed, i) => (
                  <div key={ed.id} className={S.card}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 mt-1">
                        <button onClick={() => move(i,-1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronUp size={14}/></button>
                        <span className="text-[9px] text-center text-gray-300 font-bold">{i+1}</span>
                        <button onClick={() => move(i,1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronDown size={14}/></button>
                      </div>
                      {ed.img && <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0"><img src={ed.img} className="w-full h-full object-cover" alt=""/></div>}
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Field label="URL imagen"><input className={S.input} placeholder="https://..." value={ed.img} onChange={e => edit(i,'img',e.target.value)}/></Field>
                        <Field label="Tag"><input className={S.input} placeholder="Best Seller" value={ed.tag} onChange={e => edit(i,'tag',e.target.value)}/></Field>
                        <Field label="Botón"><input className={S.input} value={ed.label} onChange={e => edit(i,'label',e.target.value)}/></Field>
                        <Field label="Link"><input className={S.input} placeholder="/products" value={ed.link} onChange={e => edit(i,'link',e.target.value)}/></Field>
                      </div>
                      <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
                <button onClick={add} className={`${S.btn} ${S.btnGhost} w-full justify-center border-dashed text-xs`}><Plus size={13}/> Agregar tarjeta</button>
              </div>
            );
          })()}

          {tab === 'reels' && (() => {
            const reels = config.reels;
            const upd = nw => onChange({ ...config, reels: nw });
            const edit = (i, k, v) => upd(reels.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
            const remove = i => upd(reels.filter((_, idx) => idx !== i));
            const add = () => upd([...reels, { id: uid(), thumb:'', src:'', visible:true }]);
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Eyebrow"><input className={S.input} value={config.reelsEyebrow} onChange={e => onChange({ ...config, reelsEyebrow: e.target.value })}/></Field>
                  <Field label="Título"><input className={S.input} value={config.reelsTitle} onChange={e => onChange({ ...config, reelsTitle: e.target.value })}/></Field>
                </div>
                {reels.map((r, i) => (
                  <div key={r.id} className={S.card}>
                    <div className="flex items-center gap-3">
                      {r.thumb && <div className="w-10 h-16 rounded bg-gray-900 overflow-hidden flex-shrink-0"><img src={r.thumb} className="w-full h-full object-cover" alt=""/></div>}
                      <div className="flex-1 space-y-2">
                        <Field label="Miniatura"><input className={S.input} placeholder="https://... .jpg" value={r.thumb} onChange={e => edit(i,'thumb',e.target.value)}/></Field>
                        <Field label="Video"><input className={S.input} placeholder="https://... .mp4" value={r.src} onChange={e => edit(i,'src',e.target.value)}/></Field>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Toggle value={r.visible} onChange={v => edit(i,'visible',v)} label="Visible"/>
                        <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={add} className={`${S.btn} ${S.btnGhost} w-full justify-center border-dashed text-xs`}><Plus size={13}/> Agregar reel</button>
              </div>
            );
          })()}

          {tab === 'general' && (
            <div className="space-y-5">
              <Field label="WhatsApp (código de país sin +)">
                <input className={S.input} placeholder="584127398442" value={g.whatsapp} onChange={e => uGen('whatsapp', e.target.value)} />
              </Field>
              <Field label="Instagram URL"><input className={S.input} value={g.instagramUrl} onChange={e => uGen('instagramUrl', e.target.value)}/></Field>
              <Field label="Facebook URL"><input className={S.input} value={g.facebookUrl}   onChange={e => uGen('facebookUrl',  e.target.value)}/></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Color dorado (acento)">
                  <div className="flex gap-2 items-center">
                    <input type="color" value={g.brandColor} onChange={e => uGen('brandColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-[#e8ddd0] p-0.5"/>
                    <input className={`${S.input} flex-1`} value={g.brandColor} onChange={e => uGen('brandColor', e.target.value)}/>
                  </div>
                </Field>
                <Field label="Color marrón (oscuro)">
                  <div className="flex gap-2 items-center">
                    <input type="color" value={g.darkColor} onChange={e => uGen('darkColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-[#e8ddd0] p-0.5"/>
                    <input className={`${S.input} flex-1`} value={g.darkColor} onChange={e => uGen('darkColor', e.target.value)}/>
                  </div>
                </Field>
              </div>
              <div className="border-t border-[#e8ddd0] pt-5 space-y-4">
                <p className={S.label}>Sección Nosotros</p>
                <Field label="Imagen URL">
                  <input className={S.input} value={g.aboutImage} onChange={e => uGen('aboutImage', e.target.value)}/>
                  {g.aboutImage && <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden"><img src={g.aboutImage} className="w-full h-full object-cover" alt=""/></div>}
                </Field>
                <Field label="Título"><input className={S.input} value={g.aboutTitle} onChange={e => uGen('aboutTitle', e.target.value)}/></Field>
                <Field label="Texto descriptivo">
                  <textarea className={`${S.input} resize-none`} rows={3} value={g.aboutText} onChange={e => uGen('aboutText', e.target.value)}/>
                </Field>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
function CategoriesSection({ config, onChange }) {
  const cats = config.categories;
  const upd = nw => onChange({ ...config, categories: nw });
  const move   = (i, d) => { const arr=[...cats],j=i+d; if(j<0||j>=arr.length)return; [arr[i],arr[j]]=[arr[j],arr[i]]; upd(arr); };
  const edit   = (i, k, v) => upd(cats.map((c, idx) => idx===i ? { ...c, [k]: v } : c));
  const remove = i => upd(cats.filter((_, idx) => idx !== i));
  const add    = () => upd([...cats, { id: uid(), label:'Nueva categoría', img:'', visible:true }]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">El orden aquí determina el orden en la tienda.</p>
        <button onClick={add} className={`${S.btn} ${S.btnPrimary} text-xs`}><Plus size={13}/> Nueva</button>
      </div>
      {cats.map((cat, i) => (
        <div key={cat.id} className={`${S.card} ${!cat.visible ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(i,-1)} className="text-gray-300 hover:text-[#c9a96e]"><ChevronUp size={16}/></button>
              <span className="text-[10px] text-center text-gray-400 font-bold">{i+1}</span>
              <button onClick={() => move(i,1)}  className="text-gray-300 hover:text-[#c9a96e]"><ChevronDown size={16}/></button>
            </div>
            <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {cat.img
                ? <img src={cat.img} className="w-full h-full object-cover" alt="" onError={e => e.target.style.display='none'}/>
                : <div className="w-full h-full flex items-center justify-center"><Image size={16} className="text-gray-300"/></div>}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre"><input className={S.input} value={cat.label} onChange={e => edit(i,'label',e.target.value)}/></Field>
              <Field label="URL imagen"><input className={S.input} placeholder="https://..." value={cat.img} onChange={e => edit(i,'img',e.target.value)}/></Field>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <Toggle value={cat.visible} onChange={v => edit(i,'visible',v)} label="Visible"/>
              <button onClick={() => remove(i)} className={S.btnDanger}><Trash2 size={15}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
const PROD_PER_PAGE = 12;

function ProductsSection({ config, onChange, initialFilter = 'all' }) {
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState(initialFilter);
  const [page,      setPage]      = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editBuf,   setEditBuf]   = useState(null);

  const prods = config.products || [];

  const filtered = useMemo(() => prods.filter(p => {
    const q = search.toLowerCase();
    const m = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    if (!m) return false;
    if (filter === 'offer')    return p.inOffer;
    if (filter === 'hidden')   return !p.visible;
    if (filter === 'ton')      return p.hasTon;
    if (filter === 'nostock')  return p.stock === false;
    if (filter === 'lowstock') return p.lowStock === true;
    return true;
  }), [prods, search, filter]);

  const totalPages = Math.ceil(filtered.length / PROD_PER_PAGE);
  const paginated  = filtered.slice((page-1)*PROD_PER_PAGE, page*PROD_PER_PAGE);

  const resetPage  = v => { setFilter(v); setPage(1); };
  const startEdit  = p  => { setEditingId(p.id); setEditBuf({...p}); };
  const cancelEdit = () => { setEditingId(null); setEditBuf(null); };
  const saveEdit   = () => {
    onChange({ ...config, products: prods.map(p => p.id === editingId ? editBuf : p) });
    setEditingId(null); setEditBuf(null);
  };
  const quickToggle  = (id, key) => onChange({ ...config, products: prods.map(p => p.id===id ? {...p,[key]:!p[key]} : p) });
  const removeProduct = id => onChange({ ...config, products: prods.filter(p => p.id !== id) });
  const addProduct   = () => {
    const np = { id: Date.now(), brand:'NUEVA MARCA', name:'Nuevo producto', price:0, image:'', images:[],
      stock:true, inOffer:false, offerPrice:null, hasTon:false, tonValue:'', visible:true,
      description:'', rating:4.5, reviews:0, category:'facial' };
    onChange({ ...config, products: [np, ...prods] });
    startEdit(np); setPage(1);
  };

  const FILTERS = [
    ['all','Todos',prods.length],
    ['offer','En oferta',prods.filter(p=>p.inOffer).length],
    ['nostock','Sin stock',prods.filter(p=>p.stock===false).length],
    ['lowstock','Poco stock',prods.filter(p=>p.lowStock===true).length],
    ['hidden','Ocultos',prods.filter(p=>!p.visible).length],
    ['ton','Con ton',prods.filter(p=>p.hasTon).length],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input className={`${S.input} pl-8 w-56`} placeholder="Buscar producto o marca..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
        </div>
        <button onClick={addProduct} className={`${S.btn} ${S.btnPrimary} text-xs`}><Plus size={13}/> Nuevo producto</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(([v,l,count]) => (
          <button key={v} onClick={() => resetPage(v)}
            className={`${S.btn} text-xs ${filter===v ? S.btnPrimary : S.btnGhost}`}>
            {l}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter===v ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} resultado{filtered.length!==1?'s':''} · pág {page}/{totalPages||1}</p>

      <div className="space-y-2">
        {paginated.map(p => (
          <div key={p.id} className={`${S.card} ${!p.visible ? 'opacity-50' : ''}`}>
            {editingId === p.id && editBuf ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#4a3a31] truncate mr-4">✏️ {editBuf.name}</p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={saveEdit}   className={`${S.btn} ${S.btnPrimary} text-xs`}><Save size={13}/> Guardar</button>
                    <button onClick={cancelEdit} className={`${S.btn} ${S.btnGhost}   text-xs`}><X size={13}/> Cancelar</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Field label="Marca"><input className={S.input} value={editBuf.brand} onChange={e => setEditBuf(b=>({...b,brand:e.target.value}))}/></Field>
                  <Field label="Nombre"><input className={S.input} value={editBuf.name}  onChange={e => setEditBuf(b=>({...b,name:e.target.value}))}/></Field>
                  <Field label="Precio USD"><input className={S.input} type="number" min={0} step={0.01} value={editBuf.price} onChange={e => setEditBuf(b=>({...b,price:Number(e.target.value)}))}/></Field>
                </div>
                <Field label="Descripción">
                  <textarea className={`${S.input} resize-none`} rows={2} value={editBuf.description}
                    placeholder="Descripción breve..." onChange={e => setEditBuf(b=>({...b,description:e.target.value}))}/>
                </Field>
                <Field label="Imagen principal (URL)">
                  <input className={S.input} placeholder="https://..." value={editBuf.image} onChange={e => setEditBuf(b=>({...b,image:e.target.value}))}/>
                </Field>
                {editBuf.image && <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-100"><img src={editBuf.image} className="w-full h-full object-cover" alt=""/></div>}
                <Field label="Imágenes adicionales (separadas por coma)">
                  <input className={S.input} placeholder="url1, url2, url3"
                    value={(editBuf.images||[]).join(', ')}
                    onChange={e => setEditBuf(b=>({...b,images:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))}/>
                </Field>
                <Field label="Categoría">
                  <select className={S.input} value={editBuf.category} onChange={e => setEditBuf(b=>({...b,category:e.target.value}))}>
                    {config.categories.map(c => <option key={c.id} value={c.label.toLowerCase()}>{c.label}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
                  <Toggle value={editBuf.visible} onChange={v => setEditBuf(b=>({...b,visible:v}))}  label="Visible"/>
                  <Toggle value={editBuf.stock}    onChange={v => setEditBuf(b=>({...b,stock:v}))}     label="En stock"/>
                  <Toggle value={editBuf.inOffer}  onChange={v => setEditBuf(b=>({...b,inOffer:v}))}   label="En oferta"/>
                  <Toggle value={editBuf.hasTon}   onChange={v => setEditBuf(b=>({...b,hasTon:v}))}    label="Tiene ton"/>
                  <Toggle value={!!editBuf.lowStock} onChange={v => setEditBuf(b=>({...b,lowStock:v}))} label="Poco stock"/>
                </div>
                {editBuf.inOffer && (
                  <Field label="Precio de oferta USD">
                    <input className={S.input} type="number" min={0} step={0.01} value={editBuf.offerPrice||''} onChange={e => setEditBuf(b=>({...b,offerPrice:Number(e.target.value)}))}/>
                  </Field>
                )}
                {editBuf.hasTon && (
                  <Field label="Ton / variante (ej: 21N, 23C)">
                    <input className={S.input} value={editBuf.tonValue||''} onChange={e => setEditBuf(b=>({...b,tonValue:e.target.value}))}/>
                  </Field>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image
                    ? <img src={p.image} className="w-full h-full object-cover" alt=""/>
                    : <div className="w-full h-full flex items-center justify-center"><Package size={14} className="text-gray-300"/></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-[#c9a96e]">{p.brand}</p>
                  <p className="text-[13px] font-medium text-[#1a1209] truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <p className="text-xs text-gray-400">${Number(p.price).toFixed(2)}</p>
                    {p.inOffer   && <span className="text-[9px] font-bold uppercase text-[#c9a96e] bg-[#c9a96e]/10 px-1.5 py-0.5 rounded-full">Oferta</span>}
                    {!p.stock    && <span className="text-[9px] font-bold uppercase text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">Sin stock</span>}
                    {p.lowStock  && <span className="text-[9px] font-bold uppercase text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-full">Poco stock</span>}
                    {p.hasTon    && <span className="text-[9px] font-bold uppercase text-purple-400 bg-purple-50 px-1.5 py-0.5 rounded-full">Ton</span>}
                    {!p.visible  && <span className="text-[9px] font-bold uppercase text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Oculto</span>}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={() => quickToggle(p.id,'visible')} title={p.visible?'Ocultar':'Mostrar'}
                    className="p-2 rounded-lg text-gray-300 hover:text-[#4a3a31] hover:bg-gray-50 transition-colors">
                    {p.visible ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </button>
                  <button onClick={() => quickToggle(p.id,'stock')} title="Toggle stock"
                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Check size={14} className={p.stock ? 'text-green-400' : 'text-gray-300'}/>
                  </button>
                  <button onClick={() => quickToggle(p.id,'inOffer')} title="Toggle oferta"
                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Tag size={14} className={p.inOffer ? 'text-[#c9a96e]' : 'text-gray-300'}/>
                  </button>
                  <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-gray-300 hover:text-[#4a3a31] hover:bg-gray-50 transition-colors">
                    <Edit2 size={14}/>
                  </button>
                  <button onClick={() => removeProduct(p.id)} className={S.btnDanger}><Trash2 size={14}/></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
            className="w-8 h-8 rounded-full border border-[#e8ddd0] flex items-center justify-center hover:border-[#c9a96e] disabled:opacity-30 transition-colors">
            <ChevronLeft size={14}/>
          </button>
          {Array.from({length:totalPages},(_,i)=>i+1)
            .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
            .reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[])
            .map((p,i)=> p==='…'
              ? <span key={`e${i}`} className="text-gray-400 text-sm px-1">…</span>
              : <button key={p} onClick={()=>setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${p===page?'bg-[#4a3a31] text-white':'border border-[#e8ddd0] text-gray-600 hover:border-[#4a3a31]'}`}>
                  {p}
                </button>
            )}
          <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            className="w-8 h-8 rounded-full border border-[#e8ddd0] flex items-center justify-center hover:border-[#c9a96e] disabled:opacity-30 transition-colors">
            <ChevronRight size={14}/>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ config, onNavigate, onImportMock, onCSVImport, importing, importDone }) {
  const prods    = config.products || [];
  const enOferta = prods.filter(p => p.inOffer).length;
  const sinStock = prods.filter(p => p.stock === false).length;
  const ocultos  = prods.filter(p => !p.visible).length;
  const pocoStock = prods.filter(p => p.lowStock === true).length;
  const cats     = config.categories.filter(c => c.visible).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-[#1a1209]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Panel de administración
        </h1>
        <p className="text-sm text-gray-400 mt-1">Gestión de tu tienda U.RRIOLA K-Beauty</p>
      </div>

      {/* Stats — cada una lleva a productos con filtro */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label:'Total productos', value:prods.length,  bg:'bg-[#4a3a31]',    text:'text-white',        filter:'all' },
          { label:'En oferta',       value:enOferta,      bg:'bg-[#c9a96e]/15', text:'text-[#c9a96e]',    filter:'offer' },
          { label:'Sin stock',       value:sinStock,      bg:'bg-red-50',       text:'text-red-400',      filter:'nostock' },
          { label:'Poco stock',      value:pocoStock,     bg:'bg-orange-50',    text:'text-orange-400',   filter:'lowstock' },
          { label:'Ocultos',         value:ocultos,       bg:'bg-gray-100',     text:'text-gray-400',     filter:'hidden' },
        ].map(s => (
          <button key={s.label} onClick={() => onNavigate('products', s.filter)}
            className={`${s.bg} rounded-xl p-5 text-left hover:scale-[1.02] transition-transform`}>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${s.text} opacity-70`}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Acceso rápido */}
      <div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8a6f4e] mb-4">Lo que más usás</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon:Package, label:'Productos',   desc:'Editar precios, stock, ofertas y ton', tab:'products',   accent:'#4a3a31' },
            { icon:Grid,    label:'Categorías',  desc:'Reordenar, crear y ocultar categorías', tab:'categories', accent:'#c9a96e' },
          ].map(a => {
            const Icon = a.icon;
            return (
              <button key={a.tab} onClick={() => onNavigate(a.tab)}
                className="group flex items-center gap-4 bg-white border border-[#e8ddd0] rounded-xl p-5 hover:border-[#c9a96e] hover:shadow-md transition-all text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.accent+'18' }}>
                  <Icon size={22} style={{ color: a.accent }}/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1209]">{a.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#c9a96e] transition-colors"/>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorías activas */}
      <div className={S.card}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#1a1209]">Categorías activas ({cats}/{config.categories.length})</p>
          <button onClick={() => onNavigate('categories')} className="text-xs text-[#c9a96e] hover:underline">Editar →</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {config.categories.map(c => (
            <span key={c.id} className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full
              ${c.visible ? 'bg-[#4a3a31]/10 text-[#4a3a31]' : 'bg-gray-100 text-gray-400 line-through'}`}>
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Importación */}
      <div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8a6f4e] mb-4">Importar productos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Botón único — productos mock */}
          <div className="bg-white border border-[#e8ddd0] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4a3a31]/10 flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-[#4a3a31]"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1209]">Importar catálogo inicial</p>
                <p className="text-xs text-gray-400">Carga los {MOCK_PRODUCTS.length} productos de muestra. <strong>Una sola vez.</strong></p>
              </div>
            </div>
            {importDone
              ? <p className="text-xs text-green-600 font-medium flex items-center gap-1"><Check size={13}/> Productos importados correctamente</p>
              : <button onClick={onImportMock} disabled={importing}
                  className={`${S.btn} ${S.btnPrimary} text-xs w-full justify-center`}>
                  {importing ? 'Importando...' : `Importar ${MOCK_PRODUCTS.length} productos`}
                </button>
            }
          </div>

          {/* CSV masivo */}
          <div className="bg-white border border-[#e8ddd0] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a96e]/15 flex items-center justify-center flex-shrink-0">
                <Grid size={18} className="text-[#c9a96e]"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1209]">Importación masiva CSV</p>
                <p className="text-xs text-gray-400">Columnas: <code className="bg-gray-100 px-1 rounded">brand, name, price, category, image, stock</code></p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="data:text/csv;charset=utf-8,brand,name,price,category,image,stock%0AABIB,Ejemplo,25.00,facial,,true"
                download="plantilla_productos.csv"
                className={`${S.btn} ${S.btnGhost} text-xs`}>
                ↓ Plantilla
              </a>
              <label className={`${S.btn} ${S.btnPrimary} text-xs cursor-pointer`}>
                ↑ Subir CSV
                <input type="file" accept=".csv" onChange={onCSVImport} className="hidden"/>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Tip configuración avanzada */}
      <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 rounded-xl p-5">
        <Settings size={20} className="text-amber-500 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="text-sm font-semibold text-[#4a3a31]">Configuración avanzada — ⚙ arriba a la derecha</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Hero (imagen/video de fondo), sección CTA "Tu rutina, elevada.", Editorial "Glow the Korean Way", Reels,
            colores de marca, WhatsApp, redes sociales y sección Nosotros.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ROOT ───────────────────────────────────────────────────────────────
const MAIN_TABS = [
  { id: 'dashboard',  label: 'Inicio',     icon: Home },
  { id: 'products',   label: 'Productos',  icon: Package },
  { id: 'categories', label: 'Categorías', icon: Grid },
];

export default function Admin() {
  const navigate = useNavigate();
  const [config,       setConfig]       = useState(() => { const s=getAdminConfig(); return { ...DEFAULT_CONFIG, ...s, products: s.products ?? DEFAULT_CONFIG.products }; });
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast,        setToast]        = useState(null);
  const [dirty,        setDirty]        = useState(false);
  const [importDone,   setImportDone]   = useState(() => !!localStorage.getItem('urriola_import_done'));
  const [importing,    setImporting]    = useState(false);

  const handleChange = useCallback(cfg => { setConfig(cfg); setDirty(true); }, []);

  const handleSave = () => {
    saveConfig(config); setDirty(false);
    setToast('¡Cambios guardados!'); setTimeout(() => setToast(null), 2500);
  };
  const handleReset = () => {
    if (!window.confirm('¿Restaurar configuración por defecto? Perderás todos tus cambios.')) return;
    localStorage.removeItem(LS_KEY); setConfig(DEFAULT_CONFIG); setDirty(false);
    setToast('Configuración restaurada'); setTimeout(() => setToast(null), 2500);
  };

  // Navegar a tab con filtro opcional
  const handleNavigate = (tab, filter) => {
    setActiveTab(tab);
    if (filter) setActiveFilter(filter);
  };

  // Importar productos mock — sube a Firebase Y actualiza estado local
  const handleImportMock = async () => {
    if (!window.confirm(`¿Importar ${MOCK_PRODUCTS.length} productos a Firebase? Esto los hará visibles en la tienda.`)) return;
    setImporting(true);
    try {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const db = getFirestore();
      let count = 0;
      for (const p of MOCK_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          brand:       p.brand,
          name:        p.name,
          price:       p.price,
          image:       p.image,
          images:      p.images || [p.image],
          category:    p.category || 'facial',
          stock:       true,
          visible:     true,
          featured:    false,
          inOffer:     false,
          offerPrice:  null,
          hasTon:      false,
          tonValue:    '',
          lowStock:    false,
          description: '',
          rating:      p.rating || 4.5,
          reviews:     p.reviews || 0,
          createdAt:   serverTimestamp(),
        });
        count++;
      }
      // También actualiza el estado local del admin
      const toAdd = MOCK_PRODUCTS.map(p => ({
        ...p, description:'', inOffer:false, offerPrice:null,
        hasTon:false, tonValue:'', visible:true, lowStock:false,
      }));
      handleChange({ ...config, products: [...(config.products||[]), ...toAdd] });
      setImportDone(true);
      localStorage.setItem('urriola_import_done', '1');
      setToast(`✅ ${count} productos subidos a Firebase`);
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error(err);
      setToast('❌ Error al importar. Revisá la consola.');
      setTimeout(() => setToast(null), 3500);
    } finally {
      setImporting(false);
    }
  };

  // Importar CSV
  const handleCSVImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const text  = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const newProds = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',');
      const row  = {};
      headers.forEach((h, idx) => { row[h] = vals[idx]?.trim() || ''; });
      if (!row.name) continue;
      newProds.push({
        id: Date.now() + i,
        brand:    row.brand    || '',
        name:     row.name     || '',
        price:    parseFloat(row.price) || 0,
        category: row.category || 'facial',
        image:    row.image    || '',
        images:   row.image ? [row.image] : [],
        stock:    row.stock !== 'false',
        featured: row.featured === 'true',
        inOffer:  false, offerPrice: null,
        hasTon:   false, tonValue: '',
        visible:  true,  lowStock: false,
        description: '', rating: 4.5, reviews: 0,
      });
    }
    handleChange({ ...config, products: [...(config.products||[]), ...newProds] });
    setToast(`✅ ${newProds.length} productos importados desde CSV`); setTimeout(() => setToast(null), 3000);
    e.target.value = '';
  };

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');`}</style>

      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily:"'Cormorant Garamond', serif" }}>U.RRIOLA</span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#b8986a] bg-[#c9a96e]/10 px-2.5 py-1 rounded-full font-semibold">Admin</span>
          </div>
          <nav className="hidden md:flex gap-1">
            {MAIN_TABS.map(t => { const I=t.icon; return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
                  ${activeTab===t.id ? 'bg-[#4a3a31] text-white' : 'text-[#4a3a31] hover:bg-[#4a3a31]/8'}`}>
                <I size={13}/>{t.label}
              </button>
            );})}
          </nav>
          <div className="flex items-center gap-2">
            {dirty && <span className="hidden md:block text-[10px] text-amber-500 font-medium animate-pulse">● Sin guardar</span>}
            <button onClick={() => setSettingsOpen(true)} title="Configuración avanzada"
              className="p-2.5 rounded-full border border-[#e8ddd0] text-[#4a3a31] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors">
              <Settings size={16}/>
            </button>
            <button onClick={handleReset}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#e8ddd0] text-xs text-[#4a3a31] hover:border-[#c9a96e] transition-colors">
              <RefreshCw size={12}/> Restaurar
            </button>
            <button onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all
                ${dirty ? 'bg-[#4a3a31] text-white hover:bg-[#c9a96e] shadow-md' : 'bg-gray-100 text-gray-400 cursor-default'}`}>
              <Save size={13}/> Guardar
            </button>
            <button onClick={handleLogout} title="Cerrar sesión"
              className="p-2.5 rounded-full border border-[#e8ddd0] text-[#4a3a31] hover:border-red-300 hover:text-red-400 transition-colors">
              <LogOut size={15}/>
            </button>
          </div>
        </div>
        {/* Nav móvil */}
        <div className="md:hidden flex border-t border-[#f0ebe4]">
          {MAIN_TABS.map(t => { const I=t.icon; return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] font-medium transition-colors
                ${activeTab===t.id ? 'text-[#4a3a31] border-t-2 border-[#4a3a31]' : 'text-gray-400'}`}>
              <I size={16}/>{t.label}
            </button>
          );})}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {activeTab === 'dashboard'  && <Dashboard config={config} onNavigate={handleNavigate} onImportMock={handleImportMock} onCSVImport={handleCSVImport} importing={importing} importDone={importDone} />}
        {activeTab === 'products'   && <ProductsSection config={config} onChange={handleChange} initialFilter={activeFilter}/>}
        {activeTab === 'categories' && <CategoriesSection config={config} onChange={handleChange}/>}
      </main>

      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} config={config} onChange={handleChange}/>
      {toast && <Toast message={toast}/>}
    </div>
  );
}