const {getDocs} = require("firebase/firestore");
const {doc, setDoc, addDoc, collection} = require("firebase/firestore");
const db = require('../firebaseconnect')
const moment = require("moment");

class AgentJourneyDetails {
    constructor (date=moment(new Date()).format('DD-MM-YYYY'),time=moment(new Date()).format('HH:mm:ss'),prodStatusCode,prodStatusDesc) {
        this.date = date;
        this.time = time;
        this.prodStatusCode = prodStatusCode;
        this.prodStatusDesc = prodStatusDesc;
        // console.log("this.sessionId",this.sessionId)
    }

    async add(sessionId){

        const u = {
            date: this.date,
            time: this.time,
            prodStatusCode: this.prodStatusCode,
            prodStatusDesc: this.prodStatusDesc,
        };

        try {
            // return await addDoc(collection(db, "user"), u);
            // console.log("agent before insert",u);
            const DetailsSessionId = sessionId+this.prodStatusDesc;
            return await setDoc(doc(db, "agentjourney",sessionId,"agentjourneydetails",DetailsSessionId), u);
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

module.exports = AgentJourneyDetails