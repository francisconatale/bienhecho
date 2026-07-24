import { openDB, DBSchema, IDBPDatabase } from "idb";
import { TaskPhoto } from "@/types";

interface PhotoDB extends DBSchema {
  "task-photos": {
    key: string;
    value: TaskPhoto;
    indexes: { "by-tarea": string };
  };
}

const DB_NAME = "bien-hecho-photos";
const DB_VERSION = 1;
const STORE_NAME = "task-photos";

let dbPromise: Promise<IDBPDatabase<PhotoDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PhotoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-tarea", "tarea_id");
      },
    });
  }
  return dbPromise;
}

export async function getPhotosByTarea(tareaId: string): Promise<TaskPhoto[]> {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, "by-tarea", tareaId);
}

export async function addPhoto(photo: TaskPhoto): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, photo);
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function deletePhotosByTarea(tareaId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const index = tx.store.index("by-tarea");
  let cursor = await index.openCursor(tareaId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function getAllPhotos(): Promise<TaskPhoto[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}
