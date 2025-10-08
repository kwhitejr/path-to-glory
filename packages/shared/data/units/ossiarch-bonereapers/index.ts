import { UnitWarscroll } from '../../../src/types/unit';

// Named Heroes
import nagash from './nagash.json';
import katakros from './katakros.json';
import arkhanTheBlack from './arkhan-the-black.json';
import archKavalosZandtos from './arch-kavalos-zandtos.json';
import vokmortian from './vokmortian.json';

// Generic Heroes
import mortisanBoneshaper from './mortisan-boneshaper.json';
import mortisanOssifector from './mortisan-ossifector.json';
import mortisanSoulreaper from './mortisan-soulreaper.json';
import mortisanSoulmason from './mortisan-soulmason.json';
import liegeKavalos from './liege-kavalos.json';

// Infantry Units
import mortekGuard from './mortek-guard.json';
import immortisGuard from './immortis-guard.json';
import necropolisStalkers from './necropolis-stalkers.json';
import teraticCohort from './teratic-cohort.json';
import morghastArchai from './morghast-archai.json';
import morghastHarbingers from './morghast-harbingers.json';

// Cavalry Units
import kavalosDeathriders from './kavalos-deathriders.json';

// Monsters & War Machines
import gothizzarHarvester from './gothizzar-harvester.json';
import mortekCrawler from './mortek-crawler.json';

// Endless Spells
import nightmarePredator from './nightmare-predator.json';
import soulstealerCarrion from './soulstealer-carrion.json';
import boneTitheShrieker from './bone-tithe-shrieker.json';

export const ossiarchBonereapersUnits: Record<string, UnitWarscroll> = {
  // Named Heroes
  'nagash': nagash as UnitWarscroll,
  'katakros': katakros as UnitWarscroll,
  'arkhan-the-black': arkhanTheBlack as UnitWarscroll,
  'arch-kavalos-zandtos': archKavalosZandtos as UnitWarscroll,
  'vokmortian': vokmortian as UnitWarscroll,

  // Generic Heroes
  'mortisan-boneshaper': mortisanBoneshaper as UnitWarscroll,
  'mortisan-ossifector': mortisanOssifector as UnitWarscroll,
  'mortisan-soulreaper': mortisanSoulreaper as UnitWarscroll,
  'mortisan-soulmason': mortisanSoulmason as UnitWarscroll,
  'liege-kavalos': liegeKavalos as UnitWarscroll,

  // Infantry Units
  'mortek-guard': mortekGuard as UnitWarscroll,
  'immortis-guard': immortisGuard as UnitWarscroll,
  'necropolis-stalkers': necropolisStalkers as UnitWarscroll,
  'teratic-cohort': teraticCohort as UnitWarscroll,
  'morghast-archai': morghastArchai as UnitWarscroll,
  'morghast-harbingers': morghastHarbingers as UnitWarscroll,

  // Cavalry Units
  'kavalos-deathriders': kavalosDeathriders as UnitWarscroll,

  // Monsters & War Machines
  'gothizzar-harvester': gothizzarHarvester as UnitWarscroll,
  'mortek-crawler': mortekCrawler as UnitWarscroll,

  // Endless Spells
  'nightmare-predator': nightmarePredator as UnitWarscroll,
  'soulstealer-carrion': soulstealerCarrion as UnitWarscroll,
  'bone-tithe-shrieker': boneTitheShrieker as UnitWarscroll,
};

export default ossiarchBonereapersUnits;
