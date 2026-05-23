<!-- Неделя 11 | status: Parsed: -->

### **📚 Конспект для студентов: Utility Types в TypeScript**

**Цель:** Освоить инструменты для гибкой трансформации типов и научиться создавать надёжные type guards.

#### **1. Зачем нужны Utility Types?**
Представьте, что у вас есть основной тип — например, `User`. В разных частях приложения вам нужны его вариации: форма для создания (все поля опциональны), строгий объект для БД (все поля обязательны), объект для передачи по сети (без пароля).
Писать каждый тип вручную — трудоёмко и небезопасно. **Utility Types** — это "функции" для типов, которые создают новые типы на основе старых.

#### **2. Основные Utility Types на практике**
Рассмотрим интерфейс, с которым будем работать:
```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Опциональное поле
  age: number;
}
```

| Utility Type | Что делает | Пример | Результат (описание типа) |
| :--- | :--- | :--- | :--- |
| **`Partial<T>`** | Делает **все** свойства типа `T` опциональными. | `type UserForm = Partial<User>;` | `{ id?: number; name?: string; email?: string; age?: number }` |
| **`Required<T>`** | Делает **все** свойства типа `T` обязательными. | `type StrictUser = Required<User>;` | `{ id: number; name: string; email: string; age: number }` |
| **`Pick<T, K>`** | Создаёт тип, выбрав из `T` только указанные ключи `K`. | `type UserPreview = Pick<User, 'id' \| 'name'>;` | `{ id: number; name: string }` |
| **`Omit<T, K>`** | Создаёт тип, **исключив** из `T` указанные ключи `K`. | `type PublicUser = Omit<User, 'email'>;` | `{ id: number; name: string; age: number }` |

**Пример сценария:** Создадим тип для обновления пользователя, где можно передать любое подмножество полей, но `id` должен быть всегда.

```typescript
// Неправильно: здесь id стал опциональным, но нам он нужен обязательным.
type UpdateUserRequest = Partial<User>;

// Правильно: используем пересечение типов (&).
// Мы говорим: "Этот тип должен быть Partial от User, но также у него обязательно должно быть поле id,
// тип которого мы берём из оригинала (User['id'])".
type UpdateUserRequest = Partial<User> & { id: User['id'] };
// Итог: { id: number; name?: string; email?: string; age?: number }

// Альтернативный, более явный способ через Pick и Omit:
// 1. Сначала вытащим id как обязательное поле.
// 2. Добавим к нему все остальные поля, но сделав их опциональными.
type UpdateUserRequestAlt = Pick<User, 'id'> & Partial<Omit<User, 'id'>>;
// Результат будет идентичным.
```

#### **3. Утилиты для работы с функциями**
Эти утилиты позволяют "заглянуть" внутрь типа функции.

```typescript
function fetchUser(id: number): Promise<User> {
  // ... реализация
}

// Получаем тип её параметров (кортеж)
type FetchUserParams = Parameters<typeof fetchUser>; // [number]
// Получаем тип её возвращаемого значения
type FetchUserReturn = ReturnType<typeof fetchUser>; // Promise<User>
```

**Зачем это нужно?** Чтобы избежать рассинхронизации. Если вы измените сигнатуру `fetchUser`, типы `FetchUserParams` и `FetchUserReturn` обновятся автоматически. Это особенно полезно для создания type guards.

#### **4. Создание Type Guard с помощью ReturnType**
Type Guard — это функция, которая помогает TypeScript сузить тип переменной.

Допустим, у нас есть API, которое возвращает ответ одного из двух типов:
```typescript
interface SuccessResponse {
  data: User;
  status: 'ok';
}

interface ErrorResponse {
  error: string;
  status: 'error';
}

type ApiResponse = SuccessResponse | ErrorResponse;
```

Мы можем создать функцию, которая проверяет тип ответа. Чтобы не дублировать тип успешного результата, используем `ReturnType` (предполагая, что у нас есть функция `fetchData`).
```typescript
// Предположим, есть декларация функции, которая возвращает Promise<ApiResponse>
declare function fetchData(): Promise<ApiResponse>;

// Type Guard, проверяющий, что ответ успешный
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.status === 'ok';
}

// Использование
const result: ApiResponse = await fetchData();
if (isSuccessResponse(result)) {
  // Здесь TypeScript точно знает, что result имеет тип SuccessResponse
  console.log(result.data.name);
}
```

#### **5. Контрольное задание К11.1**
**Часть 1. Тип для формы редактирования.**
Используя интерфейс `User` из примеров выше, создайте тип `UserEditForm`. В этом типе **все поля должны быть опциональными** (`Partial`), **за исключением поля `id`**, которое должно остаться обязательным.
*   **Подсказка:** Вам потребуется комбинировать `Partial<T>` и `Required<T>` (или `Pick<T, K>`).

**Часть 2. Type Guard для функции.**
1.  Объявите функцию `processData(input: string): SuccessResponse | ErrorResponse` (реализация не важна).
2.  Создайте type guard-функцию `isProcessSuccess`, которая принимает некий аргумент и проверяет, является ли он **успешным результатом выполнения `processData`**.
3.  **Ключевое требование:** Тип успешного результата (`SuccessResponse`) в проверке **должен быть получен с помощью утилиты `ReturnType`**, а не указан вручную.

**Что нужно предоставить:**
*   Код с объявлением типов и функций (интерфейсы `SuccessResponse`/`ErrorResponse`, функцию `processData`, type guard `isProcessSuccess`).
*   **Не нужно** присылать полную реализацию функций или вызывающий код. Достаточно деклараций, которые демонстрируют работу с Utility Types.

Удачи в выполнении!
