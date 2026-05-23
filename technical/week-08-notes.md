<!-- Неделя 8 (конспект и задание) | status: Parsed: -->

### **📚 Конспект для студентов: React + TypeScript – Основы**

**Цель:** Научиться создавать типизированные React-компоненты, корректно описывая пропсы, состояние и события.

#### **1. Зачем TypeScript в React?**
TypeScript добавляет статическую типизацию в мир React. Это даёт:
*   **Предсказуемость:** Компонент ясно сообщает, какие данные (пропсы) он ожидает.
*   **Надёжность:** Ошибки, такие как передача строки вместо числа или обращение к несуществующему свойству объекта, будут подчёркнуты в редакторе кода **до запуска приложения**.
*   **Автодополнение:** Ваша среда разработки (VSCode или zed) будет точно знать структуру пропсов и состояния, предлагая подсказки.

#### **2. Создание проекта на Vite + React + TS**
Откройте терминал в папке для проектов и выполните:
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```
*   `--template react-ts` – ключевой флаг, создающий проект с предварительно настроенным TypeScript.
*   Откройте `src/App.tsx` – это корневой компонент. Обратите внимание на расширение `.tsx`.

#### **3. Типизация пропсов (Props)**
Пропсы — это аргументы компонента. Их тип описывается с помощью `interface` или `type`.

**Пример: компонент `Greeting`**
```tsx
// 1. Описываем интерфейс для пропсов
interface GreetingProps {
  name: string;
  age?: number; // Необязательный пропс
}

// 2. Указываем тип в параметрах функции (часто с деструктуризацией)
const Greeting = ({ name, age }: GreetingProps) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>You are {age} years old.</p>}
    </div>
  );
};

// 3. Использование (TypeScript проверит тип!)
export const App = () => <Greeting name="Alice" age={25} />;
```

#### **4. Хук состояния `useState` с типами**
Хук `useState` в TypeScript принимает **дженерик-параметр** – тип состояния.

```tsx
import { useState } from 'react';

const Counter = () => {
  // Явное указание типа: состояние - число
  const [count, setCount] = useState<number>(0);

  // TypeScript выведет тип `boolean` из начального значения `false`
  const [isActive, setIsActive] = useState(false);

  // Сложные типы: массив объектов. Тип лучше указать явно.
  interface Todo {
    id: number;
    text: string;
  }
  const [todos, setTodos] = useState<Todo[]>([]); // Начальное значение - пустой массив типа Todo

  // Состояние, которое может быть `null` (например, данные пользователя до загрузки)
  const [user, setUser] = useState<{ name: string } | null>(null);

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
};
```

#### **5. Хук эффекта `useEffect` и типизация событий**
*   **`useEffect`:** Сам хук не требует специальной типизации. Важно типизировать данные, с которыми вы работаете внутри эффекта (например, ответ от API).
    ```tsx
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('/api/data');
        // Указываем тип ожидаемых данных
        const data: MyDataType = await response.json();
        setState(data);
      };
      fetchData();
    }, []);
    ```

*   **События (Events):** TypeScript требует указания точного типа для объекта события.
    ```tsx
    import {ChangeEvent, FormEvent} from 'react';
    
    const Form = () => {
      const [inputValue, setInputValue] = useState('');

      // Ключевой момент: правильный тип события для элемента
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // TypeScript знает, что у `target` есть `value`
      };

      const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Submitted:', inputValue);
      };

      return (
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputValue} onChange={handleChange} />
          <button type="submit">Send</button>
        </form>
      );
    };
    ```
    Основные типы событий: `ChangeEvent<HTMLInputElement>`, `FormEvent`, `MouseEvent<HTMLButtonElement>`.

#### **6.A Контрольное задание К8.1 (вариант с setInterval) **
**Задача:** Создать компонент `<Timer initialSeconds: number />`.

**Требования и подсказки:**
1.  **Пропсы:** Создайте `interface TimerProps` с одним обязательным свойством `initialSeconds` типа `number`.
2.  **Состояние:** Используйте хук `useState` для хранения оставшегося времени. Явно укажите тип состояния как `number`.
3.  **Эффект:** Используйте хук `useEffect` для создания интервала (`setInterval`), который каждую секунду уменьшает состояние на 1.
    *   Не забудьте вернуть функцию очистки из эффекта (`clearInterval`), чтобы остановить таймер при размонтировании компонента или изменении зависимостей.
    *   Зависимость эффекта — `[seconds]`, чтобы перезапускать интервал при обновлении состояния.
4.  **Логика:** Когда значение состояния (`seconds`) станет равным или меньше 0, очистите интервал и выведите сообщение "Time's up!".
5.  **Рендеринг:** Компонент должен отображать текущее значение оставшегося времени в формате `Осталось: X сек.`.

**Примерная структура компонента:**
```tsx
import { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
}

export const Timer = ({ initialSeconds }: TimerProps) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    // ... логика интервала и очистки
  }, [seconds]); // Зависимость от `seconds`

  return (
    <div>
      {/* Рендерим оставшееся время или сообщение */}
    </div>
  );
};
```

**Результат:** У вас должен получиться полностью типизированный компонент, который корректно работает и останавливается по завершении времени.


#### **6.B Контрольное задание К8.1 (вариант с `setTimeout`)**

**Задача:** Создать компонент `<Timer initialSeconds: number />`, который отсчитывает время вниз от `initialSeconds` до 0, используя **`setTimeout`** вместо `setInterval`.

**Ключевая концепция:** В этом подходе `useEffect` запускает *одиночный* таймер (`setTimeout`) для одного "тика". По его завершении, эффект (который зависит от `seconds`) запускается снова с новым значением, создавая рекурсивную цепочку таймеров. Это считается более "чистым" и предсказуемым подходом в React.

**Требования и подсказки:**
1.  **Пропсы и состояние:** Создайте `interface TimerProps` и используйте `useState<number>` для хранения оставшихся секунд.
2.  **Эффект с `setTimeout`:** Ваш `useEffect` должен:
    *   Проверить, не истекло ли время (`if (seconds <= 0) { return; }`). **Это условие остановки рекурсии.**
    *   Если время ещё есть, установить таймер `setTimeout`, который через 1000 мс уменьшит `seconds` на 1.
    *   **Крайне важно:** Функция, возвращаемая из `useEffect` (функция очистки), должна вызывать `clearTimeout` для текущего таймера. Это предотвратит утечки памяти и попытки обновления состояния размонтированного компонента.
    *   Массив зависимостей эффекта **должен включать `seconds`**, чтобы эффект перезапускался на каждом "тике".
3.  **Рендеринг:** Отображайте текущее значение `seconds`. По истечении времени (`seconds <= 0`) выводите "Время вышло".

**Примерная структура компонента:**
```tsx
import { useState, useEffect, useRef } from 'react'; // useRef может быть полезен

interface TimerProps {
  initialSeconds: number;
}

export const Timer = ({ initialSeconds }: TimerProps) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  // Используем useRef для хранения ID таймера, чтобы его можно было очистить
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Условие остановки: если время вышло, ничего не делаем
    // ...

    // 2. Устанавливаем таймер на следующий "тик"
    // ...

    // 3. Функция очистки: ОБЯЗАТЕЛЬНО очищаем текущий таймер
    return () => {
      // ...
    };
  }, [seconds]); // Эффект зависит от `seconds` и перезапускается на каждом изменении

  return (
    <div>
      {/* Рендерим оставшееся время или сообщение */}
    </div>
  );
};
```

**Чем этот вариант лучше?**
*   **Более безопасно:** Исключает риск наложения интервалов при возможных задержках в event loop.
*   **Более идиоматично для React:** Прямая связь между состоянием (`seconds`) и запуском side-эффекта.
*   **Глубже изучает `useEffect`:** Требует чёткого понимания зависимостей, очистки и условий выполнения эффекта.
