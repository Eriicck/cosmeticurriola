// ─── DATOS COMPARTIDOS — U.RRIOLA ────────────────────────────────────────────
// Este archivo es la única fuente de verdad para productos e imágenes.
// Cuando conectes Firebase, reemplazás MOCK_PRODUCTS con la llamada a Firestore.

export const REAL_PRODUCTS = [
  { brand: 'ABIB', name: 'ABIB FACIAL SUNSCREEN IN ESSENCE FORMAT HEARTLEAF SUN 50ML',    price: 28.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864766907_1.jpg?v=1754507945&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME CREAM VITA TUBE FACIAL MOISTURIZER 75ML',     price: 37.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8800280690012_2.jpg?v=1754430312&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME DARK SPOT PAD VITA TOUCH 60PADS',             price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558477.jpg?v=1763500472&width=750' },
  { brand: 'ABIB', name: 'ABIB GLUTATHIOSOME DARK SPOT SERUM VITA DROP 50ML',              price: 28.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558514.jpg?v=1754430581&width=750' },
  { brand: 'ABIB', name: 'ABIB GREEN LHA PORE PAD CLEAR TOUCH 60PADS',                    price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809562558101.jpg?v=1763823169&width=750' },
  { brand: 'ABIB', name: 'ABIB GUMMY SHEET MASK HEARTLEAF STICKER',                       price:  4.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809750463729_1.jpg?v=1754426696&width=750' },
  { brand: 'ABIB', name: 'ABIB GUMMY SHEET MASK MADECASSOSIDE STICKER',                   price:  4.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809750463705.jpg?v=1754427869&width=750' },
  { brand: 'ABIB', name: 'ABIB HEARTLEAF CALMING TONER SKIN BOOSTER 200ML',               price: 30.00, image: 'https://k-wowcosmetics.myshopify.com/cdn/shop/files/602004106681.jpg?v=1756823646&width=750' },
];

export const EXTRA_IMAGES = [
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864769229_9bd3ac34-a3c6-4a9a-93d1-ca9acc514897.jpg?v=1756824196&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864760615_c00cc898-7ec5-4063-9d93-1aa271554777.webp?v=1764265249&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809292443210_1.jpg?v=1754428520&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864768123.jpg?v=1763500029&width=750',
  'https://k-wowcosmetics.myshopify.com/cdn/shop/files/8809864753099_ea8d4690-8936-4ca8-bd00-d442b61fe36a.jpg?v=1765287021&width=750',
];

export const MOCK_PRODUCTS = Array.from({ length: 80 }).map((_, i) => {
  const base = REAL_PRODUCTS[i % REAL_PRODUCTS.length];
  return {
    id: i + 1,
    brand: base.brand,
    name:  i < REAL_PRODUCTS.length ? base.name : `${base.name} - Vol. ${i + 1}`,
    price: i < REAL_PRODUCTS.length ? base.price : base.price + (i % 5),
    image: i < REAL_PRODUCTS.length ? base.image : EXTRA_IMAGES[i % EXTRA_IMAGES.length],
    images: [
      i < REAL_PRODUCTS.length ? base.image : EXTRA_IMAGES[i % EXTRA_IMAGES.length],
      EXTRA_IMAGES[(i + 1) % EXTRA_IMAGES.length],
      EXTRA_IMAGES[(i + 2) % EXTRA_IMAGES.length],
    ],
    stock: true,
    rating: 4 + (i % 2) * 0.5,
    reviews: 12 + (i * 3) % 80,
    category: ['facial', 'capilar', 'corporal'][i % 3],
  };
});

export const ALL_BRANDS = ['ABIB', 'ANUA', 'APLB', 'BEAUTY OF JOSEON', 'COSRX', 'INNISFREE'];

export const WHATSAPP_NUMBER = '584127398442'; // ← Cambiá por el número de tu clienta