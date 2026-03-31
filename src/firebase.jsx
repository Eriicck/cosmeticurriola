// ─────────────────────────────────────────────────────────────────────────────
// firebase.js — Configuración y helpers de Firebase para U.RRIOLA
//
// SETUP:
//  1. Creá un proyecto en https://console.firebase.google.com
//  2. Habilitá Firestore Database en modo "Producción"
//  3. Habilitá Storage para imágenes de productos
//  4. Reemplazá las variables de entorno en tu .env:
//       VITE_FIREBASE_API_KEY=...
//       VITE_FIREBASE_AUTH_DOMAIN=...
//       VITE_FIREBASE_PROJECT_ID=...
//       VITE_FIREBASE_STORAGE_BUCKET=...
//       VITE_FIREBASE_MESSAGING_SENDER_ID=...
//       VITE_FIREBASE_APP_ID=...
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app     = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);

// ─── COLECCIONES ──────────────────────────────────────────────────────────────
// Estructura Firestore:
//
//  products/
//    {productId}/
//      brand: string
//      name: string
//      price: number
//      images: string[]     ← URLs de Storage
//      category: string     ← "facial" | "capilar" | "corporal" | "herramientas" | "esenciales"
//      stock: boolean
//      featured: boolean
//      createdAt: Timestamp
//
//  orders/
//    {orderId}/
//      client: { nombre, apellido, email, telefono }
//      metodo: "shipping" | "pickup"
//      direccion: { direccion, ciudad, estado }
//      items: [{ id, name, price, quantity, image }]
//      total: number
//      status: "pending" | "confirmed" | "shipped" | "delivered"
//      createdAt: Timestamp

// ─── HELPERS DE PRODUCTOS ─────────────────────────────────────────────────────

/**
 * Obtiene todos los productos, opcionalmente filtrados.
 * @param {{ category?: string, featured?: boolean, maxItems?: number }} opts
 * @returns {Promise<Array>}
 */
export async function getProducts({ category, featured, maxItems } = {}) {
  const ref = collection(db, 'products');
  const constraints = [orderBy('createdAt', 'desc')];

  if (category)  constraints.push(where('category', '==', category));
  if (featured !== undefined) constraints.push(where('featured', '==', featured));
  if (maxItems)  constraints.push(limit(maxItems));

  const snapshot = await getDocs(query(ref, ...constraints));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Obtiene un producto por ID.
 * @param {string} productId
 * @returns {Promise<Object|null>}
 */
export async function getProduct(productId) {
  const snap = await getDoc(doc(db, 'products', productId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Crea un nuevo producto en Firestore.
 * @param {Object} data — datos del producto (sin id ni createdAt)
 * @returns {Promise<string>} — ID del documento creado
 */
export async function createProduct(data) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    stock: data.stock ?? true,
    featured: data.featured ?? false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Actualiza un producto existente.
 * @param {string} productId
 * @param {Object} updates
 */
export async function updateProduct(productId, updates) {
  await updateDoc(doc(db, 'products', productId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Elimina un producto.
 * @param {string} productId
 */
export async function deleteProduct(productId) {
  await deleteDoc(doc(db, 'products', productId));
}

// ─── HELPERS DE ÓRDENES ───────────────────────────────────────────────────────

/**
 * Guarda un pedido en Firestore.
 * Útil para tener un registro además del mensaje de WhatsApp.
 *
 * @param {{ form: Object, cart: Array, total: number }} orderData
 * @returns {Promise<string>} — ID de la orden
 */
export async function saveOrder({ form, cart, total }) {
  const docRef = await addDoc(collection(db, 'orders'), {
    client: {
      nombre:   form.nombre,
      apellido: form.apellido,
      email:    form.email    || null,
      telefono: form.telefono || null,
    },
    metodo: form.metodo,
    direccion: form.metodo === 'shipping'
      ? { direccion: form.direccion, ciudad: form.ciudad, estado: form.estado || null }
      : null,
    notas: form.notas || null,
    items: cart.map(item => ({
      id:       item.id,
      name:     item.name,
      brand:    item.brand,
      price:    item.price,
      quantity: item.quantity,
      image:    item.image,
    })),
    total,
    status:    'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Obtiene todas las órdenes (para panel admin).
 * @returns {Promise<Array>}
 */
export async function getOrders() {
  const snapshot = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Actualiza el estado de una orden.
 * @param {string} orderId
 * @param {'pending'|'confirmed'|'shipped'|'delivered'} status
 */
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ─── HELPERS DE STORAGE (imágenes) ────────────────────────────────────────────

/**
 * Sube una imagen al Storage y retorna su URL pública.
 * Uso: const url = await uploadProductImage(file, 'productos/abib-sunscreen.jpg')
 *
 * @param {File} file — archivo de imagen
 * @param {string} path — ruta dentro del bucket, ej: 'products/mi-producto.webp'
 * @param {(progress: number) => void} onProgress — callback con % de progreso (0-100)
 * @returns {Promise<string>} — URL pública de descarga
 */
export function uploadProductImage(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      // Para imágenes recomendamos WebP:
      // convertir antes de subir con canvas.toBlob('image/webp', 0.85)
    });

    task.on(
      'state_changed',
      snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Elimina una imagen del Storage.
 * @param {string} path — ruta dentro del bucket
 */
export async function deleteProductImage(path) {
  await deleteObject(ref(storage, path));
}

// ─── AUTH (admin) ─────────────────────────────────────────────────────────────

/**
 * Login con email/contraseña (para panel de administración).
 * @param {string} email
 * @param {string} password
 */
export async function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Cierra la sesión actual. */
export async function logoutAdmin() {
  return signOut(auth);
}

/**
 * Escucha cambios de autenticación.
 * @param {(user: Object|null) => void} callback
 * @returns función para cancelar la suscripción
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── REGLAS DE SEGURIDAD SUGERIDAS (Firestore) ────────────────────────────────
//
// Pegá esto en Firebase Console → Firestore → Reglas:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//
//     // Productos: lectura pública, escritura solo admin
//     match /products/{productId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//
//     // Órdenes: creación pública, lectura/edición solo admin
//     match /orders/{orderId} {
//       allow create: if true;
//       allow read, update: if request.auth != null;
//     }
//   }
// }