import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// ====================| tour Types |=================

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
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }
  return await TourType.findByIdAndDelete(id);
};

// ====================| tour |=================

const createTour = async (payload: ITour) => {
  const existingTourType = await TourType.findOne({ slug: payload.slug });
  if (existingTourType) {
    throw new Error("Tour slug already exists.");
  }
  return await Tour.create(payload);
};
export const TourServices = {
  // tour types
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  //   tour
  createTour,
};
