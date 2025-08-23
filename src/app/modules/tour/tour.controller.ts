/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TourServices } from "./tour.services";
const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.createTourType(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: result,
      message: "Tour Type created successfully",
    });
  }
);
const getAllTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getAllTourTypes();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: result,
      message: "Tour Type All Get successfully",
    });
  }
);
export const TourController = {
  createTourType,
  getAllTourTypes,
};
