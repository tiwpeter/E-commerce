import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export interface AddressDto {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export class AddressService {
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: AddressDto) {
    // If setting as default, unset others
    if (dto.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: { userId, ...dto, country: dto.country ?? 'US' },
    });
  }

  async update(userId: string, addressId: string, dto: Partial<AddressDto>) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundError('Address not found');
    if (address.userId !== userId) throw new ForbiddenError('Access denied');

    if (dto.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({ where: { id: addressId }, data: dto });
  }

  async delete(userId: string, addressId: string): Promise<void> {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundError('Address not found');
    if (address.userId !== userId) throw new ForbiddenError('Access denied');

    await prisma.address.delete({ where: { id: addressId } });
  }
}

export const addressService = new AddressService();
