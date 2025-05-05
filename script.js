let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const checkbox = document.getElementById('wantInvoice');
const invoiceFields = document.getElementById('invoiceFields');
const vatNumber = document.getElementById('vatNumber');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common).sort();

        const countryInput = document.getElementById('country');
        countryInput.innerHTML = countries
            .map(country => `<option value="${country}">${country}</option>`)
            .join('');
        
        $('#country').select2({
            placeholder: 'Wybierz kraj',
            theme: "bootstrap-5",
            width: '100%'
        });
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const $countrySelect = $('#country')
            const countryInput = document.getElementById('country');
            countryInput.value = country;

            $countrySelect.val(country).trigger('change');

            getCountryCode(country); // wywołanie kolejnego kroku
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + (data[0].idd.suffixes?.[0] ?? '');
            const codeInput = document.getElementById('countryCode');
            codeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

// Funkcja inicjalizująca cały proces
document.addEventListener('DOMContentLoaded', () => {
    fetchAndFillCountries().then(() => {
        getCountryByIP();
    });

    // nasłuchiwanie kliknięcia
    document.addEventListener('click', handleClick);
});

document.getElementById('form').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.requestSubmit(); // Wysyła formularz bez reloadu
    }
});

//kod pocztowy -
document.getElementById('postalCode').addEventListener('input', function (e) {
    let value = this.value.replace(/\D/g, ''); // usuwa wszystko co nie jest cyfrą
    if (value.length > 2) {
        value = value.slice(0, 2) + '-' + value.slice(2, 5);
    }
    this.value = value;
});

//hasło pokaż i nie
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = document.getElementById('passwordIcon');
    const isPassword = passwordInput.type === 'password';
  
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('bi-eye');
    icon.classList.toggle('bi-eye-slash');
  });
  
//checkbox EU VAT
checkbox.addEventListener('change', function () {
    if (this.checked) {
        invoiceFields.classList.remove('d-none');
        vatNumber.setAttribute('required', 'required');
    } else {
        invoiceFields.classList.add('d-none');
        vatNumber.removeAttribute('required');
        }
});