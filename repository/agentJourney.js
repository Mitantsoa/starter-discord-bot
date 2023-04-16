const { collection, query, where ,getDocs} = require("firebase/firestore");
const db = require('../firebaseconnect.js');
const Agent = require('../model/Agent.js');
const Login = require('../model/User.js');
const Journey = require('../model/AgentJourney.js');
const {getAgentByTab} = require('./agent.js')

// async function getdayJourney(date){
//
//     const agents_cll = collection(db,"agent");
//     if(!agents_cll) return "1404";
//     const agents_snap = await getDocs(agents_cll);
//     const agents_ls = [];
//     agents_snap.forEach((doc)=>{
//         const data = doc.data();
//         const agent = new Agent(data.username,data.uid,data.tag)
//         agents_ls.push(agent);
//     })
//
//     const journey_cll = collection(db, "agentjourney");
//     if(!journey_cll) return "2404";
//     const journey_snap = await getDocs(query(journey_cll));
//     if(journey_snap.empty) return "3400";
//     const journey_ls = [];
//     journey_snap.forEach((doc)=>{
//         const data = doc.data();
//         const journey = new Journey(data.date,data.time,data.agentUid,data.loginId,data.prodStatusCode,data.prodStatusDesc)
//         for (let a in agents_ls){
//             const _agent = agents_ls[a];
//             // console.log('_agent',_agent)
//             // console.log('journey',journey)
//             if(_agent.uid === journey.agentUid){
//                 const data = {
//                     journey : journey,
//                     agent : _agent.username
//                 }
//                 journey_ls.push(data);
//             }
//         }
//     })
//
//     return journey_ls
//
// }

async function getdayJourney(date){

    const agents_cll = collection(db,"agent");
    if(!agents_cll) return "1404";
    const agents_snap = await getDocs(agents_cll);
    const agents_ls = [];
    agents_snap.forEach((doc)=>{
        const data = doc.data();
        const agent = new Agent(data.username,data.uid,data.tag)
        agents_ls.push(agent);
    })

    const journey_cll = collection(db, "agentjourney");
    if(!journey_cll) return "2404";
    const journey_snap = await getDocs(query(journey_cll));
    if(journey_snap.empty) return "3400";
    let journey_ls = [];

    // to work arround the await in foreach so create the table
    journey_snap.forEach((doc)=>{
        const data = doc.data();
        const _loginId = data.loginId;
        const _status = data.prodStatusDesc;
        const _agentUid = data.agentUid;
        const _sessionId = data.sessionId;
        for (let a in agents_ls){
            const _agent = agents_ls[a];
            if(_agent.uid === _agentUid){
                const data = {
                    agent : _agent.username,
                    login : _loginId,
                    status : _status,
                    sessionId : _sessionId
                }
                journey_ls.push(data);
            }
        }
    })

    // append journey details from details collection
    for (let i in journey_ls){
        let customJourney = journey_ls[i]
        const journeydetails_cll = collection(db, "agentjourney",customJourney.sessionId,"agentjourneydetails");
        if(!journeydetails_cll) return "2404";
        let _startTime = "...";
        let _endTime = "...";
        const journeydetail_snap = await getDocs(query(journeydetails_cll));
        journeydetail_snap.forEach((ddoc) => {
            const detaildata = ddoc.data();
            // console.log(ddoc.data());
            if(detaildata.prodStatusCode == "1") _startTime = detaildata.date+" "+detaildata.time;
            if(detaildata.prodStatusCode == "0") _endTime = detaildata.date+" "+detaildata.time;
        })
        customJourney.start = _startTime;
        customJourney.end = _endTime;
    }

    return journey_ls

}

async function getAgentStartJourney(date,agentTag){

    const agent_cll = await getAgentByTab(agentTag)
    if(agent_cll.length == 0) return "1400";
    const agentUid = agent_cll[0].uid;

    const journey_cll = collection(db, "agentjourney");
    if(!journey_cll) return "2404";
    const journey_snap = await getDocs(query(journey_cll,
        // where('date','==',date),
        where('agentUid',"==",agentUid),
        where('prodStatusCode',"==","1")
    ));
    if(journey_snap.empty) return [];
    const journey_ls = [];
    journey_snap.forEach((doc)=>{
        const data = doc.data();
        console.log(data);
        const journey = new Journey(data.agentUid,data.loginId,data.prodStatusCode,data.prodStatusDesc,data.sessionId)
        const _response = {
            journey : journey,
            agent : agent_cll[0]
        }
        journey_ls.push(_response);
    })

    return journey_ls

}

// async function getSessionJourney(sessionId,status){
//
//     const journey_cll = collection(db, "agentjourney");
//     if(!journey_cll) return "2404";
//     const journey_snap = await getDocs(query(journey_cll,
//         where('sessionId','==',sessionId),
//         where('prodStatusCode','==',status),
//     ));
//     if(journey_snap.empty) return [];
//     const journey_ls = [];
//     journey_snap.forEach((doc)=>{
//         const data = doc.data();
//         const journey = new Journey(data.date,data.time,data.agentUid,data.loginId,data.prodStatusCode,data.prodStatusDesc)
//         journey_ls.push(journey);
//     })
//     return journey_ls
//
// }



module.exports = {getdayJourney,getAgentStartJourney};

