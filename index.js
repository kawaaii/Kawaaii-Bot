const Discord = require('discord.js');
const config = require('./data/config.json');
const roles = require('./data/roles.json');
const {token, wh_id, wh_token} = require('./data/token.json'); 
const client = new Discord.Client({autoReconnect:true});
const webhook = new Discord.WebhookClient(wh_id, wh_token);

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
        .then(() => webhook.send(`**New Member has Joined:** ${member}`))
        .catch((reason) => { webhook.send(reason) });
    };
});

client.on('presenceUpdate', (oldMember, newMember) => {

    if (newMember.presence.game) {
        if (roles.fortniteRole && newMember.presence.game.name == "Fortnite") {
            if (!newMember.roles.has(roles.fortniteRole)) {
                newMember.addRole(roles.fortniteRole)
                .then(webhook.send(`**Fortnite role** has been given to ${newMember.user}`));
            }
        }

        if (roles.minecraftRole && newMember.presence.game.name == "Minecraft") {
            if (!newMember.roles.has(roles.minecraftRole)) {
                newMember.addRole(roles.minecraftRole)
                .then(webhook.send(`**Minecraft role** has been given to ${newMember.user}`));
            }
        }
    }

});

client.on('message', message => {
    if (!config.owners.includes(message.author.id)) {
        // If message author is not included in the config file, bot will ignore the commands.
        return;
    };
});

client.login(token);