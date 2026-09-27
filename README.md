# Pakistan in Bloom — Interactive Web GIS

An editorial, floral-inspired Leaflet application for MET418 Lab 03. The project uses separate GeoJSON files for 15 cities and 15 weather stations, with feature popups, switchable OpenStreetMap and satellite basemaps, and a layer control.

Prepared by **Meerab Qayyum** — Registration No. **FA23-BRG-076**.

## Run locally

GeoJSON is loaded with `fetch()`, so serve this folder over HTTP rather than opening `index.html` directly. In VS Code, open this folder and use **Live Server**; or run `npx http-server .` from this directory and open the local URL it prints.

The page uses Leaflet from unpkg, Esri World Imagery, OpenStreetMap tiles, and Google Fonts. Internet access is needed for those external map and font resources.

## GitHub Pages

Keep the folder structure when uploading: `index.html`, `script.js`, and `style.css` belong in the site root, and both GeoJSON files belong in the lowercase `data/` folder. GitHub Pages paths are case-sensitive. The map now reports a missing data file by name and loads the available layer even if the other file is missing.

## Data note

The city GeoJSON contains city name, province/administrative area, and type. Weather station GeoJSON contains station name, temperature, and rainfall. Weather values are illustrative sample values included for the assignment and are not live or official observations.

## Project structure

```text
WebGIS_Lab03/
├── index.html
├── style.css
├── script.js
└── data/
    ├── cities.geojson
    └── weather_stations.geojson
```
