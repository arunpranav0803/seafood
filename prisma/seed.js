const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SALT_BYTES = 16;
const HASH_KEY_LEN = 64;

async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, HASH_KEY_LEN).toString('hex');
  return `${salt}:${derivedKey}`;
}

async function main() {
  const adminPassword = await hashPassword('Admin1234!');
  const customerPassword = await hashPassword('Customer1234!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ungalmeenavan.com' },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@ungalmeenavan.com',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@ungalmeenavan.com' },
    update: {
      passwordHash: customerPassword,
      role: 'CUSTOMER'
    },
    create: {
      email: 'customer@ungalmeenavan.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER'
    }
  });

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      fullName: 'Maya Patel'
    }
  });

  await prisma.wishlist.upsert({
    where: { customerId: customerProfile.id },
    update: {},
    create: {
      customerId: customerProfile.id
    }
  });

  await prisma.address.upsert({
    where: { id: 'default-address' },
    update: {
      customerId: customerProfile.id
    },
    create: {
      id: 'default-address',
      customerId: customerProfile.id,
      label: 'Home',
      line1: '14 Beach Road',
      line2: 'Near Marine Plaza',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
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
    { name: 'Fresh Fish', slug: 'fresh-fish', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80', displayOrder: 1 },
    { name: 'Prawns', slug: 'prawns', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80', displayOrder: 2 },
    { name: 'Crab', slug: 'crab', imageUrl: 'https://images.unsplash.com/photo-1518907990464-0c5f5c9b8f70?auto=format&fit=crop&w=500&q=80', displayOrder: 3 },
    { name: 'Lobster', slug: 'lobster', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80', displayOrder: 4 },
    { name: 'Shellfish', slug: 'shellfish', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80', displayOrder: 5 },
    { name: 'Premium Catch', slug: 'premium-catch', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80', displayOrder: 6 }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  const categoryMap = await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });

  const products = [
    {
      name: 'Vanjaram',
      slug: 'vanjaram',
      description: 'Premium Vanjaram fillet, fresh from the northern Arabian Sea.',
      category: 'fresh-fish',
      mrp: 999,
      pricePerKg: 799,
      discountPercentage: 20,
      unit: 'kg',
      stockKg: 18,
      available: true,
      featured: true,
      bestseller: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 68,
      catchLocation: 'Kozhikode',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
      primaryImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
      cleaningAvailable: true,
      cleaningPrice: 70
    },
    {
      name: 'Tiger Prawns',
      slug: 'tiger-prawns',
      description: 'Large tiger prawns with firm texture and sweet coastal flavor.',
      category: 'prawns',
      mrp: 980,
      pricePerKg: 840,
      discountPercentage: 14,
      unit: 'kg',
      stockKg: 14,
      available: true,
      featured: true,
      bestseller: false,
      isNew: true,
      rating: 4.7,
      reviewCount: 42,
      catchLocation: 'Kochi Harbor',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
      primaryImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
      cleaningAvailable: true,
      cleaningPrice: 60
    },
    {
      name: 'Blue Crab',
      slug: 'blue-crab',
      description: 'Fresh blue crab with sweet meat and coastal aroma.',
      category: 'crab',
      mrp: 1100,
      pricePerKg: 920,
      discountPercentage: 16,
      unit: 'kg',
      stockKg: 10,
      available: true,
      featured: false,
      bestseller: false,
      isNew: false,
      rating: 4.6,
      reviewCount: 35,
      catchLocation: 'Mumbai Shore',
      imageUrl: 'https://images.unsplash.com/photo-1518907990464-0c5f5c9b8f70?auto=format&fit=crop&w=900&q=80',
      primaryImage: 'https://images.unsplash.com/photo-1518907990464-0c5f5c9b8f70?auto=format&fit=crop&w=900&q=80',
      cleaningAvailable: false,
      cleaningPrice: 0
    }
  ];

  for (const product of products) {
    const category = categoryMap.find((item) => item.slug === product.category);
    if (!category) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        description: product.description,
        mrp: product.mrp,
        pricePerKg: product.pricePerKg,
        discountPercentage: product.discountPercentage,
        unit: product.unit,
        stockKg: product.stockKg,
        available: product.available,
        featured: product.featured,
        bestseller: product.bestseller,
        isNew: product.isNew,
        rating: product.rating,
        reviewCount: product.reviewCount,
        catchLocation: product.catchLocation,
        imageUrl: product.imageUrl,
        primaryImage: product.primaryImage,
        cleaningAvailable: product.cleaningAvailable,
        cleaningPrice: product.cleaningPrice,
        status: 'PUBLISHED',
        publishedAt: new Date()
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: category.id,
        mrp: product.mrp,
        pricePerKg: product.pricePerKg,
        discountPercentage: product.discountPercentage,
        unit: product.unit,
        stockKg: product.stockKg,
        available: product.available,
        featured: product.featured,
        bestseller: product.bestseller,
        isNew: product.isNew,
        rating: product.rating,
        reviewCount: product.reviewCount,
        catchDate: new Date(),
        catchLocation: product.catchLocation,
        imageUrl: product.imageUrl,
        primaryImage: product.primaryImage,
        cleaningAvailable: product.cleaningAvailable,
        cleaningPrice: product.cleaningPrice,
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });
  }

  const banners = [
    {
      title: 'Fresh Catch of the Day',
      slug: 'fresh-catch-day',
      subtitle: 'Up to 20% off on premium seafood',
      ctaLabel: 'Shop now',
      ctaDestination: '/customer',
      imageUrl: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 1
    },
    {
      title: 'Live Market Pricing',
      slug: 'live-market-pricing',
      subtitle: 'Browse today’s freshest seafood with instant updates',
      ctaLabel: 'Explore menu',
      ctaDestination: '/customer',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      displayOrder: 2
    }
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { slug: banner.slug },
      update: {
        title: banner.title,
        subtitle: banner.subtitle,
        ctaLabel: banner.ctaLabel,
        ctaDestination: banner.ctaDestination,
        imageUrl: banner.imageUrl,
        enabled: true,
        displayOrder: banner.displayOrder,
        startDate: new Date(),
        endDate: null
      },
      create: {
        slug: banner.slug,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaLabel: banner.ctaLabel,
        ctaDestination: banner.ctaDestination,
        imageUrl: banner.imageUrl,
        enabled: true,
        displayOrder: banner.displayOrder,
        startDate: new Date()
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
