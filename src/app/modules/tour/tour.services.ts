// import { excludeField } from "../../constant";
import { deleteImagesFromCloudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
// import { tourSearchableFields } from "./tour.constant";
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

// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page);
//   const limit = Number(query.limit);
//   const skip = (page - 1) * limit;
//   // searchQuery
//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }
//   const result = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);
//   const totalTourTypes = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTourTypes / limit);
//   return {
//     data: result,
//     meta: {
//       page,
//       limit,
//       totalPage,
//       total: totalTourTypes,
//     },
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder.filter().search().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const getSingleTour = async (slug: string) => {
  const isFind = await Tour.findOne({ slug });
  if (!isFind) {
    throw new Error("Tour don't exists.");
  }
  return isFind;
};

// const updateTour = async (id: string, payload: ITour) => {
//   const existingTour = await Tour.findById(id);
//   if (!existingTour) {
//     throw new Error("Tour not found");
//   }
//   // add
//   if (
//     payload.images &&
//     payload.images.length > 0 &&
//     existingTour.images &&
//     existingTour.images.length > 0
//   ) {
//     payload.images = [...payload.images, ...existingTour.images];
//   }

//   // delete
//   if (
//     payload.deleteImages &&
//     payload.deleteImages.length > 0 &&
//     existingTour.images &&
//     existingTour.images.length > 0
//   ) {
//     const restDBImages = existingTour.images.filter(
//       (imageUrl) => !payload.deleteImages?.includes(imageUrl)
//     );
//     const updatedPayloadImages = (payload.images || [])
//       .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
//       .filter((imageUrl) => !restDBImages.includes(imageUrl));
//     payload.images = [...restDBImages, ...updatedPayloadImages];
//   }
//   const updateTourType = await Tour.findByIdAndUpdate(id, payload, {
//     new: true,
//   });
//   if (
//     payload.deleteImages &&
//     payload.deleteImages.length > 0 &&
//     existingTour.images &&
//     existingTour.images.length > 0
//   ) {
//     await Promise.all(
//       payload.deleteImages.map((url) => deleteImagesFromCloudinary(url))
//     );
//   }
//   return updateTourType;
// };

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  // if (payload.title) {
  //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
  //     let slug = `${baseSlug}`

  //     let counter = 0;
  //     while (await Tour.exists({ slug })) {
  //         slug = `${slug}-${counter++}` // dhaka-division-2
  //     }

  //     payload.slug = slug
  // }

  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl)
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }
  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImagesFromCloudinary(url))
    );
  }

  return updatedTour;
};
// const deleteTour = async (id: string) => {
//   const isFind = await Tour.findById(id);
//   if (!isFind) {
//     throw new Error("Tour don't exists.");
//   }
//   return await Tour.findByIdAndDelete(id);
// };

const deleteTour = async (id: string) => {
  const isFind = await Tour.findById(id);

  if (!isFind) {
    throw new Error("Tour don't exists.");
  }
  if (isFind.images && isFind.images.length > 0) {
    await Promise.all(
      isFind.images.map((url) => deleteImagesFromCloudinary(url))
    );
  }

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
