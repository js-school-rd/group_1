//1 переписать
// Создай Promise, который через 1 секунду переходит в fulfilled с числом 42. Выведи результат в консоль через .then().

async function returnPromise() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 42;
}
returnPromise().then((res) => console.log(res));

//Создай Promise, который сразу (без setTimeout) переходит в rejected с объектом ошибки new Error('Что-то пошло не так').
// Обработай ошибку через .catch() и выведи сообщение в консоль.

async function returnError() {
  throw new Error("что-то пошло не так");
}
returnError().catch((err) => console.log(err.message));

//2 Напиши async-функцию getDouble(n), которая ждёт 500 мс (через Promise), затем возвращает n * 2. Вызови её с аргументом 21 и выведи результат.

async function getDouble(n) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return n * 2;
}

getDouble(21).then((result) => console.log(result));

//3  Напиши async-функцию, которая внутри вызывает await Promise.reject(new Error('Тест ошибки')).
// Оберни в try/catch, в catch выведи сообщение и верни null. Убедись, что ошибка не «улетает» в консоль как unhandled rejection.

async function tmp3() {
  try {
    await Promise.reject(new Error("Ошибка"));
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

tmp3().then((result) => console.log(result));

//4 Напиши async-функцию, которая 3 раза подряд вызывает await delay(300) (или аналогичную задержку 300 мс). Замерь общее время выполнения. Ожидаемо ~900 мс — три задержки складываются.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const start = Date.now();
async function tmp4() {
  await delay(300);
  await delay(300);
  await delay(300);
  console.log(Date.now() - start);
}
tmp4();

//5 Те же 3 задержки по 300 мс, но запустить их через Promise.all и один await. Замерь время — должно быть ~300 мс.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const arr = [delay(300), delay(300), delay(300)];
async function tmp5() {
  const start = Date.now();
  await Promise.all(arr);
  console.log(Date.now() - start);
}
tmp5();

//6 Перепиши на async/await.
// Получи случайного пользователя с https://randomuser.me/api/ и выведи в консоль имя: data.results[0].name.first и data.results[0].name.last. Добавь try/catch для ошибок сети.
// НЕ РАЗРЕШЕН FETCH ДАЖЕ ОПЕРОЙ
async function tmp6() {
  try {
    const data = await fetch(`https://randomuser.me/api/`);
    const dataP = await data.json();
    const toPrint = await dataP.results[0].name.first;
    console.log(toPrint);
  } catch (err) {
    console.err(err.message);
  }
}

tmp6();

//7 Напиши функцию readFileAsync(path), которая оборачивает callback-based API в Promise.
// Имитация: функция fakeReadFile(path, callback) принимает путь и колбэк (err, data) => {}, через 100 мс вызывает колбэк с (null, 'содержимое файла').
// Оберни её в Promise, затем вызови через await в async-функции.

// то, что надо завернуть в ф-ию
function fakeReadFile(path, callback) {
  setTimeout(() => callback(null, "содержимое файла"), 100);
}

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fakeReadFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function tmp7() {
  const cont = await readFileAsync("E:\js\javascript notes.txt");
  console.log(cont);
}

// https://official-joke-api.appspot.com/random_joke

//8  Напиши async-функцию fetchPosts(ids), которая принимает массив id постов (например [1, 2, 3]), для каждого делает запрос к https://jsonplaceholder.typicode.com/posts/{id},
// собирает результаты через Promise.all и map, возвращает массив постов.
// Выведи в консоль заголовки (title) всех постов.
const arr8 = [1, 2, 3];

async function fetchPosts(ids) {
  const promises = ids.map((id) =>
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((res) => {
      return res.json();
    }),
  );
  const posts = await Promise.all(promises);
  return posts;
}

fetchPosts(arr8).then((data) => {
  data.forEach((d) => console.log(d.title));
});

//9 Напиши async-функцию getPost(id), которая запрашивает https://jsonplaceholder.typicode.com/posts/{id} и возвращает объект поста. Вызови с id=7, выведи title в консоль.

async function getPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const resP = await res.json();
  return resP.title;
}
getPost(7).then((title) => console.log(title));

//10 Запроси пользователя id=2: https://jsonplaceholder.typicode.com/users/2.
// Затем запроси его задачи: https://jsonplaceholder.typicode.com/users/2/todos. Выведи имя пользователя и количество завершённых задач (completed === true).

async function tmp10(id) {
  const user = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const userJson = await user.json();
  const userName = await userJson.name;
  const tasks = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}/todos`,
  );
  const tasksJson = await tasks.json();
  const tasksCount = tasksJson.length;
  return { userName, tasksCount };
}
tmp10(7).then((res) =>
  console.log(
    "name: " + res.userName + `\n` + "posts count: " + res.tasksCount,
  ),
);

//11 В одной async-функции сделай 3 параллельных запроса:
// https://dog.ceo/api/breeds/image/random
//https://api.ipify.org?format=json
//https://dummyjson.com/quotes/random
// Выведи всё в консоль через один await Promise.all([...]).

const item1 = fetch(`https://dog.ceo/api/breeds/image/random`);
const item2 = fetch(`https://dummyjson.com/quotes/random`);
const item3 = fetch(`https://dummyjson.com/quotes/random`);
const promises = [item1, item2, item3];
async function printAll11(promises) {
  const arrays = await Promise.all(promises);
  return arrays;
}
printAll11(promises).then((res) => console.log(res));

//12 Запроси фото альбома 1: https://jsonplaceholder.typicode.com/albums/1/photos. Выведи в консоль массив из 5 первых thumbnailUrl (обрежь массив через .slice(0, 5)).
//через цикл
async function tmp12(id) {
  const photos = await fetch(
    `https://jsonplaceholder.typicode.com/albums/${id}/photos`,
  );
  const photosP = await photos.json();

  for (let i = 0; i < 5; i++) {
    console.log(photosP[i].thumbnailUrl);
  }
}

tmp12(1);

//через мапу
async function tmp12Map(id) {
  const data = await fetch(
    `https://jsonplaceholder.typicode.com/albums/${id}/photos`,
  );
  const dataP = await data.json();
  return dataP.slice(0, 5).map((tmp) => tmp.thumbnailUrl);
}
tmp12Map(1).then((res) => console.log(res));
