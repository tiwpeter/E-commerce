import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Runs validation chains and returns 422 if any fail.
 * Usage: validate([body('email').isEmail(), ...])
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations in parallel
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({
          field: e.type === 'field' ? e.path : e.type,
          message: e.msg,
        })),
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  };
};
