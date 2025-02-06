import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

interface AuthenticatedRequest extends Request{
  user?:any;
}



export async function AuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Debugging: Log all request headers to check if Authorization header is included
    console.log('Request Headers:', req.headers);

    // Debugging: Check if the Authorization header exists
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    // Check if the Authorization header is missing or incorrectly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Authorization header is missing or malformed');
        throw new HttpException('Authorization header missing or invalid', HttpStatus.UNAUTHORIZED);
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    console.log('Token Extracted:', token);

    try {
        // Debugging: Log the process of decoding the token
        console.log('Verifying token...');
        const decoded = jwt.verify(token,`${process.env.JWT_SECRET}`) as any;
        console.log('Decoded Token:', decoded);

        // Attach the user information to the request object
        req.user = decoded;
        console.log('User data attached to req:', req.user);

        // Proceed to the next middleware/handler
        next();
    } catch (error) {
        // Debugging: Log any errors during token verification
        console.error('Error during token verification:', error);
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
}
