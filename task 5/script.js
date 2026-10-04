// Product data stored as JavaScript objects

const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        price: 499,
        icon: "👕",
        description: "Comfortable cotton t-shirt for everyday wear."
    },
    {
        id: 2,
        name: "Running Shoes",
        price: 999,
        icon: "👟",
        description: "Lightweight shoes designed for daily workouts."
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 1499,
        icon: "⌚",
        description: "Track your activity and stay connected."
    },
    {
        id: 4,
        name: "Backpack",
        price: 799,
        icon: "🎒",
        description: "Stylish and spacious backpack for daily use."
    },
    {
        id: 5,
        name: "Headphones",
        price: 1299,
        icon: "🎧",
        description: "Enjoy clear sound with comfortable ear cushions."
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 599,
        icon: "🕶️",
        description: "Trendy sunglasses for a stylish look."
    }
];


// Cart array

let cart = [];


// Get HTML elements

const productContainer = document.getElementById("productContainer");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");
const closeModal = document.getElementById("closeModal");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");

const checkoutSummary = document.getElementById("checkoutSummary");
const placeOrderBtn = document.getElementById("placeOrderBtn");


// Display products

function displayProducts() {

    productContainer.innerHTML = "";

    products.forEach(function(product) {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-icon">
                ${product.icon}
            </div>

            <h3>${product.name}</h3>

            <p class="product-description">
                ${product.description}
            </p>

            <div class="product-price">
                ₹${product.price}
            </div>

            <button
                class="add-cart-btn"
                onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productContainer.appendChild(productCard);
    });
}


// Add product to cart

function addToCart(productId) {

    const product = products.find(function(item) {
        return item.id === productId;
    });

    cart.push(product);

    updateCart();

    alert(`${product.name} added to cart!`);
}


// Update cart

function updateCart() {

    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "0";

        return;
    }


    cart.forEach(function(product, index) {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-info">

                <span class="cart-item-icon">
                    ${product.icon}
                </span>

                <div>
                    <div class="cart-item-name">
                        ${product.name}
                    </div>

                    <div class="cart-item-price">
                        ₹${product.price}
                    </div>
                </div>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(${index})">
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);
    });


    calculateTotal();
}


// Calculate total price

function calculateTotal() {

    const total = cart.reduce(function(sum, product) {

        return sum + product.price;

    }, 0);

    cartTotal.textContent = total;
}


// Remove product from cart

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// Open cart

cartBtn.addEventListener("click", function() {

    cartModal.style.display = "flex";

    updateCart();
});


// Close cart

closeModal.addEventListener("click", function() {

    cartModal.style.display = "none";
});


// Checkout button

checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty. Add a product first.");

        return;
    }


    const total = cart.reduce(function(sum, product) {

        return sum + product.price;

    }, 0);


    checkoutSummary.textContent =
        `You have ${cart.length} item(s) in your cart. Total amount: ₹${total}`;

    cartModal.style.display = "none";

    checkoutModal.style.display = "flex";
});


// Close checkout

closeCheckout.addEventListener("click", function() {

    checkoutModal.style.display = "none";
});


// Place order

placeOrderBtn.addEventListener("click", function() {

    alert("🎉 Order placed successfully!");

    cart = [];

    updateCart();

    checkoutModal.style.display = "none";
});


// Close modal when clicking outside

window.addEventListener("click", function(event) {

    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }

    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }

});


// Load products when page opens

displayProducts();