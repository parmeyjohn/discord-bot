import { SlashCommandBuilder } from "discord.js";

const execute = async (interaction) => {
  await interaction.reply("Pong!");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong"),
  execute(interaction),
};
