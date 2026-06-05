import type { ErrorRequestHandler } from "express";
import { AppError } from "./errors";
import { logger } from "./logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // ---- AppError ที่ throw มาตั้งใจ ----
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // ---- Error อื่นที่ไม่คาดคิด ----
  logger.error(err instanceof Error ? err.message : String(err), { stack: (err as Error).stack });

  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
};