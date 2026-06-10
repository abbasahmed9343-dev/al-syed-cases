const fs = require('fs');
const path = require('path');

const casesDir = path.join(__dirname, '..', 'content', 'cases');
const outputFile = path.join(__dirname, '..', 'public', 'cases-index.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  
  const data = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let isMultiline = false;
  let multilineContent = [];

  for (const line of lines) {
    if (isMultiline) {
      if (line.match(/^[a-z_]+:/)) {
        data[currentKey] = multilineContent.join('\n').trim();
        isMultiline = false; multilineContent = [];
        const [k, ...v] = line.split(':');
        currentKey = k.trim();
        const val = v.join(':').trim();
        if (val === '|') { isMultiline = true; }
        else { data[currentKey] = val.replace(/^["']|["']$/g, ''); }
      } else {
        multilineContent.push(line.replace(/^  /, ''));
      }
    } else {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();
      currentKey = key;
      if (val === '|') { isMultiline = true; multilineContent = []; }
      else { data[key] = val.replace(/^["']|["']$/g, ''); }
    }
  }
  if (isMultiline && currentKey) {
    data[currentKey] = multilineContent.join('\n').trim();
  }

  // Convert booleans
  for (const k of Object.keys(data)) {
    if (data[k] === 'true') data[k] = true;
    if (data[k] === 'false') data[k] = false;
  }

  return { data, body: match[2] };
}

function mdToHtml(md) {
  if (!md) return '';
  return md
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p)
    .map(p => {
      if (p.startsWith('## ')) return `<h2>${p.slice(3)}</h2>`;
      if (p.startsWith('### ')) return `<h3>${p.slice(4)}</h3>`;
      return `<p>${p.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

if (!fs.existsSync(casesDir)) {
  console.log('No cases directory found, creating empty index.');
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
  process.exit(0);
}

const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.md'));
const cases = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(casesDir, file), 'utf8');
  const { data } = parseFrontmatter(content);
  
  if (data.published === false) continue;

  cases.push({
    slug: file.replace('.md', ''),
    title_en: data.title_en || '',
    title_ur: data.title_ur || '',
    category: data.category || 'General',
    outcome: data.outcome || 'closed',
    outcome_detail_en: data.outcome_detail_en || '',
    outcome_detail_ur: data.outcome_detail_ur || '',
    date: data.date || '',
    author: data.author || 'AL SYED Team',
    cover: data.cover || '',
    featured: data.featured === true,
    summary_en: data.summary_en || '',
    summary_ur: data.summary_ur || '',
    body_en: mdToHtml(data.body_en || ''),
    body_ur: mdToHtml(data.body_ur || ''),
  });
}

// Featured first, then by date
cases.sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return 0;
});

fs.writeFileSync(outputFile, JSON.stringify(cases, null, 2));
console.log(`✓ Built cases-index.json with ${cases.length} case(s)`);
