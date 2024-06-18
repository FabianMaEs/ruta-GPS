document.addEventListener('DOMContentLoaded', function () {
  const loadingIndicator = document.getElementById('loading');
  const API = 'https://proyecto-electronica-34053442d1e0.herokuapp.com/api/coordinates';

  function showLoading() {
    loadingIndicator.style.display = 'block';
  }

  function hideLoading() {
    loadingIndicator.style.display = 'none';
  }

  const map = L.map('map').setView([21.8853, -102.2916], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let markersLayer = L.layerGroup().addTo(map);

  function dibujarRuta(map) {
    markersLayer.clearLayers();

    fetch(API)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch coordinates');
        }
        return response.json();
      })
      .then(data => {
        const coordinatesArray = data.map(coord => [coord.latitude, coord.longitude]);
        coordinatesArray.forEach(coord => {
          L.marker(coord).addTo(markersLayer);
        });
        L.polyline(coordinatesArray, { color: 'red' }).addTo(map);
      })
      .catch(error => {
        console.error('Error fetching coordinates:', error);
        alert('Error al obtener las coordenadas del servidor.');
      })
      .finally(() => hideLoading()); // Asegura que hideLoading se ejecute siempre
  }

  showLoading();
  fetch(API)
    .then(response => {
      if (!response.ok) {
        throw new Error('No hay coordenadas disponibles o el servidor está apagado');
      }
      return response.json();
    })
    .then(data => {
      hideLoading();
      if (data.length > 0) {
        dibujarRuta(map);
      }
    })
    .catch(error => {
      hideLoading();
      console.error('Error fetching coordinates:', error);
    });

  map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    showLoading();
    fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    })
    .then(response => {
      hideLoading();
      if (response.ok) {
        console.log('Coordenadas enviadas exitosamente al servidor.');
        dibujarRuta(map);
      } else {
        throw new Error('Error al enviar las coordenadas al servidor.');
      }
    })
    .catch(error => {
      hideLoading();
      console.error('Error:', error);
      alert('Ocurrió un error al enviar las coordenadas al servidor.');
    });
  });

  const showRouteButton = document.getElementById('showRouteButton');
  showRouteButton.addEventListener('click', function() {
    showLoading();
    dibujarRuta(map);
  });

  const deleteRouteButton = document.getElementById('deleteRouteButton');
  deleteRouteButton.addEventListener('click', function() {
    showLoading();
    fetch(API, {
      method: 'DELETE',
    })
    .then(response => {
      hideLoading();
      if (response.ok) {
        alert('Coordenadas eliminadas exitosamente del servidor.');
        window.location.reload();
      } else {
        throw new Error('Error al eliminar las coordenadas del servidor.');
      }
    })
    .catch(error => {
      hideLoading();
      console.error('Error:', error);
      alert('Ocurrió un error al eliminar las coordenadas del servidor.');
    });
  });
});
