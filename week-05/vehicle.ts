export abstract class Vehicle {
  private readonly id: number;

  constructor(
    public brand: string,
    protected year: number,
  ) {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
  }

  getId(): number {
    return this.id;
  }

  abstract getInfo(): string;

  startEngine(): void {
    console.log("Двигатель запущен");
  }
}
