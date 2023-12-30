//progress bar for live events
const progressValue = 30;
document.getElementById('progressValue').innerHTML = progressValue;
document.getElementById('progress-bar').style.background = `radial-gradient(closest-side, white 50%, transparent 10% 100%),
    conic-gradient(#A1A4F9 ${100 - progressValue}%, #D3D3D3 0)`;


//search functionality

var searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    var searchTerm = searchInput.value;
    searchLocation(searchTerm);
  }
});

function searchLocation(query) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data && data.length > 0) {
          var result = data[0];
          var lat = result.lat;
          var lon = result.lon;
          map.setView([lat, lon], 13);
          L.marker([lat, lon]).addTo(map);
        } else {
          alert('Location not found');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  

