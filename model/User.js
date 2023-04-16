const {getDocs} = require("firebase/firestore/lite");
const {doc, setDoc, addDoc, collection} = require("firebase/firestore");
const db = require('../firebaseconnect')

class User {
    constructor (loginid, poste, posteid ) {
        this.loginid = loginid;
        this.poste = poste;
        this.posteid = posteid;
    }
    async add(){
        const u = {
            loginid: this.loginid,
            poste: this.poste,
            posteid: this.posteid
        };
        console.group('before insert')
        console.log(u);
        console.groupEnd();
        try {
            // return await addDoc(collection(db, "user"), u);
            return await setDoc(doc(db, "user",u.loginid), u);
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
        return this.loginid + ', ' + this.poste + ', ' + this.posteid;
    }
}

// Firestore data converter
const UserConverter = {
    toFirestore: (user) => {
        return {
            login: user.loginid,
            poste: user.poste,
            posteid: user.posteid
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.loginid, data.poste, data.posteid);
    }
};

module.exports = User