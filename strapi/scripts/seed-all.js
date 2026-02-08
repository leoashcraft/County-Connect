#!/usr/bin/env node

/**
 * Master Database Seed Script for County Connect
 *
 * Runs all seed scripts in the correct order to fully populate the Strapi database.
 *
 * Prerequisites:
 *   1. Strapi must be running: cd strapi && npm run develop
 *   2. Admin user must exist: admin@navarrocounty.com / Admin123!
 *   3. API token must be created in Strapi Admin → Settings → API Tokens
 *
 * Usage:
 *   cd strapi
 *   STRAPI_TOKEN=your_token node scripts/seed-all.js
 *
 * Options:
 *   --skip=towns,permissions    Skip specific seed steps
 *   --only=towns,churches       Run only specific seed steps
 *   --dry-run                   Show what would be done without executing
 *
 * Seed Order:
 *   1. towns              - 17 Navarro County towns with zip codes
 *   2. service-categories - Service listing categories (Home & Garden, etc.)
 *   3. main-data          - Churches, restaurants, schools, local businesses
 *   4. service-pages      - 302+ SEO service pages (guides)
 *   5. permissions        - Strapi user role permissions
 *   6. synonyms           - Search keyword synonyms
 */

import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse CLI arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const skipArg = args.find(a => a.startsWith('--skip='));
const onlyArg = args.find(a => a.startsWith('--only='));
const SKIP = skipArg ? skipArg.split('=')[1].split(',') : [];
const ONLY = onlyArg ? onlyArg.split('=')[1].split(',') : null;

// Environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

// Seed steps configuration
const SEED_STEPS = [
  {
    name: 'towns',
    description: '17 Navarro County towns',
    script: 'seed-towns.js',
    requiresAdmin: true,
    requiresToken: false,
  },
  {
    name: 'service-categories',
    description: 'Service listing categories',
    script: 'seed-service-categories.js',
    requiresAdmin: true,
    requiresToken: false,
  },
  {
    name: 'main-data',
    description: 'Churches, restaurants, schools, businesses',
    script: 'seed.js',
    requiresAdmin: false,
    requiresToken: true,
    extraArgs: ['--skip=towns,service-categories'], // Already done above
  },
  {
    name: 'service-pages',
    description: '302+ service pages (guides)',
    script: 'seed-new-services.js',
    requiresAdmin: false,
    requiresToken: true,
  },
  {
    name: 'permissions',
    description: 'Strapi user role permissions',
    script: 'seed-permissions.js',
    requiresAdmin: true,
    requiresToken: false,
  },
  {
    name: 'synonyms',
    description: 'Search keyword synonyms',
    script: 'seed-synonyms.js',
    requiresAdmin: true,
    requiresToken: false,
  },
];

function shouldRun(stepName) {
  if (SKIP.includes(stepName)) return false;
  if (ONLY && !ONLY.includes(stepName)) return false;
  return true;
}

function runScript(scriptPath, env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [scriptPath], {
      cwd: __dirname,
      env: { ...process.env, ...env },
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function checkStrapiHealth() {
  try {
    const res = await fetch(`${STRAPI_URL}/_health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║      County Connect - Master Database Seed Script         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  Strapi URL:    ${STRAPI_URL}`);
  console.log(`  API Token:     ${STRAPI_TOKEN ? '✓ Set' : '✗ Not set'}`);
  console.log(`  Admin Email:   ${ADMIN_EMAIL}`);
  console.log(`  Mode:          ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  if (SKIP.length) console.log(`  Skip:          ${SKIP.join(', ')}`);
  if (ONLY) console.log(`  Only:          ${ONLY.join(', ')}`);
  console.log('');

  // Check Strapi is running
  console.log('🔍 Checking Strapi health...');
  const healthy = await checkStrapiHealth();
  if (!healthy) {
    console.error('');
    console.error('❌ Strapi is not running or not reachable at ' + STRAPI_URL);
    console.error('');
    console.error('   Start Strapi first:');
    console.error('     cd strapi && npm run develop');
    console.error('');
    process.exit(1);
  }
  console.log('✅ Strapi is healthy\n');

  // Check for API token if needed
  const needsToken = SEED_STEPS.some(s => s.requiresToken && shouldRun(s.name));
  if (needsToken && !STRAPI_TOKEN) {
    console.error('❌ STRAPI_TOKEN environment variable is required');
    console.error('');
    console.error('   Create an API token in Strapi Admin:');
    console.error('     1. Go to Settings → API Tokens');
    console.error('     2. Click "Create new API Token"');
    console.error('     3. Name: "Seed Script", Token type: "Full access"');
    console.error('     4. Copy the token and run:');
    console.error('');
    console.error('   STRAPI_TOKEN=your_token node scripts/seed-all.js');
    console.error('');
    process.exit(1);
  }

  const startTime = Date.now();
  let completed = 0;
  let skipped = 0;
  let failed = 0;

  // Run each seed step
  for (const step of SEED_STEPS) {
    if (!shouldRun(step.name)) {
      console.log(`⏭️  Skipping: ${step.name} (${step.description})`);
      skipped++;
      continue;
    }

    console.log('');
    console.log('━'.repeat(60));
    console.log(`📦 Running: ${step.name}`);
    console.log(`   ${step.description}`);
    console.log('━'.repeat(60));

    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would run: ${step.script}`);
      completed++;
      continue;
    }

    try {
      const scriptPath = resolve(__dirname, step.script);
      const env = {
        STRAPI_URL,
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
      };

      if (step.requiresToken) {
        env.STRAPI_TOKEN = STRAPI_TOKEN;
      }

      await runScript(scriptPath, env);
      completed++;
      console.log(`✅ Completed: ${step.name}`);
    } catch (error) {
      failed++;
      console.error(`❌ Failed: ${step.name} - ${error.message}`);

      // Ask whether to continue
      console.error('');
      console.error('   The seed script failed. Subsequent steps may also fail.');
      console.error('   Continuing with remaining steps...');
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📊 Summary:');
  console.log(`   ✅ Completed: ${completed}`);
  console.log(`   ⏭️  Skipped:   ${skipped}`);
  console.log(`   ❌ Failed:    ${failed}`);
  console.log(`   ⏱️  Time:      ${elapsed}s`);
  console.log('');

  if (failed > 0) {
    console.log('⚠️  Some seed steps failed. Check the output above for details.');
    process.exit(1);
  }

  console.log('🎉 Database seeding complete!');
  console.log('');
  console.log('   Next steps:');
  console.log('   1. Open Strapi Admin: http://localhost:1337/admin');
  console.log('   2. Verify data in Content Manager');
  console.log('   3. Start the frontend: cd frontend && npm run dev');
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});
