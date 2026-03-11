export function returnExpenseCardData(expenseType) {
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
