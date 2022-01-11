import { collection, addDoc, doc, onSnapshot, query, where, } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js'

async function addTestData(db) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            first: "Eli",
            last: "Lovelace",
            born: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function setUpListner(db) {
    const unsub = onSnapshot(doc(db, "users", "2DyNid3iD0EMWFEGMJLj"), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
    });
}

function listenToQuery(db, key, value, fn) {
    const q = query(collection(db, "byuOnLine"), where(key, "==", value));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        console.log(data);
        fn(data)
    });

    return {unsubscribe}
}

async function sendMessage(db, to, from, message) {
    try {
        const docRef = await addDoc(collection(db, "byuOnLine"), {
            to: to,
            from: from,
            message: message,
            time: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export { addTestData, setUpListner, listenToQuery, sendMessage }
