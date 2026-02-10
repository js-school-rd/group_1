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
  container.classList.add("expenseCardInnerContainer");

  const cardIconContainer = document.createElement("div");
  cardIconContainer.classList.add("expenseCardIcon");
  const cardICon = document.createElement("img");
  cardICon.src = expenseType.icon;
  cardICon.alt = expenseType.key;
  cardIconContainer.appendChild(cardICon);

  const cardHeaderContainer = document.createElement("div");
  cardHeaderContainer.classList.add("expenseCardHeader");
  cardHeaderContainer.textContent = expenseType.name;

  container.appendChild(cardIconContainer);
  container.appendChild(cardHeaderContainer);

  return container;
}

amountInput.addEventListener;

function displayBudgetAfterDOMLoading(initialBudget) {
  document.getElementById("budgetOutput").textContent = initialBudget;
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
  renderBudget(
    initialBudget,
    budgetBeforeCalcs,
    budgetInputValue,
    document.getElementById("budgetOutput"),
  );
}

amountInput.addEventListener("keydown", function (keyboardButton) {
  if (keyboardButton.key === "Enter") {
    keyboardButton.preventDefault();
    makeCalcs();
  }
});

function displayExpenseCard(expenseTypesMockDB) {
  const container = document.getElementById("expenseCardOuterContainer");
  container.replaceChildren();

  for (let i = 0; i < expenseTypesMockDB.length; i++) {
    const card = returnExpenseCardData(expenseTypesMockDB[i]);

    card.addEventListener("click", function () {
      try {
        const amount = parseFloat(amountInput.value);

        const tx = transactionService.createExpense({
          amount,
          category: expenseTypesMockDB[i].key,
        });

        addTransaction(tx);
        makeCalcs();
      } catch (error) {
        alert(error.message);
      } finally {
        amountInput.value = "";
      }
    });

    container.appendChild(card);
  }
}

displayExpenseCard(expenseTypesMockDB);

function calcBudget(currentBudget, expenses) {
  if (isNaN(expenses)) expenses = 0;
  return currentBudget - expenses;
}

function renderBudget(newBudget, budgetBeforeCalcs, expenses, elemToEdit) {
  if (expenses > budgetBeforeCalcs) {
    elemToEdit.classList.add("value--negative");
  } else {
    elemToEdit.classList.remove("value--negative");
  }
  elemToEdit.textContent = newBudget;
}

function transaction(amount, category, createdAt, meta) {
  this.amount = amount;
  this.category = category;
  this.createdAt = createdAt;
  this.meta = meta || {};
}

transaction.prototype.f = function () {
  const metaText =
    this.meta && Object.keys(this.meta).length > 0
      ? ` - ${JSON.stringify(this.meta)}`
      : "";
  return `$${this.amount} - ${this.category} - ${this.createdAt.toLocaleDateString()}${metaText}`;
};

transaction.prototype.toJson = function () {
  return {
    amount: this.amount,
    category: this.category,
    createdAt: this.createdAt,
    meta: this.meta,
  };
};

const transactionService = {
  createExpense: function ({
    amount,
    category,
    meta = {},
    createdAt = new Date(),
  }) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a number greater than 0");
    }
    return new transaction(amount, category, createdAt, meta);
  },
};

const transactions = [];
function addTransaction(tx) {
  transactions.push(tx);
}

const mainScreen = {
  screenEl: document.getElementById("screenMain"),

  show() {
    this.screenEl.style.display = "block";
  },

  hide() {
    this.screenEl.style.display = "none";
  },

  render() {},
};

const historyScreen = {
  screenEl: document.getElementById("screenHistory"),
  listEl: document.getElementById("historyList"),

  show() {
    this.screenEl.style.display = "block";
  },

  hide() {
    this.screenEl.style.display = "none";
  },

  render(transactions) {
    this.listEl.replaceChildren();
    Array.prototype.forEach.call(transactions, (tx) => {
      const item = document.createElement("div");
      item.textContent = tx.f();
      this.listEl.appendChild(item);
    });
  },
};

const screenManager = {
  showMain() {
    mainScreen.show();
    historyScreen.hide();
  },

  showHistory() {
    mainScreen.hide();
    historyScreen.render(transactions);
    historyScreen.show();
  },
};

document.getElementById("navMain").addEventListener("click", () => {
  screenManager.showMain();
});

document.getElementById("navHistory").addEventListener("click", () => {
  screenManager.showHistory();
});
