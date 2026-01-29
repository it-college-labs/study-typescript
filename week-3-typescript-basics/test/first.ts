interface Product {
  id: number;
  title: string;
  price: number;
}

const products: Product[] = [
  { id: 1, title: 'Ноутбук', price: 55000 },
  { id: 2, title: 'Мышь', price: 1500 }
];

function getTotalPrice(items: Product[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

console.log(getTotalPrice(products));