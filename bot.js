/*
//Script Information//
Author: Max Wong
Date Created: Feb 1, 2020
Purpose: To serve 3mber Discord server

//Sources//
Initial settup and basic command recognition: https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/
Following Discord.JS API: https://discordjs.guide
Database adapted from docs: https://discordjs.guide/sequelize/#lambda-listing-all-tags
*/

const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const PREFIX = '>';

// [alpha] Connection information
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	//SQLite only
	storahe: 'database.sqlite'
});

// [beta] Creating the model
/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage INT
 * );
*/
const tags = sequelizee.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


client.once('ready', () => {
	// [gamma] Syncing the model
	tags.sync({ force:true }); //{force:true} is for debugging
});

client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addtag') {
			// [delta]
		} else if (command === 'tag') {
			// [epsilon]
		} else if (command === 'edittag') {
			// [zeta]
		} else if (command === 'taginfo') {
			// [theta]
		} else if (command === 'showtags') {
			// [lambda]
		} else if (command === 'removetag') {
			// [mu]
		}
	}
});

client.login("ODA1OTc2Mzg2MjMzNjk2MzE2.YBiuAA.SzTkEd__ApAAb-9USoIJgtDyriY");