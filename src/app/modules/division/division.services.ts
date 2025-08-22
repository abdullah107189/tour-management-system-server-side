import { IDivision } from "./division.interface";

const createDivision = async (payload: Partial<IDivision>) => {
  console.log(payload);
};
export const divisionServices = {
  createDivision,
};
