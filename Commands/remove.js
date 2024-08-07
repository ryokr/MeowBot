const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { deleteMessage } = require('../Functions')

module.exports = {
   name: 'remove',
   description: 'Remove a song at specific position',
   voiceChannel: true,
   options: [
      {
         name: 'position',
         description: 'The position of the song, press Queue button for information. Default is current song',
         type: ApplicationCommandOptionType.Integer,
         required: false,
         autocomplete: true,
      },
   ],

   suggest: async (interaction) => {
      const query = interaction.options.getFocused()
      const choices = [1, 10, 20]

      const filtered = choices.filter((choice) => choice >= query)
      const response = filtered.map((choice) => ({ name: choice, value: choice }))

      await interaction.respond(response)
   },

   run: async (client, interaction) => {
      try {
         await interaction.deferReply()
         const position = interaction.options.getInteger('position') || 1
         const queue = client.player.getQueue(interaction.guild.id)
         const embed = new EmbedBuilder().setColor(client.config.player.embedColor).setDescription('Meowing')

         if (!queue || !queue.playing) {
            embed.setDescription('No music is currently playing')
            deleteMessage(await interaction.editReply({ embeds: [embed] }), 5000)
         } else if (queue.songs.length <= 1) {
            embed.setDescription('Removed')
            try {
               await queue.stop()
               await queue.playerMessage.delete().catch(() => {})
            } catch {}
            deleteMessage(await interaction.editReply({ embeds: [embed] }), 5000)
         } else if (position < 1 || position > queue.songs.length) {
            embed.setDescription('Please provide a valid song position in the queue')
         } else {
            if (position === 1) await queue.skip()
            const removedSong = queue.songs.splice(position - 1, 1)[0]
            embed
               .setThumbnail(removedSong.thumbnail)
               .setDescription(`✦ Removed [${removedSong.name}](${removedSong.url})・Requested by <@${removedSong.user.id}>`)

            await interaction.editReply({ embeds: [embed] })
         }
      } catch {
         console.log('❌  ✦ Remove Error')
      }
   }
}









// ─────・ F R O M  R Y O K R  W I T H  L U V ❤️‍🔥・───── //
