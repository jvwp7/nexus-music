const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
client.commands = new Collection();
const commandsArray = [];
const player = global.player;

const { Translate, GetTranslationModule } = require("./process_tools");

const discordEvents = readdirSync("./events/Discord/").filter((file) =>
  file.endsWith(".js")
);
const playerEvents = readdirSync("./events/Player/").filter((file) =>
  file.endsWith(".js")
);

GetTranslationModule().then(() => {
  console.log("| Translation Module Loaded |");

  for (const file of discordEvents) {
    try {
      const DiscordEvent = require(`./events/Discord/${file}`);
      const txtEvent = `< -> > [Loaded Discord Event] <${file.split(".")[0]}>`;
      parseLog(txtEvent);
      client.on(file.split(".")[0], DiscordEvent.bind(null, client));
      delete require.cache[require.resolve(`./events/Discord/${file}`)];
    } catch (error) {
      console.error(`Erro ao carregar evento Discord ${file}:`, error);
    }
  }

  for (const file of playerEvents) {
    try {
      const PlayerEvent = require(`./events/Player/${file}`);
      const txtEvent = `< -> > [Loaded Player Event] <${file.split(".")[0]}>`;
      parseLog(txtEvent);
      player.events.on(file.split(".")[0], PlayerEvent.bind(null));
      delete require.cache[require.resolve(`./events/Player/${file}`)];
    } catch (error) {
      console.error(`Erro ao carregar evento Player ${file}:`, error);
    }
  }

  readdirSync("./commands/").forEach((dirs) => {
    const commands = readdirSync(`./commands/${dirs}`).filter((files) =>
      files.endsWith(".js")
    );

    for (const file of commands) {
      try {
        const command = require(`./commands/${dirs}/${file}`);
        if (command.name && command.description) {
          // Verificar se o comando já existe para evitar duplicatas
          if (!client.commands.has(command.name.toLowerCase())) {
            commandsArray.push(command);
            const txtEvent = `< -> > [Loaded Command] <${command.name.toLowerCase()}>`;
            parseLog(txtEvent);
            client.commands.set(command.name.toLowerCase(), command);
          } else {
            console.warn(`Comando duplicado ignorado: ${command.name}`);
          }
          delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
        } else {
          const txtEvent = `< -> > [Failed Command] <${file}>`;
          parseLog(txtEvent);
        }
      } catch (error) {
        console.error(`Erro ao carregar comando ${file}:`, error);
      }
    }
  });

  client.on("ready", async (client) => {
    try {
      console.log(`Bot online como ${client.user.tag}`);
      console.log(`Carregados ${client.commands.size} comandos`);
      
      if (client.config.app.global) {
        await client.application.commands.set(commandsArray);
        console.log("Comandos slash registrados globalmente");
      } else {
        const guild = client.guilds.cache.get(client.config.app.guild);
        if (guild) {
          await guild.commands.set(commandsArray);
          console.log("Comandos slash registrados no servidor");
        } else {
          console.error("Servidor não encontrado para registro de comandos");
        }
      }
    } catch (error) {
      console.error("Erro ao registrar comandos slash:", error);
    }
  });

  async function parseLog(txtEvent) {
    try {
      console.log(await Translate(txtEvent, null));
    } catch (error) {
      console.log(txtEvent);
    }
  }
});
