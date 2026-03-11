class Screen {
  constructor(elementId) {
    this.screenEl = document.getElementById(elementId);
  }

  show() {
    this.screenEl.style.display = "block";
  }

  hide() {
    this.screenEl.style.display = "none";
  }

  render() {}
}

class MainScreen extends Screen {
  constructor() {
    super("screenMain");
  }
}

class HistoryScreen extends Screen {
  constructor() {
    super("screenHistory");
    this.listEl = document.getElementById("historyList");
  }

  render(transactions) {
    this.listEl.replaceChildren();

    transactions.forEach((tx) => {
      const item = document.createElement("div");
      item.textContent = tx.f();
      this.listEl.appendChild(item);
    });
  }
}

export class ScreenManager {
  constructor(analytics) {
    this.analytics = analytics;

    this.mainScreen = new MainScreen();
    this.historyScreen = new HistoryScreen();
  }

  showMain() {
    this.mainScreen.show();
    this.historyScreen.hide();
  }

  showHistory() {
    this.mainScreen.hide();
    this.historyScreen.render(this.analytics.getAll());
    this.historyScreen.show();
  }
}
