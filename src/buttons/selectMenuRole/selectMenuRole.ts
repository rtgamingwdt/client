import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../models";
import { SelectMenuButton } from "../../models/interaction";

const button: SelectMenuButton = {
  name: "selectMenuRole",
  execute: async (interaction, client, guildDb) => {
    const newRole = interaction.values[0];
    const dailyMsgs = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, "Settings.embed.dailyTitle"),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyMsg",
        )}: ${
          guildDb.dailyMsg
            ? `<:check:1077962440815411241>`
            : `<:x_:1077962443013238814>`
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyChannel",
        )}: ${
          guildDb.dailyChannel
            ? `<#${guildDb.dailyChannel}>`
            : `<:x_:1077962443013238814>`
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyRole",
        )}: <@&${newRole}>\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyTimezone",
        )}: ${guildDb.dailyTimezone}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyInterval",
        )}: ${guildDb.dailyInterval}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyType",
        )}: ${guildDb.customTypes}`,
      )
      .setColor("#0598F6");

    const dailyButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyMsg")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyMsg",
            ),
          )
          .setStyle(
            guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("dailyChannel")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyChannel",
            ),
          )
          .setStyle(
            guildDb.dailyChannel ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("dailyType")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyType",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("📝"),
      ),
      dailyButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyTimezone")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyTimezone",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🌍"),
        new ButtonBuilder()
          .setCustomId("dailyRole")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyRole",
            ),
          )
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("dailyInterval")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyInterval",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⏰"),
      );

    await client.database.updateGuild(interaction.guild!.id, {
      dailyRole: newRole,
    });

    interaction.update({
      content: null,
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2],
    });
    return;
  },
};

export default button;
