// Custom error class banaya jo Node.js ke built-in Error class ko extend karta hai
class ApiError extends Error {
    constructor(
        statusCode,                       // HTTP status code (jaise 400, 404, 500)
        message = "something went wrong",  // Default error message agar koi na diya ho
        errors = [],                      // Extra error details (array form)
        stack = ""                       // Optional stack trace (debugging ke liye)
    ) {
        super(message);                   // Parent Error class ko call karna (Error ka message set karna)

        this.statusCode = statusCode;     // Error ka status code store karna
        this.data = null;                 // Extra data ke liye placeholder (by default null)
        this.message = message;           // Error ka message store karna
        this.errors = errors;             // Error details array store karna
        this.success = false;             // Success flag false (kyunki ye error hai)

        // Agar custom stack trace diya hai toh use karo
        if (stack) {
            this.stack = stack;
        } else {
            // Nahi toh Node.js apna stack trace automatically capture karega
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export karna taaki dusre files mein use ho sake
export { ApiError }