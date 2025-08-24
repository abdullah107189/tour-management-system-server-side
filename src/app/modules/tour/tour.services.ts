import { excludeField } from "../../constant";
import { tourSearchableFields } from "./tour.constant";
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
  const existingTourType = await TourType.findOne({ title: payload.title });

  if (existingTourType) {
    throw new Error("Tour slug already exists.");
  }
  const result = await Tour.create(payload);
  return result;
};

const getAllTours = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";
  const fields = query.fields.split(",").join(" ") || "";
  // searchQuery
  const searchQuery = {
    $or: tourSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };
  for (const field of excludeField) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }
  const result = await Tour.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields);
  const totalTourTypes = await Tour.countDocuments();
  return {
    data: result,
    meta: totalTourTypes,
  };
};
const getSingleTour = async (id: string) => {
  const isFind = await Tour.findById(id);
  if (!isFind) {
    throw new Error("Tour don't exists.");
  }
  await Tour.findByIdAndDelete(id);
  return null;
};

const updateTour = async (id: string, payload: ITour) => {
  const existingTourType = await Tour.findById(id);
  if (!existingTourType) {
    throw new Error("Tour not found");
  }
  const updateTourType = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updateTourType;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};
export const TourServices = {
  // tour types
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  //   tour
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
