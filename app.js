// Inicjalizacja mapy
var map = L.map('map').setView([54.37324226722646, 18.615535036114153], 12); 

// Dodanie warstwy mapy (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker; // Zmienna przechowująca marker
var poligony = []; // Tablica do przechowywania poligonów

// Funkcja dodająca marker w miejscu kliknięcia na mapie
map.on('click', function(e) {
    if (marker) {
        marker.setLatLng(e.latlng); // Przemieszczanie markera, jeśli już istnieje
    } else {
        marker = L.marker(e.latlng).addTo(map); // Dodawanie nowego markera
    }
    console.log('Wybrany punkt:', e.latlng);
});

// Funkcja generująca izochrony (poligony)
function generateIsochron(mode) {
    if (!marker) {
        alert("Wybierz punkt na mapie.");
        return;
    }

    var lat = marker.getLatLng().lat;
    var lon = marker.getLatLng().lng;

    // Pobieranie wybranego czasu podróży
    var timeLimit = document.getElementById("timeSelect").value;
    
    // Twój klucz API z GraphHopper
    var apiKey = 'b4d6fe8e-068c-4530-bb4e-5a5ce57d1d19'; 

    // Konstrukcja URL do GraphHopper
    var url = `https://graphhopper.com/api/1/isochrone?point=${lat},${lon}&time_limit=${timeLimit * 60}&vehicle=${mode}&key=${apiKey}`;

    // Logowanie zapytania
    console.log("Zapytanie do API:", url);

    // Wysłanie zapytania do API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Odpowiedź z API:', data);  // Logowanie odpowiedzi

            // Sprawdzamy, czy odpowiedź zawiera dane w formacie, który możemy zamienić na GeoJSON
            if (data && data.polygons && data.polygons.length > 0) {
                var polygonCoordinates = data.polygons[0].geometry.coordinates;
                console.log('Współrzędne poligonu:', polygonCoordinates);  // Logowanie współrzędnych

                var polygonColor;
                var fillColor;
                if (mode === 'car') {
                    polygonColor = 'red'; // Czerwony dla samochodu
                    fillColor = 'rgba(255, 0, 0, 0.3)'; // Wypełnienie czerwone
                } else if (mode === 'bike') {
                    polygonColor = 'green'; // Zielony dla roweru
                    fillColor = 'rgba(0, 255, 0, 0.3)'; // Wypełnienie zielone
                } else if (mode === 'foot') {
                    polygonColor = 'blue'; // Niebieski dla pieszo
                    fillColor = 'rgba(0, 0, 255, 0.3)'; // Wypełnienie niebieskie
                }
                
                // Konwersja danych na GeoJSON
                var geoJson = {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: polygonCoordinates  // Współrzędne muszą być tablicą tablic współrzędnych
                        },
                        properties: {}
                    }]
                };

                // Dodanie GeoJSON do mapy
                var polygonLayer = L.geoJSON(geoJson, {
                    style: {
                        color: polygonColor,        // Kolor krawędzi poligonu
                        weight: 2,                  // Grubość linii
                        opacity: 0.7,               // Przezroczystość krawędzi
                        fillColor: fillColor,       // Kolor wypełnienia
                        fillOpacity: 0.3            // Przezroczystość wypełnienia
                    }
                }).addTo(map);

                // Przechowywanie poligonu w tablicy
                poligony.push(polygonLayer); // Przechowuj warstwę, a nie zmienną polygonLayer

                // Wymuszenie renderowania mapy
                map.invalidateSize();
            } else {
                console.error('Błąd: Brak danych w polu polygons.');
            }
        })
        .catch(error => {
            console.error('Błąd podczas generowania izochrony:', error);
        });
}

// Funkcja ukrywająca wszystkie poligony
function hidePolygons() {
    poligony.forEach(function(polygon) {
        polygon.setStyle({ 
            opacity: 0,               // Ustawienie przezroczystości na 0 dla krawędzi
            fillOpacity: 0            // Ustawienie przezroczystości na 0 dla wypełnienia
        });
    });
}

// Funkcja pokazująca wszystkie poligony
function showPolygons() {
    poligony.forEach(function(polygon) {
        polygon.setStyle({ 
            opacity: 0.7,             // Przywrócenie przezroczystości krawędzi
            fillOpacity: 0.3          // Przywrócenie przezroczystości wypełnienia
        });
    });
}

// Funkcja usuwająca wszystkie poligony
function removePolygons() {
    poligony.forEach(function(polygon) {
        map.removeLayer(polygon); // Usunięcie poligonu z mapy
    });
    poligony = []; // Czyszczenie tablicy z poligonami
}

// Funkcja pobierająca miejsca w obrębie izochrony
function recommendPlaces() {
    if (poligony.length === 0) {
        alert("Najpierw wygeneruj izochronę.");
        return;
    }

    // Pobierz pierwszą izochronę (dla uproszczenia)
    var polygonLayer = poligony[0];

    // Pobierz współrzędne izochrony w formacie GeoJSON
    var bounds = polygonLayer.getBounds();

    // Konwersja bounds do Overpass API bounding box
    var bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

    // Zapytanie do Overpass API dla POI
    var overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"](${bbox});out;`;

    // Wysłanie zapytania
    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Miejsca w obrębie izochrony:", data);

            // Wyczyszczenie listy miejsc
            var placesList = document.getElementById("places-list");
            placesList.innerHTML = "";

            // Wyświetlanie miejsc na mapie i w liście
            data.elements.forEach(element => {
                if (element.lat && element.lon && element.tags.name) {
                    // Dodaj marker na mapie
                    L.marker([element.lat, element.lon])
                        .addTo(map)
                        .bindPopup(element.tags.name);

                    // Dodaj miejsce do listy
                    var listItem = document.createElement("li");
                    listItem.textContent = element.tags.name;
                    placesList.appendChild(listItem);
                }
            });
        })
        .catch(error => {
            console.error("Błąd podczas pobierania miejsc:", error);
        });
}

// Dodanie event listenerów dla przycisków
document.getElementById('carBtn').addEventListener('click', function() {
    generateIsochron('car'); // Samochód
});

document.getElementById('footBtn').addEventListener('click', function() {
    generateIsochron('foot'); // Pieszo
});

document.getElementById('bikeBtn').addEventListener('click', function() {
    generateIsochron('bike'); // Rower
});

document.getElementById('hidePolygonsBtn').addEventListener('click', function() {
    hidePolygons(); // Ukrywanie poligonów
});

document.getElementById('showPolygonsBtn').addEventListener('click', function() {
    showPolygons(); // Pokazywanie poligonów
});

document.getElementById('removePolygonsBtn').addEventListener('click', function() {
    removePolygons(); // Usuwanie poligonów
});

// Dodanie event listenera dla przycisku "Rekomenduj miejsca"
document.getElementById('recommendPlacesBtn').addEventListener('click', function() {
    recommendPlaces();
});
