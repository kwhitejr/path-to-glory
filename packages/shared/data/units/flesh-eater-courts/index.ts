import { UnitWarscroll } from '../../../src/types/unit';

// Named Heroes
import ushoran from './ushoran.json';
import grandJusticeGormayne from './grand-justice-gormayne.json';

// Mounted Heroes
import abhorrantGhoulKingOnTerrorgheist from './abhorrant-ghoul-king-on-terrorgheist.json';
import abhorrantGhoulKingOnZombieDragon from './abhorrant-ghoul-king-on-zombie-dragon.json';

// Generic Heroes
import abhorrantGorewarden from './abhorrant-gorewarden.json';
import abhorrantArchregent from './abhorrant-archregent.json';
import abhorrantGhoulKing from './abhorrant-ghoul-king.json';
import abhorrantCardinal from './abhorrant-cardinal.json';
import marrowscrollHerald from './marrowscroll-herald.json';
import royalDecapitator from './royal-decapitator.json';

// Courtiers
import varghulfCourtier from './varghulf-courtier.json';
import cryptInfernalCourtier from './crypt-infernal-courtier.json';
import cryptHaunterCourtier from './crypt-haunter-courtier.json';

// Infantry Units
import cryptGhouls from './crypt-ghouls.json';
import cryptguard from './cryptguard.json';
import cryptHorrors from './crypt-horrors.json';
import cryptFlayers from './crypt-flayers.json';
import royalBeastflayers from './royal-beastflayers.json';

// Cavalry Units
import morbhegKnights from './morbheg-knights.json';

// Monsters
import royalZombieDragon from './royal-zombie-dragon.json';
import royalTerrorgheist from './royal-terrorgheist.json';

// Endless Spells
import corpsemareStampede from './corpsemare-stampede.json';
import cadaverousBarricade from './cadaverous-barricade.json';
import chaliceOfUshoran from './chalice-of-ushoran.json';

export const fleshEaterCourtsUnits: Record<string, UnitWarscroll> = {
  // Named Heroes
  'ushoran': ushoran as UnitWarscroll,
  'grand-justice-gormayne': grandJusticeGormayne as UnitWarscroll,

  // Mounted Heroes
  'abhorrant-ghoul-king-on-royal-terrorgheist': abhorrantGhoulKingOnTerrorgheist as UnitWarscroll,
  'abhorrant-ghoul-king-on-royal-zombie-dragon': abhorrantGhoulKingOnZombieDragon as UnitWarscroll,

  // Generic Heroes
  'abhorrant-gorewarden': abhorrantGorewarden as UnitWarscroll,
  'abhorrant-archregent': abhorrantArchregent as UnitWarscroll,
  'abhorrant-ghoul-king': abhorrantGhoulKing as UnitWarscroll,
  'abhorrant-cardinal': abhorrantCardinal as UnitWarscroll,
  'marrowscroll-herald': marrowscrollHerald as UnitWarscroll,
  'royal-decapitator': royalDecapitator as UnitWarscroll,

  // Courtiers
  'varghulf-courtier': varghulfCourtier as UnitWarscroll,
  'crypt-infernal-courtier': cryptInfernalCourtier as UnitWarscroll,
  'crypt-haunter-courtier': cryptHaunterCourtier as UnitWarscroll,

  // Infantry Units
  'crypt-ghouls': cryptGhouls as UnitWarscroll,
  'cryptguard': cryptguard as UnitWarscroll,
  'crypt-horrors': cryptHorrors as UnitWarscroll,
  'crypt-flayers': cryptFlayers as UnitWarscroll,
  'royal-beastflayers': royalBeastflayers as UnitWarscroll,

  // Cavalry Units
  'morbheg-knights': morbhegKnights as UnitWarscroll,

  // Monsters
  'royal-zombie-dragon': royalZombieDragon as UnitWarscroll,
  'royal-terrorgheist': royalTerrorgheist as UnitWarscroll,

  // Endless Spells
  'corpsemare-stampede': corpsemareStampede as UnitWarscroll,
  'cadaverous-barricade': cadaverousBarricade as UnitWarscroll,
  'chalice-of-ushoran': chaliceOfUshoran as UnitWarscroll,
};

export default fleshEaterCourtsUnits;
