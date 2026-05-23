<!-- Неделя 4 | status: Parsed: -->

### **Конспект для студентов: Дженерики, перегрузка функций и Utility Types**

**Цель:** Понять принцип обобщённого программирования (дженерики), научиться использовать перегрузку функций и ключевые утилитные типы.

#### **1. Введение в дженерики (Generics)**
Часто нам нужна одна и та же логика, но для разных типов данных. Писать для каждого типа свою функцию — неэффективно. **Дженерики (обобщения)** позволяют создавать компоненты, работающие с любыми типами, сохраняя контроль над ними.

**Базовый синтаксис:** Используются **угловые скобки `< >`**, внутри которых объявляется параметр типа (часто `T`, `U`, `K`, `V`).
```typescript
// Без дженериков: дублирование
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstNumber(arr: number[]): number { return arr[0]; }

// С дженериком: одна универсальная функция
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}

// Использование: тип можно указать явно или доверить вывод TypeScript
const num = getFirstElement<number>([1, 2, 3]); // Явно: T = number
const str = getFirstElement(['a', 'b', 'c']);   // Автовывод: T = string
```
**Дженерики в типах:** Можно создавать обобщённые типы и интерфейсы.
```typescript
type Pair<T> = [T, T]; // Пара значений одного типа
const numberPair: Pair<number> = [10, 20];
const stringPair: Pair<string> = ['hello', 'world'];
```

#### **2. Перегрузка функций**
В JavaScript одна функция часто может вызываться по-разному. TypeScript позволяет *явно описать* эти различные сигнатуры, чтобы система типов их понимала.

**Синтаксис:**
1.  Пишутся **одна или несколько сигнатур** вызова (без тела функции).
2.  Затем пишется **одна реализация** с общей сигнатурой, которая совместима со всеми вышеперечисленными.

**Пример: Функция для создания подключения**
```typescript
// 1. Сигнатуры перегрузки
function createConnection(config: string): DBConnection;
function createConnection(config: ConnectionOptions): DBConnection;

// 2. Единая реализация
function createConnection(config: string | ConnectionOptions): DBConnection {
  if (typeof config === 'string') {
    console.log(`Создаём соединение по строке: ${config}`);
  } else {
    console.log(`Создаём соединение с хостом: ${config.host}`);
  }
  return {} as DBConnection;
}

// Использование
const conn1 = createConnection('postgres://localhost');
const conn2 = createConnection({ host: 'localhost', port: 5432 });
```

#### **3. Утилитные типы (Utility Types) — встроенные дженерики**
Это готовые обобщённые типы для частых операций преобразования одних типов в другие.

**3.1. `Pick<T, K>`**
Создаёт новый тип, **выбирая** только указанный набор свойств `K` (строковых литералов) из типа `T`.
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;
// UserPreview = { id: number; name: string; email: string; }
```

**3.2. `Omit<T, K>`**
Создаёт новый тип, **исключая** указанный набор свойств `K` из типа `T`. Прямая противоположность `Pick`.
```typescript
type PublicUser = Omit<User, 'passwordHash'>;
// PublicUser = { id: number; name: string; email: string; }
```

**3.3. `Record<K, T>`**
Создаёт тип объекта, **ключи** которого принадлежат к типу `K`, а **значения** — к типу `T`. Идеален для словарей.
```typescript
type AppLocale = 'en' | 'ru';
type Translations = Record<AppLocale, string>;
const greetings: Translations = { en: 'Hello', ru: 'Привет' };
```

#### **4. Контрольное задание К4.1**
**Задача:** Применить дженерики, перегрузку и утилитные типы на практике.

1.  **Часть A (Дженерики):**
    Создайте универсальную функцию `toArray<T>(...args: T[]): T[]`, которая принимает произвольное число аргументов одного типа и возвращает массив из них.

2.  **Часть B (Перегрузка функций):**
    Объявите перегруженную функцию `parseInput(input: string): number;` и `parseInput(input: string, radix: number): number;`. Реализация должна использовать `parseInt`. Покажите её вызов в двух вариантах.

3.  **Часть C (Утилитные типы `Omit` и `Record`):**
    Дан интерфейс `Book`. Создайте:
    *   Тип `BookCatalogItem` на основе `Book`, но **без поля `inStockCount`**.
    *   Тип `LibraryCatalog`, который представляет собой объект, где **ключом** является `isbn` книги (строка), а **значением** — объект типа `BookCatalogItem`.

**Исходный интерфейс:**
```typescript
interface Book {
  isbn: string;
  title: string;
  author: string;
  pages: number;
  inStockCount: number;
}
```

**Что должно получиться:**
*   Файл с кодом на TypeScript, содержащий все объявления.
*   Код должен компилироваться без ошибок (`tsc --noEmit`).
