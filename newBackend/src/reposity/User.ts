// src/repositories/UserRepository.ts
import { PrismaClient } from '@prisma/client';
import { UserSchema } from '@/generated/zod'
import { z } from 'zod';

type User = z.infer<typeof UserSchema>;
const prisma = new PrismaClient(); 

export class UserRepository{
    async getall() : Promise<User[]> {
        const users = await prisma.user.findMany();
    // คุณสามารถใช้ UserSchema.parse() เพื่อ validate ข้อมูลที่ดึงมาจาก DB ได้ด้วย
    return users; 
  }

}