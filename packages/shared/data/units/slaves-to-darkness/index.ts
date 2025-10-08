import { UnitWarscroll } from '../../../src/types/unit';

// Named Heroes
import archaon from './archaon.json';
import belakor from './belakor.json';
import abraxia from './abraxia.json';
import eternus from './eternus.json';
import gunnarBrand from './gunnar-brand.json';
import singriBrand from './singri-brand.json';

// Generic Heroes
import daemonPrince from './daemon-prince.json';
import chaosLordOnDaemonicMount from './chaos-lord-on-daemonic-mount.json';
import chaosLordOnManticore from './chaos-lord-on-manticore.json';
import chaosLordOnKarkadrak from './chaos-lord-on-karkadrak.json';
import chaosLord from './chaos-lord.json';
import chaosSorcererLordOnManticore from './chaos-sorcerer-lord-on-manticore.json';
import chaosSorcererLord from './chaos-sorcerer-lord.json';
import exaltedHeroOfChaos from './exalted-hero-of-chaos.json';
import gauntSummonerOnDisc from './gaunt-summoner-on-disc.json';
import gauntSummoner from './gaunt-summoner.json';
import ogroidMyrmidon from './ogroid-myrmidon.json';
import centaurionMarshal from './centaurion-marshal.json';
import darkoathChieftainOnWarsteed from './darkoath-chieftain-on-warsteed.json';
import darkoathChieftain from './darkoath-chieftain.json';
import darkoathWarqueen from './darkoath-warqueen.json';

// Infantry Units
import chaosWarriors from './chaos-warriors.json';
import chaosChosen from './chaos-chosen.json';
import chaosLegionnaires from './chaos-legionnaires.json';
import darkoathMarauders from './darkoath-marauders.json';
import darkoathSavagers from './darkoath-savagers.json';
import ogroidTheridons from './ogroid-theridons.json';

// Cavalry Units
import chaosKnights from './chaos-knights.json';
import varanguard from './varanguard.json';
import darkoathFellriders from './darkoath-fellriders.json';

// Chariots
import chaosChariot from './chaos-chariot.json';
import gorebeastChariot from './gorebeast-chariot.json';

// Monsters & War Machines
import chaosWarshrine from './chaos-warshrine.json';
import soulGrinder from './soul-grinder.json';
import chaosSpawn from './chaos-spawn.json';
import mutalithVortexBeast from './mutalith-vortex-beast.json';
import slaughterbrute from './slaughterbrute.json';
import darkoathWilderfiend from './darkoath-wilderfiend.json';
import fomoroidCrusher from './fomoroid-crusher.json';
import mindstealerSphiranx from './mindstealer-sphiranx.json';

// Other Units
import chaosFuries from './chaos-furies.json';
import raptoryx from './raptoryx.json';

// Named Units
import theOathswornKin from './the-oathsworn-kin.json';

// Endless Spells & Manifestations
import realmscourgeRupture from './realmscourge-rupture.json';
import eightfoldDoomSigil from './eightfold-doom-sigil.json';
import darkfireDaemonrift from './darkfire-daemonrift.json';
import nexusChaotica from './nexus-chaotica.json';

export const slavesToDarknessUnits: Record<string, UnitWarscroll> = {
  // Named Heroes
  'archaon': archaon as UnitWarscroll,
  'belakor': belakor as UnitWarscroll,
  'abraxia': abraxia as UnitWarscroll,
  'eternus': eternus as UnitWarscroll,
  'gunnar-brand': gunnarBrand as UnitWarscroll,
  'singri-brand': singriBrand as UnitWarscroll,

  // Generic Heroes
  'daemon-prince': daemonPrince as UnitWarscroll,
  'chaos-lord-on-daemonic-mount': chaosLordOnDaemonicMount as UnitWarscroll,
  'chaos-lord-on-manticore': chaosLordOnManticore as UnitWarscroll,
  'chaos-lord-on-karkadrak': chaosLordOnKarkadrak as UnitWarscroll,
  'chaos-lord': chaosLord as UnitWarscroll,
  'chaos-sorcerer-lord-on-manticore': chaosSorcererLordOnManticore as UnitWarscroll,
  'chaos-sorcerer-lord': chaosSorcererLord as UnitWarscroll,
  'exalted-hero-of-chaos': exaltedHeroOfChaos as UnitWarscroll,
  'gaunt-summoner-on-disc': gauntSummonerOnDisc as UnitWarscroll,
  'gaunt-summoner': gauntSummoner as UnitWarscroll,
  'ogroid-myrmidon': ogroidMyrmidon as UnitWarscroll,
  'centaurion-marshal': centaurionMarshal as UnitWarscroll,
  'darkoath-chieftain-on-warsteed': darkoathChieftainOnWarsteed as UnitWarscroll,
  'darkoath-chieftain': darkoathChieftain as UnitWarscroll,
  'darkoath-warqueen': darkoathWarqueen as UnitWarscroll,

  // Infantry Units
  'chaos-warriors': chaosWarriors as UnitWarscroll,
  'chaos-chosen': chaosChosen as UnitWarscroll,
  'chaos-legionnaires': chaosLegionnaires as UnitWarscroll,
  'darkoath-marauders': darkoathMarauders as UnitWarscroll,
  'darkoath-savagers': darkoathSavagers as UnitWarscroll,
  'ogroid-theridons': ogroidTheridons as UnitWarscroll,

  // Cavalry Units
  'chaos-knights': chaosKnights as UnitWarscroll,
  'varanguard': varanguard as UnitWarscroll,
  'darkoath-fellriders': darkoathFellriders as UnitWarscroll,

  // Chariots
  'chaos-chariot': chaosChariot as UnitWarscroll,
  'gorebeast-chariot': gorebeastChariot as UnitWarscroll,

  // Monsters & War Machines
  'chaos-warshrine': chaosWarshrine as UnitWarscroll,
  'soul-grinder': soulGrinder as UnitWarscroll,
  'chaos-spawn': chaosSpawn as UnitWarscroll,
  'mutalith-vortex-beast': mutalithVortexBeast as UnitWarscroll,
  'slaughterbrute': slaughterbrute as UnitWarscroll,
  'darkoath-wilderfiend': darkoathWilderfiend as UnitWarscroll,
  'fomoroid-crusher': fomoroidCrusher as UnitWarscroll,
  'mindstealer-sphiranx': mindstealerSphiranx as UnitWarscroll,

  // Other Units
  'chaos-furies': chaosFuries as UnitWarscroll,
  'raptoryx': raptoryx as UnitWarscroll,

  // Named Units
  'the-oathsworn-kin': theOathswornKin as UnitWarscroll,

  // Endless Spells & Manifestations
  'realmscourge-rupture': realmscourgeRupture as UnitWarscroll,
  'eightfold-doom-sigil': eightfoldDoomSigil as UnitWarscroll,
  'darkfire-daemonrift': darkfireDaemonrift as UnitWarscroll,
  'nexus-chaotica': nexusChaotica as UnitWarscroll,
};

export default slavesToDarknessUnits;
