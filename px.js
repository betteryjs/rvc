document.addEventListener('DOMContentLoaded', function () {
    if (!isMobileDevice()) {
        showToast('如需获取分享链接，请关闭<code>沉浸式翻译</code>插件<br>否则会引起画面形变');
    }
    fetchExchangeRates();
});

function isMobileDevice() {
    const mobileKeywords = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Mobile'];
    return mobileKeywords.some(keyword => navigator.userAgent.includes(keyword));
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'alert alert-primary fade show';
    toast.role = 'alert';
    toast.style.marginBottom = '5px';
    toast.innerHTML = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 6000);
}

function takeScreenshot() {
    const targetElement = document.querySelector('.container');
    const uploadButton = document.querySelector('button[onclick="takeScreenshot()"]');
    const loadingDiv = document.getElementById('loading');
    const screenshotResult = document.getElementById('screenshotResult');

    loadingDiv.style.display = 'none';
    screenshotResult.style.display = 'none';

    html2canvas(targetElement).then(canvas => {
        loadingDiv.style.display = 'block';
        screenshotResult.style.display = 'block';

        canvas.toBlob(blob => {
            const formData = new FormData();
            formData.append('file', blob, 'mjj.webp');

            fetch('https://skyimg.de/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {

                    const imageUrl = data[0].url;

                    document.getElementById('screenshotResult').innerHTML =
                        `图片分享链接：<a href="${imageUrl}" target="_blank">点击查看</a>`;

                    navigator.clipboard.writeText(imageUrl).then(() => {
                        showToast('图片分享链接已复制到剪切板');
                    }, err => {
                        showToast('复制到剪切板失败');
                    });

                    loadingDiv.style.display = 'none';
                    uploadButton.style.visibility = 'visible';
                }).catch(error => {
                // document.getElementById('screenshotResult').textContent = '上传失败！';
                console.error('Error:', error);
                loadingDiv.style.display = 'none';
            });

        });
    });
}

async function fetchExchangeRates() {
    try {
        const response = await fetch('exchange_rates.json');
        const data = await response.json();
        const rates = data.rates;
        const date = data.date;

        document.getElementById('dataDate').value = date;

        updateExchangeRate(document.getElementById('purchaseCurrency'), rates, 'exchangeRate');
        updateExchangeRate(document.getElementById('tradeCurrency'), rates, 'tradeExchangeRate');

        document.getElementById('purchaseCurrency').addEventListener('change', function () {
            updateExchangeRate(this, rates, 'exchangeRate');
        });
        document.getElementById('tradeCurrency').addEventListener('change', function () {
            updateExchangeRate(this, rates, 'tradeExchangeRate');
        });

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const currentDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        document.getElementById("currentDate").value = currentDateStr;

    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

function updateExchangeRate(currencyElement, rates, rateInputId) {
    const currency = currencyElement.value;
    const rate = currency === 'CNY' ? 1 : rates[currency];
    document.getElementById(rateInputId).value = rate;
}

function calculateRemainingValue() {
    const purchaseCurrency = document.getElementById("purchaseCurrency").value;
    const tradeCurrency = document.getElementById("tradeCurrency").value;
    const exchangeRate = parseFloat(document.getElementById("exchangeRate").value);
    const tradeExchangeRate = parseFloat(document.getElementById("tradeExchangeRate").value);
    const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);
    const tradePrice = parseFloat(document.getElementById("tradePrice").value);
    const currentDate = new Date(document.getElementById("currentDate").value);
    const expiryDate = new Date(document.getElementById("expiryDate").value);
    const paymentFrequency = document.getElementById("paymentFrequency").value;

    const remainingDays = Math.floor((expiryDate - currentDate) / (24 * 60 * 60 * 1000));
    const purchasePriceCNY = purchasePrice * exchangeRate;
    const tradePriceCNY = tradePrice * tradeExchangeRate;
    const remainingValue = calculateValueByFrequency(paymentFrequency, purchasePriceCNY, remainingDays);
    const premium = tradePriceCNY - remainingValue;
    const premiumPercent = ((premium / remainingValue) * 100).toFixed(2);

    displayResults(purchasePriceCNY, tradePriceCNY, remainingValue, premium, premiumPercent, remainingDays);
}

function calculateValueByFrequency(paymentFrequency, price, days) {
    let daysInPeriod;
    switch (paymentFrequency) {
        case 'yearly':
            daysInPeriod = 365;
            break;
        case 'halfyearly':
            daysInPeriod = 182.5;
            break;
        case 'quarterly':
            daysInPeriod = 91.25;
            break;
        case 'monthly':
            daysInPeriod = 30.44;
            break;
        case 'two-yearly':
            daysInPeriod = 730;
            break;
        case 'three-yearly':
            daysInPeriod = 1095;
            break;
        case 'five-yearly':
            daysInPeriod = 1825;
            break;
        default:
            daysInPeriod = 365;
    }
    return (price / daysInPeriod) * days;
}

function displayResults(purchasePrice, tradePrice, remainingValue, premium, premiumPercent, remainingDays) {
    document.getElementById("resultPurchasePriceCNY").textContent = purchasePrice.toFixed(2);
    document.getElementById("resultTradePriceCNY").textContent = tradePrice.toFixed(2);
    document.getElementById("resultRemainingValueCNY").textContent = remainingValue.toFixed(2);
    document.getElementById("resultPremiumCNY").textContent = premium.toFixed(2);
    document.getElementById("resultPremiumPercent").textContent = premiumPercent + "%";

    const remainingMonths = Math.floor(remainingDays / 30);
    const remainingDay = remainingDays % 30;
    document.getElementById("resultRemainingDays").textContent = remainingDays;
    document.getElementById("resultRemainingMonths").textContent = remainingMonths;
    document.getElementById("resultRemainingDay").textContent = remainingDay;

    let advice = getAdvice(premiumPercent);
    document.getElementById("resultAdvice").textContent = advice;

    document.querySelector(".result").style.display = "block";
}

function getAdvice(premiumPercent) {
    if (premiumPercent >= 10 && premiumPercent < 30) {
        return "卖家溢价少许，请三思而后行！";
    } else if (premiumPercent >= 30 && premiumPercent < 100) {
        return "存在高溢价，非刚需勿买！";
    } else if (premiumPercent >= 100) {
        return "此乃传家之宝乎？";
    } else if (premiumPercent <= -30 && premiumPercent > -50) {
        return "卖家血亏，快买，错过拍断大腿！";
    } else if (premiumPercent <= -10 && premiumPercent > -30) {
        return "卖家小亏，买了或许不赚但绝对不亏！";
    } else if (premiumPercent <= -50) {
        return "极端折价，可能存在问题，需谨慎！";
    } else {
        return "价格合理，良心卖家！";
    }
}