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
  {
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
  },
  {
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
  },
  {
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
  },
];

console.log(introduceYourself("Петр", 30));
console.log(introduceYourself("Анна"));
console.log("Моя библиотека:");
console.log(myLibrary);
