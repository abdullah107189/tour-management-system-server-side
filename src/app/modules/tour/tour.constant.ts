import { ITour } from "./tour.interface";

export const tourSearchableFields: (keyof ITour)[] = [
  "title",
  "description",
  "location",
];
