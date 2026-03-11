import { TransactionSyncService } from "./transactionSyncService.js";

const service = new TransactionSyncService();

console.log("=== CALLBACK TEST ===");

service.loadWithCallback((error, data) => {
  if (error) {
    console.error("Callback error:", error);
  } else {
    console.log("Callback success:", data.slice(0, 3)); // первые 3 записи
  }
});

console.log("=== PROMISE TEST ===");

service
  .loadWithPromise()
  .then((data) => {
    console.log("Promise success:", data.slice(0, 3));
  })
  .catch((error) => {
    console.error("Promise error:", error);
  });

console.log("=== ASYNC/AWAIT TEST ===");

async function testAsync() {
  try {
    const data = await service.loadWithAsyncAwait();
    console.log("Async success:", data.slice(0, 3));
  } catch (error) {
    console.error("Async error:", error);
  }
}

testAsync();

console.log("=== SEND TRANSACTION TEST ===");

async function testSend() {
  try {
    const response = await service.sendTransaction({
      amount: 250,
      category: "Food",
      createdAt: new Date(),
    });

    console.log("Send success:", response);
  } catch (error) {
    console.error("Send error:", error);
  }
}

testSend();
