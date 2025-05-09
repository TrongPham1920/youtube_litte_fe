export interface ValidationErrors {
    email?: string;
    password?: string;
    username?: string;
}

export const validateInputs = ({
    email,
    password,
    username,
}: {
    email: string;
    password: string;
    username?: string;
}): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    // Username validation (only for signup)
    if (username !== undefined) {
        if (!username) {
            errors.username = 'Username is required';
        } else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }
    }

    return errors;
};