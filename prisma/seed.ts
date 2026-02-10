import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  const seller1 = await prisma.seller.upsert({
    where: { email: 'johndoe@seller.com' },
    update: {},
    create: {
      name: 'John Doe Electronics',
      email: 'johndoe@seller.com',
      phone: '+62-812-3456-7890',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
      description:
        'Trusted electronics seller with 10+ years of experience. We provide genuine products with warranty.',
    },
  })

  const seller2 = await prisma.seller.upsert({
    where: { email: 'fashionstore@seller.com' },
    update: {},
    create: {
      name: 'Fashion Store Indo',
      email: 'fashionstore@seller.com',
      phone: '+62-813-9876-5432',
      address: 'Jl. Gatot Subroto No. 456, Bandung, Jawa Barat 40264',
      description:
        'Your go-to destination for trendy fashion items. Quality products at affordable prices.',
    },
  })

  const seller3 = await prisma.seller.upsert({
    where: { email: 'foodmarket@seller.com' },
    update: {},
    create: {
      name: 'Food Market Semarang',
      email: 'foodmarket@seller.com',
      phone: '+62-815-1122-3344',
      address: 'Jl. Pemuda No. 789, Semarang, Jawa Tengah 50132',
      description: 'Fresh and quality food products delivered daily. Supporting local farmers.',
    },
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Smartphone Samsung Galaxy A54',
        description:
          'High-performance smartphone with 5G connectivity, 6.4" Super AMOLED display, and 50MP camera.',
        price: 5499000,
        stock: 25,
        category: 'Electronics',
        sellerId: seller1.id,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      },
      {
        name: 'Laptop ASUS VivoBook 14',
        description:
          'Lightweight laptop perfect for work and entertainment. Intel Core i5, 8GB RAM, 512GB SSD.',
        price: 7999000,
        stock: 15,
        category: 'Electronics',
        sellerId: seller1.id,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      },
      {
        name: 'Wireless Headphones Sony WH-1000XM5',
        description:
          'Premium noise-canceling headphones with exceptional sound quality and 30-hour battery life.',
        price: 4299000,
        stock: 30,
        category: 'Electronics',
        sellerId: seller1.id,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      },
    ],
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Cotton T-Shirt',
        description:
          'Comfortable and stylish cotton t-shirt available in multiple colors. Perfect for daily wear.',
        price: 125000,
        stock: 100,
        category: 'Fashion',
        sellerId: seller2.id,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      },
      {
        name: 'Slim Fit Denim Jeans',
        description:
          'Classic denim jeans with modern slim fit. Durable and comfortable for all-day wear.',
        price: 350000,
        stock: 60,
        category: 'Fashion',
        sellerId: seller2.id,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      },
      {
        name: 'Casual Sneakers',
        description:
          'Trendy and comfortable sneakers suitable for various occasions. Non-slip rubber sole.',
        price: 450000,
        stock: 40,
        category: 'Fashion',
        sellerId: seller2.id,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      },
    ],
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Organic Brown Rice 5kg',
        description: 'Premium organic brown rice from local farmers. Rich in nutrients and fiber.',
        price: 85000,
        stock: 150,
        category: 'Food',
        sellerId: seller3.id,
      },
      {
        name: 'Fresh Vegetables Package',
        description: 'Daily fresh vegetables package including tomatoes, lettuce, carrots, and more.',
        price: 45000,
        stock: 200,
        category: 'Food',
        sellerId: seller3.id,
      },
      {
        name: 'Premium Arabica Coffee Beans 250g',
        description: 'Freshly roasted arabica coffee beans from Indonesian highlands. Rich aroma and taste.',
        price: 95000,
        stock: 80,
        category: 'Food',
        sellerId: seller3.id,
      },
    ],
  })

  console.log('Database seeding completed successfully')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })