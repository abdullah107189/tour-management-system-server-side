/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionServices.createDivision(req.body);
    sendResponse(res, {
      success: true,
      message: "Division Created Successful",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  }
);
const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionServices.getAllDivision();
    sendResponse(res, {
      success: true,
      message: "Division Created Successful",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  }
);
export const divisionController = {
  createDivision,
  getAllDivision,
};
