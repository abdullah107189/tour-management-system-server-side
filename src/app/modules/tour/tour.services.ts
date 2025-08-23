import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne(payload);
  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }
  return await TourType.create(payload);
};
const getAllTourTypes = async () => {
  const result = await TourType.find({});
  const totalTourTypes = await TourType.countDocuments();
  return {
    data: result,
    meta: totalTourTypes,
  };
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour Types not found");
  }
  const updateTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updateTourType;
};
export const TourServices = {
  createTourType,
  getAllTourTypes,
  updateTourType,
};
