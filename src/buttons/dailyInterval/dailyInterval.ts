import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } from "discord.js";
import { Button } from "../../models";

const modalObject = {
  title: "Daily Post Time",
  custom_id: "dailyInterval",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "When should the message be posted? (HH:MM)",
        },
      ],
    },
  ],
};

function isFormat(str: string) {
  return /^(?:[01]\d|2[0-4]):(?:00|30)$/.test(str);
}

const button: Button = {
  name: "dailyInterval",
  execute: async(interaction, client, guildDb) => {
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyInterval === value)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.intervalSame",
            ),
          });
        if (isFormat(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.intervalInvalid",
            ),
          });

        const dailyMsgs = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyTitle",
            ),
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyMsg",
            )}: ${
              guildDb.dailyMsg
                ? `<:check:1077962440815411241>`
                : `<:x_:1077962443013238814>`
            }\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyChannel",
              )}: ${
                guildDb.dailyChannel
                  ? `<#${guildDb.dailyChannel}>`
                  : `<:x_:1077962443013238814>`
              }\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyRole",
              )}: ${
                guildDb.dailyRole
                  ? `<@&${guildDb.dailyRole}>`
                  : `<:x_:1077962443013238814>`
              }\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyTimezone",
              )}: ${guildDb.dailyTimezone}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyInterval",
              )}: ${value}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyType",
              )}: ${guildDb.customTypes}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyThread",
              )}: ${
                guildDb.dailyThread
                  ? `<:check:1077962440815411241>`
                  : `<:x_:1077962443013238814>`
              }`,
          )
          .setColor("#0598F6");

        const dailyButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("dailyMsg")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyMsg",
                ),
              )
              .setStyle(guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("dailyChannel")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyChannel",
                ),
              )
              .setStyle(guildDb.dailyChannel ? ButtonStyle.Success : ButtonStyle.Secondary),
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
          dailyButtons2 = new ActionRowBuilder().addComponents(
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
              .setStyle(guildDb.dailyRole ? ButtonStyle.Success : ButtonStyle.Secondary),
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
          ),
          dailyButtons3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("dailyThread")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyThread",
                ),
              )
              .setStyle(guildDb.dailyThread ? ButtonStyle.Success : ButtonStyle.Secondary),
          );

        await client.database.updateGuild(interaction.guild?.id || "", {
          dailyInterval: value,
        });

        return (modalInteraction as any).update({
          content: null,
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2, dailyButtons3],
          ephemeral: true,
        });
      });
  },
};

export default button;