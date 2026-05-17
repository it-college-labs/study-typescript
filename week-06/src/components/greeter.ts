import { formatDate } from "@/utils/formatters";

export function sayHello(name: string): string {
  return `Привет, ${name}! Сегодня ${formatDate(new Date())}.`;
}
