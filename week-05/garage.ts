import { Vehicle } from "./vehicle";

export class Garage {
  private vehicles: Vehicle[] = [];

  addVehicle(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
  }

  listVehicles(): void {
    this.vehicles.forEach((vehicle) => console.log(vehicle.getInfo()));
  }

  findVehicleById(id: number): Vehicle | undefined {
    return this.vehicles.find((vehicle) => vehicle.getId() === id);
  }
}
