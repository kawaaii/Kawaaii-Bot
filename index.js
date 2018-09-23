const Discord = require('discord.js');
const config = require('./data/config.json');
const roles = require('./data/roles.json');
const {token} = require('./data/token.json');
const client = new Discord.Client({autoReconnect:true});

client.on('ready', () => {
    // Messages the bot will sent in the console, when the bot is ready and connected.
    console.log(`I'm ready and running!`);
    console.log(`${client.users.size} members found.`)
});

client.on('guildMemberAdd', member => {
    // If a role in setup in the config file.
    // The bot will automaticly assign the role to the new member if enough permissions.
    if (roles.joinRole) {
        member.addRole(roles.joinRole)
        .catch((reason) => { console.log(reason) });
    };
});

client.on('message', message => {
    if (!config.owners.includes(message.author.id)) {
        // If message author is not included in the config file, bot will ignore the commands.
        return;
    };
});

client.login(token);
