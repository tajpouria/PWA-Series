import * as idb from "idb";

const POSTS_OBJECT_STORE = "POSTS_OBJECT_STORE";

const dbPromise = idb.openDB("POSTS_STORE", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(POSTS_OBJECT_STORE)) {
      db.createObjectStore(POSTS_OBJECT_STORE, { keyPath: "id" });
    }
  }
});

const addRecord = (st: string, data: any) =>
  dbPromise.then(db => {
    const tx = db.transaction(st, "readwrite");
    const store = tx.objectStore(st);
    store.put(data);
    return tx.done;
  });

export default { addRecord };
