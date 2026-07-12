const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../../data/ignoredUsers.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignore")
        .setDescription("Ignore a member")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Member to ignore")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const member = interaction.options.getUser("member");

        let ignored = [];

        if (fs.existsSync(file))
            ignored = JSON.parse(fs.readFileSync(file));

        if (ignored.includes(member.id)) {
            return interaction.reply({
                content: "That member is already ignored.",
                ephemeral: true
            });
        }

        ignored.push(member.id);

        fs.writeFileSync(file, JSON.stringify(ignored, null, 2));

        interaction.reply({
            content: `${member.tag} is now ignored.`,
            ephemeral: true
        });
    }
};
