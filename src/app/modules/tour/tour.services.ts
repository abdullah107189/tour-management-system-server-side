import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne(payload);
  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }
  return await TourType.create(payload);
};
export const TourServices = {
  createTourType,
};
