let initialBudget = 5000;
const amountInput = document.getElementById("amountInput");

//моковая БД
const expenseTypesMockDB = [
  {
    key: "FOOD",
    name: "Food",
    icon: "image/food-outline.svg",
    isActive: true,
  },
  { key: "ALCO", name: "Alco", icon: "image/glass-wine.svg", isActive: true },
  {
    key: "ENTERTAINMENT",
    name: "Entertainment",
    icon: "image/theater.svg",
    isActive: true,
  },
  {
    key: "TRANSPORT",
    name: "Transport",
    icon: "image/train-car.svg",
    isActive: true,
  },
  {
    key: "HEALTH",
    name: "Health",
    icon: "image/medication.svg",
    isActive: true,
  },
  {
    key: "EDUCATION",
    name: "Education",
    icon: "image/school-outline.svg",
    isActive: true,
  },
  { key: "TRAVEL", name: "Travel", icon: "image/earth.svg", isActive: true },
  {
    key: "SHOPPING",
    name: "Shopping",
    icon: "image/cart-minus.svg",
    isActive: true,
  },
  {
    key: "SUBSCRIPTIONS",
    name: "Subscriptions",
    icon: "image/youtube-subscription.svg",
    isActive: true,
  },
  {
    key: "GIFTS",
    name: "Gifts",
    icon: "image/gift-outline.svg",
    isActive: true,
  },
  { key: "PETS", name: "Pets", icon: "image/paw.svg", isActive: true },
  { key: "TAXI", name: "Taxi", icon: "image/taxi.svg", isActive: true },
  {
    key: "OTHER",
    name: "Other",
    icon: "image/hand-coin-outline.svg",
    isActive: true,
  },
];

function returnExpenseCardData(expenseType) {
  const container = document.createElement("button");
  container.className = "expenseCardInnerContainer";

  const cardIconContainer = document.createElement("div");
  cardIconContainer.className = "expenseCardIcon";
  const cardICon = document.createElement("img");
  cardICon.src = expenseType.icon;
  cardICon.alt = expenseType.key;
  cardIconContainer.appendChild(cardICon);

  const cardHeaderContainer = document.createElement("div");
  cardHeaderContainer.className = "expenseCardHeader";
  cardHeaderContainer.textContent = expenseType.name;

  container.appendChild(cardIconContainer);
  container.appendChild(cardHeaderContainer);

  return container;
}

amountInput.addEventListener;

function displayBudgetAfterDOMLoading(initialBudget) {
  return (document.getElementById("budgetOutput").innerHTML = initialBudget);
}

displayBudgetAfterDOMLoading(initialBudget);

function makeCalcs() {
  const budgetInputValue = parseFloat(amountInput.value);
  if (!/^\d+(\.\d+)?$/.test(budgetInputValue)) {
    alert("Wrong input data! Only positive numbers are allowed");
    return;
  }
  let budgetBeforeCalcs = initialBudget;
  initialBudget = calcBudget(initialBudget, budgetInputValue);
  updateBudgetUI(
    initialBudget,
    budgetBeforeCalcs,
    budgetInputValue,
    document.getElementById("budgetOutput"),
  );
}

//обработчик энтера
amountInput.addEventListener("keydown", function (keyboardButton) {
  if (keyboardButton.key === "Enter") {
    keyboardButton.preventDefault();
    makeCalcs();
  }
});

function displayExpenseCard(expenseTypesMockDB) {
  const container = document.getElementById("expenseCardOuterContainer");
  container.innerHTML = "";

  for (let i = 0; i < expenseTypesMockDB.length; i++) {
    const card = returnExpenseCardData(expenseTypesMockDB[i]);
    card.addEventListener("click", function () {
      makeCalcs();
    });

    container.appendChild(card);
  }
}

displayExpenseCard(expenseTypesMockDB);

//const expenseMockDB = [{ amount: 200, type: "FOOD", date: "2026-01-01" }];
function calcBudget(currentBudget, expenses) {
  if (isNaN(expenses)) expenses = 0;
  return currentBudget - expenses;
}

function updateBudgetUI(newBudget, budgetBeforeCalcs, expenses, elemToEdit) {
  if (expenses > budgetBeforeCalcs) {
    elemToEdit.classList.add("over");
  } else {
    elemToEdit.classList.remove("over");
  }
  elemToEdit.textContent = newBudget;
  amountInput.value = "";
}
