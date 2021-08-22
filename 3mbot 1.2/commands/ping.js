/*
Author: Iamwaxy
Date Created: July 17, 2021
Purpose: ping test command

Follow Tutorials: CodeLyon
*/

module.exports = 
{
    name: 'pingtest',
    aliases: ['ping', 'test'],
    permissions: [],
    description: "Ping test command. Syntax: >ping",
    async execute(client, message, args)
    {
        /*
        if(!isNaN(args[0])) return message.channel.send("Int");
        else return message.channel.send("not Int");
        */

        //message.channel.send(args.splice(0, args.length).join(" ")); //Send 'ping' in channel

        var input = 10;
        var input2 = 0;

        if(test(input2))
        {
            console.log("yes");
        }
        else
        {
            console.log("no");
        }
    },
};

function test(_input)
{
    return _input;
}