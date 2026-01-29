var products = [
    { id: 1, title: 'Ноутбук', price: 55000 },
    { id: 2, title: 'Мышь', price: 1500 }
];
function getTotalPrice(items) {
    return items.reduce(function (sum, item) { return sum + item.price; }, 0);
}
console.log(getTotalPrice(products));
