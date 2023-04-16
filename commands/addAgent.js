// import { SlashCommandBuilder } from "discord.js";
const {SlashCommandBuilder,ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addagent_cmd')
		.setDescription('Commande pour ajouter un agent'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('addagent_mdl')
			.setTitle('Ajouter Agent');

		// Add components to modal

		// Create the text input components
		const usernameInput = new TextInputBuilder()
			.setCustomId('username')
			// The label is the prompt the user sees for this input
			.setLabel("Prénom de l'agent")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const uidInput = new TextInputBuilder()
			.setCustomId('uid')
			.setLabel("Marticule de l'agent")
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		const tagInput = new TextInputBuilder()
			.setCustomId('tag')
			.setLabel("Tag sur discord")
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
		const secondActionRow = new ActionRowBuilder().addComponents(uidInput);
		const thirdActionRow = new ActionRowBuilder().addComponents(tagInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow,thirdActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	},
};