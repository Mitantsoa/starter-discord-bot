const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,StringSelectMenuBuilder } = require("discord.js");
const {getLogin,getInactiveLogin} = require('../repository/user.js')
const {getAgentStartJourney,getSessionJourney} = require('../repository/agentJourney');
const moment = require("moment");
const ping = require("../commands/ping");
const Journey = require("../model/AgentJourney");
const JourneyDetails = require("../model/AgentJourneyDetails");
module.exports = async (interaction) => {

    const custonid = interaction.customId;

    switch (custonid){
        case "startshift_btn":

            // for user verification on journey
            let _agentTag = interaction.user.tag;
            let date = moment(new Date()).format('DD-MM-YYYY');
            let {haveOnGoingSession,onGoingSession_ls} = await checkOnGoingSessionByTag(date,_agentTag);
            if(haveOnGoingSession) return await interaction.editReply({content:`l'agent ${_agentTag} est dèjà en shift, merci de vérifier`})
            //for list of login in select
            // const _logins = await getLogin();
            const _logins = await getInactiveLogin();
            console.log('option',_logins)
            const options = [];
            _logins.forEach(login => {
                const option = {
                    label:''+login.loginid,
                    description:'le poste :'+ login.poste,
                    value:''+login.loginid
                }
                options.push(option);

            })

            // Create the text input components
            const loingselect = new StringSelectMenuBuilder()
                    .setCustomId('loingselect_slc')
                    .setPlaceholder('Choissez le poste (merci de bien vérifiez avant)')
                    .addOptions(options);

            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new ActionRowBuilder().setComponents(loingselect);

            await interaction.editReply({content:'Merci de choisir le poste utiliser',components:[firstActionRow],ephemeral:true})
            // await interaction.editReply({content:`Merci de choisir le poste utiliser ${_logins[1].loginid}`})
            break;

        case "stopshift_btn":

            // for user verification on journey
            let __agentTag = interaction.user.tag;
            const _date = moment(new Date()).format('DD-MM-YYYY');
            const sessionCheck = await checkOnGoingSessionByTag(_date,__agentTag);
            if(!sessionCheck.haveOnGoingSession) return await interaction.editReply({content:`l'agent ${__agentTag} n'est pas encore en shift, merci de vérifier`,ephemeral:true})
            // console.log('list session on going',sessionCheck.onGoingSession_ls)
            // console.log('sessionCheck.haveOnGoingSession',sessionCheck.haveOnGoingSession)

            const journey = sessionCheck.onGoingSession_ls[0];
            console.log("end journey",journey)
            const time = moment(new Date()).format('HH:mm:ss')
            const _journey = new Journey(journey.agentUid,journey.loginId,journey.prodStatusCode,journey.prodStatusDesc,journey.sessionId)
            const _updateJourney = await _journey.updateStatus('0','offline');
            const _journeyDetails = new JourneyDetails(_date,time,"0","offline");
            const _save = await _journeyDetails.add(_journey.sessionId);
            if (_save == "rep:14") await interaction.editReply({content:`Erreur:${_save}`})
            // await interaction.editReply({content:`success:${_save}`});
            await ping.execute(interaction);
            break;

        // case "startstanby_btn":
        //
        //     // for user verification on journey
        //     let __agentTag = interaction.user.tag;
        //     const _date = moment(new Date()).format('DD-MM-YYYY');
        //     const sessionCheck = await checkOnGoingSessionByTag(_date,__agentTag);
        //     if(!sessionCheck.haveOnGoingSession) return await interaction.editReply({content:`l'agent ${__agentTag} n'est pas encore en shift, merci de vérifier`,ephemeral:true})
        //     // console.log('list session on going',sessionCheck.onGoingSession_ls)
        //     // console.log('sessionCheck.haveOnGoingSession',sessionCheck.haveOnGoingSession)
        //
        //     const journey = sessionCheck.onGoingSession_ls[0];
        //     console.log("end journey",journey)
        //     const time = moment(new Date()).format('HH:mm:ss')
        //     const _journey = new Journey(journey.agentUid,journey.loginId,journey.prodStatusCode,journey.prodStatusDesc,journey.sessionId)
        //     const _updateJourney = await _journey.updateStatus('0','offline');
        //     const _journeyDetails = new JourneyDetails(_date,time,"0","offline");
        //     const _save = await _journeyDetails.add(_journey.sessionId);
        //     if (_save == "rep:14") await interaction.editReply({content:`Erreur:${_save}`})
        //     // await interaction.editReply({content:`success:${_save}`});
        //     await ping.execute(interaction);
        //     break;

    }
}

async function checkOnGoingSessionByTag(date,_agentTag){
    const _agentSessionStarted = await getAgentStartJourney(date,_agentTag);
    console.log(`list des journey de ${_agentTag}`,_agentSessionStarted)
    let haveOnGoingSession = false;
    const onGoingSession_ls = [];
    if(_agentSessionStarted.length > 0){
        for (let i=0; i < _agentSessionStarted.length;i++){
            // console.log("list des session",_agentSessionStarted[i])
            // const _sessionId = _agentSessionStarted[i].journey.sessionId;
            // const _sessionStartedStatus = await getSessionJourney(_sessionId,"0")
            // console.log("list session ended",_sessionStartedStatus)
            onGoingSession_ls.push(_agentSessionStarted[i].journey);
            haveOnGoingSession = true;
            // if(_sessionStartedStatus.length == 0){
            //
            //     break;
            // }else{
            //     haveOnGoingSession = false;
            // }
        }
    };
    return {haveOnGoingSession,onGoingSession_ls};
}