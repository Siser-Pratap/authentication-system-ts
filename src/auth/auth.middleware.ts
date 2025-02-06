import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface AuthenticatedRequest extends Request {
    user?: any;
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly UserService:UserService) {}

    async use(req:AuthenticatedRequest, res:Response, next:NextFunction){
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpException('Authorization header missing or invalid', HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as any;
            const user = await this.UserService.findUserById(decoded.id);
            req.user = user;
            next();
        } catch (error) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }

}


    

