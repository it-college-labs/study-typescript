import { Vehicle } from "./vehicle";

export class Car extends Vehicle {
  constructor(
    brand: string,
    year: number,
    public model: string,
  ) {
    super(brand, year);
  }

  getInfo(): string {
    return `Автомобиль ${this.brand} ${this.model}, ${this.year} г.в. (ID: ${this.getId()})`;
  }

  startEngine(): void {
    console.log("Автомобиль заводится с ключа");
    super.startEngine();
  }
}
