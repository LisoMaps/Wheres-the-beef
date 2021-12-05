//collapsible info section
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

//make map container
var map = L.map("map", {
  center: [40, 15],
  zoom: 3,
});

// add basemap
L.tileLayer.provider("CartoDB.DarkMatterNoLabels").addTo(map);

//zoom to county
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//highlight county
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    opacity: 1,
    color: "#ffea00",
  });
  layer.bringToFront();
  infoCountries.update(layer.feature.properties);
}

//reset the hightlighted counties on mouseout
function resetHighlight(e) {
  geojsonCountries.resetStyle(e.target);
  infoCountries.update();
}

//add these events to the layer object
function onEachFeature(feature, layer) {
  {
    layer.bindTooltip(
      "<b style = 'color: " +
        feature.properties.color +
        ";'>" +
        feature.properties.COUNTRY +
        "</b>" +
        "<br> Consumed " +
        "<b style = 'color: " +
        feature.properties.color +
        ";'>" +
        feature.properties.value +
        " kg/capita" +
        "</b>" +
        " of beef in 2021",
      { direction: "top", className: "toolclass", sticky: "true" }
    );
  }
  layer.on({
    mouseover: highlightFeature,
    click: zoomToFeature,
    mouseout: resetHighlight,
  });
}

//the style for counties
function countries(feature) {
  return {
    weight: 1,
    opacity: 1,
    color: "#272727",
    fillOpacity: 1,
    fillColor: feature.properties.color,
  };
}

//add county geojson
var geojsonCountries = L.geoJson
  .ajax("data/OECDcountries.geojson", {
    style: countries,
    onEachFeature: onEachFeature,
    attribution:
      '| <a href="https://data.oecd.org/agroutput/meat-consumption.htm">OECD</a> | Map: <a href="https://weircf.wixsite.com/e-portfolio">Chip Weir</a>',
  })
  .addTo(map);

// add basemap labels
map.createPane("baselabels");
map.getPane("baselabels").style.zIndex = 600;
L.tileLayer
  .provider("CartoDB.DarkMatterOnlyLabels", {
    pane: "baselabels",
    interactive: false,
  })
  .addTo(map);

// add scale bar
L.control.scale({ position: "bottomright" }).addTo(map);
