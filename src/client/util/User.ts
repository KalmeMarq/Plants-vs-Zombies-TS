import BinaryReader from "./BinaryReader"
import BinaryWriter from "./BinaryWriter"

function ReadBoolPreserveNonZero(reader: BinaryReader, length: number) {
  if (length == 4) return new BoolPreserveNonZero(reader.readInt32())
  else if(length == 2) return new BoolPreserveNonZero(reader.readInt16())
  else if (length == 1) return new BoolPreserveNonZero(reader.readByte())
  else throw new Error("Length must be 1, 2, or 4 bytes but was " + length)
}

function ReadBoolPreserveNonZeroArray(reader: BinaryReader, array: BoolPreserveNonZero[], length: number) {
  for (let i = 0; i < array.length; i++) {
    array[i] = ReadBoolPreserveNonZero(reader, length)
  }
}

class BoolPreserveNonZero {
  private origValue: number
  public value: number

  public constructor(origValue: number) {
    this.value = this.origValue = origValue;
  }

  public get Value(): boolean {
    return this.value != 0
  }

  public set Value(value: boolean) {
    if(value) {
      this.value = (this.origValue !== 0) ? this.origValue : 1
    }
    else {
      this.value = 0
    }
  }
}

class User {
  public name: string = ''
  public path: string = ''

  public level: number = 1
  private money: number = 0
  public survivalModeFlags: number[] = new Array(10)
  private unknown1: number[] = new Array(2)
  public streakLengthEndlessSurvival: number = 0
  private unknown2: number[] = new Array(2)
  public hasMinigameTrophy: BoolPreserveNonZero[] = new Array(20)
  private unknown3: number[] = new Array(14)
  public numTimesAdventureModeCompleted: number = 0
  public treeOfWisdomHeight: number = 0
  public hasVaseBreakerTrophy: BoolPreserveNonZero[] = new Array(9)
  public streakLengthVaseBreakerEndless: number = 0
  public hasIZombieTrophy: BoolPreserveNonZero[] = new Array(9)
  public streakLengthIZombieEndless: number = 0
  private unknown4: number[] = new Array(30)
  public hasShopPlant: BoolPreserveNonZero[] = new Array(9)
  private unknown5: number = 0
  public marigoldLastPurchased: Date[] = new Array(3)
  public hasGoldenWateringCan: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public fertilizerAmount: number | undefined
  public bugSprayAmount: number | undefined
  public hasPhonograph: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public hasGardeningGlove: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public hasMushroomGarden: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public hasWheelbarrow: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public stinkyLastAwokenTime: Date = new Date()
  public numberSlots: number = 0
  public hasPoolCleaners: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public hasRoofCleaners: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public rakeUses: number = 0
  public hasAquariumGarden: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public chocolateAmount: number | undefined
  public treeOfWisdomAvailable: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public treeFoodAmount: number | undefined
  public hasWallNutFirstAid: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  private unknown6: number[] = new Array(54)
  private unknown7: number = 0
  public stinkyLastChocolateTime: Date = new Date()
  public stinkyXPosition: number = 0
  public stinkyYPosition: number = 0
  public miniGamesUnlocked: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public puzzleModeUnlocked: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public animateUnlockMiniGame: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public animateUnlockVasebreaker: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public animateUnlockIZombie: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public animateUnlockSurvival: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  private unknown8: number = 0
  public showAdventureCompleteDialog: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  public hasTaco: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  private unknown9: number[] = new Array(3)
  public hasAchievement: BoolPreserveNonZero[] = new Array(20)
  public acceptedZombatarLicenseAgreement: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  private unknown10: number[] = new Array(5)
  private haveCreatedZombatar: BoolPreserveNonZero = new BoolPreserveNonZero(0)
  private trailingData: number[] = []

  public constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }

  public load(reader: BinaryReader): void {
    let version = reader.readUint32()

    if(version !== 0x0C) {
      throw new Error('Imcompatible version!')
    }

    this.level = reader.readInt32()
    this.money = reader.readInt32()
    this.numTimesAdventureModeCompleted = reader.readInt32()
    for(let i = 0; i < this.survivalModeFlags.length; i++) this.survivalModeFlags[i] = reader.readInt32()
    for(let i = 0; i < this.unknown1.length; i++) this.unknown1[i] = reader.readUint32()
    this.streakLengthEndlessSurvival = reader.readInt32()
    for(let i = 0; i < this.unknown2.length; i++) this.unknown2[i] = reader.readUint32()
    ReadBoolPreserveNonZeroArray(reader, this.hasMinigameTrophy, 4)
    for(let i = 0; i < this.unknown3.length; i++) this.unknown3[i] = reader.readUint32()
    this.treeOfWisdomHeight = reader.readInt32()
    ReadBoolPreserveNonZeroArray(reader, this.hasVaseBreakerTrophy, 4)
    this.streakLengthVaseBreakerEndless = reader.readInt32()
    ReadBoolPreserveNonZeroArray(reader, this.hasIZombieTrophy, 4)
    this.streakLengthIZombieEndless = reader.readInt32()
    for(let i = 0; i < this.unknown4.length; i++) this.unknown4[i] = reader.readUint32()
    ReadBoolPreserveNonZeroArray(reader, this.hasShopPlant, 4)
    this.unknown5 = reader.readUint32()

    for(let i=0; i < this.marigoldLastPurchased.length; i++) {
      var value = reader.readInt32()
      let min = new Date(0)
      let base = new Date(2000, 1, 1)
      base.setDate(base.getDate() + value)
      let date = value == 0 ? min : base
      this.marigoldLastPurchased[i] = date
    }

    function readInt32Offset(reader: BinaryReader, offset: number) {
      let value = reader.readInt32()
      return value == 0 ? undefined : (value - offset)
    }

    function readUnixTimestamp(reader: BinaryReader) {
      let timestamp = reader.readInt32()
      if(timestamp == 0) {
        return new Date(0)
      } else {
        let base = new Date(1970, 1, 1, 0, 0, 0, 0)
        base.setSeconds(base.getSeconds() + timestamp)
        return base
      }
    }

    this.hasGoldenWateringCan = ReadBoolPreserveNonZero(reader, 4)
    this.fertilizerAmount = readInt32Offset(reader, 1000)
    this.bugSprayAmount = readInt32Offset(reader, 1000)
    this.hasPhonograph = ReadBoolPreserveNonZero(reader, 4)
    this.hasGardeningGlove = ReadBoolPreserveNonZero(reader, 4)
    this.hasMushroomGarden = ReadBoolPreserveNonZero(reader, 4)
    this.hasWheelbarrow = ReadBoolPreserveNonZero(reader, 4)
    this.stinkyLastAwokenTime = readUnixTimestamp(reader)
    this.numberSlots = reader.readInt32() + 6;
    this.hasPoolCleaners = ReadBoolPreserveNonZero(reader, 4)
    this.hasRoofCleaners = ReadBoolPreserveNonZero(reader, 4)
    this.rakeUses = reader.readUint32()
    this.hasAquariumGarden = ReadBoolPreserveNonZero(reader, 4)
    this.chocolateAmount = readInt32Offset(reader, 1000)
    this.treeOfWisdomAvailable = ReadBoolPreserveNonZero(reader, 4)
    this.treeFoodAmount = readInt32Offset(reader, 1000)
    this.hasWallNutFirstAid = ReadBoolPreserveNonZero(reader, 4)
    for(let i = 0; i < this.unknown6.length; i++) this.unknown6[i] = reader.readUint32()
    this.unknown7 = reader.readUint32()
    this.stinkyLastChocolateTime = readUnixTimestamp(reader)
    this.stinkyXPosition = reader.readInt32()
    this.stinkyYPosition = reader.readInt32()
    this.miniGamesUnlocked = ReadBoolPreserveNonZero(reader, 4)
    this.puzzleModeUnlocked = ReadBoolPreserveNonZero(reader, 4)
    this.animateUnlockMiniGame = ReadBoolPreserveNonZero(reader, 4)
    this.animateUnlockVasebreaker = ReadBoolPreserveNonZero(reader, 4)
    this.animateUnlockIZombie = ReadBoolPreserveNonZero(reader, 4)
    this.animateUnlockSurvival = ReadBoolPreserveNonZero(reader, 4)
    this.unknown8 = reader.readUint32()
    this.showAdventureCompleteDialog = ReadBoolPreserveNonZero(reader, 4)
    this.hasTaco = ReadBoolPreserveNonZero(reader, 4)
    for(let i = 0; i < this.unknown9.length; i++) this.unknown9[i] = reader.readUint32()
    let numZenGardenPlants = reader.readUint32()
  }

  public write(): Uint8Array {
    let writer = new BinaryWriter()
    return writer.finish()
  }

  public download(): void {
    let blob = new Blob([this.write()], {type: ""})
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    let fileName = 'user1.dat'
    link.download = fileName
    link.click()
  }
}