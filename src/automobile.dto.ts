export class AutomobileDto {
  id?: string; // Optional because Firestore generates this
  name: string;
  mpg: number;
  cylinders: number;
  displacement: number;
  horsepower: number | null;
  weight: number;
  acceleration: number;
  model_year: number;
  origin: string;
  dt_edt: string;
}