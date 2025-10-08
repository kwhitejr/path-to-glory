import { UnitWarscroll } from '../../../src/types/unit';

// Named Heroes
import celestantPrime from './celestant-prime.json';
import gardusSteelSoul from './gardus-steel-soul.json';
import ionusCryptborn from './ionus-cryptborn.json';
import karazaiTheScarred from './karazai-the-scarred.json';
import krondysSonOfDracothion from './krondys-son-of-dracothion.json';
import loraiChildOfTheAbyss from './lorai-child-of-the-abyss.json';
import lordCommanderBastianCarthalos from './lord-commander-bastian-carthalos.json';
import lordTerminos from './lord-terminos.json';
import neaveBlacktalon from './neave-blacktalon.json';
import neavesCompanions from './neaves-companions.json';
import vandusHammerhand from './vandus-hammerhand.json';
import yndrastaTheCelestialSpear from './yndrasta-the-celestial-spear.json';

// Generic Heroes
import knightArcanum from './knight-arcanum.json';
import knightDraconis from './knight-draconis.json';
import knightJudicatorWithGryphHounds from './knight-judicator-with-gryph-hounds.json';
import knightQuestor from './knight-questor.json';
import knightRelictor from './knight-relictor.json';
import knightVexillor from './knight-vexillor.json';
import lordAquilor from './lord-aquilor.json';
import lordCelestantOnDracoth from './lord-celestant-on-dracoth.json';
import lordCelestantOnStardrake from './lord-celestant-on-stardrake.json';
import lordCelestant from './lord-celestant.json';
import lordImperatant from './lord-imperatant.json';
import lordRelictor from './lord-relictor.json';
import lordVeritant from './lord-veritant.json';
import lordVigilantOnGryphStalker from './lord-vigilant-on-gryph-stalker.json';
import questorSoulsworn from './questor-soulsworn.json';

// Infantry Units
import liberators from './liberators.json';
import vanquishers from './vanquishers.json';
import vindictors from './vindictors.json';
import vigilors from './vigilors.json';
import praetors from './praetors.json';
import reclusians from './reclusians.json';
import annihilators from './annihilators.json';
import annihilatorsWithMeteoricGrandhammers from './annihilators-with-meteoric-grandhammers.json';

// Flying Units
import prosecutors from './prosecutors.json';
import vanguardRaptorsWithHurricaneCrossbows from './vanguard-raptors-with-hurricane-crossbows.json';
import vanguardRaptorsWithLongstrikeCrossbows from './vanguard-raptors-with-longstrike-crossbows.json';

// Cavalry/Mounted Units
import dracothianGuardConcussors from './dracothian-guard-concussors.json';
import dracothianGuardDesolators from './dracothian-guard-desolators.json';
import dracothianGuardFulminators from './dracothian-guard-fulminators.json';
import dracothianGuardTempestors from './dracothian-guard-tempestors.json';
import drakeswornTemplar from './drakesworn-templar.json';
import stormdrakeGuard from './stormdrake-guard.json';
import vanguardHunters from './vanguard-hunters.json';
import vanguardPalladorsWithShockHandaxes from './vanguard-palladors-with-shock-handaxes.json';
import vanguardPalladorsWithStarstrikeJavelins from './vanguard-palladors-with-starstrike-javelins.json';

// Chariots
import stormstrikeChariot from './stormstrike-chariot.json';

// Beasts/Companions
import gryphHounds from './gryph-hounds.json';
import aetherwings from './aetherwings.json';

// Endless Spells & Manifestations
import celestianVortex from './celestian-vortex.json';
import everblazeComet from './everblaze-comet.json';
import daisArcanum from './dais-arcanum.json';

export const stormcastEternalsUnits: Record<string, UnitWarscroll> = {
  // Named Heroes
  'celestant-prime': celestantPrime as UnitWarscroll,
  'gardus-steel-soul': gardusSteelSoul as UnitWarscroll,
  'ionus-cryptborn': ionusCryptborn as UnitWarscroll,
  'karazai-the-scarred': karazaiTheScarred as UnitWarscroll,
  'krondys-son-of-dracothion': krondysSonOfDracothion as UnitWarscroll,
  'lorai-child-of-the-abyss': loraiChildOfTheAbyss as UnitWarscroll,
  'lord-commander-bastian-carthalos': lordCommanderBastianCarthalos as UnitWarscroll,
  'lord-terminos': lordTerminos as UnitWarscroll,
  'neave-blacktalon': neaveBlacktalon as UnitWarscroll,
  'neaves-companions': neavesCompanions as UnitWarscroll,
  'vandus-hammerhand': vandusHammerhand as UnitWarscroll,
  'yndrasta-the-celestial-spear': yndrastaTheCelestialSpear as UnitWarscroll,

  // Generic Heroes
  'knight-arcanum': knightArcanum as UnitWarscroll,
  'knight-draconis': knightDraconis as UnitWarscroll,
  'knight-judicator-with-gryph-hounds': knightJudicatorWithGryphHounds as UnitWarscroll,
  'knight-questor': knightQuestor as UnitWarscroll,
  'knight-relictor': knightRelictor as UnitWarscroll,
  'knight-vexillor': knightVexillor as UnitWarscroll,
  'lord-aquilor': lordAquilor as UnitWarscroll,
  'lord-celestant-on-dracoth': lordCelestantOnDracoth as UnitWarscroll,
  'lord-celestant-on-stardrake': lordCelestantOnStardrake as UnitWarscroll,
  'lord-celestant': lordCelestant as UnitWarscroll,
  'lord-imperatant': lordImperatant as UnitWarscroll,
  'lord-relictor': lordRelictor as UnitWarscroll,
  'lord-veritant': lordVeritant as UnitWarscroll,
  'lord-vigilant-on-gryph-stalker': lordVigilantOnGryphStalker as UnitWarscroll,
  'questor-soulsworn': questorSoulsworn as UnitWarscroll,

  // Infantry Units
  'liberators': liberators as UnitWarscroll,
  'vanquishers': vanquishers as UnitWarscroll,
  'vindictors': vindictors as UnitWarscroll,
  'vigilors': vigilors as UnitWarscroll,
  'praetors': praetors as UnitWarscroll,
  'reclusians': reclusians as UnitWarscroll,
  'annihilators': annihilators as UnitWarscroll,
  'annihilators-with-meteoric-grandhammers': annihilatorsWithMeteoricGrandhammers as UnitWarscroll,

  // Flying Units
  'prosecutors': prosecutors as UnitWarscroll,
  'vanguard-raptors-with-hurricane-crossbows': vanguardRaptorsWithHurricaneCrossbows as UnitWarscroll,
  'vanguard-raptors-with-longstrike-crossbows': vanguardRaptorsWithLongstrikeCrossbows as UnitWarscroll,

  // Cavalry/Mounted Units
  'dracothian-guard-concussors': dracothianGuardConcussors as UnitWarscroll,
  'dracothian-guard-desolators': dracothianGuardDesolators as UnitWarscroll,
  'dracothian-guard-fulminators': dracothianGuardFulminators as UnitWarscroll,
  'dracothian-guard-tempestors': dracothianGuardTempestors as UnitWarscroll,
  'drakesworn-templar': drakeswornTemplar as UnitWarscroll,
  'stormdrake-guard': stormdrakeGuard as UnitWarscroll,
  'vanguard-hunters': vanguardHunters as UnitWarscroll,
  'vanguard-palladors-with-shock-handaxes': vanguardPalladorsWithShockHandaxes as UnitWarscroll,
  'vanguard-palladors-with-starstrike-javelins': vanguardPalladorsWithStarstrikeJavelins as UnitWarscroll,

  // Chariots
  'stormstrike-chariot': stormstrikeChariot as UnitWarscroll,

  // Beasts/Companions
  'gryph-hounds': gryphHounds as UnitWarscroll,
  'aetherwings': aetherwings as UnitWarscroll,

  // Endless Spells & Manifestations
  'celestian-vortex': celestianVortex as UnitWarscroll,
  'everblaze-comet': everblazeComet as UnitWarscroll,
  'dais-arcanum': daisArcanum as UnitWarscroll,
};

export default stormcastEternalsUnits;
