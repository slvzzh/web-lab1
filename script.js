// Товары
const products = [
    { id: 1, name: 'Мыло', price: 1000, img: 'images/Хоз мыло 65.jpg' },
    { id: 2, name: 'Пряники', price: 2000, img: 'images/praniki.png' },
    { id: 3, name: 'Молоко 1 л.', price: 3000, img: 'images/milk.jpg' },
    { id: 4, name: 'Яица 10 шт.', price: 4000, img: 'images/eggs.jpeg' },
    { id: 5, name: 'Курица филе 1 кг.', price: 5000, img: 'images/chick.jpeg' },
    { id: 6, name: 'Фарш говяжий 450 гр.', price: 6000, img: 'images/mince.jpg' },
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Элементы
const productsContainer = document.getElementById('products');
const cartModal = document.getElementById('cart-modal');
const orderModal = document.getElementById('order-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

// Отрисовка товаров
function renderProducts() {
    productsContainer.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price} ₽</p>
            <button onclick="addToCart(${p.id})">Добавить в корзину</button>
        </div>
    `).join('');
}

// Добавление в корзину
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Обновление корзины
function updateCart() {
    // Сохраняем в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Обновляем счётчик
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    // Отрисовка корзины
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} — ${item.price} ₽</span>
                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            </div>
        `).join('');
    }

    // Итоговая сумма
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = total;
}

// Изменение количества
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
    }
}

// Удаление из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Открытие/закрытие модальных окон
document.getElementById('cart-btn').addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

document.getElementById('close-cart').addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    cartModal.classList.add('hidden');
    orderModal.classList.remove('hidden');
});

document.getElementById('close-order').addEventListener('click', () => {
    orderModal.classList.add('hidden');
});

// Оформление заказа
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Заказ создан!');
    cart = [];
    updateCart();
    orderModal.classList.add('hidden');
    e.target.reset();
});

// Инициализация
renderProducts();
updateCart();