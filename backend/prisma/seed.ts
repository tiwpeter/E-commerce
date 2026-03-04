import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Clean existing data ──────────────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // ─── Users ────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: passwordHash,
      role: Role.USER,
      emailVerified: true,
    },
  });

  const regularUser2 = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: passwordHash,
      role: Role.USER,
    },
  });

  console.log('✅ Created users');

  // ─── Categories ───────────────────────────────────────────────────
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion for all occasions',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
    },
  });

  const books = await prisma.category.create({
    data: {
      name: 'Books',
      slug: 'books',
      description: 'Books, e-books and audiobooks',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    },
  });

  // Subcategories
  const smartphones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest smartphones',
      parentId: electronics.id,
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and notebooks',
      parentId: electronics.id,
    },
  });

  console.log('✅ Created categories');

  // ─── Products ─────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. The most powerful iPhone ever made.',
        price: 999.99,
        comparePrice: 1099.99,
        stock: 50,
        sku: 'APPL-IP15P-256',
        categoryId: smartphones.id,
        isFeatured: true,
        weight: 0.187,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
              isPrimary: true,
              order: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1695048132654-c9b84cba78d3?w=800',
              isPrimary: false,
              order: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Pro 14"',
        slug: 'macbook-pro-14',
        description: 'MacBook Pro with M3 Pro chip. Up to 22-hour battery life, Liquid Retina XDR display, and all the ports you need.',
        price: 1999.99,
        comparePrice: 2199.99,
        stock: 25,
        sku: 'APPL-MBP14-M3P',
        categoryId: laptops.id,
        isFeatured: true,
        weight: 1.61,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Galaxy AI is here. The Galaxy S24 Ultra features an integrated S Pen and Galaxy AI capabilities.',
        price: 1299.99,
        stock: 35,
        sku: 'SMSN-GS24U-256',
        categoryId: smartphones.id,
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling headphones with 30-hour battery life and crystal clear hands-free calling.',
        price: 349.99,
        comparePrice: 399.99,
        stock: 75,
        sku: 'SONY-WH1000XM5',
        categoryId: electronics.id,
        isFeatured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Levi\'s 501 Original Jeans',
        slug: 'levis-501-original-jeans',
        description: 'The original jean since 1873. Straight fit with button fly. Made from sturdy denim.',
        price: 69.99,
        stock: 200,
        sku: 'LEVI-501-32x32',
        categoryId: clothing.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Clean Code by Robert Martin',
        slug: 'clean-code-robert-martin',
        description: 'A handbook of agile software craftsmanship. The book teaches principles, patterns, and practices of writing clean code.',
        price: 39.99,
        stock: 150,
        sku: 'BOOK-CLEANCODE',
        categoryId: books.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro (2nd Gen)',
        slug: 'airpods-pro-2nd-gen',
        description: 'AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Transparency.',
        price: 249.99,
        comparePrice: 279.99,
        stock: 100,
        sku: 'APPL-APP2-WHITE',
        categoryId: electronics.id,
        isFeatured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and USB charging port.',
        price: 79.99,
        stock: 60,
        sku: 'HOME-LAMP-LED-01',
        categoryId: homeGarden.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // ─── Addresses ────────────────────────────────────────────────────
  const address = await prisma.address.create({
    data: {
      userId: regularUser.id,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-0100',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      isDefault: true,
    },
  });

  console.log('✅ Created addresses');

  // ─── Cart ─────────────────────────────────────────────────────────
  const cart = await prisma.cart.create({
    data: {
      userId: regularUser.id,
      items: {
        create: [
          { productId: products[0].id, quantity: 1 },
          { productId: products[3].id, quantity: 2 },
        ],
      },
    },
  });

  console.log('✅ Created cart');

  // ─── Orders ───────────────────────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-K4F2X-2024',
      userId: regularUser.id,
      addressId: address.id,
      status: OrderStatus.COMPLETED,
      subtotal: 1249.98,
      shippingFee: 0,
      total: 1249.98,
      completedAt: new Date('2024-11-15'),
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 999.99,
            total: 999.99,
          },
          {
            productId: products[3].id,
            quantity: 1,
            price: 249.99,
            total: 249.99,
          },
        ],
      },
      payment: {
        create: {
          amount: 1249.98,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.SUCCESS,
          transactionId: 'TXN-K8X2P-ABC123',
          paidAt: new Date('2024-11-10'),
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-M9T3Y-2024',
      userId: regularUser.id,
      addressId: address.id,
      status: OrderStatus.SHIPPED,
      subtotal: 1999.99,
      shippingFee: 0,
      total: 1999.99,
      trackingNumber: 'TRK-US-789456123',
      shippedAt: new Date(),
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 1999.99,
            total: 1999.99,
          },
        ],
      },
      payment: {
        create: {
          amount: 1999.99,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.SUCCESS,
          transactionId: 'TXN-M5Z8K-DEF456',
          paidAt: new Date(),
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-P7N1Q-2024',
      userId: regularUser2.id,
      addressId: address.id,
      status: OrderStatus.PAID,
      subtotal: 389.98,
      shippingFee: 9.99,
      total: 399.97,
      items: {
        create: [
          {
            productId: products[4].id,
            quantity: 2,
            price: 69.99,
            total: 139.98,
          },
          {
            productId: products[5].id,
            quantity: 5,
            price: 39.99,
            total: 199.95,
          },
          {
            productId: products[7].id,
            quantity: 1,
            price: 79.99,
            total: 79.99,
          },
        ],
      },
      payment: {
        create: {
          amount: 399.97,
          method: PaymentMethod.MOCK_GATEWAY,
          status: PaymentStatus.SUCCESS,
          transactionId: 'TXN-P2W9R-GHI789',
          paidAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Created orders');

  // ─── Reviews ──────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: regularUser.id,
        productId: products[0].id,
        rating: 5,
        title: 'Best iPhone ever!',
        comment: 'The camera is absolutely incredible. Night mode photos look stunning.',
        isApproved: true,
      },
      {
        userId: regularUser2.id,
        productId: products[0].id,
        rating: 4,
        title: 'Great phone, pricey',
        comment: 'Performance is top-notch. Battery life improved significantly.',
        isApproved: true,
      },
      {
        userId: regularUser.id,
        productId: products[3].id,
        rating: 5,
        title: 'Best headphones I\'ve owned',
        comment: 'The noise cancellation is unreal. Comfort is excellent for long listening sessions.',
        isApproved: true,
      },
      {
        userId: regularUser2.id,
        productId: products[5].id,
        rating: 5,
        title: 'Must-read for developers',
        comment: 'This book changed how I think about code quality. Highly recommended.',
        isApproved: true,
      },
    ],
  });

  console.log('✅ Created reviews');

  console.log('\n🎉 Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Test accounts:');
  console.log('  Admin : admin@ecommerce.com / Password123');
  console.log('  User  : jane@example.com   / Password123');
  console.log('  User  : bob@example.com    / Password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
