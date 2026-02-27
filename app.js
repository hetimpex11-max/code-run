const STORAGE_KEY = 'het-impex-data-v1';

const state = {
  diamondStock: [],
  roughStock: [],
  sales: [],
  bills: []
};

const refs = {
  diamondForm: document.getElementById('diamond-form'),
  roughForm: document.getElementById('rough-form'),
  saleForm: document.getElementById('sale-form'),
  billForm: document.getElementById('bill-form'),
  diamondTable: document.getElementById('diamond-table'),
  roughTable: document.getElementById('rough-table'),
  saleTable: document.getElementById('sale-table'),
  billPreview: document.getElementById('bill-preview'),
  exportBtn: document.getElementById('export-data'),
  totals: {
    diamondNumber: document.getElementById('sum-diamond-number'),
    diamondManufacturing: document.getElementById('sum-diamond-manufacturing'),
    rough: document.getElementById('sum-rough'),
    soldCts: document.getElementById('sum-sold-cts'),
    salesAmount: document.getElementById('sum-sales-amount')
  }
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadState();
  bindEvents();
  renderAll();
}

function bindEvents() {
  refs.diamondForm.addEventListener('submit', onAddDiamond);
  refs.roughForm.addEventListener('submit', onAddRough);
  refs.saleForm.addEventListener('submit', onAddSale);
  refs.billForm.addEventListener('submit', onGenerateBill);
  refs.exportBtn.addEventListener('click', exportData);

  refs.diamondTable.addEventListener('click', onDeleteRow('diamondStock'));
  refs.roughTable.addEventListener('click', onDeleteRow('roughStock'));
  refs.saleTable.addEventListener('click', onDeleteRow('sales'));
}

function onAddDiamond(event) {
  event.preventDefault();
  const shape = document.getElementById('diamond-shape').value.trim();
  const numberCts = parseFloat(document.getElementById('diamond-number-cts').value);
  const manufacturingCts = parseFloat(document.getElementById('diamond-manufacturing-cts').value);

  state.diamondStock.unshift({
    id: crypto.randomUUID(),
    date: now(),
    shape,
    numberCts,
    manufacturingCts
  });

  saveAndRender();
  refs.diamondForm.reset();
}

function onAddRough(event) {
  event.preventDefault();
  const roughType = document.getElementById('rough-type').value.trim();
  const stockCts = parseFloat(document.getElementById('rough-stock-cts').value);

  state.roughStock.unshift({
    id: crypto.randomUUID(),
    date: now(),
    roughType,
    stockCts
  });

  saveAndRender();
  refs.roughForm.reset();
}

function onAddSale(event) {
  event.preventDefault();
  const customer = document.getElementById('sale-customer').value.trim();
  const item = document.getElementById('sale-item').value.trim();
  const cts = parseFloat(document.getElementById('sale-cts').value);
  const rate = parseFloat(document.getElementById('sale-rate').value);
  const amount = cts * rate;

  state.sales.unshift({
    id: crypto.randomUUID(),
    date: now(),
    customer,
    item,
    cts,
    rate,
    amount
  });

  saveAndRender();
  refs.saleForm.reset();
}

function onGenerateBill(event) {
  event.preventDefault();

  const customer = document.getElementById('bill-customer').value.trim();
  const description = document.getElementById('bill-description').value.trim();
  const cts = parseFloat(document.getElementById('bill-cts').value);
  const rate = parseFloat(document.getElementById('bill-rate').value);
  const amount = cts * rate;

  const bill = {
    id: crypto.randomUUID(),
    billNo: `HET-${Date.now()}`,
    date: now(),
    company: 'HET IMPEX',
    customer,
    description,
    cts,
    rate,
    amount
  };

  state.bills.unshift(bill);
  saveState();
  renderBill(bill);
  refs.billForm.reset();
}

function onDeleteRow(section) {
  return (event) => {
    const btn = event.target.closest('button[data-id]');
    if (!btn) {
      return;
    }

    const id = btn.dataset.id;
    state[section] = state[section].filter((item) => item.id !== id);
    saveAndRender();
  };
}

function renderAll() {
  renderDiamondTable();
  renderRoughTable();
  renderSalesTable();
  renderTotals();

  if (state.bills.length > 0) {
    renderBill(state.bills[0]);
  }
}

function renderDiamondTable() {
  refs.diamondTable.innerHTML = state.diamondStock
    .map(
      (entry) => `<tr>
      <td>${entry.date}</td>
      <td>${escapeHtml(entry.shape)}</td>
      <td>${format(entry.numberCts)}</td>
      <td>${format(entry.manufacturingCts)}</td>
      <td><button class="btn danger" data-id="${entry.id}">Delete</button></td>
    </tr>`
    )
    .join('');
}

function renderRoughTable() {
  refs.roughTable.innerHTML = state.roughStock
    .map(
      (entry) => `<tr>
      <td>${entry.date}</td>
      <td>${escapeHtml(entry.roughType)}</td>
      <td>${format(entry.stockCts)}</td>
      <td><button class="btn danger" data-id="${entry.id}">Delete</button></td>
    </tr>`
    )
    .join('');
}

function renderSalesTable() {
  refs.saleTable.innerHTML = state.sales
    .map(
      (entry) => `<tr>
      <td>${entry.date}</td>
      <td>${escapeHtml(entry.customer)}</td>
      <td>${escapeHtml(entry.item)}</td>
      <td>${format(entry.cts)}</td>
      <td>${format(entry.amount)}</td>
      <td><button class="btn danger" data-id="${entry.id}">Delete</button></td>
    </tr>`
    )
    .join('');
}

function renderBill(bill) {
  refs.billPreview.classList.remove('hidden');
  refs.billPreview.innerHTML = `
    <h3>${bill.company}</h3>
    <h4>Bill / Invoice</h4>
    <p><strong>Bill No:</strong> ${bill.billNo}</p>
    <p><strong>Date:</strong> ${bill.date}</p>
    <p><strong>Customer:</strong> ${escapeHtml(bill.customer)}</p>
    <p><strong>Description:</strong> ${escapeHtml(bill.description)}</p>
    <p><strong>CTS:</strong> ${format(bill.cts)}</p>
    <p><strong>Rate:</strong> ${format(bill.rate)}</p>
    <p><strong>Total Amount:</strong> ${format(bill.amount)}</p>
  `;
}

function renderTotals() {
  const diamondNumber = sum(state.diamondStock, 'numberCts');
  const diamondManufacturing = sum(state.diamondStock, 'manufacturingCts');
  const rough = sum(state.roughStock, 'stockCts');
  const soldCts = sum(state.sales, 'cts');
  const salesAmount = sum(state.sales, 'amount');

  refs.totals.diamondNumber.textContent = format(diamondNumber);
  refs.totals.diamondManufacturing.textContent = format(diamondManufacturing);
  refs.totals.rough.textContent = format(rough);
  refs.totals.soldCts.textContent = format(soldCts);
  refs.totals.salesAmount.textContent = format(salesAmount);
}

function exportData() {
  const file = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = `het-impex-data-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.diamondStock = parsed.diamondStock || [];
    state.roughStock = parsed.roughStock || [];
    state.sales = parsed.sales || [];
    state.bills = parsed.bills || [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveAndRender() {
  saveState();
  renderAll();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function now() {
  return new Date().toLocaleString();
}

function format(value) {
  return Number(value).toFixed(2);
}

function sum(arr, key) {
  return arr.reduce((acc, entry) => acc + Number(entry[key] || 0), 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
