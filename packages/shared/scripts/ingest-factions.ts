#!/usr/bin/env tsx
/**
 * Faction ingestion script
 *
 * Scans PDF files in docs/references/factions/ and creates a template
 * for manual faction data entry.
 *
 * Usage: npm run ingest:factions
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { FactionSchema, type FactionData } from '../src/types/faction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACTIONS_DIR = path.join(__dirname, '../../../docs/references/factions');
const OUTPUT_FILE = path.join(__dirname, '../src/data/factions.json');

/**
 * Extract faction name from PDF filename
 * Example: "Faction Pack - Ossiarch Bonereapers.pdf" -> "Ossiarch Bonereapers"
 */
function extractFactionNameFromFilename(filename: string): string {
  const match = filename.match(/Faction Pack - (.+)\.pdf$/i);
  return match ? match[1] : filename.replace('.pdf', '');
}

/**
 * Generate faction ID from name
 * Example: "Ossiarch Bonereapers" -> "ossiarch-bonereapers"
 */
function generateFactionId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Detect likely Grand Alliance from faction name
 */
function guessGrandAlliance(name: string): string {
  const nameLower = name.toLowerCase();

  const orderKeywords = ['stormcast', 'cities', 'lumineth', 'fyreslayers', 'kharadron', 'sylvaneth', 'idoneth', 'seraphon', 'daughters of khaine'];
  const chaosKeywords = ['slaves to darkness', 'khorne', 'tzeentch', 'nurgle', 'slaanesh', 'beasts of chaos', 'disciples'];
  const deathKeywords = ['nighthaunt', 'soulblight', 'ossiarch', 'flesh-eater', 'flesh eater'];
  const destructionKeywords = ['orruk', 'gloomspite', 'ogor', 'sons of behemat', 'bonesplitterz', 'ironjawz'];

  if (orderKeywords.some(k => nameLower.includes(k))) return 'ORDER';
  if (chaosKeywords.some(k => nameLower.includes(k))) return 'CHAOS';
  if (deathKeywords.some(k => nameLower.includes(k))) return 'DEATH';
  if (destructionKeywords.some(k => nameLower.includes(k))) return 'DESTRUCTION';

  return 'UNKNOWN';
}

/**
 * Create faction template from PDF filename
 */
function createFactionTemplate(filename: string): FactionData {
  const factionName = extractFactionNameFromFilename(filename);
  const factionId = generateFactionId(factionName);
  const grandAlliance = guessGrandAlliance(factionName);

  return {
    id: factionId,
    name: factionName,
    grandAlliance,
    startingGlory: 0,
    startingRenown: 1,
    description: `Path to Glory faction pack for ${factionName}`,
    sourceFile: filename,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Main ingestion process
 */
async function main() {
  console.log('🔍 Scanning for faction PDFs...');

  // Ensure output directory exists
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

  // Check if output file already exists
  let existingFactions: Record<string, FactionData> = {};
  try {
    const existingData = await fs.readFile(OUTPUT_FILE, 'utf-8');
    existingFactions = JSON.parse(existingData);
    console.log(`📚 Found existing factions data with ${Object.keys(existingFactions).length} factions`);
  } catch {
    console.log('📝 No existing factions data found, creating new file');
  }

  // Read faction PDF files
  const files = await fs.readdir(FACTIONS_DIR);
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

  console.log(`📚 Found ${pdfFiles.length} faction PDFs`);

  // Process each PDF
  const factions: Record<string, FactionData> = { ...existingFactions };
  let newCount = 0;
  let updatedCount = 0;

  for (const filename of pdfFiles) {
    const template = createFactionTemplate(filename);
    const existing = factions[template.id];

    if (!existing) {
      console.log(`\n✨ New faction: ${template.name} (${template.grandAlliance})`);
      factions[template.id] = FactionSchema.parse(template);
      newCount++;
    } else if (existing.sourceFile !== filename) {
      console.log(`\n🔄 Updated source file for: ${template.name}`);
      factions[template.id] = {
        ...existing,
        sourceFile: filename,
        extractedAt: template.extractedAt,
      };
      updatedCount++;
    } else {
      console.log(`✓ ${template.name} (already exists)`);
    }
  }

  // Write to output file
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(factions, null, 2),
    'utf-8'
  );

  console.log(`\n✨ Ingestion complete!`);
  console.log(`   📊 Total factions: ${Object.keys(factions).length}`);
  console.log(`   ➕ New factions: ${newCount}`);
  console.log(`   🔄 Updated factions: ${updatedCount}`);
  console.log(`📝 Written to: ${OUTPUT_FILE}`);

  if (newCount > 0) {
    console.log('\n⚠️  IMPORTANT: Please manually verify the following for new factions:');
    console.log('   - Grand Alliance assignments (check PDF for accuracy)');
    console.log('   - Starting Glory values (usually 0, but verify in PDF)');
    console.log('   - Starting Renown values (usually 1, but verify in PDF)');
    console.log('   - Faction descriptions (add more detail if desired)\n');
  }
}

main().catch(console.error);
