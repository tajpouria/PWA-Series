/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as idb from "idb";

const REACT_IDB = "react-idb";

export class ObjectStore {
  private objectStore: idb.IDBPObjectStore<any, string[], string>;
  constructor(
    objectStore: idb.IDBPObjectStore<any, string[], string>,
    cb: () => void
  ) {
    this.objectStore = objectStore;
  }

  public get = async <T = any>(key: string): Promise<T> => {
    try {
      return (await this.objectStore).get(key);
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };

  public set = async (key: string, val: any) => {
    try {
      return (await this.objectStore).put(val, key);
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };

  public delete = async (key: string) => {
    try {
      return (await this.objectStore).delete(key);
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };

  public clear = async () => {
    try {
      return (await this.objectStore).clear();
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };

  public keys = async () => {
    try {
      return (await this.objectStore).getAllKeys();
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };
}

export default class IDB {
  private dbPromise: Promise<idb.IDBPDatabase<any>>;

  constructor(public dataBaseName: string, public dataBaseVersion: number = 1) {
    if (!dataBaseName) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error("react-idb: dataBaseName is required.");
    }
    this.dbPromise = idb.openDB(dataBaseName, dataBaseVersion, {
      upgrade(db) {
        db.createObjectStore("__BaseObjectStore");
      }
    });
  }

  getObjectStores = async () => {
    try {
      const db = await this.dbPromise;
      return db.objectStoreNames;
    } catch (err) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error(err);
    }
  };

  createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = {}
  ) => {
    try {
      const db = await this.dbPromise;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        const tx = db.transaction("__BaseObjectStore");
        return new ObjectStore(
          db.createObjectStore(objectStoreName, options),
          function() {
            tx.done;
          }
        );
      } else {
        console.error(
          `react-idb: object store ${objectStoreName} already exist.`
        );
      }
    } catch (err) {
      console.error("react-idb", err);
      throw new Error(err);
    }
  };
}
