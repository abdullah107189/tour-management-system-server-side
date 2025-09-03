/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TourServices } from "./tour.services";
import { ITour } from "./tour.interface";
// =========================| Tour Type |==========================
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
      statusCode: httpStatus.OK,
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
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourServices.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

// ====================| tour |=================

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };
    const result = await TourServices.createTour(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: result,
      message: "Tour created successfully",
    });
  }
);
const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TourServices.getAllTours(
      query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: "Tours retrieved successfully",
    });
  }
);
const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await TourServices.getSingleTour(slug);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: "Tour Get successfully",
    });
  }
);
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await TourServices.updateTour(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: "Tour Update successfully",
    });
  }
);
const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourServices.deleteTour(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});
export const TourController = {
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
