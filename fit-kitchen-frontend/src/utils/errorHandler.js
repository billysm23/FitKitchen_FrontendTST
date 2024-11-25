import { ErrorCodes } from './errorCodes';

class ApiError {
    // Konstanta tipe error
    static ERROR_TYPES = {
        AUTH: '1',
        VALIDATION: '2',
        RESOURCE: '3',
        DATABASE: '4',
        BUSINESS: '5',
        SERVER: '9'
    };

    // Konstanta action
    static ACTIONS = {
        RETRY: 'retry',
        LOGIN: 'login',
        LOGOUT: 'logout',
        VALIDATE: 'validate',
        REFRESH: 'refresh',
        REDIRECT: 'redirect'
    };

    static handle(error) {
        // Logging untuk development
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                error,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }

        // Error dari backend
        if (error.response?.data?.error) {
            const errorData = error.response.data.error;
            return {
                message: this.getCustomErrorMessage(errorData.code) || errorData.message,
                code: errorData.code,
                field: this.getErrorField(errorData.code),
                action: this.getErrorAction(errorData.code),
                isRetryable: this.isRetryableError(errorData.code),
                statusCode: error.response.status,
                timestamp: new Date().toISOString()
            };
        }

        // Error HTTP tanpa format khusus
        if (error.response) {
            return {
                message: this.getHttpErrorMessage(error.response.status),
                code: `HTTP_${error.response.status}`,
                action: this.ACTIONS.RETRY,
                isRetryable: true,
                statusCode: error.response.status,
                timestamp: new Date().toISOString()
            };
        }

        // Network error
        if (error.request) {
            return {
                message: 'Unable to connect to server. Please check your connection.',
                code: 'NETWORK_ERROR',
                action: this.ACTIONS.RETRY,
                isRetryable: true,
                timestamp: new Date().toISOString()
            };
        }

        // Error lainnya
        return {
            message: error.message || 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            action: this.ACTIONS.RETRY,
            isRetryable: true,
            timestamp: new Date().toISOString()
        };
    }

    // Custom error messages
    static getCustomErrorMessage(code) {
        const messages = {
            [ErrorCodes.INVALID_CREDENTIALS]: 'The email or password you entered is incorrect.',
            [ErrorCodes.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
            [ErrorCodes.TOKEN_INVALID]: 'Your session is invalid. Please log in again.',
            [ErrorCodes.USER_NOT_FOUND]: 'Account not found. Please check your email or register.',
            [ErrorCodes.UNAUTHORIZED]: 'You need to be logged in to access this content.',
            [ErrorCodes.SESSION_EXISTS]: 'You are already logged in on another device.',
            [ErrorCodes.SESSION_INVALID]: 'Your session has ended. Please log in again.',
            [ErrorCodes.RESOURCE_NOT_FOUND]: 'The requested content could not be found.',
            [ErrorCodes.LESSON_LOCKED]: 'This lesson is locked. Complete the prerequisites first.',
            [ErrorCodes.PREREQUISITE_NOT_MET]: 'You need to complete previous lessons first.'
        };

        return messages[code];
    }

    // HTTP error messages
    static getHttpErrorMessage(status) {
        const messages = {
            400: 'Invalid request. Please check your input.',
            401: 'You need to be logged in to access this content.',
            403: 'You do not have permission to access this content.',
            404: 'The requested content could not be found.',
            408: 'Request timeout. Please try again.',
            429: 'Too many requests. Please try again later.',
            500: 'Server error. Please try again later.',
            502: 'Server is temporarily unavailable. Please try again later.',
            503: 'Service unavailable. Please try again later.',
            504: 'Gateway timeout. Please try again later.'
        };

        return messages[status] || 'An error occurred. Please try again.';
    }

    // Menentukan field yang bermasalah dengan lebih detail
    static getErrorField(code) {
        const errorFields = {
            [ErrorCodes.INVALID_CREDENTIALS]: ['email', 'password'],
            [ErrorCodes.USER_NOT_FOUND]: ['email'],
            [ErrorCodes.VALIDATION_ERROR]: ['form'],
            [ErrorCodes.INVALID_INPUT]: ['form'],
            [ErrorCodes.MISSING_FIELD]: ['form'],
            [ErrorCodes.INVALID_FORMAT]: ['form'],
            [ErrorCodes.RESOURCE_EXISTS]: ['email', 'username']
        };

        return errorFields[code] || null;
    }

    // Menentukan tindakan dengan logic yang lebih terstruktur
    static getErrorAction(code) {
        const firstDigit = code.charAt(0);

        switch (firstDigit) {
            case this.ERROR_TYPES.AUTH:
                if ([ErrorCodes.TOKEN_EXPIRED, ErrorCodes.TOKEN_INVALID, 
                    ErrorCodes.SESSION_INVALID].includes(code)) {
                    return this.ACTIONS.LOGIN;
                }
                if (code === ErrorCodes.SESSION_EXISTS) {
                    return this.ACTIONS.LOGOUT;
                }
                return this.ACTIONS.RETRY;

            case this.ERROR_TYPES.VALIDATION:
                return this.ACTIONS.VALIDATE;

            case this.ERROR_TYPES.DATABASE:
            case this.ERROR_TYPES.SERVER:
                return this.ACTIONS.RETRY;

            default:
                return this.ACTIONS.RETRY;
        }
    }

    // Helper untuk menentukan apakah error bisa di-retry
    static isRetryableError(code) {
        const retryableCodes = [
            ErrorCodes.CONNECTION_ERROR,
            ErrorCodes.DB_ERROR,
            ErrorCodes.QUERY_ERROR,
            ErrorCodes.SERVICE_UNAVAILABLE,
            ErrorCodes.INTERNAL_SERVER_ERROR
        ];

        return retryableCodes.includes(code);
    }

    // Helper untuk mendapatkan error severity
    static getErrorSeverity(code) {
        const firstDigit = code.charAt(0);
        
        switch (firstDigit) {
            case this.ERROR_TYPES.AUTH:
                return 'warning';
            case this.ERROR_TYPES.VALIDATION:
                return 'info';
            case this.ERROR_TYPES.DATABASE:
            case this.ERROR_TYPES.SERVER:
                return 'error';
            default:
                return 'warning';
        }
    }
}

export default ApiError;