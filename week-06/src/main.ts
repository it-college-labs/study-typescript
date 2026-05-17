import { sayHello } from "./components/greeter";

const message = sayHello("Анна");

console.log(message);

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.textContent = message;
}
