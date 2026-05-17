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

export async function fetchUser(id: number): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const user = (await response.json()) as User;
    console.log(user.address.city);

    return user;
  } catch (error) {
    console.error("Не удалось загрузить пользователя", error);
    return null;
  }
}

export async function fetchUsers(city?: string): Promise<User[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const users = (await response.json()) as User[];

    if (city === undefined) {
      return users;
    }

    return users.filter((user) => user.address.city === city);
  } catch (error) {
    console.error("Не удалось загрузить пользователей", error);
    return [];
  }
}
