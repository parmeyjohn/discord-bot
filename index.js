const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  User,
} = require("discord.js");
require("dotenv").config();
const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`Error connection to MongoDB: ${error}`);
  }
};

connectMongoDB();
const users = mongoose.connection.collection("users");
const UserModel = require("./models/user");
const { listMembers } = require("./utils");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Loop through every file of every command type folder in the commands folder
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      console.log(command);
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// executes once bot is running
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// executes when the bot joins a server
client.on(Events.GuildCreate, (guild) => {
  console.log("Bot entered guild");
  const memberList = listMembers(guild);
  try {
    memberList.forEach(
      async (member) =>
        await UserModel.findOneAndUpdate(
          { _id: member.uid },
          { username: member.username },
          { upsert: true }
        )
    );
  } catch (err) {
    console.log("Bot Join Error:", err);
  }
});

// executes when a member joins the server
client.on(Events.GuildMemberAdd, async (member) => {
  if (member.user.bot) {
    return;
  }
  try {
    await UserModel.create({
      _id: member.user.id,
      username: member.user.username,
    });
  } catch (err) {
    console.log("Member Add Error:", err);
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  try {
    await UserModel.findByIdAndDelete(member.user.id);
  } catch (err) {
    console.log("Member Remove Error:", err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
