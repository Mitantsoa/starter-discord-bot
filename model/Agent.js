const {getDocs} = require("firebase/firestore");
const {doc, setDoc, addDoc, collection} = require("firebase/firestore");
const db = require('../firebaseconnect')

class Agent {
    constructor (username, uid, tag ) {
        this.username = username;
        this.uid = uid;
        this.tag = tag;
    }
    async add(){
        const u = {
            username: this.username,
            uid: this.uid,
            tag: this.tag
        };

        try {
            // return await addDoc(collection(db, "user"), u);
            return await setDoc(doc(db, "agent",u.uid), u);
        }catch (e) {
            console.error(e);
            return "rep:14"
        }
    }

    // async getuser(){
    //     const User = collection(db,"users");
    //     const usersnap = await getDocs(User);
    //     const users = usersnap.docs.map(doc => doc.data());
    //     return users;
    // }

    toString() {
        return this.username + ', ' + this.uid + ', ' + this.tag;
    }
}

module.exports = Agent