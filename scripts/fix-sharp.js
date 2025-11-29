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
  const installScript = path.join(sharpDir, 'lib', 'install.js');
  if (fs.existsSync(installScript)) {
    const originalCwd = process.cwd();
    try {
      process.chdir(sharpDir);
      execSync(`node ${path.basename(installScript)}`, { stdio: 'inherit', cwd: sharpDir });
      console.log(`Installed sharp: ${sharpDir}`);
    } catch (err) {
      console.error(`Failed to install sharp at ${sharpDir}:`, err.message);
    } finally {
      process.chdir(originalCwd);
    }
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

