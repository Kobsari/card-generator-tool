document.addEventListener('DOMContentLoaded', () => {
    // --- ជ្រើសរើសធាតុ HTML ទាំងអស់ ---
    const generateBtn = document.getElementById('generateBtn');
    const resultsContainer = document.getElementById('results-table-container'); 
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const basicTab = document.getElementById('basicTab');
    const advanceTab = document.getElementById('advanceTab');
    const basicForm = document.getElementById('basic-form');
    const advanceForm = document.getElementById('advance-form');
    const cardBrandSelect = document.getElementById('cardBrand');
    const binInput = document.getElementById('bin');
    const toggleDate = document.getElementById('toggleDate');
    const toggleCvv = document.getElementById('toggleCvv');
    const toggleMoney = document.getElementById('toggleMoney');
    const dateInputs = document.getElementById('date-inputs');
    const cvvInput = document.getElementById('cvv-input');
    const moneyInputs = document.getElementById('money-inputs');
    const expMonthSelect = document.getElementById('expMonth');
    const expYearSelect = document.getElementById('expYear');
    const currencySelect = document.getElementById('currency');

    let lastGeneratedData = [];

    // --- ទិន្នន័យ ---
    const cardBrandData = {
        mastercard: { bins: ['515462', '554182', '536573'], length: 16 },
        visa: { bins: ['401288', '453998', '453213'], length: 16 },
        amex: { bins: ['378282', '371334'], length: 15 },
        discover: { bins: ['601100', '601102', '655021'], length: 16 }
    };
    const currencies = [ { name: "United States Dollar", code: "USD" }, { name: "Euro", code: "EUR" }, { name: "Japanese Yen", code: "JPY" }, { name: "British Pound Sterling", code: "GBP" }, { name: "Australian Dollar", code: "AUD" }, { name: "Canadian Dollar", code: "CAD" }, { name: "Swiss Franc", code: "CHF" }, { name: "Chinese Yuan", code: "CNY" }, { name: "Swedish Krona", code: "SEK" }, { name: "New Zealand Dollar", code: "NZD" }, { name: "Cambodian Riel", code: "KHR" }, { name: "Mexican Peso", code: "MXN" }, { name: "Singapore Dollar", code: "SGD" }, { name: "Hong Kong Dollar", code: "HKD" }, { name: "Norwegian Krone", code: "NOK" }, { name: "South Korean Won", code: "KRW" }, { name: "Turkish Lira", code: "TRY" }, { name: "Russian Ruble", code: "RUB" }, { name: "Indian Rupee", code: "INR" }, { name: "Brazilian Real", code: "BRL" }, { name: "South African Rand", code: "ZAR" }, { name: "Philippine Peso", code: "PHP" }, { name: "Czech Koruna", code: "CZK" }, { name: "Indonesian Rupiah", code: "IDR" }, { name: "Malaysian Ringgit", code: "MYR" }, { name: "Hungarian Forint", code: "HUF" }, { name: "Icelandic Króna", code: "ISK" }, { name: "Croatian Kuna", code: "HRK" }, { name: "Bulgarian Lev", code: "BGN" }, { name: "Romanian Leu", code: "RON" }, { name: "Danish Krone", code: "DKK" }, { name: "Thai Baht", code: "THB" }, { name: "Polish Zloty", code: "PLN" }, { name: "Israeli New Shekel", code: "ILS" } ];

    // --- មុខងារសម្រាប់បង្ហាញលទ្ធផល ---
    function displayResultsAsTable(data, format) {
        resultsContainer.innerHTML = '';
        if (data.length === 0) return;

        if (format !== 'PIPE') {
            const pre = document.createElement('pre');
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.wordWrap = 'break-word';
            pre.textContent = format.toUpperCase() === 'JSON' ? JSON.stringify(JSON.parse(data[0]), null, 2) : data.join('\n');
            resultsContainer.appendChild(pre);
            return;
        }

        const table = document.createElement('table');
        table.className = 'results-table';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Card Number', 'Month', 'Year', 'CVV'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(rowString => {
            const columns = rowString.split('|');
            const dataRow = document.createElement('tr');
            columns.forEach(text => {
                const td = document.createElement('td');
                td.textContent = text.trim();
                dataRow.appendChild(td);
            });
            tbody.appendChild(dataRow);
        });
        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    }

    // --- មុខងារផ្សេងៗ ---
    function updateBinInput() {
        const brand = cardBrandSelect.value;
        const brandInfo = cardBrandData[brand];
        const randomBin = brandInfo.bins[Math.floor(Math.random() * brandInfo.bins.length)];
        let placeholder = 'x'.repeat(brandInfo.length - randomBin.length);
        binInput.value = randomBin + placeholder;
    }

    function populateYears() {
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 10; i++) {
            const year = currentYear + i;
            const option = document.createElement('option');
            option.value = year; option.textContent = year;
            expYearSelect.appendChild(option);
        }
        expYearSelect.value = currentYear + 1;
    }

    function populateMonths() {
        for (let i = 1; i <= 12; i++) {
            const month = String(i).padStart(2, '0');
            const option = document.createElement('option');
            option.value = month; option.textContent = month;
            expMonthSelect.appendChild(option);
        }
    }
    
    function populateCurrencies() {
        currencies.sort((a, b) => a.name.localeCompare(b.name));
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.code})`;
            currencySelect.appendChild(option);
        });
    }

    // --- គ្រប់គ្រង Event Listeners ---
    cardBrandSelect.addEventListener('change', updateBinInput);
    basicTab.addEventListener('click', () => { basicTab.classList.add('active'); advanceTab.classList.remove('active'); basicForm.classList.remove('hidden'); advanceForm.classList.add('hidden'); });
    advanceTab.addEventListener('click', () => { advanceTab.classList.add('active'); basicTab.classList.remove('active'); advanceForm.classList.remove('hidden'); basicForm.classList.add('hidden'); });
    toggleDate.addEventListener('change', () => dateInputs.classList.toggle('hidden', !toggleDate.checked));
    toggleCvv.addEventListener('change', () => cvvInput.classList.toggle('hidden', !toggleCvv.checked));
    toggleMoney.addEventListener('change', () => moneyInputs.classList.toggle('hidden', !toggleMoney.checked));

    generateBtn.addEventListener('click', async () => {
        let bin, quantity, format, queryParams;
        
        if (basicTab.classList.contains('active')) {
            bin = document.getElementById('basic-bin').value;
            quantity = document.getElementById('basic-quantity').value;
            format = 'PIPE';
            queryParams = `?bin=${bin}&quantity=${quantity}&format=${format}`;
        } else {
            bin = document.getElementById('bin').value;
            quantity = document.getElementById('quantity').value;
            format = document.getElementById('format').value;
            queryParams = `?bin=${bin}&quantity=${quantity}&format=${format}`;
            if (toggleDate.checked) { queryParams += `&expMonth=${expMonthSelect.value}&expYear=${expYearSelect.value}`; }
            if (toggleCvv.checked) { queryParams += `&cvv=${document.getElementById('cvv').value}`; }
        }

        resultsContainer.innerHTML = 'កំពុងបង្កើត...';
        try {
            const response = await fetch(`/generate${queryParams}`);
            const data = await response.json();
            lastGeneratedData = data;
            displayResultsAsTable(data, format);
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = 'ការបង្កើតបានបរាជ័យ សូមពិនិត្យ Console របស់ Server។';
        }
    });

    copyBtn.addEventListener('click', () => {
        if (lastGeneratedData.length === 0) return;
        const textToCopy = lastGeneratedData.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = 'បានចម្លង!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });
    });

    resetBtn.addEventListener('click', () => {
        resultsContainer.innerHTML = '';
        lastGeneratedData = [];
    });

    // --- ចាប់ផ្តើមដំណើរការ ---
    populateYears();
    populateMonths();
    populateCurrencies();
    updateBinInput();
    advanceTab.click();
});