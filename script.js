document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartTableBody = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');


    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h4').innerText;
            const productPrice = parseFloat(productItem.querySelector('p').innerText.replace('LKR ', '').replace(' per kg', '').replace(' per unit', ''));
            const productQuantityInput = productItem.querySelector('input[type="number"]');
            const productQuantity = parseFloat(productQuantityInput.value);

            if (productQuantity > 0) {
                addItemToCart(productName, productPrice, productQuantity);
                productQuantityInput.value = '';
            } else {
                alert('Please enter a valid quantity!');
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
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
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

        //  THE REMOVE BUTTON//
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemIndex = button.getAttribute('data-index');
                cartItems.splice(itemIndex, 1);
                updateCartTable();
            });
        });
    }


    // ADD TO FAV//


    document.getElementById('save-favourite-btn').addEventListener('click', () => {
        localStorage.setItem('favouriteOrder', JSON.stringify(cartItems));
        alert('Order saved as favourite.');
    });


    //APPPLY FAV//


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
