let maptoken=mapToken;
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
 });

 const marker=new mapboxgl.Marker()
 .setLngLat(listing.geometry.coordinates)//listing marker
 .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h3>${listing.title}</h3><p>This is location of listing!</p>`))
 


 .addTo(map);
