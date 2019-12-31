import * as idb from "idb";

const REACT_IDB = "react-idb";

export class IDBObject {
  // private objectStore: idb.IDBPObjectStore<any, string[], string>;
  // constructor(objectStore: idb.IDBPObjectStore<any, string[], string>) {
  constructor(dbName: string, db: idb.IDBPDatabase<unknown>) {
    // this.objectStore = objectStore;
  }

  // public get = async <T = any>(key: string): Promise<T> => {
  //   try {
  //     return (await this.objectStore).get(key);
  //   } catch (err) {
  //     console.error(REACT_IDB, err);
  //     throw new Error(err);
  //   }
  // };

  // public set = async (key: string, val: any) => {
  //   try {
  //     return (await this.objectStore).put(val, key);
  //   } catch (err) {
  //     console.error(REACT_IDB, err);
  //     throw new Error(err);
  //   }
  // };

  // public delete = async (key: string) => {
  //   try {
  //     return (await this.objectStore).delete(key);
  //   } catch (err) {
  //     console.error(REACT_IDB, err);
  //     throw new Error(err);
  //   }
  // };

  // public clear = async () => {
  //   try {
  //     return (await this.objectStore).clear();
  //   } catch (err) {
  //     console.error(REACT_IDB, err);
  //     throw new Error(err);
  //   }
  // };

  // public keys = async () => {
  //   try {
  //     return (await this.objectStore).getAllKeys();
  //   } catch (err) {
  //     console.error(REACT_IDB, err);
  //     throw new Error(err);
  //   }
  // };
}

export default class IDB {
  private dbVersion: number = 1;

  protected objectStoresOptions: Record<string, IDBObjectStoreParameters> = {};

  constructor(private dbName: string, private db: idb.IDBPDatabase<unknown>) {}

  public static init = async (dataBaseName: string) => {
    if (!dataBaseName) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error(`${REACT_IDB}: dataBaseName is required.`);
    }

    const idbdb = await idb.openDB(dataBaseName, 1, {
      upgrade(db) {
        db.close();
      }
    });

    return new IDB(dataBaseName, idbdb);
  };

  get objectStores() {
    try {
      const idbObjectStores = this.db.objectStoreNames;

      const _objectStore: string[] = [];

      for (let key in idbObjectStores) {
        if (!["length", "item", "contains"].includes(key)) {
          _objectStore.push(idbObjectStores[+key]);
        }
      }

      return _objectStore;
    } catch (err) {
      console.error(`${REACT_IDB}: cannot get objectStores of ${this.dbName}`);
      throw new Error(err);
    }
  }

  public createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true }
  ) => {
    try {
      if (!this.objectStores.includes(objectStoreName)) {
        // await idb.openDB(this.dbName, this.dbVersion + 4, {
        //   upgrade(db) {
        //     console.log(db);
        //     db.createObjectStore(objectStoreName, options);
        //     db.close();
        //   }
        // });
        return this.delete();

        // let OpenReq = indexedDB.open(this.dbName, 5);
        // OpenReq.onupgradeneeded = function(e) {
        //   // @ts-ignore
        //   let db = e.target.result;
        //   console.log(db);
        //   db.objectStoreNames.contains(objectStoreName) ||
        //     db.createObjectStore(objectStoreName);
        // };

        // console.log(idbdb);

        // return new IDBObject(objectStoreName, idbdb);

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
          `${REACT_IDB}: object store ${objectStoreName} already exist.`
        );
      }
    } catch (err) {
      console.error(REACT_IDB, err);
      throw new Error(err);
    }
  };

  public delete = async (
    onSuccess?: (event: Event) => void,
    onError?: (event: Event) => void,
    onBlock?: (event: Event) => void
  ) => {
    const deleteRequest = indexedDB.deleteDatabase(this.dbName);

    // await idb.deleteDB(this.dbName);

    // // if (onSuccess)
    // //   deleteRequest.onsuccess = event => {
    // //     onSuccess(event);
    // //   };

    // // if (onError)
    // //   deleteRequest.onerror = event => {
    // //     onError(event);
    // //   };

    deleteRequest.onblocked = event => {
      console.log("blocked");
      // onBlock(event);
    };
  };
}
