const {getDocs} = require("firebase/firestore");
const {doc, setDoc, addDoc, collection,updateDoc} = require("firebase/firestore");
const db = require('../firebaseconnect')
const moment = require("moment");

class AgentJourney {
    constructor (agentUid,loginId,prodStatusCode,prodStatusDesc,sessionId ) {
        this.agentUid = agentUid;
        this.loginId = loginId;
        this.prodStatusCode = prodStatusCode;
        this.prodStatusDesc = prodStatusDesc;
        this.sessionId = sessionId === undefined ? undefined :sessionId;
        console.log("this.sessionId",this.sessionId)
    }

    async add(date=moment(new Date()).format('DD-MM-YYYY'),time=moment(new Date()).format('HH:mm:ss')){

        const u = {
            // date: this.date,
            // time: this.time,
            agentUid: this.agentUid,
            loginId: this.loginId,
            prodStatusCode: this.prodStatusCode,
            prodStatusDesc: this.prodStatusDesc,
            sessionId: date+time+this.agentUid,
        };

        try {
            // return await addDoc(collection(db, "user"), u);
            // console.log("agent before insert",u);
            return await setDoc(doc(db, "agentjourney",u.sessionId), u);
        }catch (e) {
            console.error(e);
            return "rep:14"
        }
    }

    async updateStatus(statusCode, statusDesc){

        try {
            return await updateDoc(doc(db, "agentjourney",this.sessionId),
                {prodStatusCode:statusCode,prodStatusDesc:statusDesc}
            );
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
        return this.date + ', ' + this.time + ', ' + this.agentUid+ ', ' + this.loginId+ ', ' + this.prodStatusCode+ ', ' + this.prodStatusDesc;
    }
}

module.exports = AgentJourney