interface Address {
  city: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
}

const API_URL = "https://jsonplaceholder.typicode.com/users";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchUser(id: number): Promise<User | null> {
  try {
    const user = await fetchJson<User>(`${API_URL}/${id}`);
    console.log(user.address.city);

    return user;
  } catch (error) {
    console.error("Не удалось загрузить пользователя", error);
    return null;
  }
}

export async function fetchUsers(city?: string): Promise<User[]> {
  try {
    const users = await fetchJson<User[]>(API_URL);

    if (city === undefined) {
      return users;
    }

    return users.filter((user) => user.address.city === city);
  } catch (error) {
    console.error("Не удалось загрузить пользователей", error);
    return [];
  }
}
