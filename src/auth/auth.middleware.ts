import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export async function AuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('Authorization header missing or invalid', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as any;
        req.user = decoded;
        next();
    } catch (error) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
}
