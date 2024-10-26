let totalPrice = 0;
let chart;
const categories = ['vegetables', 'fruits', 'drinks', 'snacks', 'groceries'];


document.addEventListener('DOMContentLoaded', loadGroceryList);

document.getElementById('add-button').addEventListener('click', function() {
    const productInput = document.getElementById('product-input');
    const categorySelect = document.getElementById('category-select');
    const quantityInput = document.getElementById('quantity-input');
    const unitSelect = document.getElementById('unit-select');
    const priceInput = document.getElementById('price-input');

    const productName = productInput.value.trim();
    const category = categorySelect.value;
    const quantity = parseFloat(quantityInput.value.trim());
    const unit = unitSelect.value;
    const price = parseFloat(priceInput.value.trim());

    if (productName && !isNaN(quantity) && !isNaN(price)) {
        addGroceryItem(productName, category, quantity, unit, price);
        saveGroceryList(); 
        clearInputs();
    } else {
        alert('Please fill in all fields correctly.');
    }
});


function addGroceryItem(productName, category, quantity, unit, price) {
    const groceryList = document.getElementById(`${category}-list`);
    const listItem = document.createElement('li');
    const itemTotalPrice = quantity * price;

    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        groceryList.removeChild(listItem);
        totalPrice -= itemTotalPrice;
        updateTotalPrice();
        saveGroceryList();
    });

    listItem.textContent = `${productName} - ${quantity} ${unit} - $${price.toFixed(2)} (Total: $${itemTotalPrice.toFixed(2)})`;
    listItem.appendChild(removeButton);
    groceryList.appendChild(listItem);

    
    totalPrice += itemTotalPrice;
    updateTotalPrice();
}


function updateTotalPrice() {
    const gst = totalPrice * 0.02; 
    document.getElementById('total-price').textContent = `Total Price: $${(totalPrice + gst).toFixed(2)}`;
}


function clearInputs() {
    document.getElementById('product-input').value = '';
    document.getElementById('quantity-input').value = '';
    document.getElementById('price-input').value = '';
}


function createChart() {
    const ctx = document.getElementById('grocery-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], 
            datasets: [{
                label: 'Quantity',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function loadGroceryList() {
    const groceryData = JSON.parse(localStorage.getItem('groceryList')) || {};
    for (const category of categories) {
        const items = groceryData[category] || [];
        items.forEach(item => {
            const { name, quantity, unit, price } = item;
            addGroceryItem(name, category, quantity, unit, price);
        });
    }
}

function saveGroceryList() {
    const groceryData = {};
    categories.forEach(category => {
        groceryData[category] = Array.from(document.querySelectorAll(`#${category}-list li`)).map(item => {
            const parts = item.firstChild.textContent.split(' - ');
            const name = parts[0];
            const quantityUnitPrice = parts[1].split(' ');
            const quantity = parseFloat(quantityUnitPrice[0]);
            const unit = quantityUnitPrice[1];
            const price = parseFloat(parts[2].match(/\$([\d.]+)/)[1]);
            return { name, quantity, unit, price };
        });
    });
    localStorage.setItem('groceryList', JSON.stringify(groceryData));
}


