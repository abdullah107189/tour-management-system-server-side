import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";
import { Role } from "../user/user.interface";

const createDivision = async (payload: Partial<IDivision>) => {
  const result = await Division.create(payload);
  return result;
};
const getAllDivision = async () => {
  const result = await Division.find();
  return result;
};
const updateDivision = async (
  id: string,
  payload: Partial<IDivision>,
  decodedToken: JwtPayload
) => {
  const isDivisionAvailable = await Division.findById(id);
  if (!isDivisionAvailable) {
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
  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updateDivision;
};
export const divisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
};
