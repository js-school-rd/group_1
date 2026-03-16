//1 Создай Promise, который через 1 секунду переходит в fulfilled с числом 42. Выведи результат в консоль через .then().

const tmp1 = new Promise((resolve) => setTimeout(() => resolve("42"), 1000));
tmp1.then((res) => console.log(res));

//2Создай Promise, который сразу (без setTimeout) переходит в rejected с объектом ошибки new Error('Что-то пошло не так').
// Обработай ошибку через .catch() и выведи сообщение в консоль.

const tmp2 = new Promise((resolve, reject) =>
  reject(new Error("что-то пошло не так")),
);
tmp2.catch((err) => console.log(err.message));

//3 Создай Promise, который с вероятностью 50% вызывает resolve('успех') или reject(new Error('неудача')).
// Используй Math.random() > 0.5.
// Обработай оба случая — через .then() и .catch().

const tmp3 = new Promise((resolve, reject) => {
  if (Math.random() > 0.5) {
    resolve("успех");
  } else {
    reject("неудача");
  }
});
tmp3.then((success) => console.log(success));
tmp3.catch((err) => console.log(err));

//4 Вызови fetch('https://api.quotable.io/random'), затем в цепочке .then(): 1) преобразуй ответ в JSON, 2) извлеки setup и punchline, выведи в консоль.

const tmp4 = fetch("https://official-joke-api.appspot.com/random_joke")
  .then((data) => {
    return data.json();
  })
  .then((resolve) => {
    console.log(resolve.setup + "\n" + resolve.punchline);
  });

//5 Создай Promise, который reject'ится с new Error('Сеть недоступна'). Добавь .catch(), который выводит сообщение и возвращает null. Добавь .then() после catch.
const tmp5a = new Promise((resolve, reject) =>
  reject(new Error("Сеть недоступна")),
);
tmp5a
  .catch((err) => {
    console.log(err.message);
    return null;
  })
  .then();

//5 Вызови fetch('https://api.quotable.io/random'), добавь .catch() на случай ошибки сети (отключи интернет и проверь). В catch верни { content: 'Офлайн', author:)
const tmp5b = fetch("https://official-joke-api.appspot.com/random_joke")
  .then((data) => {
    return data.json();
  })
  .catch((err) => {
    console.error(err.message);
    return { setup: "no", punchline: "no" };
  })
  .then((res) => console.log(`${res.setup} - ${res.punchline}`));

//6 Сделай 3 запроса одновременно к разным API, используй Promise.all():
//https://official-joke-api.appspot.com/random_joke
//https://api.ipify.org?format=json
//https://dummyjson.com/quotes/random
//Собери результаты в массив, выведи в консоль. Замерь время — все 3 запроса должны идти параллельно (~500–800 мс, а не сумма трёх).
const tmpStart6 = new Date();
const tmp6a = fetch("https://official-joke-api.appspot.com/random_joke");
const tmp6b = fetch("https://api.ipify.org?format=json");
const tmp6c = fetch("https://dummyjson.com/quotes/random");
Promise.all([tmp6a, tmp6b, tmp6c])
  .then((data) => {
    const myArr = [];
    for (let i = 0; i < data.length; i++) {
      myArr.push(data[i].json());
    }
    return Promise.all(myArr);
  })
  .then((res) => console.log(res))
  .finally(() => console.log(new Date() - tmpStart6));

//7 Запусти 2 fetch параллельно: быстрый API (https://api.ipify.org?format=json) и более тяжёлый (https://jsonplaceholder.typicode.com/posts/1).
// Используй Promise.race(). Выведи результат первого пришедшего ответа.
const arr7 = [
  "https://api.ipify.org?format=json",
  "https://jsonplaceholder.typicode.com/posts/1",
];
const tmp7 = Promise.race(arr).then((data) => {
  console.log(data);
});

//8 Передай в Promise.all массив из трёх Promise: первый resolve с 1, второй reject с ошибкой, третий resolve с 3. Обработай через .catch().
// Убедись, что массив результатов не приходит — приходит только ошибка. Какой из трёх промисов «победил»?
const tmp8a = Promise.resolve(1);
const tmp8b = Promise.reject(new Error("Ошибка"));
const tmp8c = Promise.resolve(3);
const arr8 = [tmp8a, tmp8b, tmp8c];
const tmps8 = Promise.all(arr8)
  .then((results) => console.log(results))
  .catch((err) => console.log("Ошибка", err.message));

//9 Те же 3 Promise, что в задании 8 (один resolve, один reject, один resolve). Используй Promise.allSettled() вместо all.
// Обработай результат — должен прийти массив объектов с status и value/reason. Выведи его.
const tmp9a = Promise.resolve(1);
const tmp9b = Promise.reject(new Error("Ошибка"));
const tmp9c = Promise.resolve(3);
const arr9 = [tmp9a, tmp9b, tmp9c];
const tmp9 = Promise.allSettled(arr9).then((results) => console.log(results));

//10 Напиши функцию delay(ms), которая возвращает Promise и resolve'ится через ms миллисекунд. Внутри используй setTimeout — оберни его callback в Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
delay(1500).then(() => console.log("hello"));

// Оберни любой callback-based API по тому же принципу: new Promise((resolve, reject) => { api(...args, (err, result) => err ? reject(err) : resolve(result)); }).
function delay10b(id) {
  return fetch("https://api.ipify.org?format=json")
    .then((answer) => {
      return answer.json();
    })
    .catch(() => console.error("Ошибка: " + id));
}
delay10b(100000000000000000).then((data) => console.log(data));

//11 Запроси пост с id=5: https://jsonplaceholder.typicode.com/posts/5. Выведи в консоль title и body поста
fetch("https://jsonplaceholder.typicode.com/posts/5")
  .then((data) => {
    return data.json();
  })
  .then((dataJson) => console.log(`${dataJson.title} - ${dataJson.body}`));

//12 Запроси пользователя с id=1: https://jsonplaceholder.typicode.com/users/1. Из ответа возьми id, затем запроси его посты: https://jsonplaceholder.typicode.com/posts?userId={id}.
// Выведи имя пользователя (name) и количество постов.
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((data) => {
    return data.json();
  })
  .then((user) => {
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .then((res) => {
        return res.json();
      })
      .then((posts) => {
        return { name: user.name, quantity: posts.length };
      });
  })
  .then((toPrint) => console.log(toPrint.name + `\n` + toPrint.quantity));

//13 Запроси пользователей с id 1, 2, 3 через https://jsonplaceholder.typicode.com/users/{id}. Используй Promise.all и map. Выведи массив имён (name).
// без мапы
const arr13 = [1, 2, 3];
const promisesArr = [];
for (let i = 0; i < arr13.length; i++) {
  const tmp13 = fetch(`https://jsonplaceholder.typicode.com/users/${arr13[i]}`)
    .then((data) => {
      return data.json();
    })
    .then((resJson) => {
      return resJson.name;
    });
  //тут должен быть массив промисов!!!!
  promisesArr.push(tmp13);
}

Promise.all(promisesArr).then((results) => console.log(results));

// с мапой
const tmp13 = [1, 2, 3];

Promise.all(
  tmp13.map((id) => {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((data) => {
        return data.json();
      })
      .then((parced) => {
        return parced.name;
      });
  }),
).then((data) => console.log(data));

//14 Bored API: https://api.agify.io/?name=michael Получи данные и выведи count и age
fetch(`https://api.agify.io/?name=michael`)
  .then((data) => data.json())
  .then((dataP) =>
    console.log("count: " + `${dataP.count}` + `\n` + "age: " + `${dataP.age}`),
  );

//15 Запроси курс USD → EUR: https://api.frankfurter.app/latest?from=USD&to=EUR. Выведи в консоль «1 USD = X EUR».
fetch("https://api.frankfurter.app/latest?from=USD&to=EUR")
  .then((data) => data.json())
  .then((dataP) => {
    console.log("1 USD = " + dataP.rates.EUR + " EUR");
  });
