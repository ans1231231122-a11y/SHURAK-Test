/**
 * شُرَاك | SHURAK - Frontend Logic
 * النسخة الأولية: بيانات تجريبية + سلة محلية + هيكل Firebase
 */

// ========== بيانات تجريبية ==========
const DEMO_PRODUCTS = [
  {
    id: "p1",
    name: "سماعة لاسلكية",
    description: "حالة ممتازة، استخدام خفيف",
    price: 75,
    category: "إلكترونيات",
    emoji: "🎧",
    status: "available"
  },
  {
    id: "p2",
    name: "ساعة ذكية",
    description: "ساعة بحالة ممتازة مع الشاحن",
    price: 120,
    category: "إلكترونيات",
    emoji: "⌚",
    status: "available"
  },
  {
    id: "p3",
    name: "كتاب رياضيات متقدمة",
    description: "طبعة حديثة، نظيف جداً",
    price: 25,
    category: "كتب",
    emoji: "📚",
    status: "available"
  },
  {
    id: "p4",
    name: "حذاء رياضي Nike",
    description: "مقاس 42، شبه جديد",
    price: 180,
    category: "أزياء",
    emoji: "👟",
    status: "available"
  },
  {
    id: "p5",
    name: "جهاز تحكم ألعاب",
    description: "متوافق مع PC وPS",
    price: 95,
    category: "ألعاب",
    emoji: "🎮",
    status: "available"
  },
  {
    id: "p6",
    name: "تيشيرت جامعي",
    description: "مقاس L، قطن 100%",
    price: 45,
    category: "أزياء",
    emoji: "👕",
    status: "available"
  },
  {
    id: "p7",
    name: "سماعات رأس احترافية",
    description: "عزل صوت ممتاز",
    price: 210,
    category: "إلكترونيات",
    emoji: "🎧",
    status: "available"
  },
  {
    id: "p8",
    name: "رواية أدبية",
    description: "حالة جيدة جداً",
    price: 18,
    category: "كتب",
    emoji: "📖",
    status: "available"
  }
];

const CATEGORIES = [
  { id: "إلكترونيات", name: "إلكترونيات", icon: "📱" },
  { id: "أزياء", name: "أزياء", icon: "👕" },
  { id: "كتب", name: "كتب", icon: "📚" },
  { id: "ألعاب", name: "ألعاب", icon: "🎮" },
  { id: "أخرى", name: "أخرى", icon: "📦" }
];

// ========== حالة التطبيق ==========
let cart = JSON.parse(localStorage.getItem("shurak_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("shurak_user") || "null");
let currentFilter = "all";

// ========== تهيئة ==========
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  updateCartUI();
  updateAuthUI();
  bindEvents();
});

// ========== عرض الأقسام ==========
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-category="${cat.id}">
      <div class="category-icon">${cat.icon}</div>
      <h3>${cat.name}</h3>
    </div>
  `).join("");

  grid.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      currentFilter = cat;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      const matchBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
      if (matchBtn) matchBtn.classList.add("active");
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ========== عرض المنتجات ==========
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  let list = DEMO_PRODUCTS;

  if (currentFilter !== "all") {
    list = list.filter(p => p.category === currentFilter);
  }

  const searchTerm = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  if (searchTerm) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px;color:#5A6A7A;">لا توجد منتجات مطابقة</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">${p.emoji}</div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div class="product-price">${p.price} <span>ريال</span></div>
          <button class="btn-add" data-id="${p.id}">أضف للسلة</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

// ========== السلة ==========
function addToCart(productId) {
  const product = DEMO_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem("shurak_cart", JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");
  const itemsEl = document.getElementById("cartItems");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalQty;

  totalEl.textContent = getCartTotal() + " ريال";

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart">السلة فارغة<br><small>أضف منتجات لتبدأ التسوق</small></div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.emoji} ${item.name}</div>
        <div class="cart-item-price">${item.price} ريال</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          <button class="cart-item-remove" data-id="${item.id}">حذف</button>
        </div>
      </div>
    </div>
  `).join("");

  itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      changeQty(id, action === "inc" ? 1 : -1);
    });
  });

  itemsEl.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
}

function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

// ========== المصادقة (محاكاة + جاهز لـ Firebase) ==========
function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const accountBtn = document.getElementById("accountBtn");

  if (currentUser) {
    loginBtn.classList.add("hidden");
    accountBtn.classList.remove("hidden");
    document.getElementById("userName").textContent = currentUser.name?.split(" ")[0] || "حسابي";
    if (currentUser.photoURL) {
      document.getElementById("userAvatar").src = currentUser.photoURL;
    }
  } else {
    loginBtn.classList.remove("hidden");
    accountBtn.classList.add("hidden");
  }
}

function simulateGoogleLogin() {
  // محاكاة تسجيل الدخول (في الإنتاج يُستبدل بـ Firebase Auth)
  const mockUser = {
    uid: "demo_" + Date.now(),
    name: "أحمد الطالب",
    email: "ahmed.student@gmail.com",
    photoURL: "https://ui-avatars.com/api/?name=Ahmed&background=1E6BFF&color=fff&size=128",
    phone: "",
    city: "",
    address: "",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  currentUser = mockUser;
  localStorage.setItem("shurak_user", JSON.stringify(mockUser));
  updateAuthUI();
  alert("تم تسجيل الدخول بنجاح (نسخة تجريبية).\nفي النسخة الحقيقية سيتم استخدام Firebase Authentication مع Google.");
}

function logout() {
  currentUser = null;
  localStorage.removeItem("shurak_user");
  updateAuthUI();
  closeAccountModal();
}

function openAccountModal() {
  if (!currentUser) return;
  document.getElementById("accountAvatar").src = currentUser.photoURL || "";
  document.getElementById("accountName").textContent = currentUser.name || "—";
  document.getElementById("accountEmail").textContent = currentUser.email || "—";
  document.getElementById("userPhone").value = currentUser.phone || "";
  document.getElementById("userCity").value = currentUser.city || "";
  document.getElementById("userAddress").value = currentUser.address || "";
  document.getElementById("accountModal").classList.remove("hidden");
}

function closeAccountModal() {
  document.getElementById("accountModal").classList.add("hidden");
}

function saveProfile() {
  if (!currentUser) return;
  currentUser.phone = document.getElementById("userPhone").value.trim();
  currentUser.city = document.getElementById("userCity").value.trim();
  currentUser.address = document.getElementById("userAddress").value.trim();
  localStorage.setItem("shurak_user", JSON.stringify(currentUser));
  alert("تم حفظ التعديلات");
  closeAccountModal();
}

// ========== الطلبات (أساسي) ==========
function checkout() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }
  if (!currentUser) {
    alert("يجب تسجيل الدخول أولاً لإتمام الطلب");
    simulateGoogleLogin();
    return;
  }

  const order = {
    id: "ORD-" + Date.now(),
    userId: currentUser.uid,
    items: [...cart],
    total: getCartTotal(),
    status: "جديد",
    createdAt: new Date().toISOString()
  };

  // في الإنتاج: حفظ في Firestore
  console.log("طلب جديد:", order);
  alert(`تم إنشاء الطلب بنجاح!\nرقم الطلب: ${order.id}\nالإجمالي: ${order.total} ريال\n\n(في النسخة الحقيقية يُحفظ في Firebase)`);

  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

// ========== ربط الأحداث ==========
function bindEvents() {
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("loginBtn").addEventListener("click", simulateGoogleLogin);
  document.getElementById("accountBtn").addEventListener("click", openAccountModal);
  document.getElementById("closeAccount").addEventListener("click", closeAccountModal);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);

  document.getElementById("checkoutBtn").addEventListener("click", checkout);

  // فلترة
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.category;
      renderProducts();
    });
  });

  // بحث
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  searchInput.addEventListener("input", () => renderProducts());
  searchBtn.addEventListener("click", () => renderProducts());
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") renderProducts();
  });
}

// ========== جاهز للربط مع Firebase لاحقاً ==========
// عند تفعيل Firebase:
// 1. استبدل simulateGoogleLogin بـ signInWithPopup(auth, googleProvider)
// 2. استمع لـ onAuthStateChanged
// 3. احفظ/اقرأ المنتجات والطلبات من Firestore
// 4. اربط السلة بحساب المستخدم
