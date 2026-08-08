#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const docsDir = process.argv[2] || 'docs';
const outFile = process.argv[3] || 'SUMMARY.md';

function walk(dir){
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for(const ent of list){
    const resPath = path.join(dir, ent.name);
    if(ent.isDirectory()){
      results = results.concat(walk(resPath));
    } else if(ent.isFile() && resPath.endsWith('.md')){
      results.push(resPath);
    }
  }
  return results;
}

function extractTitle(file){
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  for(const line of lines){
    const trimmed = line.trim();
    if(trimmed.startsWith('# ')) return trimmed.replace(/^#\s+/, '');
    if(trimmed.startsWith('## ')) return trimmed.replace(/^##\s+/, '');
  }
  // fallback to filename
  return path.basename(file, '.md');
}

function relativeLink(from, to){
  return path.relative(path.dirname(from), to).split(path.sep).join('/');
}

(function main(){
  const docsPath = path.join(cwd, docsDir);
  if(!fs.existsSync(docsPath)){
    console.error(`Docs directory not found: ${docsPath}`);
    process.exit(1);
  }
  const mdFiles = walk(docsPath).sort();
  if(mdFiles.length === 0){
    console.error('No markdown files found under', docsPath);
    process.exit(1);
  }

  const lines = ['# Summary', ''];
  for(const f of mdFiles){
    const title = extractTitle(f);
    const link = './' + path.relative(cwd, f).split(path.sep).join('/');
    lines.push(`- [${title}](${link})`);
  }

  fs.writeFileSync(path.join(cwd, outFile), lines.join('\n') + '\n', 'utf8');
  console.log(`Generated ${outFile} with ${mdFiles.length} entries.`);
})();
