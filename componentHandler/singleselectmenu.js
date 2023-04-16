const Journey = require('../model/AgentJourney.js')
const JourneyDetails = require('../model/AgentJourneyDetails.js')
const {getAgentByTab} = require('../repository/agent.js')
const ping = require('../commands/ping.js')
const moment = require("moment");
module.exports = async (interaction) => {

    const custonid = interaction.customId;

    switch (custonid){
        case "loingselect_slc":

            // Get the data entered by the user
            const _selectedLogin = interaction.values[0];
            const _tag = interaction.user.tag;
            // console.log(interaction)
            const _agent = await getAgentByTab(_tag);
            console.log('agent from query',_agent);
            console.log('interaction after select:',interaction.id);
            console.log('agent[0]:',_agent[0]);
            if(_agent.length == 0) await interaction.editReply({content:`l'utilisateur ${_tag} n'est pas encore enregistrer, merci de contacter le superviseur !!`,ephemeral:true})

            const date = moment(new Date()).format('DD-MM-YYYY')
            const time = moment(new Date()).format('HH:mm:ss')
            const _sessionId = date+time+_agent[0].uid;
            const _journey = new Journey(_agent[0].uid,_selectedLogin,'1','online')
            let _save = await _journey.add();
            if (_save == "rep:14") await interaction.editReply({content:`Erreur on header creation:${_save}`,ephemeral:true})
            const _journeyDetails = new JourneyDetails(date,time,'1','online')
            _save = await _journeyDetails.add(_sessionId)
            if (_save == "rep:14") await interaction.editReply({content:`Erreur on details creation:${_save}`,ephemeral:true})
            // await interaction.editReply({content:`success:${_agent[0].uid}`});
            await ping.execute(interaction);
//             await interaction.editReply({
//                 content:
//                     `Nouvel agent ajouter :
// |- Nom : ${_agent.username}
// |- Matricule : ${_agent.uid}
// |- Tag discord : ${_agent.tag}`,});
            break
    }
}