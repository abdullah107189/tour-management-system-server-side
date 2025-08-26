/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslcommerz/sslcommerz.interface";
import { SSLService } from "../sslcommerz/sslcommerz.services";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour"
    );
  }
  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };
  const sslPayment = await SSLService.sslPaymentInit(sslPayload);
  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      paymentUpdate?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      paymentUpdate?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Fail" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const paymentUpdate = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      paymentUpdate?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Cancel" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const PaymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
