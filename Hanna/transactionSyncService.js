export class TransactionSyncService {
  constructor(baseUrl = "https://jsonplaceholder.typicode.com/posts") {
    this.baseUrl = baseUrl;
  }

  loadWithCallback(callback) {
    fetch(this.baseUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load transactions");
        }
        return response.json();
      })
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, null);
      });
  }

  loadWithPromise() {
    return fetch(this.baseUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load transactions");
      }
      return response.json();
    });
  }

  async loadWithAsyncAwait() {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error("Failed to load transactions");
    }

    return response.json();
  }

  async sendTransaction(transaction) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error("Failed to send transaction");
    }

    return response.json();
  }
}
