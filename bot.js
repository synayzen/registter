const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const Canvas = require('canvas')
    , Image = Canvas.Image
    , Font = Canvas.Font
    , path = require('path');
const snekfetch = require('snekfetch');
const fs = require('fs');
const DBL = require('dblapi.js');
const YouTube = require('simple-youtube-api');
const queue = new Map();  
const ytdl = require('ytdl-core');
const generator = require('generate-password');
const math = require('math-expression-evaluator')
const db = require('quick.db')
const moment = require('moment');
const ms = require('parse-ms');
const GIFEncoder = require('gifencoder');
require('moment-duration-format')
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} Adet komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: [Artemus] > ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});


client.login(process.env.TOKEN);

//----------------GİRİŞ-------------------//

  client.on("guildMemberAdd", member => { 
    const moment = require('moment');
  const kanal = ayarlar.giriskanal;
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
  const tarih = new Date().getTime() - user.createdAt.getTime();  
  const embed = new Discord.MessageEmbed()
  let rol = ayarlar.kayıtsızROL
  let yetkiliROL = ayarlar.yetkiliROL
 member.roles.add(rol)//splashen

  var kontrol;
if (tarih < 1296000000) kontrol = '<a:Assassins_tehlikeli:820061702870925342>  \` Hesap Güvenli Değil! \`'
if (tarih > 1296000000) kontrol = '<a:Assassins_guvenilir:820061737868853298>  \` Hesap Güvenli! \`'
  moment.locale("tr");
  let kanal1 = client.channels.cache.get(kanal);
    let giris = new Discord.MessageEmbed()
    .setTitle (`  \  𝐀𝐬𝐬𝐚𝐬𝐬𝐢𝐧'𝐬 𝐂𝐫𝐞𝐞𝐝 𝐅𝐚𝐦𝐢𝐥𝐲 \  `)
    .setDescription(`
<a:assassins_Yonok:827100827943960576>  **Sunucuya Hoş Geldin! ${member} ** **Seninle birlikte  __${member.guild.memberCount}__** ** Kişiyiz! **

<a:assassins_Yonok:827100827943960576>  ** Ses kanalına girerek kayıt olabilirsiniz. **

<a:assassins_Yonok:827100827943960576>  ** Kayıt için bekleyin ** <@&${yetkiliROL}>  ** kayıt edecektir. **

<a:assassins_Yonok:827100827943960576> \` ⚔ \` ** Tagımızı alarak ekibimize katılabilirsin. **

<a:assassins_Yonok:827100827943960576> ** Hesabın oluşturulma tarihi: ** \` ${moment(member.user.createdAt).format("YYYY DD MMMM dddd (hh:mm:ss)")} \` 

${kontrol} 

`) //splashen
    

    .setImage('https://cdn.discordapp.com/attachments/801730953813688340/803663058366103562/orjin.gif')
    .setFooter(`⚔ 𝗔𝘀𝘀𝗮𝘀𝗶𝗻'𝘀 𝗰𝗿𝗲𝗲𝗱 Sunar`)
    .setTimestamp()
kanal1.send(giris)
kanal1.send("<@&800629483865899008>")
  }); 

//-------------------------GİRİŞ_SON--------------------------//
//splashen<@&800629483865899008>


//----------------TAGLI_ALIM------------------------------//

client.on('userUpdate', async user => {
  let jaus0 = "sunucu-id"; //Buraya sunucunuzun IDsini yazın
  let jaus1 = "tagınız"; //Buraya tagınızı yazın
  let jaus2 = "tag-rol"; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
  let channel = client.guilds.cache.get(jaus0).channels.find(x => x.name == 'ekip-rol'); //tagrol-log yerine kendi log kanalınızın ismini yazabilirsiniz
  if (!jaus1) return;
  if (!jaus2) return;
  if (!channel) return;
  let member = client.guilds.cache.get(jaus0).members.get(user.id);
  if (!member) return;
  if (!member.roles.has(jaus2)) {
    if (member.user.username.includes(jaus1)) {
      member.addRole(jaus2)
      const tagaljaus = new Discord.RichEmbed()
      .setColor("BLACK")
      .setDescription(`<@${user.id}> adlı kişi, ${jaus1} aile aldığından dolayı <@&${jaus2}> rolüne erişti.`)
      .setTimestamp()
      channel.send(tagaljaus)
    }
  }else{
    if (!member.user.username.includes(jaus1)) {
      member.removeRole(jaus2)
      const tagbırakjaus = new Discord.RichEmbed()
      .setColor("BLACK")
      .setDescription(`<@${user.id}> adlı kişi, ${jaus1} aile tagımızı sildiğinden dolayı <@&${jaus2}> rolünü kaybetti.`)
      .setTimestamp()
      channel.send(tagbırakjaus)
    }
  }
});

//---------------TAG_MESAJI------------------------//

client.on("message", async msg => {
  if (msg.content.toLowerCase() === 'tagal') {
    msg.channel.send('** ``⚔`` **')  // bunu düzeltirsiniz normalde otomatik siliyordu ama böyle daha olur diye düzeltim : D  veya cimrilik yaptım
   }
}); 
client.on("message", async msg => {
  if (msg.content.toLowerCase() === 'tag') {
    msg.channel.send('** ``⚔`` **')  // bunu düzeltirsiniz normalde otomatik siliyordu ama böyle daha olur diye düzeltim : D  veya cimrilik yaptım
   }
}); 


//-------------MESAJ_LOG-----------------------------//

client.on("messageUpdate", async (oldMessage, newMessage) => {
if(newMessage.author.bot || newMessage.channel.type === "dm") return;
  let slog = newMessage.guild.channels.cache.find(c => c.name === "801730944587268116") // idli şekle getirirsin istiyorsan düzeltirsin
  if (oldMessage.content == newMessage.content) return;
  let sikerimemreyi = new Discord.MessageEmbed()
  .setColor("BLACK")
  .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
  .addField("Kullanıcı", newMessage.author)
  .addField("Eski Mesaj", oldMessage.content, true)
  .addField("Yeni Mesaj", newMessage.content, true)
  .addField("Kanal Adı", newMessage.channel.name, true)
  .addField("Mesaj ID", newMessage.id, true)
  .setThumbnail(newMessage.author.avatarURL)
  .setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours()+3}:${newMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL}`)
  slog.send(sikerimemreyi)
});
client.on("messageDelete", async (deletedMessage) => {
if(deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  let slog = deletedMessage.guild.channels.cache.find(c => c.name === "801730944587268116")// idli şekle getirirsin istiyorsan düzeltirsin
  let jauscoolama = new Discord.MessageEmbed()
  .setColor("BLACK")
  .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL)
  .addField("Kullanıcı", deletedMessage.author)
  .addField("Silinen Mesaj", deletedMessage.content, true)
  .addField("Kanal Adı", deletedMessage.channel.name, true)
  .addField("Mesaj ID", deletedMessage.id, true)
  .setThumbnail(deletedMessage.author.avatarURL)
  .setFooter(`Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours()+3}:${deletedMessage.createdAt.getMinutes()}`, `${client.user.displayAvatarURL}`)
  slog.send(jauscoolama)
});

//-----------FOTO_CHAT_LOG---------------------//

function extension(attachment) {

    let imageLink = attachment.split('.');

    let typeOfImage = imageLink[imageLink.length - 1];

    let image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);

    if (!image) return '';

    return attachment;

}

client.on('message', async message => {

if(message.channel.id === 'foto-chat-log') {

  let image = message.attachments.size > 0 ? await extension(message.attachments.array()[0].url) : '';

 if (message.attachments.size < 1) return;

const jausss = new Discord.RichEmbed()

.setImage(image)

client.channels.get('log-kanalı').send(jausss)

}})




client.on("ready", () => {
  client.channels.cache.get("801730967910875188").join();
});

//-----------------BOTUN_SESLİDE_KALMASI

const Discord1 = require('discord.js');
const client2 = new Discord.Client();
client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}!`);
console.log("Streamstatus AKIYORR")

client.user.setActivity(`Synayzen lvar 💕 Assassin's Creed Family`, {
type: "STREAMING",
url: "https://www.twitch.tv/synayzen"})
    .then(presence => console.log(`HAZIR KAPTAN ASSASSİNS!  ${presence.game ? presence.game.none : '🛠'}`))
    .catch(console.error);
});

//-----------------------------//

//-----------------------KOMUTLAR-----------------------\\

const iltifatlar1 = [
  " \n <a:twicth_siyah:839090517115535391> Sizin oy vermeniz,  **𝐀𝐬𝐬𝐚𝐬𝐬𝐢𝐧'𝐬 𝐂𝐫𝐞𝐞𝐝 𝐅𝐚𝐦𝐢𝐥𝐲** 'i discord public sunucular arasında zirveye taşıyıcaktır. \n <a:twicth_siyah:839090517115535391> Oy verebilmek için <#831909305656672306> kanalına,  \` /like \` yazmanız yeterlidir. \n Bu işlemi __3 saat' de bir tekrar edebilirseniz__ ne mutlu hepimize. \n <a:twicth_siyah:839090517115535391> Oy veren herkese teşekkürler.<a:ugen:838420877330219088> \n <a:mor_alev:838421339827470367> <@&800108734968758293> <a:mor_alev:838421339827470367>",
 " \n <a:twicth_siyah:839090517115535391> Sizin oy vermeniz,  **𝐀𝐬𝐬𝐚𝐬𝐬𝐢𝐧'𝐬 𝐂𝐫𝐞𝐞𝐝 𝐅𝐚𝐦𝐢𝐥𝐲** 'i discord public sunucular arasında zirveye taşıyıcaktır. \n <a:twicth_siyah:839090517115535391> Oy verebilmek için <#831909305656672306> kanalına,  \` /like \` yazmanız yeterlidir. \n Bu işlemi __3 saat' de bir tekrar edebilirseniz__ ne mutlu hepimize. \n <a:twicth_siyah:839090517115535391> Oy veren herkese teşekkürler.<a:ugen:838420877330219088> \n <a:mor_alev:838421339827470367> <@&800108734968758293> <a:mor_alev:838421339827470367>",
" \n <a:twicth_siyah:839090517115535391> Sizin oy vermeniz,  **𝐀𝐬𝐬𝐚𝐬𝐬𝐢𝐧'𝐬 𝐂𝐫𝐞𝐞𝐝 𝐅𝐚𝐦𝐢𝐥𝐲** 'i discord public sunucular arasında zirveye taşıyıcaktır. \n <a:twicth_siyah:839090517115535391> Oy verebilmek için <#831909305656672306> kanalına,  \` /like \` yazmanız yeterlidir. \n Bu işlemi __3 saat' de bir tekrar edebilirseniz__ ne mutlu hepimize. \n <a:twicth_siyah:839090517115535391> Oy veren herkese teşekkürler.<a:ugen:838420877330219088> \n <a:mor_alev:838421339827470367> <@&800108734968758293> <a:mor_alev:838421339827470367>",
" \n <a:twicth_siyah:839090517115535391> Sizin oy vermeniz,  **𝐀𝐬𝐬𝐚𝐬𝐬𝐢𝐧'𝐬 𝐂𝐫𝐞𝐞𝐝 𝐅𝐚𝐦𝐢𝐥𝐲** 'i discord public sunucular arasında zirveye taşıyıcaktır. \n <a:twicth_siyah:839090517115535391> Oy verebilmek için <#831909305656672306> kanalına,  \` /like \` yazmanız yeterlidir. \n Bu işlemi __3 saat' de bir tekrar edebilirseniz__ ne mutlu hepimize. \n <a:twicth_siyah:839090517115535391> Oy veren herkese teşekkürler.<a:ugen:838420877330219088> \n <a:mor_alev:838421339827470367> <@&800108734968758293> <a:mor_alev:838421339827470367>"
];

var iltifatSayi = 0; 
client.on("message", async message => {
  if(message.channel.id !== "802553188884545537" || message.author.bot) return;
  iltifatSayi++
  if(iltifatSayi >= 200) { // 20 yazan yer, 20 mesajda bir iltifat edeceğini gösterir, değiştirebilirsiniz.
    iltifatSayi = 0;
    const pinkcode = Math.floor(Math.random() * ((iltifatlar1).length - 1) + 1);
    message.reply(`**${(iltifatlar1)[pinkcode]}**`);
  };
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("guildMemberAdd", async member => {
  let ozelhosgeldin = await db.fetch(`ozelhosgeldin_${member.guild.id}`);
  if (!ozelhosgeldin) return;

  member.send(
    ozelhosgeldin
      ? ozelhosgeldin
          .replace("-sunucu-", `\`${member.guild.name}\``)
          .replace("-kullanıcı-", `\`${member.user.tag}\``)
      : ``
  );
});

client.on("guildMemberRemove", async member => {
  let ozelgorusuruz = await db.fetch(`ozelgorusuruz_${member.guild.id}`);
  if (!ozelgorusuruz) return;

  member.send(
    ozelgorusuruz
      ? ozelgorusuruz
          .replace("-sunucu-", `\`${member.guild.name}\``)
          .replace("-kullanıcı-", `\`${member.user.tag}\``)
      : ``
  );
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////