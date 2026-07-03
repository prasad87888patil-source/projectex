const STORAGE_KEY = "expenseTrackerEntries";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const currentBalanceEl = document.getElementById("currentBalance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const entriesListEl = document.getElementById("entriesList");

const descInput = document.getElementById("descInput");
const amountInput = document.getElementById("amountInput");
const typeInput = document.getElementById("typeInput");
const categoryInput = document.getElementById("categoryInput");

const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const refreshBtn = document.getElementById("refreshBtn");

function formatMoney(num) {
  return "₹" + Number(num).toFixed(2);
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function calculateTotals() {
  let income = 0;
  let expense = 0;

  entries.forEach(entry => {
    if (entry.type === "income") {
      income += entry.amount;
    } else {
      expense += entry.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense
  };
}

function render() {

  const { income, expense, balance } = calculateTotals();

  currentBalanceEl.textContent = formatMoney(balance);
  totalIncomeEl.textContent = formatMoney(income);
  totalExpenseEl.textContent = formatMoney(expense);

  entriesListEl.innerHTML = "";

  if (entries.length === 0) {
    entriesListEl.innerHTML =
      '<div class="empty-state">No entries yet. Add your first one above.</div>';
    return;
  }

  [...entries].reverse().forEach(entry => {

    const div = document.createElement("div");
    div.className = "entry";

    const sign = entry.type === "income" ? "+" : "-";
    const amountClass = entry.type;

    div.innerHTML = `
      <div class="entry-left">
        <div class="name">${entry.description}</div>
        <div class="category">${entry.category}</div>
      </div>

      <div class="entry-right">
        <div class="amount ${amountClass}">
          ${sign} ${formatMoney(entry.amount)}
        </div>

        <button class="delete-btn" data-id="${entry.id}">✕</button>
      </div>
    `;

    entriesListEl.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {

    btn.addEventListener("click", () => {

      const id = Number(btn.dataset.id);

      entries = entries.filter(item => item.id !== id);

      saveEntries();

      render();
    });

  });

}

function addEntry() {

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description) {
    alert("Please enter a description.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  entries.push({
    id: Date.now(),
    description,
    amount,
    type: typeInput.value,
    category: categoryInput.value
  });

  saveEntries();
  render();

  descInput.value = "";
  amountInput.value = "";

  descInput.focus();
}

function refreshEntries() {

  entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  render();

  refreshBtn.classList.add("spinning");

  setTimeout(() => {
    refreshBtn.classList.remove("spinning");
  }, 600);

}

addBtn.addEventListener("click", addEntry);

[descInput, amountInput].forEach(input => {

  input.addEventListener("keydown", e => {

    if (e.key === "Enter") {
      addEntry();
    }

  });

});

refreshBtn.addEventListener("click", refreshEntries);

clearAllBtn.addEventListener("click", () => {

  if (entries.length === 0) return;

  if (confirm("Clear all entries?")) {

    entries = [];

    saveEntries();

    render();

  }

});

render();
