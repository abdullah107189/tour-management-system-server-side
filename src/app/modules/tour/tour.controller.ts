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
const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TourServices.updateTourType(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
export const TourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
};
