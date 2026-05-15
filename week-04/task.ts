function toArray<T>(...args: T[]): T[] {
  return args;
}

function parseInput(input: string): number;
function parseInput(input: string, radix: number): number;
function parseInput(input: string, radix = 10): number {
  return parseInt(input, radix);
}

interface Book {
  isbn: string;
  title: string;
  author: string;
  pages: number;
  inStockCount: number;
}

type BookCatalogItem = Omit<Book, "inStockCount">;
type LibraryCatalog = Record<string, BookCatalogItem>;

const numbers = toArray(1, 2, 3);
const words = toArray("TypeScript", "Generics");

const decimal = parseInput("42");
const binary = parseInput("1010", 2);

const catalog: LibraryCatalog = {
  "978-5-17-118366-8": {
    isbn: "978-5-17-118366-8",
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    pages: 480,
  },
};

console.log(numbers, words, decimal, binary, catalog);

export {};
