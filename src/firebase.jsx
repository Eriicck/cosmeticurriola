import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc,
  getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, orderBy, onSnapshot, serverTimestamp, writeBatch
} from 'firebase/firestore';

// 1. Aquí están tus credenciales reales (Ya no usamos import.meta.env)
const firebaseConfig = {
  apiKey: "AIzaSyCC9yirluXDl8LXI1H3_tA7rj8mT_cR8yA",
  authDomain: "urruiola-768e7.firebaseapp.com",
  projectId: "urruiola-768e7",
  storageBucket: "urruiola-768e7.firebasestorage.app",
  messagingSenderId: "258905109793",
  appId: "1:258905109793:web:c869f6fd1b3b4b0ffa3a60"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── PRODUCTOS — lectura única ──────────────────────────────
export async function getProducts() {
  const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── PRODUCTOS — escucha en tiempo real ────────────────────
export function subscribeProducts(onUpdate, onError) {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q,
    snap => onUpdate(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err  => { console.error('subscribeProducts:', err); onError?.(err); }
  );
}

// ── PRODUCTO — crear ───────────────────────────────────────
export async function createProduct(data) {
  const ref = await addDoc(collection(db, 'products'), {
    ...sanitize(data),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ── PRODUCTO — actualizar uno ──────────────────────────────
export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'products', id), {
    ...sanitize(data),
    updatedAt: serverTimestamp(),
  });
}

// ── PRODUCTO — eliminar ────────────────────────────────────
export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

// ── PRODUCTOS — sincronizar lista completa a Firebase ──────
export async function syncProductsToFirebase(products) {
  const batch = writeBatch(db);
  const updates = []; 

  for (const p of products) {
    const clean = sanitize(p);

    if (p.firebaseId) {
      const ref = doc(db, 'products', p.firebaseId);
      batch.update(ref, { ...clean, updatedAt: serverTimestamp() });
    } else {
      const ref = doc(collection(db, 'products'));
      batch.set(ref, { ...clean, createdAt: serverTimestamp() });
      updates.push({ localId: p.id, ref });
    }
  }

  await batch.commit();

  return products.map(p => {
    if (p.firebaseId) return p;
    const u = updates.find(x => x.localId === p.id);
    return u ? { ...p, firebaseId: u.ref.id } : p;
  });
}

// ── PRODUCTO — actualizar campo(s) específico(s) en Firebase ──
export async function patchProduct(firebaseId, fields) {
  if (!firebaseId) return;
  await updateDoc(doc(db, 'products', firebaseId), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

// ── ÓRDENES ────────────────────────────────────────────────
export async function saveOrder({ form, cart, total }) {
  const ref = await addDoc(collection(db, 'orders'), {
    client:    { nombre: form.nombre, apellido: form.apellido, email: form.email || null, telefono: form.telefono || null },
    metodo:    form.metodo,
    direccion: form.metodo === 'shipping'
      ? { direccion: form.direccion, ciudad: form.ciudad, estado: form.estado || null }
      : null,
    notas:     form.notas || null,
    items:     cart.map(i => ({ id: i.id, name: i.name, brand: i.brand, price: i.price, quantity: i.quantity, image: i.image })),
    total,
    status:    'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ── CLOUDINARY — subir imagen o video ─────────────────────
export async function uploadToCloudinary(file) {
  const isVideo = file.type.startsWith('video/');
  const formData = new FormData();
  formData.append('file', file);
  
  // 2. Reemplacé las variables de entorno de Cloudinary por texto plano por ahora
  formData.append('upload_preset', "tu_preset_de_cloudinary");

  const endpoint = isVideo ? 'video' : 'image';
  const cloudName = "tu_cloud_name"; // Cambiaremos esto luego

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}

// Alias para compatibilidad con código anterior
export const uploadImage = uploadToCloudinary;

// ── AUTH ───────────────────────────────────────────────────
import { getAuth } from 'firebase/auth';
export { getAuth };

// ── HELPERS INTERNOS ───────────────────────────────────────
function sanitize(p) {
  const {
    id,          
    firebaseId,  
    createdAt,   
    ...rest
  } = p;
  
  const clean = {};
  for (const [k, v] of Object.entries(rest)) {
    clean[k] = v === undefined ? null : v;
  }
  return clean;
}