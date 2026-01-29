function introduceYourself(name, age) {
    if (age === undefined) {
        return "\u041F\u0440\u0438\u0432\u0435\u0442, \u043C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 ".concat(name, ".");
    }
    return "\u041F\u0440\u0438\u0432\u0435\u0442, \u043C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 ".concat(name, " \u0438 \u043C\u043D\u0435 ").concat(age, " \u043B\u0435\u0442.");
}
var myLibrary = [
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
