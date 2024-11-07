import jwt from "jsonwebtoken";

export const signToken = async (data: any) => {
    return await jwt.sign(data, process.env.JWT_SECRET);
};


export const verifyToken = async (token: any) => {
    return await jwt.verify(token, process.env.JWT_SECRET);
};