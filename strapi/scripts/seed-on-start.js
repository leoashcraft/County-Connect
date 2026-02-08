#!/usr/bin/env node

/**
 * Seed on Start Script
 *
 * Runs seed scripts once on first deployment.
 * Uses a database marker to track if seeding has been done.
 *
 * Set SEED_ON_START=true in Railway env vars for first deploy,
 * then remove it after successful seeding.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const SEED_ON_START = process.env.SEED_ON_START === 'true';

async function checkSeedMarker() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/towns?pagination[pageSize]=1`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      // If towns exist, seeding was already done
      return data.data && data.data.length > 0;
    }
  } catch (e) {
    console.log('Could not check seed status:', e.message);
  }
  return false;
}

async function waitForStrapi(maxAttempts = 30) {
  console.log('Waiting for Strapi to be ready...');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${STRAPI_URL}/_health`);
      if (res.ok) {
        console.log('Strapi is ready!');
        return true;
      }
    } catch (e) {
      // Not ready yet
    }
    await new Promise(r => setTimeout(r, 2000));
    process.stdout.write('.');
  }

  console.log('\nStrapi did not become ready in time');
  return false;
}

async function runSeeds() {
  const { spawn } = await import('child_process');
  const { dirname } = await import('path');
  const { fileURLToPath } = await import('url');

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const scripts = [
    'seed-towns.js',
    'seed-service-categories.js',
    'seed-permissions.js',
  ];

  for (const script of scripts) {
    console.log(`\nRunning ${script}...`);

    await new Promise((resolve, reject) => {
      const proc = spawn('node', [`${__dirname}/${script}`], {
        env: {
          ...process.env,
          STRAPI_URL,
          STRAPI_TOKEN,
        },
        stdio: 'inherit',
      });

      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`${script} failed with code ${code}`));
      });

      proc.on('error', reject);
    });
  }
}

async function main() {
  if (!SEED_ON_START) {
    console.log('SEED_ON_START not set to true, skipping seed');
    return;
  }

  if (!STRAPI_TOKEN) {
    console.log('STRAPI_TOKEN not set, skipping seed');
    return;
  }

  console.log('Seed on start enabled, checking if already seeded...');

  // Wait for Strapi to be ready
  const ready = await waitForStrapi();
  if (!ready) {
    console.log('Strapi not ready, skipping seed');
    return;
  }

  // Check if already seeded
  const alreadySeeded = await checkSeedMarker();
  if (alreadySeeded) {
    console.log('Database already seeded (towns exist), skipping');
    return;
  }

  console.log('Database not seeded, running seed scripts...');

  try {
    await runSeeds();
    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    // Don't exit with error - let Strapi continue running
  }
}

main();
