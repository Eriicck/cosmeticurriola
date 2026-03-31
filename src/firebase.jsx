import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── PRODUCTOS ──────────────────────────────────────────────
export async function getProducts() {
  const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createProduct(data) {
  const ref = await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

// ── ÓRDENES ────────────────────────────────────────────────
export async function saveOrder({ form, cart, total }) {
  const ref = await addDoc(collection(db, 'orders'), {
    client:   { nombre: form.nombre, apellido: form.apellido, email: form.email || null, telefono: form.telefono || null },
    metodo:   form.metodo,
    direccion: form.metodo === 'shipping' ? { direccion: form.direccion, ciudad: form.ciudad, estado: form.estado || null } : null,
    notas:    form.notas || null,
    items:    cart.map(i => ({ id: i.id, name: i.name, brand: i.brand, price: i.price, quantity: i.quantity, image: i.image })),
    total,
    status:   'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ── CLOUDINARY ─────────────────────────────────────────────
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url; // ← URL pública de la imagen
}

import { getAuth } from 'firebase/auth';
export { getAuth };