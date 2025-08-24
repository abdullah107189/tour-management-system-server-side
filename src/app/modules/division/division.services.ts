import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";
import { Role } from "../user/user.interface";
import { createSlug } from "../../utils/createSlug";

const createDivision = async (payload: Partial<IDivision>) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("A division with this name already exists.");
  }
  const slugWithPayload = await createSlug(payload, payload.name as string);
  const division = await Division.create(slugWithPayload);
  return division;
};
const getAllDivision = async () => {
  const result = await Division.find();
  const totalDivisions = await Division.countDocuments();
  return {
    data: result,
    meta: {
      total: totalDivisions,
    },
  };
};
const updateDivision = async (
  id: string,
  payload: Partial<IDivision>,
  decodedToken: JwtPayload
) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not found");
  }

  if (decodedToken.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (
      decodedToken.role === Role.SUPER_ADMIN &&
      decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new Error("A division with this name already exists.");
  }
  if (payload.name) {
    const slugWithPayload = await createSlug(payload, payload.name as string);
    payload = slugWithPayload;
  }
  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updateDivision;
};
const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  if (division == null) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found.");
  }
  return division;
};
const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};
export const divisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
  getSingleDivision,
  deleteDivision,
};
