interface User {
  id: number;
  name: string;
  email?: string;
  age: number;
}

type UserEditForm = Pick<User, "id"> & Partial<Omit<User, "id">>;

interface SuccessResponse {
  status: "success";
  data: string;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

function processData(input: string): SuccessResponse | ErrorResponse {
  if (input.trim() === "") {
    return { status: "error", message: "Пустая строка" };
  }

  return { status: "success", data: input.toUpperCase() };
}

type ProcessResult = ReturnType<typeof processData>;
type ProcessSuccess = Extract<ProcessResult, { status: "success" }>;

function isProcessSuccess(value: unknown): value is ProcessSuccess {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (value as ProcessResult).status === "success";
}

const form: UserEditForm = { id: 1, name: "Анна" };
const result = processData("typescript");

if (isProcessSuccess(result)) {
  console.log(result.data);
}

console.log(form);

export {};
