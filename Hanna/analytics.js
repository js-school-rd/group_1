function createAnalyticsModule(initialTransactions) {
  let transactions = [...initialTransactions];

  function addTransaction(tx) {
    transactions.push(tx);
  }

  function getTotal() {
    function countTotal(list) {
      if (list.length === 0) {
        return 0;
      }
      return list[0].amount + countTotal(list.slice(1));
    }

    return countTotal(transactions);
  }

  function getUniqueCategories() {
    const categories = transactions.map((tx) => tx.category);
    const uniqueSet = new Set(categories);
    return [...uniqueSet];
  }

  const filterByCategory = (category) => (transaction) =>
    transaction.category === category;

  function filterTransactionsByCategory(category) {
    return transactions.filter(filterByCategory(category));
  }

  function groupByDate() {
    const result = new Map();

    transactions.forEach((tx) => {
      const dateKey = tx.createdAt.toISOString().split("T")[0];

      if (!result.has(dateKey)) {
        result.set(dateKey, []);
      }

      result.get(dateKey).push(tx);
    });

    return result;
  }

  function getTotalByCategory() {
    const result = new Map();

    transactions.forEach((tx) => {
      if (!result.has(tx.category)) {
        result.set(tx.category, 0);
      }

      result.set(tx.category, result.get(tx.category) + tx.amount);
    });

    return result;
  }

  function getAll() {
    return [...transactions];
  }

  return {
    addTransaction,
    getTotal,
    getUniqueCategories,
    groupByDate,
    getTotalByCategory,
    getAll,
    filterTransactionsByCategory,
  };
}
