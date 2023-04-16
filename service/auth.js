const {getAgentByTab} = require("../repository/agent");

async function checkAgentExist(interaction){

    const _agentTag = interaction.user.tag
    const _isUserAdmin = interaction.member.roles.cache.some((r)=>r.name == "gerant" || r.name == "superviseur")
    const agent_cll = await getAgentByTab(_agentTag)
    console.log("Agent existe",agent_cll.length)
    console.log("Agent admin",_isUserAdmin)
    if(!agent_cll.length  && !_isUserAdmin) return false;
    return true;

}

module.exports = {checkAgentExist};