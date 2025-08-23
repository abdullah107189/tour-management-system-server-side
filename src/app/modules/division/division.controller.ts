/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

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
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.params.id;
    const verifiedToken = req.user;
    const result = await divisionServices.updateDivision(
      id,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      message: "Division Created Successful",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  }
);
const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await divisionServices.getSingleDivision(slug);
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
  updateDivision,
  getSingleDivision,
};
