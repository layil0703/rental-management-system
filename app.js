const viewTitles = {
  dashboard: "營運總覽",
  cases: "案件管理",
  properties: "物件管理",
  finance: "收支管理",
  assets: "家電與前置投入",
  floorplans: "格局圖管理",
  repairs: "修繕工單",
  reports: "投報率報表",
};

const storageKeys = {
  cases: "rental_admin_cases_v1",
  floorPlans: "rental_admin_floor_plans_v1",
  transactions: "rental_admin_transactions_v1",
  repairs: "rental_admin_repairs_v1",
  assets: "rental_admin_assets_v1",
  properties: "rental_admin_properties_v1",
  layoutItems: "rental_admin_layout_items_v1",
};

const defaultCases = [
  { name: "信義 A3", mode: "master_lease", modeLabel: "包租代管", landlord: "林小姐", income: 42000, expense: 28500, companyInvestment: 0, roi: 48.2, status: "active", statusLabel: "進行中" },
  { name: "大安 2A", mode: "master_lease", modeLabel: "包租代管", landlord: "陳先生", income: 36000, expense: 24800, companyInvestment: 0, roi: 41.6, status: "active", statusLabel: "進行中" },
  { name: "板橋 B2", mode: "agency_management", modeLabel: "代租代管", landlord: "王小姐", income: 6200, expense: 1800, companyInvestment: 0, roi: 32.4, status: "active", statusLabel: "進行中" },
  { name: "中山 5F", mode: "master_lease", modeLabel: "包租代管", landlord: "張先生", income: 30000, expense: 26100, companyInvestment: 0, roi: 18.9, status: "paused", statusLabel: "修繕中" },
  { name: "三重 C1", mode: "agency_management", modeLabel: "代租代管", landlord: "黃先生", income: 5400, expense: 1500, companyInvestment: 0, roi: 29.7, status: "active", statusLabel: "進行中" },
];

const defaultFloorPlans = [
  { title: "大安 2A 類 3D 圖", planType: "類 3D 格局圖", visibility: "房東可看", fileName: "daan-2a-3d.webp", markers: "3 個設備 / 1 筆修繕" },
  { title: "信義 A3 家具配置圖", planType: "家具配置圖", visibility: "僅內部", fileName: "xinyi-a3-layout.pdf", markers: "5 個設備" },
];

const defaultTransactions = [
  { date: "2026-06-28", caseName: "信義 A3", type: "income", typeLabel: "收入", category: "房客租金", amount: 42000, note: "本月租金" },
  { date: "2026-06-28", caseName: "信義 A3", type: "payout", typeLabel: "房東撥款", category: "房東租金", amount: 28500, note: "固定撥款" },
  { date: "2026-06-27", caseName: "中山 5F", type: "expense", typeLabel: "支出", category: "冷氣維修", amount: 6500, note: "待報價" },
  { date: "2026-06-26", caseName: "板橋 B2", type: "income", typeLabel: "收入", category: "管理費", amount: 6200, note: "代租代管" },
];

const defaultProperties = [
  { name: "信義 A3", layout: "2 房 1 廳", mode: "包租代管", status: "已出租", floorPlan: "主要格局圖 2 張" },
  { name: "大安 2A", layout: "套房", mode: "包租代管", status: "已出租", floorPlan: "類 3D 圖待更新" },
  { name: "板橋 B2", layout: "3 房 2 廳", mode: "代租代管", status: "招租中", floorPlan: "家具配置圖 1 張" },
  { name: "中山 5F", layout: "雅房", mode: "包租代管", status: "修繕中", floorPlan: "水電圖待補" },
  { name: "三重 C1", layout: "整層", mode: "代租代管", status: "已出租", floorPlan: "平面圖 1 張" },
  { name: "松山 8B", layout: "2 房 1 廳", mode: "包租代管", status: "空置", floorPlan: "尚未上傳" },
];

const defaultAssets = [
  { assetName: "冷氣", propertyName: "信義 A3", category: "家電", amount: 32000, months: 36, monthly: 889, paidBy: "公司" },
  { assetName: "冰箱", propertyName: "大安 2A", category: "家電", amount: 18000, months: 36, monthly: 500, paidBy: "公司" },
  { assetName: "洗衣機", propertyName: "板橋 B2", category: "家電", amount: 14500, months: 36, monthly: 403, paidBy: "房東" },
  { assetName: "床組", propertyName: "中山 5F", category: "家具", amount: 12000, months: 24, monthly: 500, paidBy: "公司" },
  { assetName: "熱水器", propertyName: "三重 C1", category: "家電", amount: 21000, months: 48, monthly: 438, paidBy: "房東" },
  { assetName: "衣櫃", propertyName: "松山 8B", category: "家具", amount: 16000, months: 48, monthly: 333, paidBy: "公司" },
];

const defaultRepairs = [
  { title: "冷氣不冷", caseName: "中山 5F", status: "reviewing", statusLabel: "報價中", priority: "urgent", cost: 6500, location: "主臥冷氣旁" },
  { title: "浴室排水慢", caseName: "大安 2A", status: "scheduled", statusLabel: "排程中", priority: "normal", cost: 2000, location: "衛浴排水孔" },
  { title: "門鎖更換", caseName: "板橋 B2", status: "completed", statusLabel: "已完成", priority: "low", cost: 1800, location: "大門" },
  { title: "牆面補漆", caseName: "信義 A3", status: "reviewing", statusLabel: "審核中", priority: "normal", cost: 3200, location: "客廳牆面" },
];


let activeFilter = "all";
let cases = normalizeCases(loadStoredArray(storageKeys.cases, defaultCases));
let floorPlans = loadStoredArray(storageKeys.floorPlans, defaultFloorPlans);
let transactions = loadStoredArray(storageKeys.transactions, defaultTransactions);
let repairs = loadStoredArray(storageKeys.repairs, defaultRepairs);
let assets = loadStoredArray(storageKeys.assets, defaultAssets);
let properties = loadStoredArray(storageKeys.properties, defaultProperties);

const formatMoney = (amount) =>
  new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(amount);

let selectedLayoutItem = null;
let defaultLayoutState = [];

function statusClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (["active", "paid", "completed", "進行中", "已完成", "收入"].includes(normalized)) return "status-good";
  if (["paused", "scheduled", "reviewing", "pending", "修繕中", "審核中", "已排程", "房東撥款"].includes(normalized)) return "status-warn";
  if (["overdue", "urgent", "cancelled", "支出"].includes(normalized)) return "status-danger";
  return "status-neutral";
}

function editRecord(type, name) {
  if (type === "case") {
    startCaseEdit(name);
    return;
  }

  if (type === "property") {
    startPropertyEdit(name);
    return;
  }

  if (type === "transaction") {
    startTransactionEdit(name);
    return;
  }

  if (type === "asset") {
    startAssetEdit(name);
    return;
  }

  if (type === "repair") {
    startRepairEdit(name);
    return;
  }

  const labels = {
    case: "案件",
    property: "物件",
    transaction: "收支",
    asset: "家電/投入",
    repair: "修繕",
  };
  window.alert(`${labels[type] || "資料"}「${name}」的編輯入口已預留；正式版會開啟可儲存的編輯表單。`);
}

function startTransactionEdit(key) {
  const index = Number.isInteger(Number(key))
    ? Number(key)
    : transactions.findIndex((item) => `${item.caseName} / ${item.category}` === key);
  if (index < 0) return;
  const item = transactions[index];
  if (!item) return;
  setView("finance");
  const form = document.getElementById("transactionEditForm");
  form.index.value = String(index);
  form.caseName.value = item.caseName;
  form.type.value = item.type;
  form.category.value = item.category;
  form.amount.value = item.amount;
  form.date.value = item.date;
  form.note.value = item.note || "";
  document.getElementById("transactionEditNote").textContent = `正在編輯：${item.caseName} / ${item.category}`;
  document.getElementById("transactionEditPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startAssetEdit(name) {
  const index = Number.isInteger(Number(name))
    ? Number(name)
    : assets.findIndex((item) => item.assetName === name);
  if (index < 0) return;
  const item = assets[index];
  if (!item) return;
  setView("assets");
  const form = document.getElementById("assetEditForm");
  form.index.value = String(index);
  form.propertyName.value = item.propertyName;
  form.assetName.value = item.assetName;
  form.category.value = item.category;
  form.amount.value = item.amount;
  form.months.value = item.months;
  form.paidBy.value = item.paidBy;
  document.getElementById("assetEditNote").textContent = `正在編輯：${item.assetName}`;
  document.getElementById("assetEditPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startRepairEdit(title) {
  const index = Number.isInteger(Number(title))
    ? Number(title)
    : repairs.findIndex((item) => item.title === title);
  if (index < 0) return;
  const item = repairs[index];
  if (!item) return;
  setView("repairs");
  const form = document.getElementById("repairEditForm");
  form.index.value = String(index);
  form.caseName.value = item.caseName;
  form.title.value = item.title;
  form.status.value = item.status;
  form.priority.value = item.priority;
  form.cost.value = item.cost;
  form.location.value = item.location || "";
  document.getElementById("repairEditNote").textContent = `正在編輯：${item.title}`;
  document.getElementById("repairEditPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startCaseEdit(name) {
  const item = cases.find((caseItem) => normalizeName(caseItem.name) === normalizeName(name));
  if (!item) return;
  setView("cases");
  const form = document.getElementById("caseEditForm");
  form.originalName.value = item.name;
  form.name.value = item.name;
  form.mode.value = item.mode;
  form.landlord.value = item.landlord;
  form.income.value = item.income;
  form.expense.value = item.expense;
  form.companyInvestment.value = item.companyInvestment || 0;
  document.getElementById("caseEditNote").textContent = `正在編輯：${item.name}`;
  document.getElementById("caseEditPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startPropertyEdit(name) {
  const item = properties.find((property) => normalizeName(property.name) === normalizeName(name));
  if (!item) return;
  setView("properties");
  const form = document.getElementById("propertyEditForm");
  form.originalName.value = item.name;
  form.name.value = item.name;
  form.layout.value = item.layout;
  form.mode.value = item.mode;
  form.status.value = item.status;
  form.floorPlan.value = item.floorPlan;
  document.getElementById("propertyEditNote").textContent = `正在編輯：${item.name}`;
  document.getElementById("propertyEditPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectLayoutItem(item) {
  document.querySelectorAll(".layout-item.selected").forEach((node) => node.classList.remove("selected"));
  selectedLayoutItem = item;
  if (selectedLayoutItem) {
    selectedLayoutItem.classList.add("selected");
  }
  updateLayoutToolbar();
}

function getLayoutItemLabel(item) {
  if (!item) return "";
  if (item.dataset.layoutLabel) return item.dataset.layoutLabel;
  return Array.from(item.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("")
    .trim();
}

function setLayoutItemLabel(item, label) {
  if (!item) return;
  const nextLabel = label.trim();
  if (!nextLabel) return;

  item.dataset.layoutLabel = nextLabel;
  Array.from(item.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .forEach((node) => node.remove());
  item.insertBefore(document.createTextNode(nextLabel), item.firstChild);
  ensureResizeHandle(item);
}

function getLayoutItemType(item) {
  if (!item) return "room";
  if (item.classList.contains("single-bed")) return "single-bed";
  if (item.classList.contains("double-bed")) return "double-bed";
  if (item.classList.contains("desk")) return "desk";
  if (item.classList.contains("cabinet")) return "cabinet";
  if (item.classList.contains("door")) return "door";
  if (item.classList.contains("window")) return "window";
  return "room";
}

function getLayoutItemConfig(type) {
  return {
    "single-bed": { label: "單人床", className: "furniture-item single-bed", width: 68, height: 38 },
    "double-bed": { label: "雙人床", className: "furniture-item double-bed", width: 92, height: 48 },
    desk: { label: "桌子", className: "furniture-item desk", width: 62, height: 42 },
    cabinet: { label: "櫃子", className: "furniture-item cabinet", width: 52, height: 72 },
    door: { label: "門口", className: "opening-item door", width: 56, height: 18 },
    window: { label: "窗戶", className: "opening-item window", width: 90, height: 16 },
    room: { label: "房間", className: "room layout-room", width: 150, height: 110 },
  }[type] || { label: "房間", className: "room layout-room", width: 150, height: 110 };
}

function buildLayoutItem(type, label) {
  const config = getLayoutItemConfig(type);
  const item = document.createElement("button");
  item.type = "button";
  item.className = `layout-item ${config.className}`;
  item.textContent = label || config.label;
  item.style.width = `${config.width}px`;
  item.style.height = `${config.height}px`;
  item.dataset.layoutKind = type === "door" || type === "window" ? "opening" : type === "room" ? "room" : "furniture";
  item.dataset.layoutType = type;
  item.dataset.layoutLabel = label || config.label;
  return item;
}

function getCurrentLayoutState() {
  return Array.from(document.querySelectorAll(".fake-plan .layout-item")).map((item) => ({
    type: item.dataset.layoutType || getLayoutItemType(item),
    label: getLayoutItemLabel(item),
    left: item.style.left,
    top: item.style.top,
    width: item.style.width,
    height: item.style.height,
    rotation: item.dataset.rotation || "0",
  }));
}

function saveLayoutState() {
  localStorage.setItem(storageKeys.layoutItems, JSON.stringify(getCurrentLayoutState()));
}

function renderLayoutState(items) {
  const plan = document.querySelector(".fake-plan");
  if (!plan) return;

  plan.querySelectorAll(".layout-item").forEach((item) => item.remove());
  items.forEach((storedItem) => {
    const item = buildLayoutItem(storedItem.type, storedItem.label);
    item.style.left = storedItem.left || "8%";
    item.style.top = storedItem.top || "8%";
    item.style.width = storedItem.width || item.style.width;
    item.style.height = storedItem.height || item.style.height;
    item.dataset.rotation = storedItem.rotation || "0";
    item.style.transform = `rotate(${item.dataset.rotation}deg)`;
    plan.appendChild(item);
  });
}

function captureDefaultLayoutState() {
  defaultLayoutState = getCurrentLayoutState();
}

function restoreLayoutState() {
  const plan = document.querySelector(".fake-plan");
  if (!plan) return;

  const stored = localStorage.getItem(storageKeys.layoutItems);
  if (!stored) {
    Array.from(plan.querySelectorAll(".layout-item")).forEach((item) => {
      const type = getLayoutItemType(item);
      item.dataset.layoutType = type;
      item.dataset.layoutLabel = getLayoutItemLabel(item);
    });
    return;
  }

  try {
    const items = JSON.parse(stored);
    renderLayoutState(items);
  } catch {
    localStorage.removeItem(storageKeys.layoutItems);
  }
}

function resetLayoutToDefault() {
  const confirmed = window.confirm("確定還原預設格局？目前移動、縮放、旋轉與改名的配置會被清除。");
  if (!confirmed) return;

  selectedLayoutItem = null;
  localStorage.removeItem(storageKeys.layoutItems);
  renderLayoutState(defaultLayoutState);
  enableLayoutDragging();
  updateLayoutToolbar();
  saveLayoutState();
}

function updateLayoutToolbar() {
  const label = document.getElementById("selectedLayoutLabel");
  const nameInput = document.getElementById("layoutNameInput");
  const renameButton = document.getElementById("renameLayoutButton");
  if (!label) return;
  const selectedLabel = getLayoutItemLabel(selectedLayoutItem);
  label.textContent = selectedLayoutItem ? `已選取：${selectedLabel}` : "尚未選取物件";
  if (nameInput) {
    nameInput.value = selectedLabel;
    nameInput.disabled = !selectedLayoutItem;
  }
  if (renameButton) {
    renameButton.disabled = !selectedLayoutItem;
  }
}

function renameSelectedLayout() {
  const nameInput = document.getElementById("layoutNameInput");
  if (!selectedLayoutItem || !nameInput) return;
  setLayoutItemLabel(selectedLayoutItem, nameInput.value);
  updateLayoutToolbar();
  saveLayoutState();
}

function rotateSelectedLayout(degrees) {
  if (!selectedLayoutItem) return;
  const current = Number(selectedLayoutItem.dataset.rotation || 0);
  const next = (current + degrees) % 360;
  selectedLayoutItem.dataset.rotation = String(next);
  selectedLayoutItem.style.transform = `rotate(${next}deg)`;
  saveLayoutState();
}

function deleteSelectedLayout() {
  if (!selectedLayoutItem) return;
  selectedLayoutItem.remove();
  selectedLayoutItem = null;
  updateLayoutToolbar();
  saveLayoutState();
}

function replaceFloorPlanWithImage(file) {
  const plan = document.querySelector(".fake-plan");
  if (!plan || !file || !file.type.startsWith("image/")) return false;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    plan.querySelectorAll(".layout-item, .marker").forEach((item) => item.remove());
    plan.classList.add("has-upload");
    plan.style.backgroundImage = `url("${reader.result}")`;
    selectedLayoutItem = null;
    updateLayoutToolbar();
    saveLayoutState();
  });
  reader.readAsDataURL(file);
  return true;
}

function createLayoutObject(type, customLabel = "") {
  const plan = document.querySelector(".fake-plan");
  if (!plan) return;

  const item = buildLayoutItem(type, customLabel);
  item.style.left = "8%";
  item.style.top = "8%";
  plan.appendChild(item);
  ensureResizeHandle(item);
  enableLayoutDragging(item);
  selectLayoutItem(item);
  saveLayoutState();
}

function ensureResizeHandle(item) {
  if (item.querySelector(".resize-handle")) return;
  const handle = document.createElement("span");
  handle.className = "resize-handle";
  handle.setAttribute("aria-hidden", "true");
  item.appendChild(handle);
  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    selectLayoutItem(item);
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = item.offsetWidth;
    const startHeight = item.offsetHeight;

    const resizeItem = (moveEvent) => {
      item.style.width = `${Math.max(28, startWidth + moveEvent.clientX - startX)}px`;
      item.style.height = `${Math.max(14, startHeight + moveEvent.clientY - startY)}px`;
    };

    const stopResize = () => {
      handle.removeEventListener("pointermove", resizeItem);
      handle.removeEventListener("pointerup", stopResize);
      handle.removeEventListener("pointercancel", stopResize);
      saveLayoutState();
    };

    handle.addEventListener("pointermove", resizeItem);
    handle.addEventListener("pointerup", stopResize);
    handle.addEventListener("pointercancel", stopResize);
  });
}

function enableLayoutDragging(targetItem) {
  const plan = document.querySelector(".fake-plan");
  if (!plan) return;

  const items = targetItem ? [targetItem] : Array.from(document.querySelectorAll(".layout-item"));
  items.forEach((item) => {
    if (item.dataset.dragReady === "true") return;
    item.dataset.dragReady = "true";
    ensureResizeHandle(item);
    item.addEventListener("click", () => selectLayoutItem(item));
    item.addEventListener("pointerdown", (event) => {
      if (event.target !== item) return;
      event.preventDefault();
      selectLayoutItem(item);
      item.classList.add("dragging");
      item.setPointerCapture(event.pointerId);

      const planRect = plan.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const offsetX = event.clientX - itemRect.left;
      const offsetY = event.clientY - itemRect.top;

      const moveItem = (moveEvent) => {
        const maxX = plan.clientWidth - item.offsetWidth;
        const maxY = plan.clientHeight - item.offsetHeight;
        const nextX = Math.min(Math.max(moveEvent.clientX - planRect.left - offsetX, 0), maxX);
        const nextY = Math.min(Math.max(moveEvent.clientY - planRect.top - offsetY, 0), maxY);
        item.style.left = `${(nextX / plan.clientWidth) * 100}%`;
        item.style.top = `${(nextY / plan.clientHeight) * 100}%`;
      };

      const stopDrag = () => {
        item.classList.remove("dragging");
        item.removeEventListener("pointermove", moveItem);
        item.removeEventListener("pointerup", stopDrag);
        item.removeEventListener("pointercancel", stopDrag);
        saveLayoutState();
      };

      item.addEventListener("pointermove", moveItem);
      item.addEventListener("pointerup", stopDrag);
      item.addEventListener("pointercancel", stopDrag);
    });
  });
}

function loadStoredArray(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [...fallback];
  } catch {
    return [...fallback];
  }
}

function inferInvestmentFromLegacyRoi(item) {
  const netProfit = Number(item.income || 0) - Number(item.expense || 0);
  const oldRoi = Number(item.roi || 0);
  if (netProfit <= 0 || oldRoi <= 0) return 0;
  return Math.round((netProfit * 12 * 100) / oldRoi);
}

function normalizeCases(items) {
  return items.map((item) => {
    if (Object.prototype.hasOwnProperty.call(item, "companyInvestment")) {
      return {
        ...item,
        companyInvestment: Number(item.companyInvestment || 0),
        investmentSource: item.investmentSource || "manual",
      };
    }

    const inferredInvestment = inferInvestmentFromLegacyRoi(item);
    return {
      ...item,
      companyInvestment: inferredInvestment,
      investmentSource: inferredInvestment > 0 ? "legacy_roi" : "missing",
    };
  });
}

function saveState() {
  localStorage.setItem(storageKeys.cases, JSON.stringify(cases));
  localStorage.setItem(storageKeys.floorPlans, JSON.stringify(floorPlans));
  localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions));
  localStorage.setItem(storageKeys.repairs, JSON.stringify(repairs));
  localStorage.setItem(storageKeys.assets, JSON.stringify(assets));
  localStorage.setItem(storageKeys.properties, JSON.stringify(properties));
}

function getBackupPayload() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      cases,
      floorPlans,
      transactions,
      repairs,
      assets,
      properties,
      layoutItems: getCurrentLayoutState(),
    },
  };
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportBackupData() {
  downloadJson(`rental-admin-backup-${new Date().toISOString().slice(0, 10)}.json`, getBackupPayload());
}

function isBackupPayload(payload) {
  const data = payload?.data;
  return Boolean(data)
    && Array.isArray(data.cases)
    && Array.isArray(data.floorPlans)
    && Array.isArray(data.transactions)
    && Array.isArray(data.repairs)
    && Array.isArray(data.assets)
    && Array.isArray(data.properties);
}

function applyBackupPayload(payload) {
  if (!isBackupPayload(payload)) {
    window.alert("匯入失敗：這不是有效的租管後台備份檔。");
    return false;
  }

  const confirmed = window.confirm("確定匯入備份？目前本機資料會被備份檔覆蓋。");
  if (!confirmed) return false;

  cases = normalizeCases(payload.data.cases);
  floorPlans = payload.data.floorPlans;
  transactions = payload.data.transactions;
  repairs = payload.data.repairs;
  assets = payload.data.assets;
  properties = payload.data.properties;
  saveState();

  if (Array.isArray(payload.data.layoutItems)) {
    localStorage.setItem(storageKeys.layoutItems, JSON.stringify(payload.data.layoutItems));
  } else {
    localStorage.removeItem(storageKeys.layoutItems);
  }

  selectedLayoutItem = null;
  restoreLayoutState();
  enableLayoutDragging();
  updateLayoutToolbar();
  refreshAllViews();
  setDefaultFormValues();
  window.alert("備份已匯入完成。");
  return true;
}

function resetDemoData() {
  const confirmed = window.confirm("確定重置示範資料？目前本機資料會被清除，建議先按「備份資料」保存。");
  if (!confirmed) return;

  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  cases = normalizeCases(defaultCases);
  floorPlans = [...defaultFloorPlans];
  transactions = [...defaultTransactions];
  repairs = [...defaultRepairs];
  assets = [...defaultAssets];
  properties = [...defaultProperties];
  selectedLayoutItem = null;

  renderLayoutState(defaultLayoutState);
  saveState();
  saveLayoutState();
  enableLayoutDragging();
  updateLayoutToolbar();
  refreshAllViews();
  setDefaultFormValues();
  window.alert("已重置為示範資料。");
}

function importBackupData(fileInput) {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      applyBackupPayload(JSON.parse(reader.result));
    } catch {
      window.alert("匯入失敗：JSON 檔案格式無法解析。");
    } finally {
      fileInput.value = "";
    }
  });
  reader.readAsText(file);
}

function getRepairStatusLabel(status) {
  const labels = {
    reported: "已通報",
    reviewing: "審核中",
    scheduled: "已排程",
    completed: "已完成",
  };
  return labels[status] || "已通報";
}

function getRepairPriorityLabel(priority) {
  const labels = {
    low: "低",
    normal: "一般",
    high: "高",
    urgent: "緊急",
  };
  return labels[priority] || "一般";
}

function getTransactionTypeLabel(type) {
  const labels = {
    income: "收入",
    expense: "支出",
    payout: "房東撥款",
    reimbursement: "代墊回收",
  };
  return labels[type] || "其他";
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function signedTransactionAmount(item) {
  if (item.type === "income" || item.type === "reimbursement") return item.amount;
  return -item.amount;
}

function refreshAllViews() {
  renderDashboardMetrics();
  renderRoiList();
  renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
  renderProperties();
  renderTransactions();
  renderAssets();
  renderRepairs();
  renderFloorPlans();
  renderSnapshots();
  renderReferenceOptions();
}

function renderReferenceOptions() {
  const caseOptions = document.getElementById("caseNameOptions");
  const propertyOptions = document.getElementById("propertyNameOptions");

  if (caseOptions) {
    caseOptions.innerHTML = cases
      .map((item) => `<option value="${item.name}">${item.modeLabel} / ${item.landlord}</option>`)
      .join("");
  }

  if (propertyOptions) {
    propertyOptions.innerHTML = properties
      .map((item) => `<option value="${item.name}">${item.layout} / ${item.status}</option>`)
      .join("");
  }
}

function getCaseFinancialSnapshot(caseItem) {
  const caseTransactions = transactions.filter((item) => item.caseName === caseItem.name);
  const transactionNet = caseTransactions.reduce((sum, item) => sum + signedTransactionAmount(item), 0);
  const fallbackNet = caseItem.income - caseItem.expense;
  const relatedAssets = assets.filter((item) => item.propertyName === caseItem.name);
  const assetDepreciation = relatedAssets.reduce((sum, item) => sum + item.monthly, 0);
  const caseInvestment = Number(caseItem.companyInvestment || 0);
  const assetInvestment = relatedAssets
    .filter((item) => item.paidBy === "公司" || item.paidBy === "共同分攤")
    .reduce((sum, item) => sum + item.amount, 0);
  const companyInvested = caseInvestment + assetInvestment;
  const netBeforeDepreciation = caseTransactions.length ? transactionNet : fallbackNet;
  const netProfit = netBeforeDepreciation - assetDepreciation;
  const hasInvestment = companyInvested > 0;
  const annualizedRoi = hasInvestment ? (netProfit * 12 / companyInvested) * 100 : null;
  const paybackMonth = netProfit > 0 && hasInvestment ? Math.ceil(companyInvested / netProfit) : null;
  const investmentNote =
    caseItem.investmentSource === "legacy_roi" ? "案件投入由舊 ROI 推算" : hasInvestment ? "案件投入已設定" : "未設定公司投入";
  const userInvestmentNote = caseItem.investmentNote ? `；${caseItem.investmentNote}` : "";

  return {
    name: caseItem.name,
    month: new Date().toISOString().slice(0, 7),
    netProfit,
    annualizedRoi,
    hasInvestment,
    investmentSource: caseItem.investmentSource || "manual",
    assetDepreciation,
    companyInvested,
    paybackMonth,
    note: hasInvestment ? `${investmentNote}${assetDepreciation > 0 ? "，已扣家電折舊" : ""}${userInvestmentNote}` : investmentNote,
  };
}

function getRoiSnapshots() {
  return cases.map(getCaseFinancialSnapshot).sort((a, b) => (b.annualizedRoi ?? -999999) - (a.annualizedRoi ?? -999999));
}

function getModeLabel(mode) {
  return mode === "master_lease" ? "包租代管" : "代租代管";
}

function calculateRoi(income, expense, investment) {
  if (!investment || investment <= 0) return 0;
  return ((income - expense) * 12 / investment) * 100;
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  document.getElementById("view-title").textContent = viewTitles[viewId];
}

function renderDashboardMetrics() {
  const caseCount = cases.length;
  const masterCount = cases.filter((item) => item.mode === "master_lease").length;
  const agencyCount = cases.filter((item) => item.mode === "agency_management").length;
  const roiRows = getRoiSnapshots();
  const investedRows = roiRows.filter((item) => item.annualizedRoi !== null);
  const averageRoi = investedRows.length ? investedRows.reduce((sum, item) => sum + item.annualizedRoi, 0) / investedRows.length : null;
  const netTotal = transactions.reduce((sum, item) => sum + signedTransactionAmount(item), 0);
  const pendingExpense = transactions
    .filter((item) => item.type === "expense" || item.type === "payout")
    .reduce((sum, item) => sum + item.amount, 0);

  const caseCountEl = document.getElementById("metricCaseCount");
  if (!caseCountEl) return;
  caseCountEl.textContent = String(caseCount);
  document.getElementById("metricCaseSplit").textContent = `包租 ${masterCount} / 代租 ${agencyCount}`;
  document.getElementById("metricNetProfit").textContent = formatMoney(netTotal);
  document.getElementById("metricPendingExpense").textContent = formatMoney(pendingExpense);
  document.getElementById("metricAverageRoi").textContent = averageRoi === null ? "未設定" : `${averageRoi.toFixed(1)}%`;
}

function renderRoiList() {
  const snapshotsByName = new Map(getRoiSnapshots().map((item) => [item.name, item]));
  document.getElementById("roiList").innerHTML = cases
    .map((item) => ({ ...item, snapshot: snapshotsByName.get(item.name) }))
    .sort((a, b) => (b.snapshot?.annualizedRoi ?? -999999) - (a.snapshot?.annualizedRoi ?? -999999))
    .map((item) => {
      const roi = item.snapshot?.annualizedRoi ?? null;
      const progressValue = roi === null ? 0 : Math.max(0, Math.min(roi, 60) * 1.5);
      return `
        <div class="roi-row">
          <div>
            <strong>${item.name}</strong>
            <small>${item.modeLabel} / ${item.landlord}</small>
          </div>
          <div class="progress" aria-label="${roi === null ? "未設定" : `${roi.toFixed(1)}%`}"><i style="--value: ${progressValue}%"></i></div>
          <strong>${roi === null ? "未設定" : `${roi.toFixed(1)}%`}</strong>
        </div>
      `;
    })
    .join("");
}

function renderCaseTable(filter = activeFilter, keyword = "") {
  const rows = cases.filter((item) => {
    const matchesFilter = filter === "all" || item.mode === filter;
    const haystack = `${item.name} ${item.landlord} ${item.modeLabel}`.toLowerCase();
    return matchesFilter && haystack.includes(keyword.toLowerCase());
  });

  document.getElementById("caseTable").innerHTML = rows
    .map((item) => {
      const snapshot = getCaseFinancialSnapshot(item);
      return `
        <tr>
          <td><strong>${item.name}</strong></td>
        <td><span class="badge ${statusClass(item.mode)}">${item.modeLabel}</span></td>
        <td>${item.landlord}</td>
        <td>${formatMoney(item.income)}</td>
        <td>${formatMoney(item.expense)}</td>
        <td>${formatMoney(snapshot.companyInvested)}</td>
        <td>${snapshot.annualizedRoi === null ? "未設定" : `${snapshot.annualizedRoi.toFixed(1)}%`}</td>
        <td><span class="badge ${statusClass(item.status)}">${item.statusLabel}</span></td>
        <td><button class="mini-button" onclick="editRecord('case', '${item.name}')">編輯</button></td>
      </tr>
      `;
    })
    .join("");
}

function renderProperties() {
  document.getElementById("propertyGrid").innerHTML = properties
    .map((item) => `
      <article class="property-card">
        <h3>${item.name}</h3>
        <small>${item.layout}</small>
        <div class="card-meta">
          <div><span>模式</span><strong>${item.mode}</strong></div>
          <div><span>狀態</span><strong class="badge ${statusClass(item.status)}">${item.status}</strong></div>
          <div><span>格局圖</span><strong>${item.floorPlan}</strong></div>
        </div>
        <button class="mini-button card-action" onclick="editRecord('property', '${item.name}')">編輯</button>
      </article>
    `)
    .join("");
}

function renderAssets() {
  const summary = document.getElementById("assetSummary");
  const totalMonthly = assets.reduce((sum, item) => sum + item.monthly, 0);
  if (summary) summary.textContent = `每月折舊 ${formatMoney(totalMonthly)}`;
  document.getElementById("assetGrid").innerHTML = assets
    .map((item, index) => `
      <article class="asset-card">
        <h3>${item.assetName}</h3>
        <small>${item.propertyName}</small>
        <div class="card-meta">
          <div><span>類別</span><strong>${item.category}</strong></div>
          <div><span>前置投入</span><strong>${formatMoney(item.amount)}</strong></div>
          <div><span>攤提月數</span><strong>${item.months} 個月</strong></div>
          <div><span>每月折舊</span><strong>${formatMoney(item.monthly)}</strong></div>
          <div><span>出資方</span><strong>${item.paidBy}</strong></div>
        </div>
        <button class="mini-button card-action" onclick="editRecord('asset', '${index}')">編輯</button>
      </article>
    `)
    .join("");
}

function renderRepairs() {
  const board = document.getElementById("repairBoard");
  const summary = document.getElementById("repairSummary");
  if (!board) return;
  const openCount = repairs.filter((item) => item.status !== "completed").length;
  if (summary) summary.textContent = `待處理 ${openCount} 筆`;
  board.innerHTML = repairs
    .map((item, index) => `
      <article class="repair-card">
        <h3>${item.title}</h3>
        <small>${item.caseName}</small>
        <div class="card-meta">
          <div><span>狀態</span><strong class="badge ${statusClass(item.status)}">${item.statusLabel}</strong></div>
          <div><span>優先</span><strong class="badge ${statusClass(item.priority)}">${getRepairPriorityLabel(item.priority)}</strong></div>
          <div><span>預估金額</span><strong>${formatMoney(item.cost)}</strong></div>
          <div><span>格局位置</span><strong>${item.location || "未標記"}</strong></div>
        </div>
        <button class="mini-button card-action" onclick="editRecord('repair', '${index}')">編輯</button>
      </article>
    `)
    .join("");
}

function renderSnapshots() {
  document.getElementById("snapshotGrid").innerHTML = getRoiSnapshots()
    .map((item) => `
      <article class="snapshot-card">
        <h3>${item.name}</h3>
        <small>${item.month}</small>
        <div class="card-meta">
          <div><span>月淨利</span><strong>${formatMoney(item.netProfit)}</strong></div>
          <div><span>家電折舊</span><strong>${formatMoney(item.assetDepreciation)}</strong></div>
          <div><span>公司投入</span><strong>${formatMoney(item.companyInvested)}</strong></div>
          <div><span>年化 ROI</span><strong>${item.annualizedRoi === null ? "未設定" : `${item.annualizedRoi.toFixed(1)}%`}</strong></div>
          <div><span>回本估算</span><strong>${item.paybackMonth ? `第 ${item.paybackMonth} 月` : "尚無"}</strong></div>
          <div><span>備註</span><strong>${item.note}</strong></div>
        </div>
      </article>
    `)
    .join("");
}

function renderTransactions() {
  const target = document.getElementById("transactionTable");
  const summary = document.getElementById("transactionSummary");
  if (!target || !summary) return;

  const sorted = transactions
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.date.localeCompare(a.item.date));
  const total = transactions.reduce((sum, item) => sum + signedTransactionAmount(item), 0);
  summary.textContent = `目前合計 ${formatMoney(total)}`;
  target.innerHTML = sorted
    .map(({ item, index }) => `
      <tr>
        <td>${item.date}</td>
        <td><strong>${item.caseName}</strong></td>
        <td><span class="badge ${statusClass(item.typeLabel)}">${item.typeLabel}</span></td>
        <td>${item.category}</td>
        <td>${formatMoney(signedTransactionAmount(item))}</td>
        <td>${item.note || "-"}</td>
        <td><button class="mini-button" onclick="editRecord('transaction', '${index}')">編輯</button></td>
      </tr>
    `)
    .join("");
}

function renderFloorPlans() {
  const target = document.getElementById("floorPlanList");
  if (!target) return;
  target.innerHTML = floorPlans
    .map((item) => `
      <article class="floorplan-record">
        <div>
          <strong>${item.title}</strong>
          <small>${item.fileName}</small>
        </div>
        <span class="badge">${item.planType}</span>
        <span>${item.visibility}</span>
        <span>${item.markers}</span>
      </article>
    `)
    .join("");
}

function toCsvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportAllData() {
  const rows = [
    ["案件資料"],
    ["案件", "模式", "房東", "月收入", "月支出", "公司投入", "動態月淨利", "動態年化 ROI", "狀態"],
    ...cases.map((item) => {
      const snapshot = getCaseFinancialSnapshot(item);
      return [item.name, item.modeLabel, item.landlord, item.income, item.expense, snapshot.companyInvested, snapshot.netProfit, snapshot.annualizedRoi === null ? "未設定" : `${snapshot.annualizedRoi.toFixed(1)}%`, item.statusLabel];
    }),
    [],
    ["收支紀錄"],
    ["日期", "案件", "類型", "項目", "金額", "備註"],
    ...transactions.map((item) => [item.date, item.caseName, item.typeLabel, item.category, signedTransactionAmount(item), item.note || ""]),
    [],
    ["ROI 快照"],
    ["案件", "月份", "月淨利", "家電折舊", "公司投入", "投入來源", "年化 ROI", "回本估算", "備註"],
    ...getRoiSnapshots().map((item) => [item.name, item.month, item.netProfit, item.assetDepreciation, item.companyInvested, item.investmentSource === "legacy_roi" ? "舊 ROI 推算" : "手動/資料表", item.annualizedRoi === null ? "未設定" : `${item.annualizedRoi.toFixed(1)}%`, item.paybackMonth ? `第 ${item.paybackMonth} 月` : "尚無", item.note]),
    [],
    ["家電與前置投入"],
    ["物件", "品項", "類別", "投入金額", "攤提月數", "每月折舊", "出資方"],
    ...assets.map((item) => [item.propertyName, item.assetName, item.category, item.amount, item.months, item.monthly, item.paidBy]),
    [],
    ["格局圖紀錄"],
    ["名稱", "類型", "權限", "檔名", "標記"],
    ...floorPlans.map((item) => [item.title, item.planType, item.visibility, item.fileName, item.markers]),
    [],
    ["修繕工單"],
    ["案件", "標題", "狀態", "優先", "預估金額", "格局位置"],
    ...repairs.map((item) => [item.caseName, item.title, item.statusLabel, getRepairPriorityLabel(item.priority), item.cost, item.location || ""]),
  ];
  downloadCsv("rental-admin-export.csv", rows);
}

function setDefaultFormValues() {
  const dateInput = document.querySelector('#transactionForm input[name="date"]');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => setView(item.dataset.view));
  });

  document.querySelectorAll("[data-view-link]").forEach((item) => {
    item.addEventListener("click", () => {
      setView(item.dataset.viewLink);
      if (item.dataset.viewLink === "cases") {
        document.getElementById("caseFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    });
  });

  document.getElementById("caseSearch").addEventListener("input", (event) => {
    renderCaseTable(activeFilter, event.target.value);
  });

  document.getElementById("exportButton").addEventListener("click", exportAllData);
  document.getElementById("backupButton").addEventListener("click", exportBackupData);
  document.getElementById("restoreInput").addEventListener("change", (event) => importBackupData(event.currentTarget));
  document.getElementById("resetDataButton").addEventListener("click", resetDemoData);

  document.getElementById("layoutObjectForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createLayoutObject(data.get("objectType"), data.get("objectLabel"));
    event.currentTarget.reset();
  });

  document.getElementById("rotate90Button").addEventListener("click", () => rotateSelectedLayout(90));
  document.getElementById("rotate180Button").addEventListener("click", () => rotateSelectedLayout(180));
  document.getElementById("renameLayoutButton").addEventListener("click", renameSelectedLayout);
  document.getElementById("layoutNameInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      renameSelectedLayout();
    }
  });
  document.getElementById("resetLayoutButton").addEventListener("click", resetLayoutToDefault);
  document.getElementById("deleteLayoutButton").addEventListener("click", deleteSelectedLayout);

  document.getElementById("investmentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const caseName = String(data.get("caseName") || "").trim();
    const companyInvestment = Number(data.get("companyInvestment"));
    const targetCase = cases.find((item) => normalizeName(item.name) === normalizeName(caseName));

    if (!targetCase) {
      document.getElementById("investmentFormNote").textContent = `找不到案件：${caseName}。請確認名稱與案件列表一致。`;
      return;
    }

    targetCase.companyInvestment = companyInvestment;
    targetCase.investmentSource = "manual";
    targetCase.investmentNote = data.get("note") || "";
    saveState();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderRoiList();
    renderSnapshots();
    renderDashboardMetrics();
    document.getElementById("investmentFormNote").textContent = `${caseName} 公司投入已更新為 ${formatMoney(companyInvestment)}。`;
    event.currentTarget.reset();
  });

  document.getElementById("caseEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const originalName = form.originalName.value;
    const targetCase = cases.find((item) => normalizeName(item.name) === normalizeName(originalName));
    if (!targetCase) {
      document.getElementById("caseEditNote").textContent = "找不到要編輯的案件，請重新點選編輯。";
      return;
    }

    const newName = form.name.value.trim();
    targetCase.name = newName;
    targetCase.mode = form.mode.value;
    targetCase.modeLabel = getModeLabel(form.mode.value);
    targetCase.landlord = form.landlord.value.trim();
    targetCase.income = Number(form.income.value);
    targetCase.expense = Number(form.expense.value);
    targetCase.companyInvestment = Number(form.companyInvestment.value);
    targetCase.investmentSource = "manual";

    if (normalizeName(originalName) !== normalizeName(newName)) {
      transactions.forEach((item) => {
        if (normalizeName(item.caseName) === normalizeName(originalName)) item.caseName = newName;
      });
      repairs.forEach((item) => {
        if (normalizeName(item.caseName) === normalizeName(originalName)) item.caseName = newName;
      });
      assets.forEach((item) => {
        if (normalizeName(item.propertyName) === normalizeName(originalName)) item.propertyName = newName;
      });
      floorPlans.forEach((item) => {
        if (normalizeName(item.title).includes(normalizeName(originalName))) item.title = item.title.replace(originalName, newName);
      });
    }

    saveState();
    renderDashboardMetrics();
    renderRoiList();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderTransactions();
    renderAssets();
    renderRepairs();
    renderFloorPlans();
    renderSnapshots();
    renderReferenceOptions();
    document.getElementById("caseEditNote").textContent = `${newName} 已儲存。`;
  });

  document.getElementById("cancelCaseEdit").addEventListener("click", () => {
    document.getElementById("caseEditForm").reset();
    document.getElementById("caseEditNote").textContent = "已取消編輯。";
  });

  document.getElementById("deleteCaseEdit").addEventListener("click", () => {
    const form = document.getElementById("caseEditForm");
    const caseName = form.originalName.value;
    const index = cases.findIndex((item) => normalizeName(item.name) === normalizeName(caseName));
    if (index < 0) {
      document.getElementById("caseEditNote").textContent = "請先從案件列表點選要刪除的案件。";
      return;
    }

    const confirmed = window.confirm(`確定刪除「${cases[index].name}」？相關收支與修繕紀錄也會一起移除。`);
    if (!confirmed) return;

    cases.splice(index, 1);
    transactions = transactions.filter((item) => normalizeName(item.caseName) !== normalizeName(caseName));
    repairs = repairs.filter((item) => normalizeName(item.caseName) !== normalizeName(caseName));
    saveState();
    refreshAllViews();
    form.reset();
    document.getElementById("caseEditNote").textContent = `${caseName} 已刪除，相關收支與修繕已同步移除。`;
  });

  document.getElementById("propertyEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const originalName = form.originalName.value;
    const targetProperty = properties.find((item) => normalizeName(item.name) === normalizeName(originalName));
    if (!targetProperty) {
      document.getElementById("propertyEditNote").textContent = "找不到要編輯的物件，請重新點選編輯。";
      return;
    }

    const newName = form.name.value.trim();
    targetProperty.name = newName;
    targetProperty.layout = form.layout.value.trim();
    targetProperty.mode = form.mode.value;
    targetProperty.status = form.status.value;
    targetProperty.floorPlan = form.floorPlan.value.trim();

    if (normalizeName(originalName) !== normalizeName(newName)) {
      assets.forEach((item) => {
        if (normalizeName(item.propertyName) === normalizeName(originalName)) item.propertyName = newName;
      });
    }

    saveState();
    renderProperties();
    renderAssets();
    renderSnapshots();
    renderDashboardMetrics();
    renderReferenceOptions();
    document.getElementById("propertyEditNote").textContent = `${newName} 已儲存。`;
  });

  document.getElementById("cancelPropertyEdit").addEventListener("click", () => {
    document.getElementById("propertyEditForm").reset();
    document.getElementById("propertyEditNote").textContent = "已取消編輯。";
  });

  document.getElementById("deletePropertyEdit").addEventListener("click", () => {
    const form = document.getElementById("propertyEditForm");
    const propertyName = form.originalName.value;
    const index = properties.findIndex((item) => normalizeName(item.name) === normalizeName(propertyName));
    if (index < 0) {
      document.getElementById("propertyEditNote").textContent = "請先從物件卡片點選要刪除的物件。";
      return;
    }

    const confirmed = window.confirm(`確定刪除「${properties[index].name}」？相關家電 / 前置投入也會一起移除。`);
    if (!confirmed) return;

    properties.splice(index, 1);
    assets = assets.filter((item) => normalizeName(item.propertyName) !== normalizeName(propertyName));
    saveState();
    refreshAllViews();
    form.reset();
    document.getElementById("propertyEditNote").textContent = `${propertyName} 已刪除，相關家電 / 前置投入已同步移除。`;
  });

  document.getElementById("transactionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = data.get("type");
    const amount = Number(data.get("amount"));
    const newTransaction = {
      date: data.get("date"),
      caseName: data.get("caseName"),
      type,
      typeLabel: getTransactionTypeLabel(type),
      category: data.get("category"),
      amount,
      note: data.get("note"),
    };
    transactions.unshift(newTransaction);
    saveState();
    renderTransactions();
    renderRoiList();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderSnapshots();
    renderDashboardMetrics();
    document.getElementById("transactionFormNote").textContent = `${newTransaction.caseName} 已新增 ${newTransaction.typeLabel} ${formatMoney(amount)}。`;
    event.currentTarget.reset();
    setDefaultFormValues();
  });

  document.getElementById("transactionEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const index = Number(form.index.value);
    if (!transactions[index]) return;
    const type = form.type.value;
    transactions[index] = {
      date: form.date.value,
      caseName: form.caseName.value.trim(),
      type,
      typeLabel: getTransactionTypeLabel(type),
      category: form.category.value.trim(),
      amount: Number(form.amount.value),
      note: form.note.value,
    };
    saveState();
    renderTransactions();
    renderRoiList();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderSnapshots();
    renderDashboardMetrics();
    document.getElementById("transactionEditNote").textContent = "收支紀錄已儲存。";
  });

  document.getElementById("cancelTransactionEdit").addEventListener("click", () => {
    document.getElementById("transactionEditForm").reset();
    document.getElementById("transactionEditNote").textContent = "已取消編輯。";
  });

  document.getElementById("deleteTransactionEdit").addEventListener("click", () => {
    const form = document.getElementById("transactionEditForm");
    const index = Number(form.index.value);
    if (!transactions[index]) {
      document.getElementById("transactionEditNote").textContent = "請先從收支明細點選要刪除的紀錄。";
      return;
    }

    const label = `${transactions[index].caseName} / ${transactions[index].category}`;
    const confirmed = window.confirm(`確定刪除「${label}」這筆收支？`);
    if (!confirmed) return;

    transactions.splice(index, 1);
    saveState();
    refreshAllViews();
    form.reset();
    document.getElementById("transactionEditNote").textContent = `${label} 已刪除。`;
  });

  document.getElementById("assetForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const months = Number(data.get("months"));
    const categoryLabels = {
      appliance: "家電",
      furniture: "家具",
      renovation: "裝修",
      cleaning: "清潔",
      other: "其他",
    };
    const newAsset = {
      propertyName: data.get("propertyName"),
      assetName: data.get("assetName"),
      category: categoryLabels[data.get("category")],
      amount,
      months,
      monthly: Math.round(amount / months),
      paidBy: data.get("paidBy"),
    };
    assets.unshift(newAsset);
    saveState();
    renderAssets();
    renderRoiList();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderSnapshots();
    renderDashboardMetrics();
    document.getElementById("assetFormNote").textContent = `${newAsset.propertyName} 已新增 ${newAsset.assetName}，每月折舊 ${formatMoney(newAsset.monthly)}。`;
    event.currentTarget.reset();
  });

  document.getElementById("assetEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const index = Number(form.index.value);
    if (!assets[index]) return;
    const amount = Number(form.amount.value);
    const months = Number(form.months.value);
    assets[index] = {
      propertyName: form.propertyName.value.trim(),
      assetName: form.assetName.value.trim(),
      category: form.category.value,
      amount,
      months,
      monthly: Math.round(amount / months),
      paidBy: form.paidBy.value,
    };
    saveState();
    renderAssets();
    renderRoiList();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderSnapshots();
    renderDashboardMetrics();
    document.getElementById("assetEditNote").textContent = "家電 / 前置投入已儲存。";
  });

  document.getElementById("cancelAssetEdit").addEventListener("click", () => {
    document.getElementById("assetEditForm").reset();
    document.getElementById("assetEditNote").textContent = "已取消編輯。";
  });

  document.getElementById("deleteAssetEdit").addEventListener("click", () => {
    const form = document.getElementById("assetEditForm");
    const index = Number(form.index.value);
    if (!assets[index]) {
      document.getElementById("assetEditNote").textContent = "請先從家電卡片點選要刪除的投入。";
      return;
    }

    const label = `${assets[index].propertyName} / ${assets[index].assetName}`;
    const confirmed = window.confirm(`確定刪除「${label}」這筆家電 / 前置投入？`);
    if (!confirmed) return;

    assets.splice(index, 1);
    saveState();
    refreshAllViews();
    form.reset();
    document.getElementById("assetEditNote").textContent = `${label} 已刪除。`;
  });

  document.getElementById("repairForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const status = data.get("status");
    const newRepair = {
      title: data.get("title"),
      caseName: data.get("caseName"),
      status,
      statusLabel: getRepairStatusLabel(status),
      priority: data.get("priority"),
      cost: Number(data.get("cost")),
      location: data.get("location"),
    };
    repairs.unshift(newRepair);
    saveState();
    renderRepairs();
    document.getElementById("repairFormNote").textContent = `${newRepair.caseName} 已新增修繕工單：${newRepair.title}。`;
    event.currentTarget.reset();
  });

  document.getElementById("repairEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const index = Number(form.index.value);
    if (!repairs[index]) return;
    const status = form.status.value;
    repairs[index] = {
      title: form.title.value.trim(),
      caseName: form.caseName.value.trim(),
      status,
      statusLabel: getRepairStatusLabel(status),
      priority: form.priority.value,
      cost: Number(form.cost.value),
      location: form.location.value,
    };
    saveState();
    renderRepairs();
    document.getElementById("repairEditNote").textContent = "修繕工單已儲存。";
  });

  document.getElementById("cancelRepairEdit").addEventListener("click", () => {
    document.getElementById("repairEditForm").reset();
    document.getElementById("repairEditNote").textContent = "已取消編輯。";
  });

  document.getElementById("deleteRepairEdit").addEventListener("click", () => {
    const form = document.getElementById("repairEditForm");
    const index = Number(form.index.value);
    if (!repairs[index]) {
      document.getElementById("repairEditNote").textContent = "請先從修繕卡片點選要刪除的工單。";
      return;
    }

    const label = `${repairs[index].caseName} / ${repairs[index].title}`;
    const confirmed = window.confirm(`確定刪除「${label}」這筆修繕工單？`);
    if (!confirmed) return;

    repairs.splice(index, 1);
    saveState();
    refreshAllViews();
    form.reset();
    document.getElementById("repairEditNote").textContent = `${label} 已刪除。`;
  });

  document.getElementById("addCaseButton").addEventListener("click", () => {
    setView("cases");
    document.getElementById("caseFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("caseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const income = Number(data.get("income"));
    const expense = Number(data.get("expense"));
    const investment = Number(data.get("investment"));
    const mode = data.get("mode");
    const newCase = {
      name: data.get("name"),
      mode,
      modeLabel: getModeLabel(mode),
      landlord: data.get("landlord"),
      income,
      expense,
      roi: calculateRoi(income, expense, investment),
      companyInvestment: investment,
      investmentSource: "manual",
      status: "active",
      statusLabel: "示範新增",
    };
    cases.unshift(newCase);
    saveState();
    renderCaseTable(activeFilter, document.getElementById("caseSearch").value);
    renderRoiList();
    renderSnapshots();
    renderDashboardMetrics();
    renderReferenceOptions();
    const snapshot = getCaseFinancialSnapshot(newCase);
    document.getElementById("caseFormNote").textContent = `${newCase.name} 已保存到本機，公司投入 ${formatMoney(investment)}，動態年化 ROI ${snapshot.annualizedRoi === null ? "未設定" : `${snapshot.annualizedRoi.toFixed(1)}%`}。`;
    event.currentTarget.reset();
  });

  document.getElementById("floorPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    const planTypeLabels = {
      "2d": "2D 平面圖",
      pseudo_3d: "類 3D 格局圖",
      furniture_layout: "家具配置圖",
      after_renovation: "裝修後",
      utility_layout: "水電管線圖",
    };
    const visibilityLabels = {
      internal: "僅內部",
      landlord: "房東可看",
      tenant: "房客可看",
      public: "公開",
    };
    floorPlans.unshift({
      title: data.get("title"),
      planType: planTypeLabels[data.get("planType")],
      visibility: visibilityLabels[data.get("visibility")],
      fileName: file?.name || "尚未選擇檔案",
      markers: "尚未標記",
    });
    const replaced = replaceFloorPlanWithImage(file);
    saveState();
    renderFloorPlans();
    document.getElementById("floorPlanNote").textContent = replaced
      ? "平面圖已置換為目前格局圖背景，可再用配置工具新增家具、門窗與房間區塊。"
      : "格局圖紀錄已保存到本機。若要直接置換格局圖，請選擇 JPG、PNG、WEBP 等圖片檔。";
    event.currentTarget.reset();
  });
}

renderDashboardMetrics();
saveState();
renderRoiList();
renderCaseTable();
renderProperties();
renderAssets();
renderRepairs();
renderSnapshots();
renderFloorPlans();
renderTransactions();
renderReferenceOptions();
setDefaultFormValues();
bindEvents();
captureDefaultLayoutState();
restoreLayoutState();
enableLayoutDragging();
updateLayoutToolbar();















