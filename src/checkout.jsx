import { saveOrder } from './firebase.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, Store, ChevronDown, ChevronUp, MessageCircle, CheckCircle, ShoppingCart } from 'lucide-react';
import { WHATSAPP_NUMBER } from './data';

function InputField({ label, name, type = 'text', placeholder, value, onChange, required, optional, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold tracking-widest uppercase text-gray-500">
        {label}{optional && <span className="font-normal normal-case tracking-normal text-gray-400 ml-1">(opcional)</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className={`w-full border rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 transition-all duration-200 bg-white ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-200'}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function Checkout({ cart = [], cartCount = 0, onOpenCart }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    direccion: '', ciudad: '', estado: '', notas: '',
    metodo: 'shipping',
  });
  const [errors,      setErrors]      = useState({});
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim())   errs.nombre   = 'Campo requerido';
    if (!form.apellido.trim()) errs.apellido = 'Campo requerido';
    if (form.metodo === 'shipping') {
      if (!form.direccion.trim()) errs.direccion = 'Requerido para envío';
      if (!form.ciudad.trim())    errs.ciudad    = 'Requerido para envío';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const items   = cart.map(i => `  • ${i.quantity}x ${i.name} → $${(i.price * i.quantity).toFixed(2)}`).join('\n');
    const metodo  = form.metodo === 'shipping' ? '🚚 Envío a domicilio' : '🏪 Retiro en tienda';

    let msg = `*¡Hola! Quiero realizar un pedido en U.RRIOLA* ✨\n\n`;
    msg += `*👤 Cliente:*\n  ${form.nombre} ${form.apellido}\n`;
    if (form.email)    msg += `  ${form.email}\n`;
    if (form.telefono) msg += `  ${form.telefono}\n`;
    msg += `\n*📦 Entrega:* ${metodo}\n`;
    if (form.metodo === 'shipping') {
      msg += `  ${form.direccion}, ${form.ciudad}`;
      if (form.estado) msg += `, ${form.estado}`;
      msg += '\n';
    }
    if (form.notas) msg += `\n*📝 Notas:* ${form.notas}\n`;
    msg += `\n*🛍️ Pedido (${cartCount} artículos):*\n${items}\n`;
    msg += `\n*💰 Total: $${cartTotal.toFixed(2)} USD*\n\n¡Quedo a la espera de la confirmación! 🙏`;


    await saveOrder({ form, cart, total: cartTotal });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitted(true);
  };

  // ── PANTALLA ÉXITO ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4" style={{ fontFamily: "'Jost', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400;500&display=swap');`}</style>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-4xl font-light text-gray-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>¡Pedido enviado!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">Tu pedido fue enviado por WhatsApp. Nos pondremos en contacto para confirmar los detalles.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-[#4a3a31] text-white text-sm font-medium tracking-wide px-8 py-3.5 rounded-full hover:bg-[#382b24] transition-colors"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  // ── FORMULARIO ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;400;500;600&display=swap');`}</style>

      {/* Navbar checkout */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Volver
          </button>
          <button onClick={() => navigate('/')} className="text-xl font-light text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            U.RRIOLA
          </button>
          <button onClick={onOpenCart} className="relative text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -bottom-2 -right-2 w-5 h-5 bg-gray-900 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Resumen mobile colapsable */}
      <div className="md:hidden bg-gray-50 border-b border-gray-100">
        <button onClick={() => setSummaryOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2 text-gray-600">
            <ShoppingCart size={15} strokeWidth={1.5} />
            <span className="text-sm">{summaryOpen ? 'Ocultar' : 'Ver'} resumen del pedido</span>
            {summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <span className="text-base font-bold text-gray-900">${cartTotal.toFixed(2)} USD</span>
        </button>
        <div className={`overflow-hidden transition-all duration-400 ${summaryOpen ? 'max-h-[60vh]' : 'max-h-0'}`}>
          <div className="px-4 pb-4 space-y-3 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 items-center py-1">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-500/90 text-xs text-white font-bold flex items-center justify-center">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.name}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-base font-bold text-gray-900">${cartTotal.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex gap-16">

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl space-y-8">

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Información de contacto</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Nombre"   name="nombre"   placeholder="María"     value={form.nombre}   onChange={handleChange} required error={errors.nombre} />
                <InputField label="Apellido" name="apellido" placeholder="González"  value={form.apellido} onChange={handleChange} required error={errors.apellido} />
              </div>
              <InputField label="Email"    name="email"    type="email" placeholder="tu@email.com" value={form.email}    onChange={handleChange} optional />
              <InputField label="Teléfono" name="telefono" type="tel"   placeholder="+58 412..."   value={form.telefono} onChange={handleChange} optional />
            </div>
          </section>

          {/* Método */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Forma de entrega</h2>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {[
                { value: 'shipping', Icon: Truck,  label: 'Envío a domicilio', sub: 'Coordinamos el envío por WhatsApp' },
                { value: 'pickup',   Icon: Store,  label: 'Retiro en tienda',  sub: 'Sin costo de envío' },
              ].map(({ value, Icon, label, sub }) => (
                <label
                  key={value}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 border-b border-gray-100 last:border-0 ${form.metodo === value ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.metodo === value ? 'border-gray-900' : 'border-gray-300'}`}>
                      {form.metodo === value && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </div>
                  <Icon size={18} className={form.metodo === value ? 'text-gray-700' : 'text-gray-300'} />
                  <input type="radio" name="metodo" value={value} checked={form.metodo === value} onChange={handleChange} className="hidden" />
                </label>
              ))}
            </div>
          </section>

          {/* Dirección condicional */}
          <div className={`overflow-hidden transition-all duration-500 ${form.metodo === 'shipping' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dirección de envío</h2>
              <div className="space-y-4">
                <InputField label="Dirección" name="direccion" placeholder="Av. Principal, Casa/Apto..." value={form.direccion} onChange={handleChange} required={form.metodo === 'shipping'} error={errors.direccion} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Ciudad" name="ciudad" placeholder="Caracas"  value={form.ciudad} onChange={handleChange} required={form.metodo === 'shipping'} error={errors.ciudad} />
                  <InputField label="Estado" name="estado" placeholder="Miranda"  value={form.estado} onChange={handleChange} optional />
                </div>
              </div>
            </section>
          </div>

          {/* Notas */}
          <section>
            <label className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 block mb-1">
              Notas del pedido <span className="font-normal normal-case tracking-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              name="notas" value={form.notas} onChange={handleChange}
              placeholder="Instrucciones especiales, referencias para la entrega..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-200 transition-all resize-none"
            />
          </section>

          {/* Submit */}
          <div className="pb-12 space-y-3">
            <button type="submit" className="w-full bg-[#25D366] text-white py-4 text-sm font-bold tracking-wider rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-lg flex items-center justify-center gap-3">
              <MessageCircle size={18} />
              Completar pedido por WhatsApp
            </button>
            <p className="text-center text-xs text-gray-400">Se abrirá WhatsApp con tu pedido listo para enviar.</p>
          </div>
        </form>

        {/* Resumen desktop */}
        <aside className="hidden md:block w-[360px] flex-shrink-0">
          <div className="sticky top-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-light text-gray-900 text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Resumen del pedido</h3>
              <p className="text-xs text-gray-400 mt-0.5">{cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}</p>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[45vh] overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-white flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-500/90 text-xs text-white font-bold flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{item.brand}</p>
                    <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug mt-0.5">{item.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="text-gray-400 text-xs uppercase tracking-wide">A coordinar</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-medium text-gray-900">Total</span>
                <div>
                  <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 ml-1">USD</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}