document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([19.432608, -99.133209], 8); // Ubicación inicial (Ciudad de México)
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    fetch('/api/coordinates')
      .then(response => response.json())
      .then(data => {
        data.forEach(coord => {
          L.marker([coord.latitude, coord.longitude]).addTo(map);
        });
      })
      .catch(error => console.error('Error fetching coordinates:', error));
  });
  