// Inizializza la mappa con una posizione di default (Italia centrale, ma temporanea)
const map = L.map('map').setView([42.5, 12.5], 6);

// Aggiunge il layer di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Prova a ottenere la posizione dell’utente
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Centra la mappa sulla posizione dell’utente
    map.setView([lat, lon], 13);

    // Aggiungi un marker per l'utente
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("Tu sei qui")
      .openPopup();

    // Carica i distributori solo dopo aver ottenuto la posizione
    caricaDistributori(lat, lon);

  }, error => {
    alert("Impossibile ottenere la tua posizione. Verrà mostrata la mappa generale.");
    caricaDistributori(); // Carica tutto se la posizione non è disponibile
  });
} else {
  alert("Geolocalizzazione non supportata dal browser.");
  caricaDistributori(); // Fallback
}

// Funzione per caricare distributori (eventualmente con filtro distanza)
function caricaDistributori(userLat = null, userLon = null) {
  fetch('/api/distributori')
    .then(res => res.json())
    .then(data => {
      data.forEach(distributore => {
        const lat = parseFloat(distributore.clatitudine);
        const lon = parseFloat(distributore.clongitudine);

        // Se abbiamo la posizione dell’utente, mostra solo i vicini (entro 10 km)
        if (userLat && userLon) {
          const distanza = getDistanza(userLat, userLon, lat, lon);
          if (distanza > 10) return; // Salta se troppo lontano
        }

        const nome = distributore.cnome || "Distributore";
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<strong>${nome}</strong><br>${distributore.ccomune}, ${distributore.cprovincia}`);
      });
    });
}

// Funzione per calcolare distanza in km tra due coordinate (Haversine)
function getDistanza(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
