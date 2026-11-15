const CATEGORIES = {
  expense: ["Food & Dining","Transport","Shopping","Bills & Utilities","Entertainment","Health","Education","Other"],
  income: ["Salary","Freelance","Business","Investment","Gift","Other"]
};
const COLORS = ["#58a77f","#e4b16e","#719bc4","#b38acb","#df8277","#8eaaa0","#d5c66d","#8b91bd"];
const SYMBOLS = {"Food & Dining":"⌂","Transport":"↗","Shopping":"◇","Bills & Utilities":"▤","Entertainment":"♫","Health":"＋","Education":"▣","Salary":"₹","Freelance":"✦","Business":"▥","Investment":"↗","Gift":"♡","Other":"•"};
const $ = id => document.getElementById(id);
let transactions = [];
let activeType = "expense";
let showAll = false;
let toastTimer;

function loadData() {
  try { transactions = JSON.parse(localStorage.getItem("smartLedgerTransactions") || "[]"); }
  catch { transactions = []; }
}
function saveData() { localStorage.setItem("smartLedgerTransactions", JSON.stringify(transactions)); }
function money(value) {
  return new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value || 0);
}
function dateLabel(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}
function updateSummary() {
  const income = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  $("balanceAmount").textContent = money(income-expense);
  $("incomeAmount").textContent = money(income);
  $("expenseAmount").textContent = money(expense);
  $("donutTotal").textContent = money(expense);
}
function renderTransactions() {
  const query = $("searchInput").value.trim().toLowerCase();
  const type = $("typeFilter").value;
  const category = $("categoryFilter").value;
  const filtered = transactions.filter(t =>
    (type==="all" || t.type===type) &&
    (category==="all" || t.category===category) &&
    (t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query) || (t.note||"").toLowerCase().includes(query))
  ).sort((a,b)=>b.date.localeCompare(a.date) || b.createdAt-a.createdAt);
  const visible = showAll ? filtered : filtered.slice(0,5);
  $("transactionBody").innerHTML = visible.map(t => `
    <tr>
      <td><div class="transaction-name"><span class="transaction-symbol ${t.type}">${SYMBOLS[t.category]||"•"}</span><span>${escapeHTML(t.title)}</span></div></td>
      <td><span class="category-pill">${escapeHTML(t.category)}</span></td>
      <td>${dateLabel(t.date)}</td>
      <td class="amount-cell ${t.type}">${t.type==="income"?"+":"−"} ${money(t.amount)}</td>
      <td><div class="row-actions"><button class="icon-btn" data-edit="${t.id}" aria-label="Edit ${escapeHTML(t.title)}">Edit</button><button class="icon-btn" data-delete="${t.id}" aria-label="Delete ${escapeHTML(t.title)}">Delete</button></div></td>
    </tr>`).join("");
  $("emptyState").classList.toggle("show", filtered.length===0);
  $("viewAllBtn").textContent = showAll ? "Show less ↑" : "View all →";
}
function renderCategoryFilter() {
  const current = $("categoryFilter").value || "all";
  const cats = [...new Set(transactions.map(t=>t.category))].sort();
  $("categoryFilter").innerHTML = '<option value="all">All categories</option>' + cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $("categoryFilter").value = cats.includes(current) ? current : "all";
}
function renderCategories() {
  const totals = {};
  transactions.filter(t=>t.type==="expense").forEach(t=>totals[t.category]=(totals[t.category]||0)+t.amount);
  const entries = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const total = entries.reduce((s,e)=>s+e[1],0);
  if (!total) {
    $("donutChart").style.background = "conic-gradient(#e7eee9 0 100%)";
    $("categoryList").innerHTML = '<p class="empty-note">Add expenses to see your breakdown.</p>';
    return;
  }
  let cursor=0;
  const segments=entries.map(([name,value],i)=>{
    const start=cursor; cursor += value/total*100;
    return `${COLORS[i%COLORS.length]} ${start}% ${cursor}%`;
  });
  $("donutChart").style.background=`conic-gradient(${segments.join(",")})`;
  $("categoryList").innerHTML=entries.slice(0,5).map(([name,value],i)=>`
    <div class="category-row"><i class="category-color" style="background:${COLORS[i%COLORS.length]}"></i><span>${escapeHTML(name)}</span><strong>${Math.round(value/total*100)}%</strong></div>`).join("");
}
function renderChart() {
  const months = Number($("chartPeriod").value);
  const now = new Date();
  const data=[];
  for(let i=months-1;i>=0;i--){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const income=transactions.filter(t=>t.type==="income"&&t.date.startsWith(key)).reduce((s,t)=>s+t.amount,0);
    const expense=transactions.filter(t=>t.type==="expense"&&t.date.startsWith(key)).reduce((s,t)=>s+t.amount,0);
    data.push({label:d.toLocaleDateString("en-IN",{month:"short"}),income,expense});
  }
  const max=Math.max(1,...data.flatMap(d=>[d.income,d.expense]));
  $("barChart").innerHTML=data.map(d=>`
    <div class="bar-group"><div class="bars" title="${d.label}: Income ${money(d.income)}, expenses ${money(d.expense)}">
      <div class="bar income" style="height:${Math.max(d.income?3:0,d.income/max*100)}%"></div>
      <div class="bar expense" style="height:${Math.max(d.expense?3:0,d.expense/max*100)}%"></div>
    </div><span class="bar-label">${d.label}</span></div>`).join("");
}
function renderAll() {
  updateSummary(); renderCategoryFilter(); renderTransactions(); renderCategories(); renderChart();
}
function populateCategories(type, selected="") {
  $("categoryInput").innerHTML=CATEGORIES[type].map(c=>`<option value="${c}">${c}</option>`).join("");
  if(selected && CATEGORIES[type].includes(selected)) $("categoryInput").value=selected;
}
function openModal(transaction=null) {
  $("transactionForm").reset();
  $("formError").textContent="";
  $("editId").value=transaction?.id||"";
  activeType=transaction?.type||"expense";
  $("transactionType").value=activeType;
  document.querySelectorAll(".type-option").forEach(b=>b.classList.toggle("selected",b.dataset.type===activeType));
  populateCategories(activeType,transaction?.category);
  $("modalTitle").textContent=transaction?"Edit transaction":"Add transaction";
  $("saveBtn").textContent=transaction?"Update transaction":"Save transaction";
  $("titleInput").value=transaction?.title||"";
  $("amountInput").value=transaction?.amount||"";
  $("dateInput").value=transaction?.date||new Date().toISOString().slice(0,10);
  $("noteInput").value=transaction?.note||"";
  $("modalBackdrop").classList.add("open");
  $("modalBackdrop").setAttribute("aria-hidden","false");
  setTimeout(()=>$("titleInput").focus(),50);
}
function closeModal() {
  $("modalBackdrop").classList.remove("open");
  $("modalBackdrop").setAttribute("aria-hidden","true");
}
function notify(message) {
  $("toast").textContent=message; $("toast").classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2400);
}
function submitTransaction(event) {
  event.preventDefault();
  const title=$("titleInput").value.trim();
  const amount=Number($("amountInput").value);
  const date=$("dateInput").value;
  if(!title || !Number.isFinite(amount) || amount<=0 || !date) {
    $("formError").textContent="Please enter a title, valid amount and date."; return;
  }
  const id=$("editId").value;
  const item={id:id||`${Date.now()}-${Math.random().toString(16).slice(2)}`,title,amount,type:activeType,date,category:$("categoryInput").value,note:$("noteInput").value.trim(),createdAt:Date.now()};
  if(id) transactions=transactions.map(t=>t.id===id?{...item,createdAt:t.createdAt}:t);
  else transactions.push(item);
  saveData(); renderAll(); closeModal(); notify(id?"Transaction updated":"Transaction added successfully");
}
function handleTableClick(event) {
  const edit=event.target.closest("[data-edit]");
  const del=event.target.closest("[data-delete]");
  if(edit){const item=transactions.find(t=>t.id===edit.dataset.edit);if(item)openModal(item);}
  if(del){
    const item=transactions.find(t=>t.id===del.dataset.delete);
    if(item && confirm(`Delete "${item.title}"?`)){
      transactions=transactions.filter(t=>t.id!==item.id);saveData();renderAll();notify("Transaction deleted");
    }
  }
}
function init() {
  loadData();
  $("todayLabel").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  populateCategories("expense");
  renderAll();
  ["openModalTop","emptyAddBtn"].forEach(id=>$(id).addEventListener("click",()=>openModal()));
  ["closeModal","cancelModal"].forEach(id=>$(id).addEventListener("click",closeModal));
  $("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal();});
  $("transactionForm").addEventListener("submit",submitTransaction);
  $("transactionBody").addEventListener("click",handleTableClick);
  $("searchInput").addEventListener("input",renderTransactions);
  $("typeFilter").addEventListener("change",renderTransactions);
  $("categoryFilter").addEventListener("change",renderTransactions);
  $("chartPeriod").addEventListener("change",renderChart);
  $("viewAllBtn").addEventListener("click",()=>{showAll=!showAll;renderTransactions();});
  document.querySelectorAll(".type-option").forEach(btn=>btn.addEventListener("click",()=>{
    activeType=btn.dataset.type;$("transactionType").value=activeType;
    document.querySelectorAll(".type-option").forEach(b=>b.classList.toggle("selected",b===btn));
    populateCategories(activeType);
  }));
  $("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>$("sidebar").classList.remove("open")));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
}
document.addEventListener("DOMContentLoaded",init);
