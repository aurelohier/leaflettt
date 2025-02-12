// Initialiser la carte
var map = L.map('map', {
    center: [48.11, -1.658],
    zoom: 20,
    attributionControl: true
});

// Attribution
map.attributionControl.addAttribution('<a href="https://esigat.wordpress.com/" target="_blank">MASTER SIGAT</a> / sources : RM - OSM');

// Ajouter les fonds de carte (basemaps)
var basemaps = {
    OSM: L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
        opacity: 0.2 }),
    THUNDER: L.tileLayer('https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png'),
    ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    OrthoRM2021: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2021'}),
    OrthoRM2014: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2014'}),
    PlanRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'ref_fonds:pvci_simple_gris'}),
};


// Par défaut, on ajoute le fond de carte "CARTO"
basemaps.OSM.addTo(map);


 
// Ajouter l'echelle cartographique
L.control.scale({ imperial: false,  metric: true   }).addTo(map);

// Ajouter une MiniMap

var miniMapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true,
minimized: false, position: 'bottomright'
}).addTo(map);


// Ajouter des marqueurs manuels
//RENNES 2
var popuprennes2 = '<h1>Université Rennes 2 </h1> <br> <img src="https://img.20mn.fr/aCz_EIKEQRaUgpiap_hsiSk/1444x920_des-etudiants-de-rennes-2-bloque-l-universite-rennes-2-students-block-the-university-des-etudiants-de-rennes-2-r-a-unis-en-assemblee-generale-ce-lundi-6-mars-2023-votent-le-blocage-de-l-universite-rennes-2-avant-la-manifestation-generale-prevue-le-7-mars-2023-contre-la-r-a-forme-des-retraites-students-from-rennes-2-meeting-in-general-assembly-this-monday-march-6-2023-vote-to-block-rennes-2-university-before-the-general-demonstration-scheduled-for-march-7-2023-against-the-pension-reform-picaudjustin-picaud018-credit-justin-picaud-sipa-2303061631-credit-justin-picaud-sipa-2303061641" width="200px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var rennes2icone = L.icon({
iconUrl: 'https://media.theapolis.de/uploads/organization/655cb49559dee.png',
iconSize: [40, 40] });

var Rennes2 = L.marker([48.119, -1.7013], {icon: rennes2icone}).bindPopup(popuprennes2,customOptions);

// Ajouter un gestionnaire d'événements pour le survol (hover)
Rennes2.on('mouseover', function (e) {
this.openPopup();
});

// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Rennes2.on('mouseout', function (e) {
this.closePopup();
});

//GARE
var popupgare = '<h1>gare </h1> <br> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Gare_de_Rennes_-_August_2024.jpg/1280px-Gare_de_Rennes_-_August_2024.jpg" width="200px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var gareicone = L.icon({
iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_des_trains_grandes_lignes.png',
iconSize: [40, 40] });

var Gare = L.marker([48.103, -1.672], {icon: gareicone}).bindPopup(popupgare,customOptions);

// Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {
this.openPopup();
});

// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {
this.closePopup();
});

var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: true, opacity : 0.2});

var Bat = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});

// Ajouter la couche WMS pour la voirie vélo
var velo = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
    layers: 'trp_doux:v_voirie_amenagement_velo',
    format: 'image/png',
    transparent: true,
    opacity: 0.5 // Opacité initiale
}).addTo(map);

// Ajouter un curseur d'opacité
var opacityControl = L.control({ position: 'topright' });

opacityControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'leaflet-control-opacity');
    div.innerHTML = '<label for="opacity">Opacité : </label>' +
        '<input type="range" id="opacity-slider" min="0" max="1" step="0.1" value="0.5" style="width: 100%;">';
    
    L.DomEvent.on(div, 'input', function (e) {
        // Récupérer la valeur du curseur et ajuster l'opacité de la couche
        var opacityValue = e.target.value;
        velo.setOpacity(opacityValue); // Appliquer l'opacité à la couche WMS "velo"
    });

    return div;
};


// Ajouter le contrôle d'opacité à la carte
opacityControl.addTo(map);




var marqueurs = {"Rennes2": Rennes2, "gare": Gare, "Cadastre" : Cadastre, "Batiment":Bat, "velo":velo,};

// Contrôleur de couches


// Contrôleur de couches de fond de carte avec un titre intégré
var basemapControl = L.control.layers(basemaps, null, { 
    position: 'topleft', 
    collapsed: false 
}).addTo(map);

// Ajouter un titre pour la boîte de fond de carte
basemapControl._container.insertAdjacentHTML('afterbegin', '<h3 style="margin: 5px; padding: 5px;">Fonds de carte</h3>');

// Contrôleur de couches de marqueurs avec un titre intégré
var markersControl = L.control.layers(null, marqueurs, { 
    position: 'topright', 
    collapsed: false 
}).addTo(map);

// Ajouter un titre pour la boîte des marqueurs
markersControl._container.insertAdjacentHTML('afterbegin', '<h3 style="margin: 5px; padding: 5px;">Marqueurs</h3>');


// Ajout des Stations de vélos

var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson).addTo(map);
});


// Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});