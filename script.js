function getRandomLatLng(map) {
    // get the boundaries of the map
    let bounds = map.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    let lngSpan = northEast.lng - southWest.lng;
    let latSpan = northEast.lat - southWest.lat;

    let randomLng = Math.random() * lngSpan + southWest.lng;
    let randomLat = Math.random() * latSpan + southWest.lat;

    return [ randomLat, randomLng,];
}

let singapore = [ 1.29,103.85]; // Singapore latlng
let map = L.map('map').setView(singapore, 13);

// setup the tile layers
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

// create marker cluster
// let markerClusterLayer = L.markerClusterGroup();

// for (let i = 0; i < 50; i++) {
//     let pos = getRandomLatLng(map);
//     L.marker(pos).bindPopup("Marker").addTo(markerClusterLayer);
// }

// markerClusterLayer.addTo(map);

// taxi availability and earthquake locator
window.addEventListener('DOMContentLoaded', async(event)=> {
    const taxiResponse = await axios.get("https://api.data.gov.sg/v1/transport/taxi-availability");
    const taxiCoordinates = taxiResponse.data.features[0].geometry.coordinates;

    let markerClusterLayer = L.markerClusterGroup();

    for (let i = 0; i < taxiCoordinates.length; i++) {
        let pos = taxiCoordinates[i];
        L.marker([pos[1],pos[0]]).bindPopup(`Lat: ${pos[1]}, Lon: ${pos[1]}`).addTo(markerClusterLayer);
    }

    markerClusterLayer.addTo(map);

    const earthquakeResponse = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson ");
    const earthquakeObjLst = earthquakeResponse.data.features;
    console.log(earthquakeResponse);

    let eqMrkrClusterLayer = L.markerClusterGroup();

    for (let i = 0; i < earthquakeObjLst.length; i++) {
        let info = earthquakeObjLst[i];
        let earthquakeCoordinates = info.geometry.coordinates;
        L.marker([earthquakeCoordinates[1],earthquakeCoordinates[0]]).bindPopup(`Earthquake at ${info.properties.place}`).addTo(eqMrkrClusterLayer);
    }

    eqMrkrClusterLayer.addTo(map);
});