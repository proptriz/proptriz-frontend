import { AxiosError } from "axios";
import { toast } from "react-toastify";
import logger from "../../logger.config.mjs";

interface ValidationError {
  path: string;
  msg: string;
  type: string;
  location: string;
  value?: any;
}

interface ApiErrorResponse {
  message?: string;
  errors?: ValidationError[];
}

export class ApiErrorHandler {
  static handle(error: unknown, defaultMessage = "An error occurred") {
    if (error instanceof AxiosError) {
      const data = error.response?.data as ApiErrorResponse;

      // Handle validation errors
      if (error.response?.status === 400 && data?.errors?.length) {
        this.handleValidationErrors(data.errors);
        return;
      }

      // Handle general error message
      const errorMessage = data?.message || error.message || defaultMessage;
      logger.error("API Error:", error);
      toast.error(errorMessage);
      return;
    }

    logger.error("Unexpected error:", error);
    toast.error(defaultMessage);
  }

  private static handleValidationErrors(errors: ValidationError[]) {
    if (errors.length === 1) {
      toast.error(errors[0].msg);
    } else {
      const errorList = errors.map(e => `${e.path}: ${e.msg}`).join("\n");
      toast.error(`Please fix the following errors:\n${errorList}`);
    }
  }

  static getFieldError(errors: ValidationError[] | undefined, fieldName: string): string | null {
    if (!errors) return null;
    const error = errors.find(e => e.path === fieldName);
    return error?.msg || null;
  }
}

export const handleApiError = (error: unknown, defaultMessage?: string) => {
  ApiErrorHandler.handle(error, defaultMessage);
};