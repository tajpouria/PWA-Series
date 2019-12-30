import * as idb from "idb";

const REACT_IDB = "react-idb";

export class ObjectStore {
  private objectStore: idb.IDBPObjectStore<any, string[], string>;
  constructor(objectStore: idb.IDBPObjectStore<any, string[], string>) {
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

  private objectStoresOptionsStore: Record<
    string,
    IDBObjectStoreParameters
  > = {};

  constructor(public dataBaseName: string, public dataBaseVersion: number = 1) {
    if (!dataBaseName) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error(`${REACT_IDB}: dataBaseName is required.`);
    }
    this.dbPromise = idb.openDB(dataBaseName, dataBaseVersion, {
      upgrade(db) {
        db.close();
      }
    });
  }

  public getObjectStores = async () => {
    try {
      const db = await this.dbPromise;
      return db.objectStoreNames;
    } catch (err) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error(err);
    }
  };

  public createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = {}
  ) => {
    try {
      const currentDatabase = await this.dbPromise;
      const objectStores = await this.getObjectStores();

      let OpenReq = indexedDB.open(this.dataBaseName, 2);
      OpenReq.onupgradeneeded = function(e) {
        // @ts-ignore
        let db = e.target.result;
        console.log(db);
        setTimeout(() => {
          db.objectStoreNames.contains("myStore") ||
            db.createObjectStore("myStore");
        }, 3000);
      };

      // request.onerror = console.error;

      if (!currentDatabase.objectStoreNames.contains(objectStoreName)) {
        // var request = window.indexedDB.open(this.dataBaseName, 4);
        // request.onupgradeneeded = event => {
        //   // @ts-ignore
        //   var db = event.target.result;
        //   var transaction = db.transaction(
        //     [this.dataBaseName],
        //     "versionchange"
        //   );
        //   var objectStore = db.createObjectStore(objectStoreName, options);
        // };
        // this.delete(
        //   () => {
        //     console.log("hello");
        //     // this.objectStoresOptionsStore[objectStoreName] = options || {};
        //     // const dbPromise = idb.openDB(
        //     //   this.dataBaseName,
        //     //   this.dataBaseVersion + 1,
        //     //   {
        //     //     upgrade(db) {
        //     //       db.createObjectStore(objectStoreName, options);
        //     //       db.close();
        //     //       // for (let key in { ...objectStores, objectStoreName }) {
        //     //       //   const objectStore =
        //     //       //     key === objectStoreName
        //     //       //       ? objectStoreName
        //     //       //       : objectStores.item(+key);
        //     //       //   console.log(objectStoreName);
        //     //       //   if (
        //     //       //     objectStore &&
        //     //       //     !db.objectStoreNames.contains(objectStore) &&
        //     //       //     !["length", "item", "contains"].includes(key)
        //     //       //   ) {
        //     //       //     db.createObjectStore(objectStore);
        //     //       //   }
        //     //       // }
        //     //     }
        //     //   }
        //     // );
        //     // this.dbPromise = dbPromise;
        //   },
        //   () => {
        //     console.error(
        //       `${REACT_IDB}: an exception on deleting ${this.dataBaseName}.`
        //     );
        //   },
        //   () => {
        //     console.error(
        //       `${REACT_IDB}: ${this.dataBaseName} delete request blocked, make sure all dataBase connections are closed.`
        //     );
        //   }
        // );
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

  public delete = async (
    onSuccess?: (event: Event) => void,
    onError?: (event: Event) => void,
    onBlock?: (event: Event) => void
  ) => {
    // const deleteRequest = indexedDB.deleteDatabase(this.dataBaseName);

    await idb.deleteDB(this.dataBaseName);

    // if (onSuccess)
    //   deleteRequest.onsuccess = event => {
    //     onSuccess(event);
    //   };

    // if (onError)
    //   deleteRequest.onerror = event => {
    //     onError(event);
    //   };

    // if (onBlock)
    //   deleteRequest.onblocked = event => {
    //     onBlock(event);
    //   };
  };
}
