const Agent = require('../model/Agent.js')
module.exports = async (interaction) => {

    const custonid = interaction.customId;

    switch (custonid){
        case "addagent_mdl":

            // Get the data entered by the user
            const username = interaction.fields.getTextInputValue('username');
            const uid = interaction.fields.getTextInputValue('uid');
            const tag = interaction.fields.getTextInputValue('tag');
            const _agent = new Agent(username,uid,tag)
            const _save = await _agent.add();

            if (_save == "rep:14") await interaction.editReply({content:`Erreur:${_save}`})
            await interaction.editReply({
                content:
`Nouvel agent ajouter :
|- Nom : ${_agent.username}
|- Matricule : ${_agent.uid}
|- Tag discord : ${_agent.tag}`,});
            break
    }
}