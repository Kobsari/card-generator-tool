const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

function calculateLuhn(number) {
    let sum = 0;
    let isSecond = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i), 10);
        if (isSecond) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isSecond = !isSecond;
    }
    return (10 - (sum % 10)) % 10;
}

function generateCardNumber(binPattern) {
    const brandLength = binPattern.length;
    let baseBin = binPattern.replace(/x/gi, '');
    let cardNumber = baseBin;

    while (cardNumber.length < brandLength - 1) {
        cardNumber += Math.floor(Math.random() * 10);
    }
    const checkDigit = calculateLuhn(cardNumber);
    return cardNumber + checkDigit;
}

app.get('/generate', (req, res) => {
    const { bin, quantity, format, expMonth, expYear, cvv } = req.query;
    let results = [];
    const cardDataArray = [];

    for (let i = 0; i < parseInt(quantity); i++) {
        const cardNumber = generateCardNumber(bin);
        const finalMonth = (expMonth && expMonth !== 'random') ? expMonth : String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const finalYear = (expYear && expYear !== 'random') ? expYear : new Date().getFullYear() + Math.floor(Math.random() * 5) + 2;
        const finalCvv = (cvv !== undefined) ? (cvv || String(Math.floor(Math.random() * 900) + 100)) : null;

        cardDataArray.push({ cardNumber, finalMonth, finalYear, finalCvv });
    }

    switch (format.toLowerCase()) {
        case 'csv':
            results.push('cardNumber,expMonth,expYear,cvv');
            cardDataArray.forEach(card => {
                results.push([card.cardNumber, card.finalMonth, card.finalYear, card.finalCvv].filter(Boolean).join(','));
            });
            break;

        case 'json':
            const jsonData = cardDataArray.map(card => {
                const data = { cardNumber: card.cardNumber, expMonth: card.finalMonth, expYear: card.finalYear };
                if (card.finalCvv !== null) data.cvv = card.finalCvv;
                return data;
            });
            results = [JSON.stringify(jsonData)]; 
            break;

        case 'xml':
            const xmlData = cardDataArray.map(card => {
                let xml = '  <card>\n';
                xml += `    <cardNumber>${card.cardNumber}</cardNumber>\n`;
                xml += `    <expMonth>${card.finalMonth}</expMonth>\n`;
                xml += `    <expYear>${card.finalYear}</expYear>\n`;
                if (card.finalCvv !== null) xml += `    <cvv>${card.finalCvv}</cvv>\n`;
                xml += '  </card>';
                return xml;
            }).join('\n');
            results = [`<cards>\n${xmlData}\n</cards>`];
            break;
            
        case 'pipe':
        default:
            cardDataArray.forEach(card => {
                results.push([card.cardNumber, card.finalMonth, card.finalYear, card.finalCvv].filter(val => val !== null).join('|'));
            });
            break;
    }

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`✅ ម៉ាស៊ីនមេបានត្រៀមរួចរាល់! សូមបើក browser ទៅកាន់ http://localhost:${PORT}`);
});