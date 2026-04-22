import * as dotenv from 'dotenv';
dotenv.config();

// import หลัง dotenv.config() เพื่อให้ env โหลดก่อน
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function clean() {
  await prisma.variantOptionValue.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.optionValue.deleteMany()
  await prisma.productOption.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.shippingRate.deleteMany()
  await prisma.shippingMethod.deleteMany()
  await prisma.shippingZone.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleaned all existing data')
}

async function main() {
  await clean()

  // ─── CATEGORY ────────────────────────────────────────────────────────────

  const parentCategory = await prisma.category.create({
    data: {
      id: 'cat_parent_001',
      name: 'เสื้อผ้า',
      slug: 'clothing',
      description: 'เสื้อผ้าแฟชั่นสำหรับทุกเพศทุกวัย',
      image: 'https://cdn.example.com/categories/clothing.jpg',
      isActive: true,
    },
  })

  const subCategory = await prisma.category.create({
    data: {
      id: 'cat_sub_001',
      name: 'เสื้อยืด',
      slug: 'tshirt',
      description: 'เสื้อยืดแขนสั้น ผ้านุ่ม สวมใส่สบาย',
      image: 'https://cdn.example.com/categories/tshirt.jpg',
      parentId: parentCategory.id,
      isActive: true,
    },
  })

  // ─── USER ────────────────────────────────────────────────────────────────

  const user = await prisma.user.create({
    data: {
      id: 'user_001',
      email: 'somchai.jaidee@gmail.com',
      password: '$2b$10$hashedpasswordhere',   // bcrypt hash ของ "password123"
      name: 'สมชาย ใจดี',
      role: 'USER',
      isActive: true,
      emailVerified: true,
      avatar: 'https://cdn.example.com/avatars/user_001.jpg',
    },
  })

  // ─── ADDRESS ─────────────────────────────────────────────────────────────

  const address = await prisma.address.create({
    data: {
      id: 'addr_001',
      userId: user.id,
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      phone: '0812345678',
      addressLine1: '123/45 ถนนสุขุมวิท ซอย 11',
      addressLine2: 'แขวงคลองเตยเหนือ เขตวัฒนา',
      city: 'กรุงเทพมหานคร',
      state: 'กรุงเทพมหานคร',
      postalCode: '10110',
      country: 'TH',
      isDefault: true,
    },
  })

  // ─── SHIPPING ─────────────────────────────────────────────────────────────

  const shippingZone = await prisma.shippingZone.create({
    data: {
      id: 'zone_001',
      name: 'ทั่วประเทศ',
      countries: ['TH'],
      isActive: true,
    },
  })

  const shippingMethod = await prisma.shippingMethod.create({
    data: {
      id: 'method_001',
      name: 'Kerry Express',
      code: 'KERRY',
      logo: 'https://cdn.example.com/shipping/kerry.png',
      trackingUrl: 'https://th.kerryexpress.com/track/?track={trackingNumber}',
      isActive: true,
    },
  })

  await prisma.shippingRate.create({
    data: {
      zoneId: shippingZone.id,
      methodId: shippingMethod.id,
      type: 'FLAT',
      price: '50.00',
      estimatedDays: 2,
      isActive: true,
    },
  })

  // ─── PRODUCT ─────────────────────────────────────────────────────────────

  const product = await prisma.product.create({
    data: {
      id: 'prod_001',
      name: 'เสื้อยืด Oversize Basic Cotton',
      slug: 'oversize-basic-cotton-tshirt',
      description: 'เสื้อยืด Oversize ทรงสวย ผ้า Cotton 100% น้ำหนักเนื้อผ้า 180 แกรม ระบายอากาศได้ดี เหมาะกับทุก Outfit',
      basePrice: '290.00',
      comparePrice: '390.00',
      sku: 'TSH-OVS-CTN-001',
      weight: 200,
      isActive: true,
      isFeatured: true,
      hasVariants: true,
      stock: 0,
      categoryId: subCategory.id,
    },
  })

  // ─── PRODUCT IMAGES ──────────────────────────────────────────────────────

  await prisma.productImage.createMany({
    data: [
      { url: 'https://cdn.example.com/products/tsh-ovs-ctn-001/front.jpg', alt: 'ด้านหน้า', isPrimary: true,  order: 0, productId: product.id },
      { url: 'https://cdn.example.com/products/tsh-ovs-ctn-001/back.jpg',  alt: 'ด้านหลัง', isPrimary: false, order: 1, productId: product.id },
      { url: 'https://cdn.example.com/products/tsh-ovs-ctn-001/detail.jpg',alt: 'รายละเอียดผ้า', isPrimary: false, order: 2, productId: product.id },
    ],
  })

  // ─── PRODUCT OPTIONS ─────────────────────────────────────────────────────

  const optionColor = await prisma.productOption.create({
    data: { productId: product.id, name: 'สี', order: 0 },
  })
  const optionSize = await prisma.productOption.create({
    data: { productId: product.id, name: 'ขนาด', order: 1 },
  })

  // ─── OPTION VALUES ───────────────────────────────────────────────────────

  const [colorBlack, colorWhite, colorNavy] = await Promise.all([
    prisma.optionValue.create({ data: { optionId: optionColor.id, value: 'ดำ',     order: 0 } }),
    prisma.optionValue.create({ data: { optionId: optionColor.id, value: 'ขาว',    order: 1 } }),
    prisma.optionValue.create({ data: { optionId: optionColor.id, value: 'กรมท่า', order: 2 } }),
  ])
  const [sizeS, sizeM, sizeL, sizeXL] = await Promise.all([
    prisma.optionValue.create({ data: { optionId: optionSize.id, value: 'S',  order: 0 } }),
    prisma.optionValue.create({ data: { optionId: optionSize.id, value: 'M',  order: 1 } }),
    prisma.optionValue.create({ data: { optionId: optionSize.id, value: 'L',  order: 2 } }),
    prisma.optionValue.create({ data: { optionId: optionSize.id, value: 'XL', order: 3 } }),
  ])

  // ─── PRODUCT VARIANTS ────────────────────────────────────────────────────

  const variantDefs = [
    { sku: 'TSH-OVS-CTN-BLK-S',  colorVal: colorBlack, sizeVal: sizeS,  price: '290.00', stock: 15, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/black.jpg' },
    { sku: 'TSH-OVS-CTN-BLK-M',  colorVal: colorBlack, sizeVal: sizeM,  price: '290.00', stock: 30, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/black.jpg' },
    { sku: 'TSH-OVS-CTN-BLK-L',  colorVal: colorBlack, sizeVal: sizeL,  price: '290.00', stock: 25, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/black.jpg' },
    { sku: 'TSH-OVS-CTN-BLK-XL', colorVal: colorBlack, sizeVal: sizeXL, price: '320.00', stock: 10, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/black.jpg' },
    { sku: 'TSH-OVS-CTN-WHT-S',  colorVal: colorWhite, sizeVal: sizeS,  price: '290.00', stock: 12, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/white.jpg' },
    { sku: 'TSH-OVS-CTN-WHT-M',  colorVal: colorWhite, sizeVal: sizeM,  price: '290.00', stock: 28, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/white.jpg' },
    { sku: 'TSH-OVS-CTN-WHT-L',  colorVal: colorWhite, sizeVal: sizeL,  price: '290.00', stock: 20, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/white.jpg' },
    { sku: 'TSH-OVS-CTN-WHT-XL', colorVal: colorWhite, sizeVal: sizeXL, price: '320.00', stock: 8,  image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/white.jpg' },
    { sku: 'TSH-OVS-CTN-NVY-S',  colorVal: colorNavy,  sizeVal: sizeS,  price: '290.00', stock: 10, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/navy.jpg' },
    { sku: 'TSH-OVS-CTN-NVY-M',  colorVal: colorNavy,  sizeVal: sizeM,  price: '290.00', stock: 22, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/navy.jpg' },
    { sku: 'TSH-OVS-CTN-NVY-L',  colorVal: colorNavy,  sizeVal: sizeL,  price: '290.00', stock: 18, image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/navy.jpg' },
    { sku: 'TSH-OVS-CTN-NVY-XL', colorVal: colorNavy,  sizeVal: sizeXL, price: '320.00', stock: 5,  image: 'https://cdn.example.com/products/tsh-ovs-ctn-001/navy.jpg' },
  ]

  const createdVariants: Record<string, string> = {}  // sku → id

  for (const def of variantDefs) {
    const variant = await prisma.productVariant.create({
      data: {
        productId:    product.id,
        sku:          def.sku,
        price:        def.price,
        comparePrice: '390.00',
        stock:        def.stock,
        weight:       200,
        image:        def.image,
        isActive:     true,
      },
    })
    createdVariants[def.sku] = variant.id

    await prisma.variantOptionValue.createMany({
      data: [
        { variantId: variant.id, optionValueId: def.colorVal.id },
        { variantId: variant.id, optionValueId: def.sizeVal.id  },
      ],
    })
  }

  // ─── CART ─────────────────────────────────────────────────────────────────

  const cart = await prisma.cart.create({
    data: { userId: user.id },
  })

  await prisma.cartItem.create({
    data: {
      cartId:    cart.id,
      productId: product.id,
      variantId: createdVariants['TSH-OVS-CTN-BLK-M'],
      quantity:  2,
    },
  })

  // ─── ORDER ────────────────────────────────────────────────────────────────

  const order = await prisma.order.create({
    data: {
      id:              'order_001',
      orderNumber:     'ORD-20240422-0001',
      userId:          user.id,
      addressId:       address.id,
      shippingMethodId: shippingMethod.id,
      status:          'PAID',
      subtotal:        '580.00',   // 290 × 2
      shippingFee:     '50.00',
      discount:        '0.00',
      total:           '630.00',
      notes:           'ฝากไว้ที่นิติบุคคลได้เลยครับ',
      shippedAt:       null,
      completedAt:     null,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId:      order.id,
      productId:    product.id,
      variantId:    createdVariants['TSH-OVS-CTN-BLK-M'],
      quantity:     2,
      price:        '290.00',
      total:        '580.00',
      productName:  'เสื้อยืด Oversize Basic Cotton',
      variantLabel: 'ดำ / M',
    },
  })

  // ─── PAYMENT ─────────────────────────────────────────────────────────────

  await prisma.payment.create({
    data: {
      orderId:       order.id,
      amount:        '630.00',
      method:        'BANK_TRANSFER',
      status:        'SUCCESS',
      transactionId: 'TXN-20240422-ABC123',
      gatewayRef:    'REF-KBANK-987654',
      paidAt:        new Date('2024-04-22T10:30:00Z'),
      metadata:      { bank: 'KBANK', slip: 'https://cdn.example.com/slips/txn-abc123.jpg' },
    },
  })

  // ─── REVIEW ──────────────────────────────────────────────────────────────

  await prisma.review.create({
    data: {
      userId:     user.id,
      productId:  product.id,
      rating:     5,
      title:      'ผ้าดีมาก ทรงสวย',
      comment:    'สั่งมาใส่แล้วชอบมากเลยครับ ผ้านุ่ม ไม่ร้อน ทรง Oversize พอดี ไม่หลวมเกินไป จะสั่งเพิ่มอีกแน่นอน',
      isApproved: true,
    },
  })

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });