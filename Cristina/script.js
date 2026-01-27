let currentBalance = 1000;
let currentCurrency = "USD";
const rates = { USD: 1, EUR: 0.92, RUB: 90 };

const currencyInfo = {
  USD: { flag: "https://cdn-icons-png.flaticon.com/512/197/197374.png" },
  EUR: { flag: "https://cdn-icons-png.flaticon.com/512/197/197615.png" },
  RUB: { flag: "https://cdn-icons-png.flaticon.com/512/197/197408.png" },
};

const categoryIcons = {
  Food: "   https://cdn-icons-png.flaticon.com/512/6686/6686729.png ",
  Rent: "https://cdn-icons-png.flaticon.com/512/10812/10812271.png",
  Transport: "   https://cdn-icons-png.flaticon.com/512/565/565352.png ",
  Healthcare: "   https://cdn-icons-png.flaticon.com/512/154/154016.png ",
  Energy: "https://cdn-icons-png.flaticon.com/512/4439/4439957.png",
  Kids: "https://cdn-icons-png.flaticon.com/512/10331/10331189.png",
  Croissants: "https://cdn-icons-png.flaticon.com/512/3014/3014502.png",
  More: "https://cdn-icons-png.flaticon.com/512/570/570223.png",
  Income: "https://cdn-icons-png.flaticon.com/512/11142/11142277.png",
  Limit: "https://cdn-icons-png.flaticon.com/512/2040/2040504.png",
};

// --- Alerts ---
function showNotify(text, isExpense = false) {
  const notify = document.getElementById("notification");
  if (!notify) return;
  notify.textContent = text;
  notify.classList.remove("bg-red-500", "bg-green-500", "hidden");
  notify.classList.add(isExpense ? "bg-red-500" : "bg-green-500");
  setTimeout(() => {
    notify.classList.add("hidden");
  }, 2000);
}

// --- Expenses Income Tabs ---
function switchTab(type) {
  document.getElementById("section-expense").style.display =
    type === "expense" ? "block" : "none";
  document.getElementById("section-income").style.display =
    type === "income" ? "block" : "none";
  document
    .getElementById("tab-expense")
    .classList.toggle("active", type === "expense");
  document
    .getElementById("tab-income")
    .classList.toggle("active", type === "income");
}

// --- Change Balance Toggle---
function toggleEdit(show) {
  document.getElementById("balance-view").style.display = show
    ? "none"
    : "block";
  document.getElementById("balance-edit").style.display = show
    ? "block"
    : "none";
}
// --- Change Balance ---
function saveNewBudget() {
  let input = document.getElementById("new-budget-input");
  let val = parseFloat(input.value);
  if (isNaN(val)) return;

  currentBalance = val / rates[currentCurrency];
  updateUI();
  toggleEdit(false);
  addHistory("limit", val, "Limit changed");

  showNotify("The limit has been updated", false);
  input.value = "";

  updateButtonStates();
}
// --- Income ---
function addIncome() {
  let input = document.getElementById("income-input");
  let amount = parseFloat(input.value);
  if (isNaN(amount) || amount <= 0) return;

  currentBalance += amount / rates[currentCurrency];
  addHistory("income", amount, "Income");
  updateUI();
  showNotify("Balance replenished!", false);
  input.value = "";

  updateButtonStates();
}
// --- Expensess ---
function spendMoney(cat) {
  let input = document.getElementById("expense-input");
  let amount = parseFloat(input.value);
  if (isNaN(amount) || amount <= 0) return;

  currentBalance -= amount / rates[currentCurrency];
  addHistory("expense", amount, cat);
  updateUI();

  showNotify(`Spent on ${cat}`, true);
  input.value = "";

  updateButtonStates();
}

// --- Currency ---
function selectCurrency(code, btn) {
  currentCurrency = code;
  document.getElementById("expense-code").textContent = code;
  document.getElementById("expense-flag").src = currencyInfo[code].flag;

  if (document.getElementById("income-code")) {
    document.getElementById("income-code").textContent = code;
    document.getElementById("income-flag").src = currencyInfo[code].flag;
  }

  document
    .querySelectorAll(".currency-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updateUI();
}

function updateUI() {
  document.getElementById("balance-display").textContent =
    currentBalance.toFixed(2);
}

// --- History ---
function addHistory(type, amount, cat) {
  const list = document.getElementById("history-list");
  const placeholder = document.getElementById("empty-placeholder");
  if (placeholder) placeholder.remove();

  const now = new Date();
  const dateTime = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}, ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const iconKey =
    cat === "Limit Changed" || cat === "Limit Changed"
      ? "Limit"
      : cat === "Income"
        ? "Income"
        : cat;
  const iconUrl = categoryIcons[iconKey] || categoryIcons["More"];

  let amountText = "";
  let colorClass = "";

  if (type === "income") {
    amountText = `+${amount.toFixed(2)}`;
    colorClass = "text-green-400";
  } else if (type === "expense") {
    amountText = `-${amount.toFixed(2)}`;
    colorClass = "text-red-400";
  } else if (type === "limit") {
    amountText = `${amount.toFixed(2)}`;
    colorClass = "text-white opacity-70";
  }
  const div = document.createElement("div");

  div.className =
    "flex justify-between items-center p-3 bg-[#ffffff14] rounded-lg mb-2 backdrop-blur-sm";

  div.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-[#ffffff1a] rounded-full flex items-center justify-center">
        <img src="${iconUrl}" class="w-6 h-6 object-contain" alt="${cat}">
      </div>
      <div>
        <div class="font-bold text-white text-sm">${cat}</div>
        <div class="text-[10px] text-gray-400">${dateTime}</div>
      </div>
    </div>
    <div class="font-bold ${colorClass}">
      ${amountText} <span class="text-xs">${currentCurrency}</span>
    </div>
  `;

  list.prepend(div);
}

// --- Disable Buttons ---
function updateButtonStates() {
  const expVal = document.getElementById("expense-input").value;
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.disabled = !expVal || parseFloat(expVal) <= 0;
  });

  const incVal = document.getElementById("income-input").value;
  const incBtn = document.querySelector(".income-btn");
  if (incBtn) incBtn.disabled = !incVal || parseFloat(incVal) <= 0;

  const limitVal = document.getElementById("new-budget-input").value;
  const saveBtn = document.querySelector(".save-btn");
  if (saveBtn) saveBtn.disabled = !limitVal || parseFloat(limitVal) <= 0;
}

document
  .getElementById("expense-input")
  .addEventListener("input", updateButtonStates);
document
  .getElementById("income-input")
  .addEventListener("input", updateButtonStates);
document
  .getElementById("new-budget-input")
  .addEventListener("input", updateButtonStates);

updateButtonStates();
