const foods = [
    {
        id:1,
        name:"Margherita Pizza",
        category:"Pizza",
        price:249,
        icon:"🍕"
    },
    {
        id:2,
        name:"Chicken Pizza",
        category:"Pizza",
        price:349,
        icon:"🍕"
    },
    {
        id:3,
        name:"Cheese Burger",
        category:"Burger",
        price:179,
        icon:"🍔"
    },
    {
        id:4,
        name:"Chicken Burger",
        category:"Burger",
        price:229,
        icon:"🍔"
    },
    {
        id:5,
        name:"Biryani",
        category:"Indian",
        price:199,
        icon:"🍛"
    },
    {
        id:6,
        name:"Paneer Tikka",
        category:"Indian",
        price:219,
        icon:"🥘"
    },
    {
        id:7,
        name:"Masala Dosa",
        category:"Indian",
        price:129,
        icon:"🥞"
    },
    {
        id:8,
        name:"Cold Drink",
        category:"Drinks",
        price:59,
        icon:"🥤"
    }
];

let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

const foodContainer = document.getElementById("foodContainer");
const cartItems = document.getElementById("cartItems");
const search = document.getElementById("search");
const category = document.getElementById("category");

function displayFoods(){
    const searchText = search.value.toLowerCase();
    const selectedCategory = category.value;

    const filteredFoods = foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchText);
        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    foodContainer.innerHTML = "";

    filteredFoods.forEach(food => {
        foodContainer.innerHTML += `
            <div class="food-card">
                <div class="food-image">${food.icon}</div>
                <h3>${food.name}</h3>
                <p>${food.category}</p>
                <div class="price">₹${food.price}</div>
                <button class="btn" onclick="addToCart(${food.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(id){
    const existingItem = cart.find(item => item.id === id);

    if(existingItem){
        existingItem.quantity++;
    }else{
        const food = foods.find(item => item.id === id);

        cart.push({
            ...food,
            quantity:1
        });
    }

    saveCart();
    displayCart();
}

function removeFromCart(id){
    cart = cart.filter(item => item.id !== id);

    saveCart();
    displayCart();
}

function changeQuantity(id, change){
    const item = cart.find(item => item.id === id);

    if(item){
        item.quantity += change;

        if(item.quantity <= 0){
            removeFromCart(id);
            return;
        }
    }

    saveCart();
    displayCart();
}

function displayCart(){
    cartItems.innerHTML = "";

    if(cart.length === 0){
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    let subtotal = 0;
    let count = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.icon} ${item.name}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div class="cart-controls">
                    <button onclick="changeQuantity(${item.id},-1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id},1)">+</button>
                    <button onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });

    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + delivery;

    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("delivery").textContent = delivery;
    document.getElementById("total").textContent = total;
    document.getElementById("cartCount").textContent = count;
}

function saveCart(){
    localStorage.setItem("foodCart", JSON.stringify(cart));
}

function openOrderForm(){
    if(cart.length === 0){
        alert("Please add some food to your cart first.");
        return;
    }

    document.getElementById("orderModal").style.display = "flex";
}

function closeOrderForm(){
    document.getElementById("orderModal").style.display = "none";
}

document.getElementById("orderForm").addEventListener("submit", function(event){
    event.preventDefault();

    const name = document.getElementById("name").value;
    const payment = document.getElementById("payment").value;
    const total = document.getElementById("total").textContent;

    alert(
        "Order placed successfully! 🎉\n\n" +
        "Customer: " + name + "\n" +
        "Payment: " + payment + "\n" +
        "Total: ₹" + total
    );

    cart = [];
    saveCart();
    displayCart();
    closeOrderForm();
    this.reset();
});

search.addEventListener("input", displayFoods);
category.addEventListener("change", displayFoods);

displayFoods();
displayCart();