const Discord = require('discord.js');
const fs = require('fs');
const config = require('./data/config.json');
const roles = require('./data/roles.json');
const {token, wh_id, wh_token} = require('./data/token.json'); 
const client = new Discord.Client({autoReconnect:true});
const webhook = new Discord.WebhookClient(wh_id, wh_token);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`I'm ready and running!`);
    console.log(`${client.users.size} members found.`)
    console.log(roles.SelfAssignableRoles);
});

client.on('guildMemberAdd', member => {
    if (roles.joinRole) {
        member.addRole(roles.joinRole)
        .then(() => webhook.send(`**New Member has Joined:** ${member}`))
        .catch((reason) => { webhook.send(reason) });
    };
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    if (!config.owners.includes(message.author.id)) return;
    
    const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    };

});

client.login(token);