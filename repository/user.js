const { collection, query, where ,getDocs} = require("firebase/firestore");
const db = require('../firebaseconnect.js');
const Agent = require('../model/Agent.js');
const Login = require('../model/User.js');
const Journey = require('../model/AgentJourney.js');

async function getLogin(){

    const logins_cll = collection(db, "user");
    if(!logins_cll) return "2404";
    const logins_snap = await getDocs(logins_cll);
    const logins_ls = [];
    logins_snap.forEach((doc)=>{
        const login = new Login(doc.data().loginid,doc.data().poste,doc.data().posteid)
        logins_ls.push(login);
    })

    return logins_ls

}

async function getInactiveLogin(){

    const journey_cll = collection(db, "agentjourney");
    if(!journey_cll) return "2404";
    const journey_snap = await getDocs(query(journey_cll,
        where('prodStatusCode','==','1'),
    ));
    const user_cll = collection(db,"user");
    console.log("journey start",user_cll)
    if(!user_cll) return "1404";
    const user_snap = await getDocs(user_cll);
    const logingActive_ls = [];
    const logingInActive_ls = []
    if(journey_snap.empty){
        user_snap.forEach((doc)=>{
            const login = new Login(doc.data().loginid,doc.data().poste,doc.data().posteid)
            logingInActive_ls.push(login)
        })
    }
    journey_snap.forEach((doc) =>{
        const jdata = doc.data();
        logingActive_ls.push(jdata.loginId);
    })
    user_snap.forEach((doc)=>{
        if(logingActive_ls.includes(doc.data().loginid)){
            const login = new Login(doc.data().loginid,doc.data().poste,doc.data().posteid)
            logingInActive_ls.push(login)
        }
    })
    return logingInActive_ls

}

module.exports = {getLogin,getInactiveLogin};