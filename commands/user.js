// import { SlashCommandBuilder } from "discord.js";
const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const User = require('../model/User.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('useradd')
        .setDescription('This will return who you are')
        .addStringOption(option =>
            option.setName('loginid')
                .setDescription('Entrer le login')
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName('poste')
                .setDescription('Entrer le poste ayant le login')
                .setRequired(true),
        ).addStringOption(option =>
            option.setName('posteid')
                .setDescription('Entrer le posteid')
                .setRequired(true)
        ),

    async execute(interaction){

        const _user = new User(interaction.options.getString('loginid'),interaction.options.getString('poste'),interaction.options.getString('posteid'));
        console.log(_user);
        const _ref = await _user.add();
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('clink me')
                    .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                    .setCustomId('danger')
                    .setLabel('clink me')
                    .setStyle(ButtonStyle.Danger)
            );

        // interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		// await interaction.editReply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
        // await interaction.editReply({content:`${interaction.options.getString('loginid')}`, components:[row]});
        if (_ref == "rep:14") await interaction.editReply({content:`Erreur:${_ref}`})
        await interaction.editReply({
            content:`Nouvel login ajouter :
            |- login : ${_user.loginid}
            |- poste : ${_user.poste}
            |- posteId : ${_user.posteid}`,
            components:[row]});
    }
}

// |- login : ${_user.loginid}
// |- poste : ${_user.poste}

// Pause du '08/04/2023':
// - Nomena (online|offline|standby)
// - Nomena (online|offline|standby)
// - Nomena (online|offline|standby)
//
// debuté terminer pause reprise service