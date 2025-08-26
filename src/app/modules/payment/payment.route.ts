import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();
router.post("/initPayment/:booking", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failedPayment);
router.post("/cancel", PaymentController.cancelPayment);
export const PaymentRoutes = router;
