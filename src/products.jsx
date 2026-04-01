import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Search, SlidersHorizontal, X,
  Plus, Minus, ChevronLeft, ChevronRight, Star
} from 'lucide-react';
import { getProducts } from './firebase';

const ITEMS_PER_PAGE = 16;
const SORT_OPTIONS   = ['Destacados', 'Precio: menor a mayor', 'Precio: mayor a menor', 'Más nuevos'];

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {open ? <Minus size={14} className="text-gray-400" /> : <Plus size={14} className="text-gray-400" />}
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden"><div className="pb-4">{children}</div></div>
      </div>
    </div>
  );
}

// ─── MODAL PRODUCTO ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onAddToCart }) {
  const [qty,       setQty]       = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { setQty(1); setActiveImg(0); }, [product]);

  // Bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image].filter(Boolean);

  const displayPrice = product.inOffer && product.offerPrice ? product.offerPrice : product.price;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop — click cierra */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — centrado, no más slide desde abajo */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        style={{ maxHeight: '90dvh' }}>

        {/* Botón cerrar */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors border border-gray-100">
          <X size={17} className="text-gray-700" />
        </button>

        {/* Galería izquierda */}
        <div className="relative bg-[#f7f3ee] flex-shrink-0 md:w-[45%]" style={{ aspectRatio: '1' }}>
          <img
            src={images[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {/* Badge oferta */}
          {product.inOffer && (
            <div className="absolute top-4 left-4 bg-[#c9a96e] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Oferta
            </div>
          )}
          {/* Dots navegación galería */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImg ? 'bg-[#4a3a31] w-6' : 'bg-[#4a3a31]/25 w-1.5'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Info derecha — scrolleable independientemente */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#b8986a] tracking-widest uppercase">{product.brand}</span>
            <h2 className="text-xl md:text-2xl font-light text-gray-900 mt-2 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h2>

            {/* Estrellas */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className={i < Math.floor(product.rating || 4) ? 'fill-[#c9a96e] text-[#c9a96e]' : 'fill-gray-200 text-gray-200'} />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviews || 0})</span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mt-5 pb-5 border-b border-gray-100">
              {product.inOffer && product.offerPrice ? (
                <>
                  <p className="text-3xl font-bold text-[#c9a96e]">${Number(product.offerPrice).toFixed(2)} <span className="text-sm font-normal text-gray-400">USD</span></p>
                  <p className="text-base text-gray-400 line-through">${Number(product.price).toFixed(2)}</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)} <span className="text-sm font-normal text-gray-400">USD</span></p>
              )}
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-500 mt-5 leading-relaxed">
              {product.description || 'Producto K-Beauty premium. Formulado con ingredientes activos para resultados visibles desde la primera semana de uso.'}
            </p>

            {/* Ton */}
            {product.hasTon && product.tonValue && (
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1.5 rounded-full">
                🎨 Ton: {product.tonValue}
              </div>
            )}
          </div>

          {/* CTA fijo al fondo */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl h-11 overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 text-gray-500 hover:bg-gray-50 h-full transition-colors flex items-center">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="px-4 text-gray-500 hover:bg-gray-50 h-full transition-colors flex items-center">
                  <Plus size={14} />
                </button>
              </div>
              {product.stock !== false
                ? <span className="text-xs text-green-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> En stock</span>
                : <span className="text-xs text-red-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> Sin stock</span>}
            </div>
            <button
              disabled={product.stock === false}
              onClick={() => { if (product.stock !== false) { onAddToCart(product, qty); onClose(); } }}
              className={`w-full text-white py-4 text-sm font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                ${product.stock !== false
                  ? 'bg-[#4a3a31] hover:bg-[#c9a96e] shadow-md hover:shadow-lg cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <ShoppingCart size={16} strokeWidth={1.5} />
              {product.stock !== false
                ? `Añadir al carrito — $${(Number(displayPrice) * qty).toFixed(2)} USD`
                : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onOpenModal }) {
  const displayPrice = product.inOffer && product.offerPrice ? product.offerPrice : product.price;
  return (
    <div className="group relative flex flex-col cursor-pointer">
      <div className="relative overflow-hidden bg-gray-50 rounded-sm" style={{ aspectRatio: '4/5' }}
        onClick={() => onOpenModal(product)}>
        <img src={product.image} alt={product.name} loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105" />
        {product.inOffer && (
          <div className="absolute top-2 left-2 bg-[#c9a96e] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Oferta</div>
        )}
        {product.stock === false && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Agotado</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 md:bottom-0 md:left-0 md:right-0 md:p-4 transition-all duration-500 ease-out md:translate-y-[120%] md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); if (product.stock !== false) onAddToCart(product); }}
            disabled={product.stock === false}
            className={`w-full backdrop-blur-sm border py-2.5 md:py-3 text-[12px] md:text-sm font-medium rounded-md transition-colors duration-300 shadow-sm md:shadow-lg flex items-center justify-center gap-2
              ${product.stock !== false
                ? 'bg-white/95 border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900'
                : 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'}`}>
            {product.stock !== false ? 'Añadir al carrito' : 'Agotado'}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-0.5 px-1 text-center md:text-left">
        <span className="text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase">{product.brand}</span>
        <h3 className="text-[13px] md:text-sm font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">{product.name}</h3>
        <div className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} className={i < Math.floor(product.rating || 4) ? 'fill-[#c9a96e] text-[#c9a96e]' : 'fill-gray-200 text-gray-200'} />
          ))}
          <span className="text-[10px] text-gray-400 ml-0.5">({product.reviews || 0})</span>
        </div>
        <div className="flex items-baseline gap-2 justify-center md:justify-start mt-1">
          <span className={`text-[13px] md:text-sm font-semibold ${product.inOffer ? 'text-[#c9a96e]' : 'text-gray-600'}`}>
            ${Number(displayPrice).toFixed(2)} USD
          </span>
          {product.inOffer && product.offerPrice && (
            <span className="text-[11px] text-gray-400 line-through">${Number(product.price).toFixed(2)}</span>
          )}
        </div>
        {product.hasTon && product.tonValue && (
          <span className="text-[9px] text-purple-400 font-medium">Ton: {product.tonValue}</span>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Products({ cartCount = 0, onAddToCart, onOpenCart }) {
  const navigate = useNavigate();

  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState('');
  const [selectedBrands,  setSelectedBrands]  = useState([]);
  const [selectedCats,    setSelectedCats]    = useState([]);
  const [minPrice,        setMinPrice]        = useState('');
  const [maxPrice,        setMaxPrice]        = useState('');
  const [sortBy,          setSortBy]          = useState('Destacados');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [filterOpen,      setFilterOpen]      = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts()
      .then(data => {
        const seen = new Set();
        const deduped = data.filter(p => {
          const key = p.name?.trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return p.visible !== false;
        });
        setProducts(deduped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ALL_BRANDS = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const ALL_CATS   = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

  const filtered = useMemo(() => {
    const getPrice = p => p.inOffer && p.offerPrice ? p.offerPrice : p.price;
    let list = products.filter(p => {
      const q     = search.toLowerCase();
      const ok    = p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
      const brand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const cat   = selectedCats.length === 0   || selectedCats.includes(p.category);
      const min   = minPrice === '' || getPrice(p) >= Number(minPrice);
      const max   = maxPrice === '' || getPrice(p) <= Number(maxPrice);
      return ok && brand && cat && min && max;
    });
    if (sortBy === 'Precio: menor a mayor') list = [...list].sort((a, b) => (a.inOffer&&a.offerPrice?a.offerPrice:a.price) - (b.inOffer&&b.offerPrice?b.offerPrice:b.price));
    if (sortBy === 'Precio: mayor a menor') list = [...list].sort((a, b) => (b.inOffer&&b.offerPrice?b.offerPrice:b.price) - (a.inOffer&&a.offerPrice?a.offerPrice:a.price));
    return list;
  }, [search, selectedBrands, selectedCats, minPrice, maxPrice, sortBy, products]);

  const totalPages      = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = useCallback((p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleBrand = b => { setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setCurrentPage(1); };
  const toggleCat   = c => { setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); setCurrentPage(1); };
  const clearFilters = () => { setSearch(''); setSelectedBrands([]); setSelectedCats([]); setMinPrice(''); setMaxPrice(''); setSortBy('Destacados'); setCurrentPage(1); };
  const hasFilters = search || selectedBrands.length > 0 || selectedCats.length > 0 || minPrice || maxPrice;

  return (
    /* overflow-x-hidden en el root evita el ensanchamiento por el filtro drawer */
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        h1, h2 { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-6 flex-1">
            <nav className="hidden md:flex gap-6 text-sm font-medium tracking-wide">
              <button onClick={() => navigate('/')} className="hover:text-gray-500 transition-colors duration-300">Inicio</button>
              <button className="text-gray-900 border-b border-gray-900">Productos</button>
              <button onClick={() => navigate('/#nosotros')} className="hover:text-gray-500 transition-colors duration-300">Nosotros</button>
            </nav>
            <button onClick={() => navigate('/')} className="md:hidden text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft size={15} /> Inicio
            </button>
          </div>
          <button onClick={() => navigate('/')} className="text-2xl md:text-3xl tracking-widest font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            U.RRIOLA
          </button>
          <div className="flex items-center justify-end gap-4 flex-1">
            <button onClick={onOpenCart} className="relative hover:opacity-70 transition-opacity duration-300">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO ── */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 text-center">
          <p className="text-[#b8986a] text-[10px] tracking-[0.35em] uppercase mb-2">Catálogo</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">Todos los Productos</h2>
        </div>

        {/* Toolbar — en mobile se apila limpiamente */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-gray-400 flex-shrink-0">{filtered.length} productos</span>

            {/* Controles en fila, sin overflow en mobile */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar..." value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors w-36 md:w-52" />
              </div>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-md py-2 px-2 text-xs md:text-sm text-gray-700 focus:outline-none focus:border-gray-400 cursor-pointer bg-white max-w-[130px] md:max-w-none">
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>

              <button onClick={() => setFilterOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 rounded-md py-2 px-3 hover:border-gray-400 transition-colors flex-shrink-0">
                <SlidersHorizontal size={14} /> Filtro
                {hasFilters && <span className="w-2 h-2 bg-[#c9a96e] rounded-full" />}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <svg className="animate-spin w-8 h-8 text-[#c9a96e]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No hay productos con esos filtros.</p>
            <button onClick={clearFilters} className="mt-3 text-xs text-[#c9a96e] underline underline-offset-2">Limpiar filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12">
            {currentProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-2 text-sm">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 transition-colors">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…'); acc.push(p); return acc; }, [])
              .map((p, i) =>
                p === '…'
                  ? <span key={`e${i}`} className="text-gray-400 px-1">…</span>
                  : <button key={p} onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-300 ${p === currentPage ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700 hover:border-gray-900'}`}>
                      {p}
                    </button>
              )}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </main>

      {/* ── DRAWER FILTRO ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-medium text-gray-900 text-sm">Filtrar</span>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {ALL_CATS.length > 0 && (
                <Accordion title="Categorías" defaultOpen>
                  <div className="space-y-3 pt-1">
                    {ALL_CATS.map(c => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedCats.includes(c)} onChange={() => toggleCat(c)} className="w-4 h-4 rounded accent-gray-900" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors capitalize">{c}</span>
                      </label>
                    ))}
                  </div>
                </Accordion>
              )}
              <Accordion title="Precio">
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-gray-200 rounded-md p-2 flex-1 focus-within:border-gray-900 transition-colors">
                    <span className="text-xs text-gray-400 mr-1">$</span>
                    <input type="number" placeholder="0" value={minPrice} onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }} className="w-full outline-none text-sm bg-transparent" />
                  </div>
                  <span className="text-gray-400 text-sm">—</span>
                  <div className="flex items-center border border-gray-200 rounded-md p-2 flex-1 focus-within:border-gray-900 transition-colors">
                    <span className="text-xs text-gray-400 mr-1">$</span>
                    <input type="number" placeholder="999" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }} className="w-full outline-none text-sm bg-transparent" />
                  </div>
                </div>
              </Accordion>
              {ALL_BRANDS.length > 0 && (
                <Accordion title="Marcas" defaultOpen>
                  <div className="space-y-3 pt-1 max-h-48 overflow-y-auto pr-1">
                    {ALL_BRANDS.map(b => (
                      <label key={b} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="w-4 h-4 rounded accent-gray-900" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b}</span>
                      </label>
                    ))}
                  </div>
                </Accordion>
              )}
            </div>
            <div className="border-t border-gray-100 p-4 space-y-2">
              <button onClick={() => setFilterOpen(false)} className="w-full bg-[#4a3a31] text-white py-3 text-sm font-bold tracking-widest hover:bg-[#382b24] transition-colors rounded-md">
                APLICAR
              </button>
              <button onClick={() => { clearFilters(); setFilterOpen(false); }} className="w-full text-sm text-gray-500 py-2 hover:text-gray-900 transition-colors">
                Eliminar todo
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={onAddToCart} />
    </div>
  );
}