import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, update, ref, get, child, onValue, off } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8ZS_OCx178BVdnxniv1IhOOcHg92J-Qc",
  authDomain: "portfolio-webrtc-controller.firebaseapp.com",
  databaseURL: "https://portfolio-webrtc-controller-default-rtdb.firebaseio.com",
  projectId: "portfolio-webrtc-controller",
  storageBucket: "portfolio-webrtc-controller.firebasestorage.app",
  messagingSenderId: "441502457338",
  appId: "1:441502457338:web:fa20c5e044bff6d8e8d843"
};

initializeApp(firebaseConfig);

const db = getDatabase();

export async function firebaseSaveUpdate(data, id = crypto.randomUUID()) {
  console.log("AQUI")
  console.log(db)
  await update(ref(db, `/${id}`), data);
  console.log("AQUI")

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