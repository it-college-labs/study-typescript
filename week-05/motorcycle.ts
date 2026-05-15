import { Vehicle } from "./vehicle";

export class Motorcycle extends Vehicle {
  constructor(
    brand: string,
    year: number,
    public type: string,
  ) {
    super(brand, year);
  }

  getInfo(): string {
    return `Мотоцикл ${this.brand}, тип ${this.type}, ${this.year} г.в. (ID: ${this.getId()})`;
  }
}
