import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.booking;
  const result = await PaymentServices.initPayment(bookingId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created Successfully",
    data: result,
  });
});
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.query;
  const result = await PaymentServices.successPayment(
    payload as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${payload.transactionId}&message=${result.message}&amount=${payload.amount}&status=${payload.status}`
    );
  }
});
const failedPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.query;
  const result = await PaymentServices.failedPayment(
    payload as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${payload.transactionId}&message=${result.message}&amount=${payload.amount}&status=${payload.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.query;
  const result = await PaymentServices.cancelPayment(
    payload as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${payload.transactionId}&message=${result.message}&amount=${payload.amount}&status=${payload.status}`
    );
  }
});
export const PaymentController = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
