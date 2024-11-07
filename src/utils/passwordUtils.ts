// Import necessary modules
import bcrypt from "bcrypt";

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const verifyPassword = async (hash: string, password: string) => {
    return await bcrypt.compare(password, hash);
};


