var gasPriceSection2=document.getElementById("gas_price_section2");
var gasPriceSectionNavigate=document.getElementById("gas_price_section_navigate");
var gasPriceSection3=document.getElementById("gas_price_section_3");
var crimeSection2=document.getElementById("crime_section2");
var earthQuakeSection2=document.getElementById("earthquake_section2");
var liveEventSection2=document.getElementById("events_section2");
var liveEventsCompass=document.getElementById("events_section2_compass");
var unemploymentSection1=document.getElementById("unemployment_section1");
var unemploymentSection2=document.getElementById("unemployment_section2");


function displayNone() {
    gasPriceSection2.style.display="none";
    gasPriceSectionNavigate.style.display="none";
    gasPriceSection3.style.display="none";
    crimeSection2.style.display="none";
    earthQuakeSection2.style.display="none";
    liveEventSection2.style.display="none";
    liveEventsCompass.style.display="none";
    unemploymentSection1.style.display="none";
    unemploymentSection2.style.display="none";
}

function showGasPrice() {
    displayNone()
    gasPriceSection2.style.display="flex";
    gasPriceSectionNavigate.style.display="flex";
    gasPriceSection3.style.display="flex";
}

function showCrime() {
    displayNone()
    crimeSection2.style.display="flex";

}

function showEvents() {
    displayNone()
    liveEventSection2.style.display="flex";
    liveEventsCompass.style.display="flex";
}

function showEarthQuake() {
    displayNone()
    earthQuakeSection2.style.display="flex";
}

function showunemployment() {
    displayNone()
    unemploymentSection1.style.display="block";
    unemploymentSection2.style.display="flex";
}