import * as idb from "idb";

const REACT_IDB = "react-idb";

type IDBObjectKey =
  | string
  | number
  | Date
  | ArrayBufferView
  | ArrayBuffer
  | IDBArrayKey
  | IDBKeyRange;

export class IDBObject {
  constructor(
    private db: idb.IDBPDatabase<unknown>,
    private storeName: string
  ) {}

  public set = async (key: IDBObjectKey, value: any) => {
    const closeDBConnection = () => {
      this.db.close();

      this.set(key, value);
    };
    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.put(this.storeName, value, key);
    } catch (err) {
      console.error(
        `${REACT_IDB}: unknown exception "${this.storeName}.set(${key})".`,
        err
      );
    }
  };

  public get = async (key: IDBObjectKey) => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.get(this.storeName, key);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public delete = async (key: IDBObjectKey) => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.delete(this.storeName, key);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public keys = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.getAllKeys(this.storeName);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public values = async () => {
    try {
      const entries = await this.entries();

      return entries && entries.length ? entries.map(entry => entry) : [];
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public entries = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.getAll(this.storeName);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public clear = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        }
      });

      return db.clear(this.storeName);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };
}

export default class IDB {
  protected objectStoresOptions: Record<string, IDBObjectStoreParameters> = {};

  constructor(private dbName: string, private db: idb.IDBPDatabase<unknown>) {}

  public static init = async (dataBaseName: string) => {
    if (!dataBaseName) {
      console.error(`${REACT_IDB}: dataBaseName is required.`);
      throw new Error(`${REACT_IDB}: dataBaseName is required.`);
    }

    // @ts-ignore //TODO: browser support
    const dataBases: any[] = await indexedDB.databases();

    const isAlreadyExist = dataBases.find(
      _database => _database.name === dataBaseName
    );

    const _version = isAlreadyExist?.version || 1;

    const idbdb = await idb.openDB(dataBaseName, _version);

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
    }
  }

  public createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true }
  ) => {
    const closeDBConnection = () => this.db.close();

    try {
      if (!this.db.objectStoreNames.contains(objectStoreName)) {
        await idb.openDB(this.dbName, this.db.version + 1, {
          upgrade(db) {
            db.createObjectStore(objectStoreName, options);
          },

          blocked() {
            closeDBConnection();
          }
        });
      }

      return new IDBObject(this.db, objectStoreName);
    } catch (err) {
      console.error(REACT_IDB, err);
    }
  };

  public delete = async () => {
    const closeDBConnection = () => this.db.close();

    return await idb.deleteDB(this.dbName, {
      blocked() {
        closeDBConnection();
      }
    });
  };
}
