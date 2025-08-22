import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const result = await Division.create(payload);
  return result;
};
export const divisionServices = {
  createDivision,
};
