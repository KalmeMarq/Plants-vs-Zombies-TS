import DRP from 'discord-rich-presence'

export default class DiscordPresence {
  private static client = DRP('754884279372087356')
  private static START_TIME = 0

  public static start(): void {
    DiscordPresence.START_TIME = Date.now()

    DiscordPresence.client.updatePresence({
      startTimestamp: DiscordPresence.START_TIME,
      largeImageKey: 'pvz',
      largeImageText:	'PlantsVsZombiesTS  1.0.0',
      instance: true
    })
  }
}