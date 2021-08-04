/*
Author: Iamwaxy
Date Created: July 19, 2021
Purpose: Learning to do embeds

Follow Tutorials: CodeLyon
*/

module.exports = {
    name: 'embedtest',
    aliases: ['embtest', 'testemb'],
    permissions: [],
    description: "Just a test to learn embeds. Syntax: >embedtest",
    execute(client, message, args, Discord) 
    {
        const newEmbed = new Discord.MessageEmbed()
            .setTitle('Hi there')
            .setColor('#d99307')
            .setURL('https://www.youtube.com/watch?v=Qik6A7UAGfk')
            .setDescription('Hey look, a new video!')
            .addFields(
                {name: 'Check out', value: 'Bedwards Grind Animation'},
                {name: 'and', value: 'City Pigeon Demo'}
            )
            .attachFiles(['../Images/kerdTheBird.png'])
            .setImage('attachment://kerdTheBird.png')
            .setFooter("It's Kerd the Bird");

        message.channel.send(newEmbed); //Send Embed
    }
};