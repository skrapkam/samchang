const fs = require('fs');
const path = require('path');

let failed = false;
function fail(msg) {
  console.error(msg);
  failed = true;
}

// Validate project markdown frontmatter
const projectsDir = path.join(__dirname, '..', 'src', 'projects');
if (fs.existsSync(projectsDir)) {
  const projects = fs.readdirSync(projectsDir).filter(d => fs.statSync(path.join(projectsDir, d)).isDirectory());
  projects.forEach(project => {
    const file = path.join(projectsDir, project, 'index.md');
    if (!fs.existsSync(file)) {
      fail(`Missing index.md in ${project}`);
      return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      fail(`Missing frontmatter in ${file}`);
      return;
    }
    const data = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
        data[key] = value;
      }
    });
    ['title', 'date', 'excerpt'].forEach(field => {
      if (!data[field]) fail(`${file} is missing ${field}`);
    });
  });
}

// Validate music JSON data
const musicPath = path.join(__dirname, '..', 'data', 'music', 'music.json');
if (fs.existsSync(musicPath)) {
  try {
    const music = JSON.parse(fs.readFileSync(musicPath, 'utf8'));
    if (!Array.isArray(music)) {
      fail('Music data is not an array');
    } else {
      music.forEach((item, idx) => {
        ['title', 'date', 'url'].forEach(field => {
          if (!item[field]) fail(`music[${idx}].${field} missing`);
        });
        if (!item.image || !item.image.src) {
          fail(`music[${idx}].image.src missing`);
        }
      });
    }
  } catch (e) {
    fail(`Music JSON parse error: ${e.message}`);
  }
}

if (failed) {
  console.error('Content validation failed');
  process.exit(1);
} else {
  console.log('Content validation passed');
}
