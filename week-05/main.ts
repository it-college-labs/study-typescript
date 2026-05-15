import { Car } from "./car";
import { Garage } from "./garage";
import { Motorcycle } from "./motorcycle";

const garage = new Garage();

const car = new Car("Toyota", 2020, "Camry");
const motorcycle = new Motorcycle("Yamaha", 2022, "sport");

garage.addVehicle(car);
garage.addVehicle(motorcycle);

garage.listVehicles();

const foundVehicle = garage.findVehicleById(car.getId());

if (foundVehicle) {
  foundVehicle.startEngine();
}
