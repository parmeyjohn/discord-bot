const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("bday")
  .setDescription("Set birthday month and day for server announcements.");

const execute = async (interaction) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = {
    January: 31,
    February: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  const modal = new ModalBuilder({
    customId: `bdayModal-${interaction.user.id}`,
    title: "Input Birthday 🍰",
  });

  const monthInput = new TextInputBuilder({
    customId: "monthInput",
    label: "What month were you born?",
    style: TextInputStyle.Short,
    maxLength: 2,
    placeholder: "mm",
    required: true,
  });

  const dayInput = new TextInputBuilder({
    customId: "dayInput",
    label: "What day were you born?",
    style: TextInputStyle.Short,
    maxLength: 2,
    placeholder: "dd",
    required: true,
  });

  const monthActionRow = new ActionRowBuilder().addComponents(monthInput);
  const dayActionRow = new ActionRowBuilder().addComponents(dayInput);

  modal.addComponents(monthActionRow, dayActionRow);

  await interaction.showModal(modal);

  const filter = (i) => i.customId === `bdayModal-${i.user.id}`;

  interaction.awaitModalSubmit({ filter, time: 30_000 }).then((i) => {
    const month = i.fields.getTextInputValue("monthInput");
    const day = i.fields.getTextInputValue("dayInput");

    i.reply({
      content: `You set your birthday to ${month} ${day}`,
      ephemeral: true,
    });
  });
};

module.exports = { data, execute };
