// Legt beim Start fehlende Spiele aus der Vorlage an. Bestehende Bestenlisten bleiben unberührt.
const fs = require('fs');
const dbPath = '/data/db.json';
const seed = JSON.parse(fs.readFileSync('/app/db.seed.json', 'utf8'));
const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
let added = [];
for (const key of Object.keys(seed)) {
  if (!(key in db)) { db[key] = seed[key]; added.push(key); }
}
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(added.length ? 'Neu angelegt: ' + added.join(', ') : 'Alle Spiele vorhanden');
