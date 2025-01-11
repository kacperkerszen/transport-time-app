# Analiza dostępności transportowej

## Opis i cel aplikacji

Analiza dostępności transportowej (Transport Time App) to aplikacja webowa, która pozwala użytkownikom na wybranie punktu na mapie oraz generowanie izochron czasowych dla różnych środków transportu (samochód, pieszo, rower). Aplikacja oblicza obszar, który można osiągnąć w określonym czasie podróży, w zależności od wybranego środka transportu.

Celem aplikacji jest ułatwienie planowania podróży, umożliwiając użytkownikom szybkie obliczenie obszarów dostępnych w określonym czasie.

Po wygenerowaniu izochrony aplikacja umożliwia użytkownikom wyświetlenie listy rekomendowanych miejsc znajdujących się w obrębie izochrony. Lista ta zawiera tylko miejsca posiadające nazwę (np. restauracje, kawiarnie, banki) - Rekomendowane miejsca są także wyświetlane na mapie w formie markerów.


## Struktura plików i ich funkcje

- **index.html**: Główny plik HTML aplikacji, zawiera strukturę strony, formularz wyboru czasu podróży, przyciski do wyboru środka transportu oraz mapę z opcją generowania izochron i rekomendacji miejsc.
  
- **style.css**: Arkusz stylów odpowiedzialny za wygląd aplikacji, w tym układ mapy, przyciski, oraz inne elementy interfejsu użytkownika. Styl przycisku "Rekomenduj miejsca" wyróżniono żółtym kolorem, aby odróżniał się od pozostałych funkcji.

- **app.js**: Główny plik JavaScript zawierający logikę aplikacji:
  - **Funkcje**: 
    - Dodawanie markera na mapie.
    - Generowanie izochron dla różnych środków transportu.
    - Ukrywanie, pokazywanie i usuwanie poligonów.
    - Rekomendowanie miejsc na podstawie danych z Overpass API.
    - Integracja z API GraphHopper do generowania izochron.

- **README.md**: Dokumentacja projektu, która zawiera szczegóły na temat aplikacji, jej funkcji, użytych technologii oraz autorów.

## Użyte technologie i API

- **HTML5**: Struktura strony internetowej, odpowiedzialna za organizację elementów wizualnych.
- **CSS3**: Stylowanie aplikacji, zapewniające atrakcyjny wygląd oraz responsywność.
- **JavaScript**: Główna logika aplikacji, interakcje z użytkownikiem oraz komunikacja z API.
- **Leaflet**: Biblioteka JavaScript do obsługi map. Używana do renderowania mapy i interakcji z nią.
- **GraphHopper API**: API do generowania izochron na podstawie punktu na mapie. Używane do obliczeń związanych z czasem podróży dla samochodu, roweru i pieszo.
- **Overpass API**: API wykorzystywane do wyszukiwania miejsc (POI) w obrębie izochrony. Pozwala na pobranie informacji o lokalnych atrakcjach, usługach i instytucjach.
- **GitHub Pages**: Platforma do hostowania aplikacji webowej w celach demonstracyjnych i testowych.

## Autorzy

- **Kacper Kerszen**
- **Kacper Krawczyk**

## Jak używać

1. Otwórz plik `index.html` w swojej przeglądarce.
2. Kliknij na mapę, aby wybrać punkt początkowy.
3. Wybierz czas podróży (5 minut, 15 minut, 30 minut).
4. Kliknij przycisk odpowiadający wybranemu środkowi transportu (Samochód, Pieszo, Rower), aby wygenerować izochronę.
5. Kliknij przycisk "Rekomenduj miejsca", aby wyświetlić listę miejsc w obrębie izochrony.
6. Wybierz opcję ukrywania, pokazywania lub usuwania wygenerowanych poligonów.

## Licencja

Aplikacja jest dostępna dla kadego w formie open-source. Można ją dowolnie wykorzystywać, modyfikować i udostępniać.
