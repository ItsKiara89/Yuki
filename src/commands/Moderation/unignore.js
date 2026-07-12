import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from "discord.js";

import { IgnoreService } from "../../services/ignoreService.js";

import { successEmbed, errorEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";
import { logger } from "../../utils/logger.js";
import {
    handleInteractionError,
    TitanBotError,
    ErrorTypes
} from "../../utils/errorHandler.js";

if (!IgnoreService.unignoreUser(user.id)) {
    return InteractionHelper.universalReply(interaction, {
        embeds: [
            errorEmbed(
                "User Not Ignored",
                `${user.tag} is not ignored.`
            )
        ]
    });
}

export default {
    data: new SlashCommandBuilder()
        .setName("unignore")
        .setDescription("Remove a user from the ignore list")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("User to unignore")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    category: "moderation",

    async execute(interaction) {
        try {
            const user = interaction.options.getUser("target");

            if (!user) {
                throw new TitanBotError(
                    "Missing target user",
                    ErrorTypes.USER_INPUT,
                    "You must specify a user to unignore.",
                    { subtype: "invalid_user" }
                );
            }

            let ignored = [];

            if (fs.existsSync(ignoredFile)) {
                ignored = JSON.parse(fs.readFileSync(ignoredFile, "utf8"));
            }

            if (!ignored.includes(user.id)) {
                return InteractionHelper.universalReply(interaction, {
                    embeds: [
                        errorEmbed(
                            "User Not Ignored",
                            `${user.tag} is not in the ignore list.`
                        )
                    ]
                });
            }

            ignored = ignored.filter(id => id !== user.id);

            fs.writeFileSync(
                ignoredFile,
                JSON.stringify(ignored, null, 2)
            );

            return InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        "User Unignored",
                        `${user.tag} can now use the bot again.`
                    )
                ]
            });

        } catch (error) {
            logger.error("Unignore command error:", error);
            await handleInteractionError(interaction, error, {
                subtype: "unignore_failed"
            });
        }
    }
};
