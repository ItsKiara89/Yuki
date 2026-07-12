import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from "discord.js";

import { IgnoreService } from "../../services/ignoreService.js";

import { successEmbed, errorEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";

if (!IgnoreService.ignoreUser(user.id)) {
    return InteractionHelper.universalReply(interaction, {
        embeds: [
            errorEmbed(
                "Already Ignored",
                `${user.tag} is already ignored.`
            )
        ]
    });
}

export default {
    data: new SlashCommandBuilder()
        .setName("ignore")
        .setDescription("Ignore a member")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("User to ignore")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    category: "moderation",

    async execute(interaction) {
        const user = interaction.options.getUser("target");

        let ignored = [];

        if (fs.existsSync(ignoredFile))
            ignored = JSON.parse(fs.readFileSync(ignoredFile));

        if (ignored.includes(user.id)) {
            return InteractionHelper.universalReply(interaction, {
                embeds: [errorEmbed("Already ignored", `${user.tag} is already ignored.`)]
            });
        }

        ignored.push(user.id);

        fs.writeFileSync(ignoredFile, JSON.stringify(ignored, null, 2));

        return InteractionHelper.universalReply(interaction, {
            embeds: [successEmbed("User Ignored", `${user.tag} will no longer be able to use the bot.`)]
        });
    }
};
