const {SlashCommandBuilder,ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle,
	ButtonBuilder,
	ButtonStyle
} = require('discord.js')
const {getLogin} = require('../repository/user.js')
const {getdayJourney} = require('../repository/agentJourney.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {

		const journeys = await getdayJourney("date");
		let messageresp = `Status des agents de la journée du 10/04/2023 :\n`;

		const row = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId('startshift_btn')
				.setLabel('Débuter Prod')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('stopshift_btn')
				.setLabel('Fin Prod')
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId('startstanby_btn')
				.setLabel('Faire une pause')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('stopstanby')
				.setLabel('Retoure après pause')
				.setStyle(ButtonStyle.Primary)
		);

		if(journeys == "3400") return  await interaction.editReply({content:`${messageresp} |- Pas d'agent connecter`,components:[row]});
		// console.log("list journey:",journeys);

		for(let j in journeys){
			const journey = journeys[j];
			if(journey.status =="online") {
				messageresp += `\t|- **__${journey.agent}__** -- [${journey.status}] 🟢 \n`;
			}else{
				messageresp += `\t|- **__${journey.agent}__** -- [${journey.status}] 🚫 \n`;
			}
			messageresp += `\t|--- *Login* : ${journey.login}\n`;
			messageresp += `\t|--- *Débute* : ${journey.start}\n`;
			messageresp += `\t|--- *Fin* : ${journey.end}\n`;
		}

		await interaction.editReply({content:`${messageresp}`,components:[row],ephemeral:false})

	},
};