const API_BASE = "https://api.frankfurter.app";
const CACHE_MS = 5 * 60 * 1000;

// 1. Promise: fetch курсов для baseCurrency. return fetch(...).then(res => res.json()).
//    Ответ: { base, date, rates: { EUR: 0.92, ... } }
async function fetchRates(baseCurrency) {
  try {
    const data = await fetch(
      `https://api.frankfurter.app/latest?from=${baseCurrency}`,
    );
    const res = await data.json();
    return res;
  } catch (err) {
    console.error("Нет инета");
    return null;
  }
}

fetchRates("USD").then((res) => {
  if (res) {
    console.log(res.rates);
  }
});

// 2. Async: список валют. GET https://api.frankfurter.app/currencies
//    Ответ: { USD: "United States Dollar", EUR: "Euro", ... }
async function getCurrencies() {
  const data = await fetch(`https://api.frankfurter.app/currencies`);
  const dataP = await data.json();
  return dataP;
}
getCurrencies().then((data) => console.log(data));

// 3. Sync: проверка перед конвертацией. Верни строку с ошибкой или null если всё ок.
//    Проверь: amount > 0, from !== to, amount не NaN.
function validateInput(amount, from, to) {
  let output = null;
  if (amount <= 0) {
    output = "Сумма меньше нуля";
  }
  if (from === to) {
    output = "Исходная валюта совпадает с валютой для конвертации";
  }
  if (Number.isNaN(amount)) {
    output = "Введено не число";
  }
  return output;
}

// 4. Async: конвертация. fetch(?from=&to=), проверка res.ok, return amount * rates[to].
//    try/catch — при ошибке throw new Error('...') или return null.
async function convert(amount, from, to) {
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
    );
    if (!res.ok) {
      console.log("Ошибка API");
      return null;
    }

    const dataP = await res.json();

    if (dataP.message) {
      console.log(dataP.message);
      return null;
    }

    const rate = dataP.rates[to];
    return rate * amount;
  } catch (err) {
    console.log("Сеть недоступна");
    return null;
  }
}

convert(100, "USD", "EUR").then((res) => console.log(res));
