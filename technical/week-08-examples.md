<!-- Неделя 8 (примеры) | status: Parsed: -->

# **Практические примеры: Типизация в React + TypeScript**

## Введение

На этой неделе мы переходим к созданию React-приложений с TypeScript. Типизация в React даёт несколько ключевых преимуществ:
- **Автодополнение** в редакторе для пропсов компонентов
- **Защита от ошибок** на этапе компиляции (неправильные типы пропсов, обращение к несуществующим свойствам)
- **Самодокументирование** кода — интерфейсы компонентов становятся явными
- **Безопасная работа с асинхронностью** — типизация промисов и данных с сервера

Все примеры построены вокруг простого, но реалистичного сценария — приложения для работы с задачами (Todo App). Это позволит сосредоточиться на TypeScript, а не на логике приложения.

---

## **Группа 1: Типизация компонентов и пропсов**

### Пример 1.1: Базовый компонент с пропсами

Создадим простой компонент, который принимает два пропса и отображает их. TypeScript проверит, что переданные значения имеют правильный тип.

```tsx
// Компонент, отображающий задачу
// Задача: создать компонент TodoItem, который принимает title (строку) и completed (булево)
// и отображает их в виде строки "✓ Купить молоко" или "○ Позвонить маме"

// Решение:
interface TodoItemProps {
  title: string;
  completed: boolean;
}

function TodoItem({ title, completed }: TodoItemProps) {
  const prefix = completed ? '✓' : '○';
  return <div>{prefix} {title}</div>;
}

// Использование:
// <TodoItem title="Купить молоко" completed={true} />
// <TodoItem title="Позвонить маме" completed={false} />
```

---

### Пример 1.2: Опциональные пропсы и значения по умолчанию

Добавим опциональный пропс с типом, который может отсутствовать. TypeScript обяжет нас проверить его наличие перед использованием.

```tsx
// Задача: добавить в компонент TodoItem опциональный пропс dueDate (дата выполнения)
// Если дата передана — отобразить её в скобках после названия

// Решение:
interface TodoItemProps {
  title: string;
  completed: boolean;
  dueDate?: Date; // опциональный пропс
}

function TodoItem({ title, completed, dueDate }: TodoItemProps) {
  const prefix = completed ? '✓' : '○';
  return (
    <div>
      {prefix} {title}
      {dueDate && <span> (до {dueDate.toLocaleDateString()})</span>}
    </div>
  );
}
```

---

### Пример 1.3: Типизация children

Пропс `children` имеет особый тип в React. Рассмотрим, как правильно его типизировать.

```tsx
// Задача: создать компонент-обёртку Card, который принимает заголовок и children
// и отображает их в стилизованном блоке

// Решение:
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode; // специальный тип для children
}

function Card({ title, children }: CardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// Использование:
// <Card title="Мои задачи">
//   <TodoItem title="Купить молоко" completed={false} />
//   <TodoItem title="Позвонить маме" completed={true} />
// </Card>
```

---

### Пример 1.4: Discriminated Unions в пропсах

Иногда компонент должен вести себя по-разному в зависимости от переданного пропса. Discriminated unions (размеченные объединения) позволяют описать такие сценарии типобезопасно.

```tsx
// Задача: создать компонент Notification, который может быть либо успешным (success),
// либо сообщением об ошибке (error). Для успеха нужен message, для ошибки — message и retryButton

// Решение:
type NotificationProps =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; showRetry: boolean };

function Notification(props: NotificationProps) {
  if (props.type === 'success') {
    return <div style={{ color: 'green' }}>✓ {props.message}</div>;
  } else {
    return (
      <div style={{ color: 'red' }}>
        ✗ {props.message}
        {props.showRetry && <button>Повторить</button>}
      </div>
    );
  }
}

// Использование:
// <Notification type="success" message="Задача добавлена" />
// <Notification type="error" message="Ошибка загрузки" showRetry={true} />
```

---

## **Группа 2: Типизация хуков useState и useEffect**

### Пример 2.1: Явная типизация useState

TypeScript часто выводит тип автоматически, но иногда нужно указать его явно.

```tsx
// Задача: создать компонент Counter с типизированным состоянием

// Решение:
import { useState } from 'react';

function Counter() {
  // TypeScript выведет тип number автоматически
  const [count, setCount] = useState(0);
  
  // Но если начальное состояние не определяет тип однозначно,
  // нужно указать его явно:
  const [value, setValue] = useState<number | null>(null);
  
  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      
      <p>Значение: {value}</p>
      <button onClick={() => setValue(42)}>Установить 42</button>
    </div>
  );
}
```

---

### Пример 2.2: Типизация сложных состояний (объекты и массивы)

Рассмотрим типизацию более сложных структур данных в состоянии.

```tsx
// Задача: создать компонент для управления списком задач с типизированным состоянием

// Решение:
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]); // явно указываем тип массива
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };
  
  return (
    <div>
      <input 
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button onClick={addTask}>Добавить</button>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? '✓' : '○'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Пример 2.3: Типизация useEffect с зависимостями

`useEffect` сам по себе не требует типизации, но важно правильно типизировать функции и данные внутри него.

```tsx
// Задача: сохранять список задач в localStorage при изменении

// Решение:
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Загружаем задачи при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Task[]; // утверждение типа
        setTasks(parsed);
      } catch (e) {
        console.error('Ошибка загрузки задач');
      }
    }
  }, []); // пустой массив зависимостей — эффект выполнится один раз
  
  // Сохраняем при каждом изменении tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // зависимость от tasks
  
  return (
    // ... остальной код
  );
}
```

---

### Пример 2.4: Типизация ref и работы с DOM

`useRef` может использоваться как для хранения изменяемых значений, так и для ссылок на DOM-элементы.

```tsx
// Задача: создать компонент с фокусом на поле ввода при монтировании

// Решение:
import { useRef, useEffect } from 'react';

function TodoForm() {
  // Тип для ссылки на DOM-элемент input
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Проверяем, что ref.current существует и является HTMLElement
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <input 
      ref={inputRef}
      type="text"
      placeholder="Введите задачу"
    />
  );
}
```

---

## **Группа 3: Типизация событий**

### Пример 3.1: Типизация onChange для input

События в React имеют типизированные обработчики. Используем их для безопасности.

```tsx
// Задача: создать форму с одним полем и обработать изменение

// Решение:
import { useState, ChangeEvent } from 'react';

function TodoForm() {
  const [value, setValue] = useState('');
  
  // Явно типизируем событие
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  return (
    <input 
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Введите задачу"
    />
  );
}
```

---

### Пример 3.2: Типизация onSubmit для формы

Обработка отправки формы требует типизации события и предотвращения стандартного поведения.

```tsx
// Задача: создать форму добавления задачи с обработкой submit

// Решение:
import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [value, setValue] = useState('');
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы
    if (value.trim()) {
      onAdd(value);
      setValue('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Добавить</button>
    </form>
  );
}
```

---

### Пример 3.3: Типизация onClick для кнопки

События мыши также типизируются. Рассмотрим пример с передачей дополнительных данных.

```tsx
// Задача: создать кнопку удаления задачи с confirm-диалогом

// Решение:
import { MouseEvent } from 'react';

interface DeleteButtonProps {
  taskId: number;
  taskTitle: string;
  onDelete: (id: number) => void;
}

function DeleteButton({ taskId, taskTitle, onDelete }: DeleteButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // предотвращаем всплытие события
    
    if (window.confirm(`Удалить задачу "${taskTitle}"?`)) {
      onDelete(taskId);
    }
  };
  
  return (
    <button onClick={handleClick} style={{ color: 'red' }}>
      Удалить
    </button>
  );
}
```

---

### Пример 3.4: Типизация кастомных событий

Иногда нужно типизировать события, которые вы сами создаёте и передаёте между компонентами.

```tsx
// Задача: создать компонент TodoItem, который генерирует кастомные события
// для родительского компонента

// Решение:
interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void; // функция-обработчик
  onDelete: (id: number) => void;
}

function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)} // вызываем onToggle с id задачи
      />
      <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {title}
      </span>
      <button onClick={() => onDelete(id)}>🗑️</button>
    </div>
  );
}
```

---

## **Группа 4: Типизация асинхронных операций**

### Пример 4.1: Типизация Promise<T>

Промисы могут возвращать данные определённого типа. TypeScript поможет это отследить.

```tsx
// Задача: создать функцию, которая возвращает Promise с задачами

// Решение:
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Функция возвращает Promise, который разрешится массивом Task
function fetchTasks(): Promise<Task[]> {
  return fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json());
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadTasks = () => {
    setLoading(true);
    fetchTasks()
      .then(data => {
        setTasks(data.slice(0, 10)); // берём первые 10
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка:', error);
        setLoading(false);
      });
  };
  
  return (
    <div>
      <button onClick={loadTasks}>Загрузить задачи</button>
      {loading && <div>Загрузка...</div>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Пример 4.2: Типизация async/await

Современный стиль работы с промисами — async/await — также полностью типизирован.

```tsx
// Задача: переписать предыдущий пример на async/await с обработкой ошибок

// Решение:
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // TypeScript не знает тип данных из response.json()
      // Но мы можем утвердить тип
      const data = await response.json() as Task[];
      
      setTasks(data.slice(0, 10));
    } catch (err) {
      // err имеет тип unknown — нужно проверить перед использованием
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={loadTasks}>Загрузить задачи</button>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Пример 4.3: Типизация возвращаемого значения асинхронной функции

Рассмотрим, как правильно типизировать функцию, которая возвращает разные результаты.

```tsx
// Задача: создать функцию, которая ищет задачу по ID и возвращает либо задачу,
// либо null, если не найдена

// Решение:
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Функция возвращает Promise, который может разрешиться Task или null
async function findTaskById(id: number): Promise<Task | null> {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // задача не найдена
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const task = await response.json() as Task;
    return task;
  } catch (error) {
    console.error('Ошибка поиска задачи:', error);
    return null;
  }
}

// Использование в компоненте:
function TaskFinder() {
  const [task, setTask] = useState<Task | null>(null);
  const [searchId, setSearchId] = useState('');
  
  const handleSearch = async () => {
    const id = parseInt(searchId);
    if (isNaN(id)) return;
    
    const found = await findTaskById(id);
    setTask(found);
  };
  
  return (
    <div>
      <input
        type="number"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch}>Найти</button>
      
      {task === null ? (
        <div>Задача не найдена</div>
      ) : (
        <div>{task.title} - {task.completed ? '✓' : '○'}</div>
      )}
    </div>
  );
}
```

---

### Пример 4.4: Типизация нескольких последовательных запросов

Реальные приложения часто делают несколько связанных запросов.

```tsx
// Задача: загрузить пользователя и его задачи

// Решение:
interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface UserWithTasks extends User {
  tasks: Task[];
}

async function fetchUserWithTasks(userId: number): Promise<UserWithTasks | null> {
  try {
    // Параллельно загружаем пользователя и задачи
    const [userResponse, tasksResponse] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
    ]);
    
    if (!userResponse.ok) {
      if (userResponse.status === 404) return null;
      throw new Error('Ошибка загрузки пользователя');
    }
    
    const user = await userResponse.json() as User;
    const tasks = await tasksResponse.json() as Task[];
    
    return {
      ...user,
      tasks
    };
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}
```

---

## **Группа 5: Типизация данных из fetch**

### Пример 5.1: Создание типизированного клиента API

Организуем работу с API через отдельный модуль с типизированными функциями.

```tsx
// Задача: создать модуль для работы с API задач

// Решение:
// api.ts
interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface CreateTaskData {
  userId: number;
  title: string;
  completed?: boolean;
}

export const api = {
  // GET запрос с типизированным ответом
  async getTasks(): Promise<Task[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json() as Promise<Task[]>;
  },
  
  // POST запрос с типизированным телом и ответом
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, completed: data.completed ?? false })
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json() as Promise<Task>;
  },
  
  // PATCH запрос с частичным обновлением
  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json() as Promise<Task>;
  }
};
```

---

### Пример 5.2: Типизация ответа с пагинацией

API часто возвращают структурированные ответы с метаданными.

```tsx
// Задача: создать тип для ответа API с пагинацией

// Решение:
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Функция, имитирующая API с пагинацией
async function fetchTasksPaginated(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Task>> {
  const start = (page - 1) * limit;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${limit}`
  );
  
  // Заголовок X-Total-Count часто содержит общее количество
  const total = parseInt(response.headers.get('X-Total-Count') || '0');
  
  const tasks = await response.json() as Task[];
  
  return {
    data: tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}
```

---

### Пример 5.3: Типизация ошибок API

Обработка ошибок — важная часть работы с API. Типизируем возможные ошибки.

```tsx
// Задача: создать типизированную обработку ошибок API

// Решение:
interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>; // для валидационных ошибок
}

class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  
  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // тело ответа может быть пустым
      }
      
      throw new ApiError(
        response.status,
        errorData.message || response.statusText,
        errorData.errors
      );
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // сетевые ошибки или другие проблемы
    throw new ApiError(0, 'Network error or unknown error');
  }
}
```

---

### Пример 5.4: Типизация AbortController для отмены запросов

В реальных приложениях нужно уметь отменять запросы при размонтировании компонента.

```tsx
// Задача: создать хук для загрузки данных с возможностью отмены запроса

// Решение:
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchTasks() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos',
          { signal: abortController.signal }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json() as Task[];
        setTasks(data.slice(0, 10));
        setError(null);
      } catch (err) {
        // Игнорируем ошибки от отменённых запросов
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
    
    // Очистка: отменяем запрос при размонтировании
    return () => {
      abortController.abort();
    };
  }, []); // пустой массив зависимостей — загружаем один раз
  
  return { tasks, loading, error };
}
```

---

## **Группа 6: Обработка ошибок**

### Пример 6.1: Типизированная обработка ошибок в компоненте

Создадим компонент, который корректно обрабатывает разные типы ошибок.

```tsx
// Задача: создать компонент с обработкой различных типов ошибок

// Решение:
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Собственный класс ошибки
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function TaskForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Error | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Валидация
      if (!title.trim()) {
        throw new ValidationError('Название задачи не может быть пустым');
      }
      
      if (title.length > 100) {
        throw new ValidationError('Название задачи слишком длинное (макс. 100 символов)');
      }
      
      // Отправка данных
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          userId: 1,
          completed: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const task = await response.json() as Task;
      console.log('Задача создана:', task);
      setTitle('');
      
    } catch (err) {
      // Сохраняем ошибку в состоянии
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Произошла неизвестная ошибка'));
      }
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Создать</button>
      </form>
      
      {error && (
        <div style={{ 
          color: error instanceof ValidationError ? 'orange' : 'red',
          marginTop: '8px'
        }}>
          <strong>{error.name}:</strong> {error.message}
        </div>
      )}
    </div>
  );
}
```

---

### Пример 6.2: Error Boundary с TypeScript

Error Boundary — специальные компоненты React для отлова ошибок. В TypeScript они имеют свои особенности.

```tsx
// Задача: создать Error Boundary с правильной типизацией

// Решение:
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  // Статический метод для обновления состояния при ошибке
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  // Метод для логирования ошибки
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Что-то пошло не так</h2>
          <details>
            <summary>Подробнее об ошибке</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Использование:
// <ErrorBoundary>
//   <TaskManager />
// </ErrorBoundary>
```

---

### Пример 6.3: Типизация fallback-значений и состояния загрузки

Объединим обработку ошибок, загрузки и данных в одном компоненте с правильной типизацией.

```tsx
// Задача: создать компонент с состояниями loading, error, data

// Решение:
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type LoadingState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function TaskList() {
  const [state, setState] = useState<LoadingState<Task[]>>({ status: 'idle' });
  
  const loadTasks = async () => {
    setState({ status: 'loading' });
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as Task[];
      setState({ status: 'success', data: data.slice(0, 5) });
    } catch (err) {
      setState({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  };
  
  return (
    <div>
      {state.status === 'idle' && (
        <button onClick={loadTasks}>Загрузить задачи</button>
      )}
      
      {state.status === 'loading' && (
        <div>Загрузка...</div>
      )}
      
      {state.status === 'success' && (
        <ul>
          {state.data.map(task => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
      
      {state.status === 'error' && (
        <div style={{ color: 'red' }}>
          Ошибка: {state.error}
          <button onClick={loadTasks}>Повторить</button>
        </div>
      )}
    </div>
  );
}
```

---

### Пример 6.4: Типизация повторных попыток (retry logic)

Добавим механизм повторных попыток при временных ошибках.

```tsx
// Задача: создать функцию с автоматическими повторными попытками

// Решение:
interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoff?: boolean; // увеличивать задержку с каждой попыткой
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = { maxAttempts: 3, delayMs: 1000, backoff: true }
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Для 404 и других клиентских ошибок не повторяем
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${response.status}`);
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === config.maxAttempts) {
        break;
      }
      
      // Вычисляем задержку
      const delay = config.backoff 
        ? config.delayMs * Math.pow(2, attempt - 1) // экспоненциальная задержка
        : config.delayMs;
      
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Использование:
// try {
//   const tasks = await fetchWithRetry<Task[]>(
//     'https://jsonplaceholder.typicode.com/todos',
//     {},
//     { maxAttempts: 5, delayMs: 500, backoff: true }
//   );
// } catch (error) {
//   console.error('All retries failed:', error);
// }
```

---
