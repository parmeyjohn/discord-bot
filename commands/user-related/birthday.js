const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  SlashCommandBuilder,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("set-bday")
  .setDescription("Set birthday month and day for server announcements.");

const execute = async (interaction) => {
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  //   const days = Array(31).keys().map(i => {label: i, value: i})
  //   console.log(days)

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Choose a month...")
    .setMinValues(1)
    .setMaxValues(12)
    .addOptions(
      months.map((m) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(m.label)
          .setValue(`${m.value}`)
      )
    );

  const actionRow = new ActionRowBuilder().addComponents(selectMenu);

  const monthReply = await interaction.reply({
    components: [actionRow],
  });
};

module.exports = { data, execute };
