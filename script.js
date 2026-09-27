/* Pakistan in Bloom | Web GIS Applications (MET418), Lab 03
   City and station features are loaded from separate GeoJSON files. */
const map = L.map('map', { zoomControl: false, scrollWheelZoom: true }).setView([30.35, 69.35], 5);
L.control.zoom({ position: 'topright' }).addTo(map);

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri'
});
osm.addTo(map);

const cityIcon = L.divIcon({ className: 'city-marker', iconSize: [13, 13], iconAnchor: [6, 6] });
const stationIcon = L.divIcon({ className: 'station-marker', html: '✳', iconSize: [22, 22], iconAnchor: [11, 11] });

function row(label, value) {
  return `<div class="popup-row"><span>${label}</span><strong>${value}</strong></div>`;
}

async function loadGeoJson(paths) {
  const errors = [];
  for (const path of paths) {
    try {
      const url = new URL(path, document.baseURI);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        throw new Error('The file is not a GeoJSON FeatureCollection');
      }
      return data;
    } catch (error) {
      errors.push(`${path}: ${error.message}`);
    }
  }
  throw new Error(errors.join(' | '));
}

async function initLayers() {
  const overlayMaps = {};
  const errors = [];

  // Try the expected data/ paths first, then common GitHub upload layouts.
  try {
    const citiesData = await loadGeoJson([
      'data/cities.geojson', 'Data/cities.geojson', 'cities.geojson'
    ]);
    const citiesLayer = L.geoJSON(citiesData, {
      pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: cityIcon }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`<p class="popup-kicker">City · ${p.province}</p><h3 class="popup-name">${p.name}</h3>${row('Province', p.province)}${row('Type', p.type)}`);
        layer.bindTooltip(p.name, { direction: 'right', offset: [9, 0], className: 'city-label' });
      }
    }).addTo(map);
    overlayMaps['Major Cities'] = citiesLayer;
  } catch (error) {
    console.error('Cities GeoJSON failed to load:', error);
    errors.push(`Cities data could not load. Check that data/cities.geojson is committed to GitHub. (${error.message})`);
  }

  try {
    const stationsData = await loadGeoJson([
      'data/weather_stations.geojson',
      'data/Weather_Stations.geojson',
      'Data/weather_stations.geojson',
      'weather_stations.geojson'
    ]);
    const stationsLayer = L.geoJSON(stationsData, {
      pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: stationIcon }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`<p class="popup-kicker">Illustrative station reading</p><h3 class="popup-name">${p.station}</h3>${row('Temperature', `${p.temperature} °C`)}${row('Rainfall', `${p.rainfall} mm`)}${row('Reading type', 'Sample data')}`);
      }
    }).addTo(map);
    overlayMaps['Weather Stations'] = stationsLayer;
  } catch (error) {
    console.error('Weather stations GeoJSON failed to load:', error);
    errors.push(`Weather stations could not load. Check that data/weather_stations.geojson is committed to GitHub with the same spelling and capitalization. (${error.message})`);
  }

  L.control.layers(
    { 'OpenStreetMap': osm, 'Satellite imagery': satellite },
    overlayMaps,
    { position: 'topright', collapsed: false }
  ).addTo(map);

  if (errors.length) {
    const notice = document.createElement('div');
    notice.className = 'data-error';
    notice.textContent = errors.join(' ');
    document.querySelector('.map-frame').append(notice);
  }
}

initLayers();
