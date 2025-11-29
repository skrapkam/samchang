#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findSharpDirs(dir, depth = 0) {
  const sharpDirs = [];
  
  if (depth > 5) return sharpDirs; // Prevent infinite recursion
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name === 'sharp' && fs.existsSync(path.join(fullPath, 'package.json'))) {
          sharpDirs.push(fullPath);
        } else if (entry.name !== 'node_modules' || depth === 0) {
          sharpDirs.push(...findSharpDirs(fullPath, depth + 1));
        }
      }
    }
  } catch (err) {
    // Ignore errors
  }
  
  return sharpDirs;
}

function removeBuildDir(sharpDir) {
  const buildDir = path.join(sharpDir, 'build');
  if (fs.existsSync(buildDir)) {
    try {
      fs.rmSync(buildDir, { recursive: true, force: true });
      console.log(`Removed build directory: ${buildDir}`);
    } catch (err) {
      console.error(`Failed to remove ${buildDir}:`, err.message);
    }
  }
}

function installSharp(sharpDir) {
  const installScript = path.join(sharpDir, 'install', 'libvips.js');
  const installDll = path.join(sharpDir, 'install', 'dll-copy.js');
  
  if (!fs.existsSync(installScript)) {
    console.log(`Install script not found at ${installScript}, skipping`);
    return;
  }
  
  const originalCwd = process.cwd();
  try {
    process.chdir(sharpDir);
    
    // Force Linux platform detection - override process.platform temporarily
    const originalPlatform = process.platform;
    const originalArch = process.arch;
    
    // Set environment to force Linux detection
    const env = {
      ...process.env,
      npm_config_platform: 'linux',
      npm_config_arch: 'x64',
      npm_config_target_platform: 'linux',
      npm_config_target_arch: 'x64',
      SHARP_IGNORE_GLOBAL_LIBVIPS: '1',
      SHARP_FORCE_GLOBAL_LIBVIPS: 'false',
      // Override platform detection
      PLATFORM: 'linux',
      ARCH: 'x64'
    };
    
    // Try to install libvips
    try {
      execSync(`node install/libvips.js`, { 
        stdio: 'inherit', 
        cwd: sharpDir,
        env: env
      });
    } catch (err) {
      console.error(`libvips install failed, trying alternative method:`, err.message);
      // If that fails, try using npm/yarn to reinstall sharp
      execSync(`npm install sharp --force --ignore-scripts=false`, {
        stdio: 'inherit',
        cwd: sharpDir,
        env: env
      });
    }
    
    // Copy DLLs if needed
    if (fs.existsSync(installDll)) {
      try {
        execSync(`node install/dll-copy.js`, {
          stdio: 'inherit',
          cwd: sharpDir,
          env: env
        });
      } catch (err) {
        // DLL copy is optional, ignore errors
        console.log(`DLL copy skipped: ${err.message}`);
      }
    }
    
    console.log(`Installed sharp: ${sharpDir}`);
  } catch (err) {
    console.error(`Failed to install sharp at ${sharpDir}:`, err.message);
    // Try one more time with yarn
    try {
      execSync(`yarn add sharp --force --ignore-scripts=false`, {
        stdio: 'inherit',
        cwd: path.dirname(sharpDir),
        env: { ...process.env, npm_config_platform: 'linux', npm_config_arch: 'x64' }
      });
    } catch (err2) {
      console.error(`Yarn reinstall also failed:`, err2.message);
    }
  } finally {
    process.chdir(originalCwd);
  }
}

const nodeModulesDir = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('node_modules not found, skipping sharp fix');
  process.exit(0);
}

console.log('Finding sharp installations...');
const sharpDirs = findSharpDirs(nodeModulesDir);

if (sharpDirs.length === 0) {
  console.log('No sharp installations found');
  process.exit(0);
}

console.log(`Found ${sharpDirs.length} sharp installation(s)`);

for (const sharpDir of sharpDirs) {
  removeBuildDir(sharpDir);
  installSharp(sharpDir);
}

console.log('Sharp fix completed');

