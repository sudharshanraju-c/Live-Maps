// Declare map as a global variable accessible to both functions
let map;

// Leaflet attribution URL
const leafletAttributionUrl = 'http://www.openstreetmap.org/copyright';

// Function to initialize the map
function initializeMap() {
    if (!map) {
        map = L.map('map').setView([36.778259, -119.417931], 13);

        // Clear existing layers
        map.eachLayer(function (layer) {
            layer.remove();
        });

        // Add dark map layer
        addDarkMapLayer();

    }
}

// Function to add dark map layer
function addDarkMapLayer() {
    var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 30,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });
    dark.addTo(map);
}


// mapintegration function for GasPrice
function integrateGasPriceMap() {
    // Call initializeMap function to ensure the map is initialized
    initializeMap();
    // Clear existing layers
    map.eachLayer(function (layer) {
        layer.remove();
    });

    // Add dark map layer
    addDarkMapLayer();
    // Configuration object
    const config = {
        dataSource: 'https://ig.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/schemas/657fcf9170a0fe178870a387/instances/list?size=100',
        paddingVertical: 5,
        paddingHorizontal: 15,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        tooltipOnHover: true,
        markersColorsList: [
            { value: 'open', label: '#0B9431' },
            { value: 'close', label: '#5C5C5C' },
        ],
        enableCurrentLocation: true,
        currentLocationDataSource: 'https://ig.aidtaas.com/tf-web/v1.0/64e1fd3d1443eb00018cc231/schemas/6576e12da1e7e3437119b8c9/instances/list',
        currentLocationMarkerColor: '#0000FF',
    };

    // Variables extracted from config
    const {
        paddingVertical,
        paddingHorizontal,
        enableCurrentLocation,
        currentLocationDataSource,
        currentLocationMarkerColor,
        fontSize,
        fontFamily,
        tooltipOnHover,
    } = config;

    let markerOpenColor;
    let markerCloseColor;

    // Extract marker colors from the configuration
    config.markersColorsList?.forEach(({ value, label }) => {
        if (value === 'open' && label !== '') {
            markerOpenColor = label;
            console.log(markerOpenColor);
        }

        if ((value === 'closed' || value === 'close') && label !== '') {
            markerCloseColor = label;
        }
    });

    // Event listener for map click
    map.on('click', (event) => {
        console.log(event.latlng);
    });



    // Fetch data and add markers to the map
    if (config.dataSource) {
        getProductPrices(config.dataSource);
    }

    // Function to determine data source type
    function getDataSourceType() {
        const dataSourceUrl = config?.dataSource;

        if (dataSourceUrl?.includes('schemas')) {
            console.log('Data Source: Schema');
            return true;
        } else {
            console.log('Data Source: Group / AQ');
            return false;
        }
    }

    // Asynchronously fetch product prices
    async function getProductPrices(dataSource) {
        try {
            const apiResponse = await fetch(dataSource);
            const apiResJson = await apiResponse.json();
            const mapMarkers = getDataSourceType() ? apiResJson?.entities : apiResJson?.model?.entities;
            addMapMarker(mapMarkers);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Add current location marker if enabled
    if (enableCurrentLocation && currentLocationDataSource) {
        addCurrentLocationMarker(currentLocationDataSource, currentLocationMarkerColor);
    }

    // Function to add map markers
    function addMapMarker(mapMarkers) {
        map?.setView([mapMarkers[0]?.lat, mapMarkers[0]?.lng], 13);

        mapMarkers?.forEach(({ lat, lng, open, products }, index) => {
            let markerTooltipDetails = '';
            const markerColor = open ? markerOpenColor : markerCloseColor;
            let markerPrice = '';

            products?.forEach(({ product_name, price, color }, productIndex) => {
                markerTooltipDetails += `<div style="background-color:${color} ; color: white;  padding: 5px; margin-bottom: 3px; border-radius: 10px;">${product_name} - ${price}</div>`;

                if (productIndex === 0 || product_name === 'petrol') {
                    markerPrice = price;
                }
            });

            const markerIcon = L.divIcon({
                className: '',
                html: `<div class='price-marker-${index}'> 
                        ${markerPrice} 
                      <div class='price-marker-bottom-${index}'> </div> 
                    </div> 
                    <style> 
                      .price-marker-${index} 
                        { box-sizing: border-box; display: inline-block; position: relative; background-color: ${markerColor} ; color: white; padding: ${paddingVertical}px ${paddingHorizontal}px; border-radius: 5px; font-size: ${fontSize}px; font-family: ${fontFamily}; } 
                    </style> 
                    <style> 
                      .price-marker-bottom-${index} { content: ''; position: absolute; top: 98%; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 0.6em solid transparent; border-right: 0.6em solid transparent; border-top: 0.8em solid ${markerColor}; font-family: ${fontFamily}; }; 
                    </style>`,
            });

            const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

            const tooltip = L.tooltip({
                direction: 'top',
                offset: L.point(50, -10),
                content: markerTooltipDetails,
            });

            if (tooltipOnHover) {
                marker.bindTooltip(tooltip);
            }
        });
    }

    
}

// Call the integrateGasPriceMap function 
integrateGasPriceMap();


function integrateCrimeMap() {
    // Constants and Configurations
    var apiEndpoint = 'https://ig.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/schemas/65801ca970a0fe178870a528/instances/list';

    // Function to create a draggable marker
    function createDraggableMarker(lat, lng, options) {
        return L.marker([lat, lng], options).addTo(map);
    }

    // Function to calculate dynamic icon size based on zoom level
    function calculateIconSize(zoom) {
        var scaleFactor = 0.1;
        return Math.ceil(2 * Math.pow(2, zoom) * scaleFactor);
    }

    // Function to update marker icon size when the map is zoomed
    function updateMarkerIconSize() {
        map.on('zoomend', function () {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    var icon = layer.options.icon;
                    icon.options.iconSize = [calculateIconSize(map.getZoom()), calculateIconSize(map.getZoom())];
                    layer.setIcon(icon);
                }
            });
        });
    }

    // Function to handle marker dragend event
    function handleMarkerDragend(marker, originalPosition) {
        marker.on('dragend', function (event) {
            var marker = event.target;
            var position = marker.getLatLng();
            console.log('Marker dragged to:', position);

            // Reset the marker to its original position
            marker.setLatLng(originalPosition);
        });
    }

    // Function to bind popup content to a marker
    function bindPopupContent(marker, event) {
        var popupContent = `
            <b>${event.name}</b><br>
            Loss: ${event.price}<br>
            Location: ${event.location}<br>
            Date: ${event.date}<br>
            Time: ${event.time}
        `;
        marker.bindPopup(popupContent);
    }

    // Function to handle marker click event and populate HTML elements
    function handleMarkerClick(marker, event) {
        marker.on('click', function () {
            // Limit the displayed event name to a certain length
            var maxlengthLoss = 20;
            var maxLength = 7;
            var truncatedName = event.name.length > maxLength ? event.name.substring(0, maxLength) + '...' : event.name;
            var Loss = event.price.length > maxlengthLoss ? event.price.substring(0, maxlengthLoss) + '...' : event.price;
            // Populate HTML elements with data
            document.querySelector('.top_box1_row1_col1_text').textContent = truncatedName;
            document.querySelector('.top_box1_row2_text1').textContent = event.id;
            document.querySelector('.top_box2_text1').textContent = Loss;
            document.querySelector('.top_box2_text2').textContent = event.location;

            // Replace the image URL with the dynamic one
            var imageUrl = event.image_url;
            document.querySelector('.top_box1_row1_col1_img img').src = imageUrl;
        });
    }

    // Function to fetch events and populate the map
    function fetchAndPopulateMap(apiEndpoint) {
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS' && data.entities) {
                    data.entities.forEach(event => {
                        var originalPosition = [event.latitude, event.longitude];

                        var markerOptions = {
                            title: event.event_name,
                            draggable: true,
                            autoPan: true,
                            icon: L.icon({
                                iconUrl: event.image_url,
                                iconSize: [calculateIconSize(map.getZoom()), calculateIconSize(map.getZoom())],
                                iconAnchor: [16, 16],
                                popupAnchor: [0, -16]
                            })
                        };

                        var marker = createDraggableMarker(event.latitude, event.longitude, markerOptions);

                        handleMarkerDragend(marker, originalPosition);
                        bindPopupContent(marker, event);
                        handleMarkerClick(marker, event);
                    });

                    updateMarkerIconSize();
                }
            })
            .catch(error => console.error('Error fetching events:', error));
    }

    // Call initializeMap function to ensure the map is initialized
    initializeMap();
    // Clear existing layers
    map.eachLayer(function (layer) {
        layer.remove();
    });

    // Add dark map layer
    addDarkMapLayer();
    fetchAndPopulateMap(apiEndpoint);
}

// Call the integrated function
// integrateCrimeMap();


function integrateEarthQuakeMap() {
    // Your API endpoint
    let apiEndpoint = "https://ig.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/schemas/657bf72b6331e02b4b749212/instances/list";

    // Call initializeMap function to ensure the map is initialized
    initializeMap();
    // Clear existing layers
    map.eachLayer(function (layer) {
        layer.remove();
    });

    // Add dark map layer
    addDarkMapLayer();

    // Function to create circles based on time difference
    function createCircles(lat, lng, radius1, radius2, radius3, radius4, fillColor1, fillColor2, fillColor3, fillColor4, fillOpacity1, fillOpacity2, fillOpacity3, fillOpacity4) {
        L.circle([parseFloat(lat), parseFloat(lng)], {
            radius: radius1,
            fillColor: fillColor1,
            fillOpacity: fillOpacity1,
            stroke: false
        }).addTo(map);

        L.circle([parseFloat(lat), parseFloat(lng)], {
            radius: radius2,
            fillColor: fillColor2,
            fillOpacity: fillOpacity2,
            stroke: false
        }).addTo(map);

        L.circle([parseFloat(lat), parseFloat(lng)], {
            radius: radius3,
            fillColor: fillColor3,
            fillOpacity: fillOpacity3,
            stroke: false
        }).addTo(map);

        L.circle([parseFloat(lat), parseFloat(lng)], {
            radius: radius4,
            fillColor: fillColor4,
            fillOpacity: fillOpacity4,
            stroke: false
        }).addTo(map);
    }

    // Fetch data from the API
    async function fetchData() {
        try {
            let response = await fetch(apiEndpoint);
            let data = await response.json();

            // Check if the API response is successful
            if (data.status === "SUCCESS") {
                let earthquakeData = data.entities;

                // Iterate through the earthquake data and add markers to the map
                earthquakeData.forEach(({ lat, lng, earthquake_time }) => {
                    map.setView([parseFloat(lat), parseFloat(lng)], 3)
                    const currentTime = new Date();
                    const earthquakeTime = new Date(earthquake_time);

                    // Calculate the time difference in hours
                    const timeDifference = (currentTime - earthquakeTime) / (1000 * 60 * 60);

                    console.log(timeDifference)

                    // Choose circle style based on time difference
                    if (timeDifference <= 1) {
                        // Past hour
                        createCircles(lat, lng, 330000.5, 270000.5, 220000.5, 140000.5, "#BB8E02", "#D7A303", "#ECB303", "#FFC100", 0.2, 0.3, 0.91, 1);
                    } else if (timeDifference <= 24) {
                        // Past day
                        createCircles(lat, lng, 40000.1645, 50000.83, 70000.4, 0, "#F5791F", "#F5791F", "#F5791F", 1, 0.7, 0.39, 0);
                    } else if (timeDifference <= 168) {
                        // Past week
                        createCircles(lat, lng, 330000, 210000, 134320.8, 86560.72, "#98002B", "#98002B", "#98002B", "#D7023F", 0.2, 0.3, 1, 1);
                    }
                    else {
                        // before past week
                        createCircles(lat, lng, 330000, 210000, 134320.8, 86560.72, "red", "green", "blue", "yellow", 0.2, 0.3, 1, 1);
                    }
                });
            } else {
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            console.error("Error fetching data from the API", error);
        }
    }

    // Call the fetchData function to retrieve and display earthquake data on the map
    fetchData();
}

// Call the integrated function
// integrateEarthQuakeMap();



// mapintegration function for LiveEvents

function integrateLiveEventsMap() {
    // Your API endpoint
    var apiEndpoint = 'https://ig.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/schemas/65813d8070a0fe178870a5d9/instances/list';

    // Call initializeMap function to ensure the map is initialized
    initializeMap();
    // Clear existing layers
    map.eachLayer(function (layer) {
        layer.remove();
    });

    // Add dark map layer
    addDarkMapLayer();

    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS' && data.entities) {
                data.entities.forEach(event => {
                    var marker = L.marker([event.lat, event.lng], {
                        title: event.event_name,
                        icon: L.icon({
                            iconUrl: event.event_type_image,
                            // iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh_ddVUEL6n-y8wFLrB9Fi4vE5E15wcpcOg&usqp=CAU",
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16]
                        })
                    }).addTo(map);

                    var popupContent = `
                                <b>${event.event_name}</b><br>
                                Type: ${event.event_type}<br>
                                Price: ${event.event_price}<br>
                                Phone: ${event.event_phone_number}<br>
                                Days: ${event.event_days}<br>
                                Time: ${event.event_start_time} - ${event.event_end_time}
                            `;
                    marker.bindPopup(popupContent);
                });
            }
        })
        .catch(error => console.error('Error fetching events:', error));
}

// Call the integrateLiveEventsMap function
// integrateLiveEventsMap();



// mapintegration function for Unemployment

function integrateUnemploymentMap() {
    // Your API endpoint
    let apiEndpoint = "https://ig.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/schemas/657bfb976331e02b4b74b346/instances/list?size1000";

    // Call initializeMap function to ensure the map is initialized
    initializeMap();
    // Clear existing layers
    map.eachLayer(function (layer) {
        layer.remove();
    });

    // Add dark map layer
    addDarkMapLayer();

    // Function to create circles based on time difference
    function createCircles(lat, lng, radius, fillColor, fillOpacity) {
        L.circle([parseFloat(lat), parseFloat(lng)], {
            radius: radius,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            stroke: false
        }).addTo(map);
    }

    // Fetch data from the API
    async function fetchData() {
        try {
            let response = await fetch(apiEndpoint);
            let data = await response.json();

            // Check if the API response is successful
            if (data.status === "SUCCESS") {
                let unemploymentData = data.entities;

                // Iterate through the unemployment data and add circles to the map
                unemploymentData.forEach(({ latitude, longitude, value }) => {
                    map.setView([parseFloat(latitude), parseFloat(longitude)], 3);

                    // Choose circle style based on employmentRate
                    if (value >= 800000) {
                        createCircles(latitude, longitude, 300000.4, "#FDC100", 1);
                    } else if (value > 600000 && value < 800000) {
                        createCircles(latitude, longitude, 300000.4, "#FF9040", 1);
                    } else if (value > 400000 && value < 600000) {
                        createCircles(latitude, longitude, 300000.4, "#880218", 1);
                    } else if (value > 200000 && value < 400000) {
                        createCircles(latitude, longitude, 300000.4, "#8D3B00", 1);
                    } else if (value < 200000) {
                        createCircles(latitude, longitude, 300000.4, "#7C3401", 1);
                    }
                });
            } else {
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            console.error("Error fetching data from the API", error);
        }
    }

    // Call the fetchData function to retrieve and display unemployment data on the map
    fetchData();
}

// Call the integrateUnemploymentMap function
// integrateUnemploymentMap();


