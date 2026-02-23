import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, User, Menu, X, 
  ChevronDown, ChevronUp, Plus, Minus, SlidersHorizontal, ChevronRight, Truck, Store, Instagram, Facebook
} from 'lucide-react';

// --- GENERACIÓN DE 80 PRODUCTOS DINÁMICOS ---
// Agregamos los productos reales y exactos para la primera página
const REAL_PRODUCTS = [
  { brand: 'ABIB', name: 'ABIB FACIAL SUNSCREEN IN ESSENCE FORMAT HEARTLEAF SUN 50ML', price: 28.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864766907_1.jpg?v=1754507945&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME CREAM VITA TUBE FACIAL MOISTURIZER 75ML', price: 37.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8800280690012_2.jpg?v=1754430312&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME DARK SPOT PAD VITA TOUCH 60PADS', price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558477.jpg?v=1763500472&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME DARK SPOT SERUM VITA DROP 50ML', price: 28.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558514.jpg?v=1754430581&width=750' },
  { brand: 'ABIB', name: 'ABIB GREEN LHA PORE PAD CLEAR TOUCH 60PADS', price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558101.jpg?v=1763823169&width=750' },
  { brand: 'ABIB', name: 'ABIB GUMMY SHEET MASK HEARTLEAF STICKER', price: 4.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809750463729_1.jpg?v=1754426696&width=750' },
  { brand: 'ABIB', name: 'ABIB GUMMY SHEET MASK MADECASSOSIDE STICKER', price: 4.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809750463705.jpg?v=1754427869&width=750' },
  { brand: 'ABIB', name: 'ABIB HEARTLEAF CALMING TONER SKIN BOOSTER 200ML', price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/602004106681.jpg?v=1756823646&width=750' }
];

// Imágenes sueltas para nutrir las demás páginas y la galería de los modales
const EXTRA_IMAGES = [
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864769229_9bd3ac34-a3c6-4a9a-93d1-ca9acc514897.jpg?v=1756824196&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864760615_c00cc898-7ec5-4063-9d93-1aa271554777.webp?v=1764265249&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809292443210_1.jpg?v=1754428520&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864768123.jpg?v=1763500029&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864753099_ea8d4690-8936-4ca8-bd00-d442b61fe36a.jpg?v=1765287021&width=750'
];

const MOCK_PRODUCTS = Array.from({ length: 80 }).map((_, i) => {
  const baseProduct = REAL_PRODUCTS[i % REAL_PRODUCTS.length];
  return {
    id: i + 1,
    brand: baseProduct.brand,
    // Agregamos un diferenciador (Vol. X) para que cambien los nombres visualmente en las pags 2, 3, etc.
    name: i < REAL_PRODUCTS.length ? baseProduct.name : `${baseProduct.name} - Vol. ${i + 1}`,
    price: i < REAL_PRODUCTS.length ? baseProduct.price : baseProduct.price + (i % 5),
    // Alternamos con las imágenes extra en las siguientes páginas para que no se vea repetido
    image: i < REAL_PRODUCTS.length ? baseProduct.image : EXTRA_IMAGES[i % EXTRA_IMAGES.length],
    images: [
      i < REAL_PRODUCTS.length ? baseProduct.image : EXTRA_IMAGES[i % EXTRA_IMAGES.length],
      EXTRA_IMAGES[(i + 1) % EXTRA_IMAGES.length],
      EXTRA_IMAGES[(i + 2) % EXTRA_IMAGES.length]
    ],
    stock: true // 100% de los productos en stock
  };
});

// --- COMPONENTES REUTILIZABLES ---
const Drawer = ({ isOpen, onClose, title, children, side = 'right' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex transition-opacity duration-500 ease-in-out">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-500 ease-in-out ${
          side === 'right' ? 'ml-auto translate-x-0' : 'mr-auto translate-x-0'
        } animate-in slide-in-from-${side}`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors duration-300">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ title, children, defaultOpen = false, elegant = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 transition-all duration-500 ${elegant ? 'py-1' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between py-4 text-left transition-colors duration-300 outline-none ${elegant ? 'px-0 hover:text-gray-600' : 'px-6'}`}
      >
        <span className={`text-sm text-gray-900 ${elegant ? 'font-semibold tracking-wide' : 'font-medium'}`}>{title}</span>
        {isOpen ? <Minus size={16} className="text-gray-500 transition-transform duration-300 rotate-180" /> : <Plus size={16} className="text-gray-500 transition-transform duration-300" />}
      </button>
      <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className={`overflow-hidden ${elegant ? 'px-0' : 'px-6'}`}>
          <div className={isOpen ? 'pb-4' : 'pb-0'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('shop'); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [modalQuantity, setModalQuantity] = useState(1);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const totalPages = Math.ceil(MOCK_PRODUCTS.length / itemsPerPage);
  
  // Productos de la página actual
  const currentProducts = MOCK_PRODUCTS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente al inicio
  };

  // Estados del formulario para WhatsApp
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    metodo: 'shipping'
  });

  const handleInputChange = (e) => {
    setCheckoutData({...checkoutData, [e.target.name]: e.target.value});
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- ENVIAR A WHATSAPP ---
  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!checkoutData.nombre || !checkoutData.apellido) {
      alert("Por favor, ingresa tu nombre y apellido para continuar.");
      return;
    }

    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');
    const metodoText = checkoutData.metodo === 'shipping' ? 'Envío a Domicilio' : 'Retiro en Tienda';
    
    let text = `*¡Hola! Quiero realizar un pedido en URRIOLA* 🛍️\n\n`;
    text += `*Cliente:* ${checkoutData.nombre} ${checkoutData.apellido}\n`;
    text += `*Método:* ${metodoText}\n`;
    
    if (checkoutData.metodo === 'shipping' && checkoutData.direccion) {
      text += `*Dirección:* ${checkoutData.direccion}, ${checkoutData.ciudad}\n`;
    }
    
    text += `\n*Mi Pedido:*\n${itemsText}\n\n`;
    text += `*Total a pagar: $${cartTotal.toFixed(2)} USD*\n\n`;
    text += `¡Quedo a la espera de la confirmación! ✨`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/584127398442?text=${encodedText}`, '_blank');
  };

  // --- VISTA DE TIENDA (SHOP) ---
  const ShopView = () => (
    <div className="min-h-screen bg-white font-sans text-gray-900 transition-opacity duration-500 flex flex-col">
      {/* Navbar Superior */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
        <div className="flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden hover:opacity-70 transition-opacity duration-300"><Menu size={24} strokeWidth={1.5} /></button>
            <nav className="hidden md:flex gap-6 text-sm font-medium tracking-wide">
              <a href="#" className="hover:text-gray-500 transition-colors duration-300">Inicio</a>
              <a href="#" className="hover:text-gray-500 transition-colors duration-300">Productos</a>
              <a href="#" className="hover:text-gray-500 transition-colors duration-300">Nosotros</a>
            </nav>
          </div>

          <div className="flex-none text-center">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest font-semibold cursor-pointer" onClick={() => {setView('shop'); setCurrentPage(1);}}>
              U.RRIOLA
            </h1>
          </div>

          <div className="flex items-center justify-end gap-4 md:gap-6 flex-1">
            <button className="hidden md:block hover:opacity-70 transition-opacity duration-300"><Search size={20} strokeWidth={1.5} /></button>
            <button className="hidden md:block hover:opacity-70 transition-opacity duration-300"><User size={20} strokeWidth={1.5} /></button>
            <button className="relative hover:opacity-70 transition-opacity duration-300" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white transition-transform scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Titulo */}
      <main className="mx-auto w-full max-w-7xl px-4 md:px-8 py-8 flex-1">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Todos los Productos</h2>
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
            <span className="text-sm text-gray-500">{MOCK_PRODUCTS.length} productos en total</span>
            <div className="flex items-center gap-6 text-sm">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 font-medium hover:text-gray-600 transition-colors duration-300"
              >
                <SlidersHorizontal size={16} />
                Filtro
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Productos (Dependiente de Paginación) */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {currentProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col cursor-pointer">
              {/* Contenedor Imagen */}
              <div 
                className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 rounded-sm"
                onClick={() => { setSelectedProduct(product); setModalQuantity(1); }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                
                {/* Botón Añadir al Carrito (Siempre visible en Móvil, Hover en Desktop) */}
                <div className="absolute bottom-2 left-2 right-2 md:bottom-0 md:left-0 md:right-0 md:p-4 transition-all duration-500 ease-out md:translate-y-[120%] md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="w-full bg-white/95 backdrop-blur-sm border border-gray-200 py-2.5 md:py-3 text-[13px] md:text-sm font-medium text-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-300 shadow-sm md:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>{product.stock ? 'Añadir al carrito' : 'Agotado'}</span>
                  </button>
                </div>
              </div>

              {/* Info del Producto */}
              <div className="mt-4 flex flex-col gap-1 px-1 text-center md:text-left">
                <span className="text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase">{product.brand}</span>
                <h3 className="text-[13px] md:text-sm font-medium text-gray-900 leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-gray-600">
                  {product.name}
                </h3>
                <span className="text-[13px] md:text-sm text-gray-600 mt-1">${product.price.toFixed(2)} USD</span>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación Real */}
        <div className="mt-20 flex items-center justify-center gap-2 md:gap-4 text-sm">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button 
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`flex h-10 w-10 items-center justify-center transition-all duration-300 ${
                currentPage === idx + 1 
                  ? 'border-b-2 border-gray-900 font-bold text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-900 transition-all duration-300 ml-2"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </main>

      {/* Footer Simple y Elegante */}
      <footer className="bg-[#fdfcfb] border-t border-gray-100 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="font-serif text-2xl tracking-widest font-semibold">U.RRIOLA</h2>
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">Productos</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contacto</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Facebook size={20} /></a>
          </div>
          <p className="text-xs text-gray-400 pt-4">
            &copy; {new Date().getFullYear()} URRIOLA Cosmetics. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );

  // --- MODAL DE PRODUCTO (VISTA RAPIDA MEJORADA) ---
  const ProductModal = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 transition-opacity duration-500">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
        
        {/* Contenedor Principal del Modal */}
        <div className="relative w-full h-full md:h-auto md:max-w-5xl bg-white md:shadow-2xl overflow-hidden flex flex-col md:flex-row md:max-h-[85vh] md:rounded-lg animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-gray-900 transition-all duration-300 shadow-sm"
          >
            <X size={20} />
          </button>
          
          {/* Lado Izquierdo: Galería de Imágenes (Scrollable) */}
          <div className="w-full md:w-1/2 bg-gray-50 h-[45vh] md:h-full overflow-y-auto custom-scrollbar relative">
            <div className="flex flex-row md:flex-col snap-x md:snap-none overflow-x-auto md:overflow-x-hidden h-full md:h-auto">
              {selectedProduct.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${selectedProduct.name} - Imagen ${idx + 1}`} 
                  className="w-full h-full md:h-auto object-cover object-center shrink-0 snap-center"
                />
              ))}
            </div>
            {/* Indicador de scroll sutil en móvil */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full md:hidden backdrop-blur-sm">
              Desliza
            </div>
          </div>

          {/* Lado Derecho: Detalles y Acciones */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white flex flex-col">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">{selectedProduct.brand}</span>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2 leading-tight">{selectedProduct.name}</h2>
            <p className="text-xl font-medium text-gray-900 mb-6">${selectedProduct.price.toFixed(2)} USD</p>
            
            <div className="space-y-6 flex-1">
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Un imprescindible en tu rutina. Formulado cuidadosamente para brindar hidratación profunda, frescura instantánea y una barrera protectora que dura todo el día. Su textura sedosa se absorbe rápidamente sin dejar sensación grasa.
              </p>

              {/* Contenedor Fijo Inferior para móviles, normal en desktop */}
              <div className="pt-4 border-t border-gray-100 mt-6 pb-2">
                <span className="text-sm font-medium text-gray-900 block mb-3">Cantidad</span>
                <div className="flex items-center gap-4">
                  {/* Selector de cantidad (- +) Redondeado y grande */}
                  <div className="flex items-center border border-gray-300 rounded-full h-12 w-32 shrink-0 bg-white shadow-sm overflow-hidden">
                    <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="flex-1 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-semibold w-8 text-center">{modalQuantity}</span>
                    <button onClick={() => setModalQuantity(modalQuantity + 1)} className="flex-1 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Botón Añadir al carrito (Fijo y con Ícono) */}
                  <button 
                    onClick={() => { addToCart(selectedProduct, modalQuantity); setSelectedProduct(null); }}
                    className="flex-1 bg-gray-900 text-white h-12 rounded-full text-[13px] md:text-sm font-semibold tracking-widest hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <span>AÑADIR AL CARRITO</span>
                    <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Acordeones de Detalles */}
              <div className="pt-4 space-y-2">
                <Accordion title="Descripción del Producto" elegant={true}>
                  <p className="text-sm text-gray-500 font-light leading-relaxed pb-4">
                    Ideal para todo tipo de pieles, especialmente las sensibles. Testeado dermatológicamente para asegurar la mayor eficacia sin irritaciones. Proporciona un acabado luminoso y saludable desde la primera aplicación.
                  </p>
                </Accordion>
                <Accordion title="Cómo usar" elegant={true}>
                  <ul className="text-sm text-gray-500 font-light leading-relaxed pb-4 list-disc pl-4 space-y-2">
                    <li>Limpia y seca tu rostro previamente.</li>
                    <li>Aplica una cantidad del tamaño de una moneda.</li>
                    <li>Masajea suavemente hasta su completa absorción.</li>
                    <li>Úsalo como último paso de tu rutina de día.</li>
                  </ul>
                </Accordion>
                <Accordion title="Ingredientes" elegant={true}>
                  <p className="text-sm text-gray-500 font-light leading-relaxed pb-4 text-justify">
                    Aqua, Glycerin, Niacinamide, Butylene Glycol, Centella Asiatica Extract, Sodium Hyaluronate, Panthenol, Allantoin, Betaine, Carbomer, Arginine.
                  </p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- VISTA DE CHECKOUT ---
  const CheckoutView = () => {
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

    return (
      <div className="min-h-screen bg-[#f4ece5] font-sans md:flex animate-in fade-in duration-500">
        {/* Cabecera Móvil */}
        <div className="md:hidden bg-[#f4ece5] border-b border-[#e1d5c9] w-full">
          <div className="py-6 text-center">
             <h1 className="font-serif text-3xl tracking-widest font-semibold cursor-pointer" onClick={() => setView('shop')}>
              U.RRIOLA
            </h1>
          </div>
          
          <button 
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            className="w-full flex items-center justify-between p-4 bg-[#ece3da] text-sm text-[#4a3a31] transition-colors duration-300"
          >
            <span className="flex items-center gap-2 font-medium text-[#0066cc]">
              {isOrderSummaryOpen ? 'Ocultar resumen del pedido' : 'Mostrar resumen del pedido'}
              {isOrderSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
            <span className="font-semibold text-lg">${cartTotal.toFixed(2)}</span>
          </button>
          
          <div className={`grid transition-all duration-500 ease-in-out bg-[#ece3da] ${isOrderSummaryOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="px-4 pb-4 space-y-4 pt-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md border border-gray-200 bg-white flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-md" />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase">USD</span>
                    <span className="text-2xl font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario (Desktop 55%) */}
        <div className="w-full md:w-[55%] lg:w-[60%] bg-[#f4ece5] p-4 md:p-12 lg:pl-32 lg:pr-16 flex flex-col">
          <div className="hidden md:block mb-8">
            <h1 className="font-serif text-4xl tracking-widest font-semibold cursor-pointer mb-6 hover:opacity-80 transition-opacity" onClick={() => setView('shop')}>
              U.RRIOLA
            </h1>
            <nav className="flex gap-2 text-xs text-gray-500">
              <span className="text-[#0066cc] cursor-pointer hover:underline" onClick={() => setView('shop')}>Carrito</span>
              <ChevronRight size={14} />
              <span className="font-medium text-gray-900">Información & Pago</span>
            </nav>
          </div>

          <form onSubmit={handleWhatsAppOrder}>
            {/* Contacto Común (Nombre y Apellido SIEMPRE obligatorios) */}
            <div className="mt-8 md:mt-0 space-y-4 mb-10">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Información de Contacto</h2>
              <div className="flex gap-3">
                <input 
                  required
                  name="nombre"
                  value={checkoutData.nombre}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Nombre" 
                  className="w-1/2 rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none focus:ring-1 focus:ring-[#0066cc] transition-shadow duration-300" 
                />
                <input 
                  required
                  name="apellido"
                  value={checkoutData.apellido}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Apellidos" 
                  className="w-1/2 rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none focus:ring-1 focus:ring-[#0066cc] transition-shadow duration-300" 
                />
              </div>
              <input 
                name="email"
                value={checkoutData.email}
                onChange={handleInputChange}
                type="email" 
                placeholder="Correo electrónico (Opcional)" 
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none transition-shadow duration-300"
              />
              <input 
                name="telefono"
                value={checkoutData.telefono}
                onChange={handleInputChange}
                type="tel" 
                placeholder="Teléfono (Opcional)" 
                className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none transition-shadow duration-300"
              />
            </div>

            {/* Forma de entrega */}
            <div className="space-y-4 mb-10">
              <h2 className="text-xl font-medium text-gray-900">Forma de entrega</h2>
              <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 transition-all duration-300 ${checkoutData.metodo === 'shipping' ? 'bg-[#f0f5fa] border-[#0066cc]' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${checkoutData.metodo === 'shipping' ? 'border-[#0066cc]' : 'border-gray-400'}`}>
                      {checkoutData.metodo === 'shipping' && <div className="w-2 h-2 rounded-full bg-[#0066cc] animate-in zoom-in" />}
                    </div>
                    <span className="text-sm font-medium">Envío</span>
                  </div>
                  <Truck size={20} className={checkoutData.metodo === 'shipping' ? 'text-[#0066cc]' : 'text-gray-500'} />
                  <input type="radio" name="metodo" value="shipping" checked={checkoutData.metodo === 'shipping'} onChange={handleInputChange} className="hidden" />
                </label>
                
                <label className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 ${checkoutData.metodo === 'pickup' ? 'bg-[#f0f5fa] border-[#0066cc]' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${checkoutData.metodo === 'pickup' ? 'border-[#0066cc]' : 'border-gray-400'}`}>
                      {checkoutData.metodo === 'pickup' && <div className="w-2 h-2 rounded-full bg-[#0066cc] animate-in zoom-in" />}
                    </div>
                    <span className="text-sm font-medium">Retiro en Tienda</span>
                  </div>
                  <Store size={20} className={checkoutData.metodo === 'pickup' ? 'text-[#0066cc]' : 'text-gray-500'} />
                  <input type="radio" name="metodo" value="pickup" checked={checkoutData.metodo === 'pickup'} onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Direccion (Condicional) */}
            <div className={`space-y-4 transition-all duration-500 overflow-hidden ${checkoutData.metodo === 'shipping' ? 'max-h-[500px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
              <h2 className="text-xl font-medium text-gray-900">Dirección de envío</h2>
              <div className="space-y-3">
                <input 
                  required={checkoutData.metodo === 'shipping'}
                  name="direccion"
                  value={checkoutData.direccion}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Dirección completa" 
                  className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none transition-shadow duration-300" 
                />
                <input 
                  required={checkoutData.metodo === 'shipping'}
                  name="ciudad"
                  value={checkoutData.ciudad}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Ciudad / Estado" 
                  className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-[#0066cc] focus:outline-none transition-shadow duration-300" 
                />
              </div>
            </div>

            {/* Botonera */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pb-12">
               <button 
                type="button"
                onClick={() => setView('shop')}
                className="text-[#0066cc] text-sm hover:underline flex items-center gap-1 transition-colors duration-300"
               >
                 <ChevronRight size={16} className="rotate-180" /> Volver al carrito
               </button>
               <button type="submit" className="w-full sm:w-auto bg-[#0066cc] text-white px-8 py-4 rounded-md text-sm font-medium hover:bg-[#0055aa] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                 Completar pedido por WhatsApp
               </button>
            </div>
          </form>
        </div>

        {/* Resumen (Desktop 45%) */}
        <div className="hidden md:block md:w-[45%] lg:w-[40%] bg-white border-l border-gray-200 p-12 pr-32">
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md border border-gray-200 bg-white flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-md" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/90 text-xs text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 text-sm pr-4">
                  <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal - {cartCount} artículos</span>
                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase">USD</span>
                <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative selection:bg-gray-200">
      {view === 'shop' ? <ShopView /> : <CheckoutView />}

      {/* MODAL PRODUCTO */}
      <ProductModal />

      {/* DRAWER DEL FILTRO */}
      <Drawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar">
        <div className="pb-24">
          <Accordion title="Disponibilidad" defaultOpen={true}>
            <div className="space-y-3 pb-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900 transition-all duration-300" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">En existencia (80)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900 transition-all duration-300" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Agotado (0)</span>
              </label>
            </div>
          </Accordion>
          <Accordion title="Precio">
            <div className="pt-4 space-y-4">
              <div className="h-1 w-full bg-gray-200 rounded relative">
                <div className="absolute left-[10%] right-[30%] bg-gray-900 h-full rounded" />
                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-gray-300 rounded-full shadow cursor-pointer hover:scale-110 transition-transform" />
                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-gray-300 rounded-full shadow cursor-pointer hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center border border-gray-300 rounded-md p-2 flex-1 focus-within:border-gray-900 transition-colors duration-300">
                  <span className="mr-2">$</span>
                  <input type="number" placeholder="0" className="w-full outline-none bg-transparent" />
                </div>
                <span>—</span>
                <div className="flex items-center border border-gray-300 rounded-md p-2 flex-1 focus-within:border-gray-900 transition-colors duration-300">
                  <span className="mr-2">$</span>
                  <input type="number" placeholder="380" className="w-full outline-none bg-transparent" />
                </div>
              </div>
            </div>
          </Accordion>
          <Accordion title="Marcas">
            <div className="space-y-3 pb-2 pt-2 h-48 overflow-y-auto custom-scrollbar">
              {['URRIOLA (80)', 'ANUA (0)', 'APLB (0)'].map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-gray-900 focus:ring-gray-900 transition-all duration-300" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </Accordion>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 space-y-2">
          <button className="w-full bg-[#4a3a31] text-white py-3 text-sm font-bold tracking-widest hover:bg-[#382b24] transition-colors duration-300 rounded-md shadow-md">
            APLICAR
          </button>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-white text-gray-600 py-3 text-sm tracking-widest hover:text-gray-900 border-b border-transparent hover:border-gray-900 transition-all duration-300 inline-block mx-auto text-center w-max"
          >
            ELIMINAR TODO
          </button>
        </div>
      </Drawer>

      {/* DRAWER DEL CARRITO */}
      <Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`Tu carrito (${cartCount})`}>
        <div className="flex h-full flex-col">
          <div className="h-1 w-full bg-gray-100">
             <div className="h-full bg-gray-900 w-full transition-all duration-700 ease-out" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 space-y-4 animate-in fade-in">
                <ShoppingCart size={40} className="mx-auto text-gray-300" />
                <p>Tu carrito está vacío.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 animate-in slide-in-from-right-4 duration-300">
                  <img src={item.image} alt={item.name} className="h-24 w-24 object-cover object-center rounded-md bg-gray-50" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-[13px] font-medium text-gray-900 leading-snug pr-4 hover:text-gray-600 transition-colors">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                        <X size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">${item.price.toFixed(2)}</span>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md h-8 w-24">
                        <button onClick={() => updateQuantity(item.id, -1)} className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors"><Minus size={14} /></button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors"><Plus size={14} /></button>
                      </div>
                      <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Subtotal</span>
                <span className="text-2xl font-semibold text-gray-900">${cartTotal.toFixed(2)} USD</span>
              </div>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  setView('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-[#4a3a31] text-white py-4 text-sm font-bold tracking-widest hover:bg-[#382b24] transition-colors duration-300 rounded-full shadow-md hover:shadow-lg flex justify-center items-center gap-2"
              >
                <span>PAGAR</span>
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 mt-2 transition-colors duration-300"
              >
                Continuar comprando <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Estilos CSS Adicionales */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
      `}} />
    </div>
  );
}