const { collection, query, where ,getDocs,getDoc} = require("firebase/firestore");
const db = require('../firebaseconnect.js');
const Agent = require('../model/Agent.js');
const Login = require('../model/User.js');
const Journey = require('../model/AgentJourney.js');

async function getAgentByTab(tag){

    const agent_cll = collection(db, "agent");
    // console.log("user check before start shift",agent_ls)
    if(!agent_cll) return "1404";

    const agent_snap = await getDocs(query(agent_cll,where("tag",'==',tag)));
    // if(agent_snap.empty) return "1400";
    const agent_ls = [];

    agent_snap.forEach((doc)=>{
        const data = doc.data();
        const login = new Agent(data.username,data.uid,data.tag)
        console.log("login",login);
        agent_ls.push(login);
    })

    return agent_ls

}

module.exports = {getAgentByTab};