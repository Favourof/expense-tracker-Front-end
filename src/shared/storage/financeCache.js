const DB_NAME = "aequopath-cache";
const DB_VERSION = 1;
const STORE_NAME = "finance-snapshots";

const getDb = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });

const withStore = async (mode, callback) => {
  const db = await getDb();
  if (!db) return null;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => db.close();

    Promise.resolve(callback(store))
      .then(resolve)
      .catch(reject);
  });
};

export const getFinanceSnapshot = async (key) => {
  if (!key) return null;

  return withStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  });
};

export const setFinanceSnapshot = async (key, snapshot) => {
  if (!key || !snapshot) return null;

  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.put({
        key,
        snapshot,
        updatedAt: new Date().toISOString(),
      });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  });
};

export const clearFinanceSnapshot = async (key) => {
  if (!key) return null;

  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  });
};

