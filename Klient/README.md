# Naukowcy – klient React (Vite)

## Uruchomienie
1. W katalogu projektu:
   - `npm install`
   - `npm run dev`

2. (Opcjonalnie) ustaw API:
   - skopiuj `.env.example` → `.env`
   - ustaw `VITE_API_BASE_URL` (np. `http://localhost:8000`)

## Wymagania z zadania
- kafelki listy + usuwanie + przejście do edycji (ID w URL)
- jeden formularz do dodawania/edycji
- potwierdzenie usuwania (modal)
- filtrowanie (po stronie API) przez query param `aktywny`:
  - brak parametru = wszystkie
  - `?aktywny=true` = tylko aktywni
  - `?aktywny=false` = tylko nieaktywni
- toast (prawy górny róg, 3 sekundy): zielony sukces / czerwony błąd
- globalny loader podczas każdego requestu

