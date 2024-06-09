document.addEventListener('DOMContentLoaded', function () {
  // Ubicación inicial de Aguascalientes
  const map = L.map('map').setView([21.8853, -102.2916], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Variable para almacenar los marcadores
  const markersLayer = L.layerGroup().addTo(map);

  fetch('/api/coordinates')
    .then(response => response.json())
    .then(data => {
      // Almacenar las coordenadas en un array
      const coordinatesArray = data.map(coord => [coord.latitude, coord.longitude]);
      
      // Agregar los marcadores al mapa
      coordinatesArray.forEach(coord => {
        L.marker(coord).addTo(markersLayer);
      });

      // Agregar la polilínea al mapa
      L.polyline(coordinatesArray, { color: 'red' }).addTo(map);
    })
    .catch(error => console.error('Error fetching coordinates:', error));

  // Agregar un evento de clic al mapa
  map.on('click', function(e) {
    // Obtener las coordenadas del clic
    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;

    // Enviar las coordenadas al servidor
    fetch('https://ruta-gps-server.onrender.com/api/coordinates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    })
    .then(response => {
      if (response.ok) {
        alert('Coordenadas enviadas exitosamente al servidor.');
      } else {
        throw new Error('Error al enviar las coordenadas al servidor.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Ocurrió un error al enviar las coordenadas al servidor.');
    });
  });

  // Agregar un evento de clic al botón para mostrar la ruta
  const showRouteButton = document.getElementById('showRouteButton');
  showRouteButton.addEventListener('click', function() {
    // Aquí puedes agregar la lógica para mostrar la ruta
    alert('Mostrando ruta...');
  });

  // Agregar un evento de clic al botón para limpiar las coordenadas
  const deleteRouteButton = document.getElementById('deleteRouteButton');
  deleteRouteButton.addEventListener('click', function() {
      // Enviar una petición DELETE al servidor
      fetch('https://ruta-gps-server.onrender.com/api/coordinates', {
          method: 'DELETE',
      })
      .then(response => {
          if (response.ok) {
              alert('Coordenadas eliminadas exitosamente del servidor.');
          } else {
              throw new Error('Error al eliminar las coordenadas del servidor.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Ocurrió un error al eliminar las coordenadas del servidor.');
      });
  });
});
