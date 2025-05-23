import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, update, ref, get, child, onValue, off} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
};

initializeApp(firebaseConfig);

const db = getDatabase();

export async function firebaseSaveUpdate(data, id = crypto.randomUUID()) {
    await update(ref(db, `/${id}`), data);
    return id
}

export async function firebaseGet(id) {
    let resp = await get(child(ref(db), `${id}/offer`))
    return resp.val()
}

export function firebaseListening(id, callback) {
    const path = ref(db, `/${id}/answer`);
  
    const listener = onValue(path, (snapshot) => {
      const data = snapshot.val();
  
      if (data !== null) {
        callback(data);
        off(path);
      }
    });
  }