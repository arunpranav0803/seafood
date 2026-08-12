import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  const adminPassword = await hashPassword('Admin1234!');
  const customerPassword = await hashPassword('Customer1234!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@seafood.market' },
    update: {},
    create: {
      email: 'admin@seafood.market',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@seafood.market' },
    update: {},
    create: {
      email: 'customer@seafood.market',
      passwordHash: customerPassword,
      role: 'CUSTOMER'
    }
  });

  await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      fullName: 'Maya Patel'
    }
  });

  await prisma.fisherman.upsert({
    where: { email: 'captain@seafood.market' },
    update: {},
    create: {
      name: 'Blue Harbor Catch',
      email: 'captain@seafood.market',
      phone: '+919876543210',
      location: 'Goa Coast',
      boatSource: 'Blue Harbor'
    }
  });

  const categories = [
    { name: 'Fish', slug: 'fish' },
    { name: 'Prawns', slug: 'prawns' },
    { name: 'Crab', slug: 'crab' },
    { name: 'Squid', slug: 'squid' },
    { name: 'Lobster', slug: 'lobster' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  const categoryMap = await prisma.category.findMany();

  const products = [
    {
      name: 'Pomfret',
      slug: 'pomfret',
      description: 'Silvery pomfret fresh from the morning catch.',
      category: 'fish',
      pricePerKg: 650,
      stockKg: 12,
      catchLocation: 'Goa Coast',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Tiger Prawns',
      slug: 'tiger-prawns',
      description: 'Large tiger prawns with firm, sweet texture.',
      category: 'prawns',
      pricePerKg: 880,
      stockKg: 8,
      catchLocation: 'Kochi Harbor',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Blue Crab',
      slug: 'blue-crab',
      description: 'Fresh blue crab with a tender meat yield.',
      category: 'crab',
      pricePerKg: 950,
      stockKg: 5,
      catchLocation: 'Mumbai Shore',
      imageUrl: 'https://images.unsplash.com/photo-1518907990464-0c5f5c9b8f70?auto=format&fit=crop&w=900&q=80'
    }
  ];

  for (const product of products) {
    const category = categoryMap.find((item) => item.slug === product.category);
    if (!category) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        description: product.description,
        pricePerKg: product.pricePerKg,
        stockKg: product.stockKg,
        catchLocation: product.catchLocation,
        imageUrl: product.imageUrl,
        status: 'PUBLISHED',
        publishedAt: new Date()
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: category.id,
        pricePerKg: product.pricePerKg,
        stockKg: product.stockKg,
        status: 'PUBLISHED',
        catchDate: new Date(),
        catchLocation: product.catchLocation,
        imageUrl: product.imageUrl,
        publishedAt: new Date()
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
