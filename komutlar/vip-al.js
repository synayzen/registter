const Discord = require('discord.js');
const rdb = require('quick.db');
const moment = require('moment');
const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
let vipal = message.guild.roles.cache.find(r => r.id === ayarlar.vipROL)
if(!["807654931380174880"].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
  return message.channel.send(`Bu komutu kullanabilmek için ayarlanan kayıt yetkisine sahip olmalısınız!`).then(x => x.delete({timeout: 5000}));
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!member) return message.channel.send('Bir üye etiketlemelisin.').then(x => x.delete({timeout: 5000}));
 member.roles.remove(vipal)
  let embed = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(`${member} kullanıcısı artık ${vipal} değil !`)
  .setTimestamp()
 

message.channel.send(embed).then(x => x.delete({timeout: 5000}));
} 

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['vip-al'],
  permLevel: 0
}
exports.help = {
  name: 'vip-al',
  description: "Belirtilen üyeye kayıtsız rolü verir",
  usage: 'vip-al @kişi'
}