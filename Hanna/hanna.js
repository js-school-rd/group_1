import { expenseTypesMockDB } from "./expenseTypesMockDB.js";
import { ScreenManager } from "./screenManager.js";
import { returnExpenseCardData } from "./expenseCardManager.js";
import { TransactionSyncService } from "./transactionSyncService.js";

const syncService = new TransactionSyncService();

class Transaction {
  constructor(amount, category, createdAt = new Date(), meta = {}) {
    this.amount = amount;
    this.category = category;
    this.createdAt = createdAt;
    this.meta = meta;
  }

  f() {
    const metaText =
      this.meta && Object.keys(this.meta).length > 0
        ? ` - ${JSON.stringify(this.meta)}`
        : "";

    return `$${this.amount} - ${this.category} - ${this.createdAt.toLocaleDateString()}${metaText}`;
  }

  toJson() {
    return {
      amount: this.amount,
      category: this.category,
      createdAt: this.createdAt,
      meta: this.meta,
    };
  }
}

class TransactionService {
  createExpense({ amount, category, meta = {}, createdAt = new Date() }) {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a number greater than 0");
    }

    return new Transaction(amount, category, createdAt, meta);
  }
}

class BudgetManager {
  calcBudget(currentBudget, expenses) {
    if (Number.isNaN(expenses)) {
      return currentBudget;
    }

    return currentBudget - expenses;
  }

  renderBudget(newBudget, budgetBeforeCalcs, expenses, elemToEdit) {
    if (expenses > budgetBeforeCalcs) {
      elemToEdit.classList.add("value--negative");
    } else {
      elemToEdit.classList.remove("value--negative");
    }

    elemToEdit.textContent = newBudget;
  }
}

class ExpenseCardManager {
  constructor({
    containerId,
    amountInput,
    expenseTypes,
    transactionService,
    analytics,
    onExpenseAdded,
  }) {
    this.container = document.getElementById(containerId);
    this.amountInput = amountInput;
    this.expenseTypes = expenseTypes;
    this.transactionService = transactionService;
    this.analytics = analytics;
    this.onExpenseAdded = onExpenseAdded;
  }

  render() {
    this.container.replaceChildren();

    for (let i = 0; i < this.expenseTypes.length; i++) {
      const expenseType = this.expenseTypes[i];
      const card = returnExpenseCardData(expenseType);

      card.addEventListener("click", () => {
        try {
          const amount = parseFloat(this.amountInput.value);

          const tx = this.transactionService.createExpense({
            amount,
            category: expenseType.key,
          });

          this.analytics.addTransaction(tx);
          this.onExpenseAdded();
        } catch (error) {
          alert(error.message);
        } finally {
          this.amountInput.value = "";
        }
      });

      this.container.appendChild(card);
    }
  }
}

class BudgetApp {
  constructor() {
    this.initialBudget = 5000;

    this.amountInput = document.getElementById("amountInput");
    this.budgetOutput = document.getElementById("budgetOutput");
    this.navMain = document.getElementById("navMain");
    this.navHistory = document.getElementById("navHistory");

    this.analytics = createAnalyticsModule([]);
    this.screenManager = new ScreenManager(this.analytics);
    this.transactionService = new TransactionService();
    this.budgetManager = new BudgetManager();

    this.expenseCardManager = new ExpenseCardManager({
      containerId: "expenseCardOuterContainer",
      amountInput: this.amountInput,
      expenseTypes: expenseTypesMockDB,
      transactionService: this.transactionService,
      analytics: this.analytics,
      onExpenseAdded: () => this.makeCalcs(),
    });
  }

  init() {
    this.displayBudget();
    this.bindEvents();
    this.expenseCardManager.render();
  }

  displayBudget() {
    this.budgetOutput.textContent = this.initialBudget;
  }

  makeCalcs() {
    const budgetInputValue = parseFloat(this.amountInput.value);

    if (Number.isNaN(budgetInputValue) || budgetInputValue <= 0) {
      alert("Wrong input data! Only positive numbers are allowed");
      return;
    }

    const budgetBeforeCalcs = this.initialBudget;

    this.initialBudget = this.budgetManager.calcBudget(
      this.initialBudget,
      budgetInputValue,
    );

    this.budgetManager.renderBudget(
      this.initialBudget,
      budgetBeforeCalcs,
      budgetInputValue,
      this.budgetOutput,
    );
  }

  bindEvents() {
    this.amountInput.addEventListener("keydown", (keyboardButton) => {
      if (keyboardButton.key === "Enter") {
        keyboardButton.preventDefault();
        this.makeCalcs();
      }
    });

    this.navMain.addEventListener("click", () => {
      this.screenManager.showMain();
    });

    this.navHistory.addEventListener("click", () => {
      this.screenManager.showHistory();
    });
  }
}

const app = new BudgetApp();
app.init();
