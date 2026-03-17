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

async function convert(amount, from, to) {
  try {
    const data = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
    );
    if (!res.ok) {
      console.log("Ошибка API");
      return null;
    }

    const dataP = await data.json();

    if (dataP.message) {
      console.log(data.message);
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
