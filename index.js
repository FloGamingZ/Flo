const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const token = process.env.token;
var prefix = ".";

const warns = JSON.parse(fs.readFileSync('./warns.json'))

client.login('NjU0MDI3MjQ4MjE0NDc0NzUy.Xe_qRA.DjjszqwGZDc4O0MNrehiz2Qw1OU');

client.on('message', message => {
    if (message.content === "Comment vas-tu ?") {
        message.channel.sendMessage('Je vais très bien merci ! :heart:');
        console.log('répond à cvt');
    }
});

/* A rejoint */
client.on('guildMemberAdd', member => {
    let embed = new Discord.RichEmbed()
        .setDescription(':tada: **Bonjour à toi** ' + member.user + ' et bienvenue sur ' + member.guild.name + ' :slight_smile: ! Passes un agréable moment sur le serveur ')
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('654030807404511256').send(embed)
    member.addRole('654049506769371163')

});

/* A quitté */
client.on('guildMemberRemove', member => {
    let embed = new Discord.RichEmbed()
        .setDescription(member.user + ' a quitté ' + member.guild.name + '... :confused:' + ' Au revoir et bonne continuation ! ')
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('654030807404511256').send(embed)

});

/*Kick*/
client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/)

    if (args[0].toLowerCase() === prefix + 'kick') {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas **kick** cet utilisateur :x:")
        if (!member.kickable) return message.channel.sen("Je ne peux pas exclure cet utilisateur")
        member.kick()
        message.channel.send(member.user.username + ' a été exclu du serveur')
    }
});

/*Ban*/
client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/)

    if (args[0].toLowerCase() === prefix + 'ban') {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas **bannir** cet utilisateur :x:")
        if (!member.bannable) return message.channel.sen("Je ne peux pas bannir cet utilisateur")
        member.ban()
        message.channel.send(member.user.username + ' a été banni du serveur')
    }
});

/*Clear*/
client.on('message', function(message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = parseInt(args[1])
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(count + 1, true)
    }

    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Utilisateur introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (!member.manageable) return message.channel.send("Je ne peux pas mute cet utilisateur")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute')
        } else {
            message.guild.createRole({ name: 'Muted', permissions: 0 }).then(function(role) {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(function(channel) {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + ' a été mute')
            })
        }
    }
})

/*Warn*/
client.on("message", function(message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason)
    }

    if (args[0].toLowerCase() === prefix + "infractions") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('Derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp()
        message.channel.send(embed)
    }
})

client.on("message", function(message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    /*Unmute*/
    if (args[0].toLowerCase() === prefix + "unmute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Utilisateur introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute cet utilisateur.")
        if (!member.manageable) return message.channel.send("Je ne pas unmute ce membre.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        message.channel.send(member + ' a été unmute')
    }

    /*Unwarn*/
    if (args[0].toLowerCase() === prefix + "unwarn") {
        let member = message.mentions.members.first()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        if (!member) return message.channel.send("Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
        if (!member.manageable) return message.channel.send("Je ne pas unwarn ce membre.")
        if (!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
        warns[member.id].shift()
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
    }
})
