
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Carica i dati dal file JSON una sola volta all'avvio
let distributori = [];
app.use(express.static('public')); // Serve la cartella 'public'

fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nella lettura del file:', err);
    return;
  }
  distributori = JSON.parse(data);
  console.log('Dati caricati con successo.');
});

// Endpoint base
app.get('/', (req, res) => {
  res.send('Web Service Distributori di Carburante');
});

// Tutti i distributori
app.get('/api/distributori', (req, res) => {
  res.json(distributori);
});

// Per ID (OpenStreetMap)
app.get('/api/distributori/:id', (req, res) => {
  const id = req.params.id;
  const found = distributori.find(d => d.cidentificatore_in_openstreetmap === id);
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: 'Distributore non trovato' });
  }
});

// Filtra per regione
app.get('/api/distributori/regione/:cregione', (req, res) => {
  const regione = req.params.cregione.toUpperCase();
  const filtrati = distributori.filter(d => d.cregione.toUpperCase() === regione);
  res.json(filtrati);
});

// Filtra per provincia
app.get('/api/distributori/provincia/:cprovincia', (req, res) => {
  const provincia = req.params.cprovincia.toUpperCase();
  const filtrati = distributori.filter(d => d.cprovincia.toUpperCase() === provincia);
  res.json(filtrati);
});

// Filtra per comune
app.get('/api/distributori/comune/:ccomune', (req, res) => {
  const comune = req.params.ccomune.toUpperCase();
  const filtrati = distributori.filter(d => d.ccomune.toUpperCase() === comune);
  res.json(filtrati);
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
