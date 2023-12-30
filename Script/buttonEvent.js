
  
const navCol3Container = document.getElementById('button_box');

let currentlyClickedButton = null;

// Function to reset the state of the previously clicked button
function resetPreviousButtonState() {
    if (currentlyClickedButton) {
        currentlyClickedButton.style.background = '#1D304E';
        const buttonText = currentlyClickedButton.querySelector('.button_text');
        buttonText.style.color = '#fff';
    }
}

// Define values for images and texts
const buttonData = [
    { id: 1, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/9a720f15-ee68-4634-8ab1-9f19e2d4a85a_$$Gas%20Station%20Fuel%20Petroleum.svg", text: 'Fuel' },
    { id: 2, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/b6a625f4-1ed2-4b7f-b424-79af2f949fef_$$Ticket%201.svg", text: 'Events' },
    { id: 3, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/c3fd3cd2-685f-4638-a962-bb40773d02d3_$$Donation%20Charity%20Hand%20Give%20Heart.svg", text: 'Fundraisers' },
    { id: 4, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/fdd10483-9967-4d96-b2a2-23130212347e_$$Punishment%20Handcuff.svg", text: 'Crime' },
    { id: 5, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/53992ddc-851c-4a13-a9dc-f82c866a3096_$$Network.svg", text: 'Networks' },
    { id: 6, image: "https://cdn.gaiansolutions.com/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/618b6fdef5dacc0001a6b1b0/9b3a71fd-1ff9-4191-b285-d8c973de1bfd_$$Sustainable%20Cities%20And%20Communities.svg", text: 'Real Estate' },
];

// Loop through and create buttons

for (let i = 0; i < buttonData.length; i++) {
    const button = document.createElement('div');
    button.className = 'button_conatainer';
    button.style.display = 'flex';
    button.style.height = '100%';
    button.style.padding = '0.5rem';
    button.style.borderRadius = '0.25rem';
    button.style.background = '#1D304E';
    button.style.gap = '0.5rem';

    const buttonImage = document.createElement('img');
    buttonImage.className = 'button_image';
    buttonImage.src = buttonData[i].image;

    const buttonText = document.createElement('div');
    buttonText.className = 'button_text';
    buttonText.textContent = buttonData[i].text;
    buttonText.style.fontSize = 'clamp(0.0683125rem, 0rem + 1.0938vw, 6.8359375rem)';
    buttonText.style.display = 'flex';
    buttonText.style.alignItems = 'center';
    buttonText.style.color = 'white';

    // Add onclick event to change background and text color and call respective map integration function
    button.onclick = function () {
        resetPreviousButtonState();
        button.style.background = 'white';
        buttonText.style.color = '#1D304E';
        currentlyClickedButton = button;


        // Check if the map is already initialized
        if (!map) {
            // If not initialized, create a new map
            map = L.map('map').setView([36.778259, -119.417931], 13);

            // Add tile layer to the map
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                maxZoom: 30,
                attribution: `&copy; <a href=${leafletAttributionUrl}>OpenStreetMap</a>`,
            }).addTo(map);
        }

        // Call respective map integration function based on button text
        const buttonTextLowerCase = buttonData[i].text.toLowerCase();
        switch (buttonTextLowerCase) {
            case 'fuel':
                showGasPrice();
                integrateGasPriceMap();
              
                break;
            case 'events':
                integrateLiveEventsMap();
                showEvents()
                break;
            case 'fundraisers':
                integrateUnemploymentMap();
                showunemployment()
                break;
            case 'crime':
                integrateCrimeMap();
                showCrime();
                break;
            case 'networks':
                integrateEarthQuakeMap();
                showEarthQuake();
                break;
            // Add more cases for other buttons if needed
            default:
                break;
        }

    };

    // Append image and text to the button
    button.appendChild(buttonImage);
    button.appendChild(buttonText);

    // Append button to the container with flex display
    navCol3Container.appendChild(button);
}

