#!/usr/bin/env node

/**
 * Start Strapi with optional seeding
 *
 * 1. Starts Strapi
 * 2. If SEED_ON_START=true, runs seed scripts after Strapi is ready
 *
 * Usage in Railway:
 *   Set SEED_ON_START=true for first deploy
 *   Remove SEED_ON_START after successful seeding
 */

const { spawn } = require('child_process');
const path = require('path');

const strapiRoot = path.resolve(__dirname, '..');

// Use localhost for internal calls, not the public URL
const INTERNAL_URL = `http://localhost:${process.env.PORT || 1337}`;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const SEED_ON_START = process.env.SEED_ON_START === 'true';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

async function waitForStrapi(maxAttempts = 60) {
  console.log('[seed] Waiting for Strapi to be ready...');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${INTERNAL_URL}/_health`);
      if (res.ok) {
        console.log('[seed] Strapi is ready!');
        return true;
      }
    } catch (e) {
      // Not ready yet
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('[seed] Strapi did not become ready in time');
  return false;
}

async function checkIfSeeded() {
  try {
    // Check if towns exist (our seed marker)
    const res = await fetch(`${INTERNAL_URL}/api/towns?pagination[pageSize]=1`);
    if (res.ok) {
      const data = await res.json();
      return data.data && data.data.length > 0;
    }
  } catch (e) {
    console.log('[seed] Could not check seed status:', e.message);
  }
  return false;
}

function runSeedScript(script, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`[seed] Running ${script}...`);

    const proc = spawn('node', [path.join(__dirname, script)], {
      cwd: strapiRoot,
      env: { ...process.env, ...env },
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });

    proc.on('error', reject);
  });
}

async function runSeeds() {
  console.log('[seed] Running seed scripts...');

  try {
    // These use admin login
    await runSeedScript('seed-towns.js', { ADMIN_EMAIL, ADMIN_PASSWORD, STRAPI_URL: INTERNAL_URL });
    await runSeedScript('seed-service-categories.js', { ADMIN_EMAIL, ADMIN_PASSWORD, STRAPI_URL: INTERNAL_URL });
    await runSeedScript('seed-permissions.js', { ADMIN_EMAIL, ADMIN_PASSWORD, STRAPI_URL: INTERNAL_URL });

    // This uses API token
    if (STRAPI_TOKEN) {
      await runSeedScript('seed.mjs', { STRAPI_TOKEN, STRAPI_URL: INTERNAL_URL });
    } else {
      console.log('[seed] STRAPI_TOKEN not set, skipping main seed');
    }

    console.log('[seed] ✅ Seeding complete!');
  } catch (error) {
    console.error('[seed] ❌ Seeding error:', error.message);
  }
}

async function seedAfterReady() {
  if (!SEED_ON_START) {
    console.log('[seed] SEED_ON_START not enabled, skipping');
    return;
  }

  const ready = await waitForStrapi();
  if (!ready) return;

  const alreadySeeded = await checkIfSeeded();
  if (alreadySeeded) {
    console.log('[seed] Database already has data, skipping seed');
    return;
  }

  await runSeeds();
}

// Start Strapi
console.log('[start] Starting Strapi...');

const strapi = spawn('npm', ['run', 'strapi', 'start'], {
  cwd: strapiRoot,
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
  shell: true,
});

strapi.on('error', (err) => {
  console.error('[start] Failed to start Strapi:', err);
  process.exit(1);
});

strapi.on('close', (code) => {
  console.log(`[start] Strapi exited with code ${code}`);
  process.exit(code);
});

// Run seeds in background after Strapi starts
if (SEED_ON_START) {
  seedAfterReady().catch(console.error);
}
