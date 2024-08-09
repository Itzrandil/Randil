const paymentSelect = document.getElementById('payment');
const paymentInfoDiv = document.getElementById('payment-info');
const checkOutBtn = document.getElementById('checkOut');
const clearBtn = document.getElementById('clearBtn');
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const contactInput = document.getElementById('contact');
const emailInput = document.getElementById('email');
const deliverySelect = document.getElementById('delivery');

function validateForm() {
    return (
        nameInput.value.trim() !== '' &&
        addressInput.value.trim() !== '' &&
        contactInput.value.trim() !== '' &&
        emailInput.value.trim() !== '' &&
        deliverySelect.value !== ''
    );
}

paymentSelect.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'cash') {
        paymentInfoDiv.innerHTML = 'Please have the amount ready when the products are delivered.';
    } else if (selectedValue === 'card') {
        paymentInfoDiv.innerHTML = `
            <label for="card-number">Card Number : </label>
            <input type="text" id="card-number" placeholder="Enter your card number">
            <label for="card-expiry">Card Expiry : </label>
            <input type="text" id="card-expiry" placeholder="Enter your card expiry">
            <label for="card-cvv">Card CVV : </label>
            <input type="text" id="card-cvv" placeholder="Enter your card CVV">
        `;
    }
});

checkOutBtn.addEventListener('click', () => {
    if (!validateForm()) {
        alert('Error: Please fill out all required fields.');
        return;
    }

    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 3));
    const formattedDeliveryDate = deliveryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    alert(`Thank you for your purchase! Your order will be delivered on ${formattedDeliveryDate}.`);
});

clearBtn.addEventListener('click', () => {
    nameInput.value = '';
    addressInput.value = '';
    contactInput.value = '';
    emailInput.value = '';
    deliverySelect.selectedIndex = 0;
    paymentSelect.selectedIndex = 0;
    paymentInfoDiv.innerHTML = '';
});+

document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartTableBody = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Add event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h4').innerText;
            const productPrice = parseFloat(productItem.querySelector('p').innerText.replace('LKR ', '').replace(' per kg', '').replace(' per unit', ''));
            const productQuantityInput = productItem.querySelector('input[type="number"]');
            const productQuantity = parseFloat(productQuantityInput.value);

            if (productQuantity > 0) {
                addItemToCart(productName, productPrice, productQuantity);
                productQuantityInput.value = ''; // Clear the input field
            } else {
                alert('Please enter a valid quantity.');
            }
        });
    });

    function addItemToCart(name, price, quantity) {
        const existingItemIndex = cartItems.findIndex(item => item.name === name);
        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({ name, price, quantity });
        }
        updateCartTable();
    }

    function updateCartTable() {
        cartTableBody.innerHTML = '';
        let totalPrice = 0;

        cartItems.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>LKR ${itemTotalPrice.toFixed(2)}</td>
                <td><button class="remove-item-btn" data-index="${index}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        totalPriceElement.innerText = `LKR ${totalPrice.toFixed(2)}`;

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemIndex = button.getAttribute('data-index');
                cartItems.splice(itemIndex, 1);
                updateCartTable();
            });
        });
    }

    document.getElementById('save-favourite-btn').addEventListener('click', () => {
        localStorage.setItem('favouriteOrder', JSON.stringify(cartItems));
        alert('Order saved as favourite.');
    });

    document.getElementById('apply-favourite-btn').addEventListener('click', () => {
        const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder'));
        if (favouriteOrder) {
            cartItems.length = 0;
            cartItems.push(...favouriteOrder);
            updateCartTable();
        } else {
            alert('No favourite order found.');
        }
    });
});

// for the table summary part//
document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryTableBody = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');

    // Retrieve the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        // If there are no items in the cart, display a message
        orderSummaryTableBody.innerHTML = `
            <tr>
                <td colspan="3">No items in the order summary.</td>
            </tr>
        `;
        totalPriceElement.innerText = 'LKR 0.00';
    } else {
        let totalPrice = 0;

        // Populate the order summary table with cart items
        cartItems.forEach((item) => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>LKR ${itemTotalPrice.toFixed(2)}</td>
            `;
            orderSummaryTableBody.appendChild(row);
        });

        totalPriceElement.innerText = `LKR ${totalPrice.toFixed(2)}`;
    }
});
