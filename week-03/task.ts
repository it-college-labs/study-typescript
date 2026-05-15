function introduceYourself(name: string, age?: number): string {
  if (age === undefined) {
    return `Привет, меня зовут ${name}.`;
  }

  return `Привет, меня зовут ${name} и мне ${age} лет.`;
}

interface Book {
  title: string;
  author: string;
  year?: number;
}

const myLibrary: Book[] = [
  { title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967 },
  { title: "Преступление и наказание", author: "Федор Достоевский", year: 1866 },
  { title: "Чистый код", author: "Роберт Мартин" },
];

console.log(introduceYourself("Петр", 30));
console.log(introduceYourself("Анна"));
console.log(myLibrary);

export {};
