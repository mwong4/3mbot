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
const Tags = sequelize.define('tags', {
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
	Tags.sync({ force:true }); //{force:true} is for debugging
});

client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addtag') {
			// [delta] Adding a tag
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.shift(' ');

			try {
				// equivalent to: INSET INTO tags (name, desciprion, username) values (?, ?, ?);
				const tag = await Tags.create({
					name: tagName,
					description: tagDesciprtion,
					username: message.author.username,
				});
				return message.reply(`tag ${tag.name} added.`);
			}
			catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.reply('That tag already exists.');
				}
				return message.reply('Something went wrong with adding a tag.');
			}
		} else if (command === 'tag') {
			// [epsilon] Fetching a tag
			const tagName = commandArgs;

			//Equivalent to: SELECT * FROm tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { name: tagName} });
			if (tag) {
				//Equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
				tag.increment('usage_count');
				return message.channel.send(tag.get('description'));
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'edittag') {
			// [zeta] Editing a tag
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			//Equivalent to: UPDATE tags (description) values (?) WHERE name='?';
			const affectedRows = await Tags.update({description: tagDescription}, {where: {name: tagName} });
			if(affectedRows > 0) {
				return message.reply(`Tag ${tagName} was edited.`);
			}
			return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'taginfo') {
			// [theta] Dsplay info on a specific tag
			const tagName = commandArgs;

			//Equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: {name: tagName} });
			if(tag) {
				return message.channel.send(`${tageName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`)
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'showtags') {
			// [lambda] Listing all tags
			//Equivalent to: SELECT name FROm tags;
			const tagList = await Tags.findAll({attribute: ['name']});
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
			return message.channel.send(`List of tags: ${tagString}`);
		} else if (command === 'removetag') {
			// [mu] Deleting a tag
			const tagName = commandArgs;
			//Equivallent to: DELETE from tags WHERE name = ?;
			const rowCount = await Tags.destroy({where: {name: tagName} });
			if (!rowCount) return message.reply('That tag did not exist.');

			return message.reply('Tag deleted');
		}
	}
});

client.login("ODA1OTc2Mzg2MjMzNjk2MzE2.YBiuAA.SzTkEd__ApAAb-9USoIJgtDyriY");