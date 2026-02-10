# Marketplace Admin Panel

Sistem admin panel untuk marketplace e-commerce yang dibangun dengan NestJS, Prisma, dan Tailwind CSS.

## Fitur

✅ **Autentikasi & Otorisasi**
- Login system dengan session management
- Protected admin routes

✅ **Manajemen Sellers**
- CRUD operations untuk sellers
- Daftar sellers dengan fitur pencarian
- Detail seller dengan daftar produk mereka

✅ **Manajemen Products**
- CRUD operations untuk products
- Relasi one-to-many dengan sellers
- Daftar products dengan fitur pencarian
- Detail product dengan informasi seller

✅ **Dashboard Admin**
- Statistik total sellers dan products
- Recent activity (sellers & products terbaru)

✅ **Pattern MVC**
- Model: Prisma Schema
- View: Handlebars templates
- Controller: NestJS Controllers

## Tech Stack

- **Backend Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: MySQL
- **View Engine**: Handlebars (HBS)
- **CSS Framework**: Tailwind CSS
- **Session Management**: express-session
- **Authentication**: bcrypt

## Database Schema

### Relasi Tabel
- `Seller` (1) → (Many) `Product` (One-to-Many)
- Setiap product memiliki satu seller
- Setiap seller bisa memiliki banyak products

### Tabel Users
- id, email, password, name, role, createdAt, updatedAt

### Tabel Sellers
- id, name, email, phone, address, description, createdAt, updatedAt

### Tabel Products
- id, name, description, price, stock, category, imageUrl, sellerId, createdAt, updatedAt

## Setup & Installation

### Prerequisites
- Node.js (v18 atau lebih baru)
- MySQL Database
- npm atau yarn

### Langkah Instalasi

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**

Buat database MySQL baru:
```sql
CREATE DATABASE marketplace_db;
```

3. **Konfigurasi Environment**

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:
```env
DATABASE_URL="mysql://root:password@localhost:3306/marketplace_db"
JWT_SECRET="your-secret-key-change-this-in-production"
SESSION_SECRET="your-session-secret-change-this-in-production"
```

4. **Generate Prisma Client**
```bash
npm run prisma:generate
```

5. **Run Database Migration**
```bash
npm run prisma:migrate
```

Ketika diminta nama migration, masukkan: `init` atau nama yang relevan.

6. **Seed Database (Data Awal)**
```bash
npm run prisma:seed
```

Ini akan membuat:
- 1 admin user
- 3 sellers
- 9 products (3 products untuk setiap seller)

7. **Start Application**
```bash
npm run start:dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

## Login Credentials

Setelah seeding database, gunakan kredensial berikut untuk login:

```
Email: admin@marketplace.com
Password: admin123
```

## Endpoint Routes

### Authentication
- `GET /auth/login` - Halaman login
- `POST /auth/login` - Process login
- `GET /auth/logout` - Logout

### Admin Dashboard
- `GET /admin/dashboard` - Dashboard utama

### Sellers Management
- `GET /admin/sellers` - Daftar sellers (dengan search)
- `GET /admin/sellers/create` - Form create seller
- `POST /admin/sellers/create` - Process create seller
- `GET /admin/sellers/:id` - Detail seller
- `GET /admin/sellers/:id/edit` - Form edit seller
- `POST /admin/sellers/:id/edit` - Process update seller
- `POST /admin/sellers/:id/delete` - Delete seller

### Products Management
- `GET /admin/products` - Daftar products (dengan search)
- `GET /admin/products/create` - Form create product
- `POST /admin/products/create` - Process create product
- `GET /admin/products/:id` - Detail product
- `GET /admin/products/:id/edit` - Form edit product
- `POST /admin/products/:id/edit` - Process update product
- `POST /admin/products/:id/delete` - Delete product

## Struktur Folder

```
marketplace-admin/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── src/
│   ├── admin/                 # Admin module
│   ├── auth/                  # Authentication module
│   ├── sellers/               # Sellers module (CRUD)
│   ├── products/              # Products module (CRUD)
│   ├── prisma/                # Prisma service
│   ├── app.module.ts          # Main app module
│   └── main.ts                # Application entry point
├── views/                     # Handlebars templates
│   ├── partials/
│   │   └── navbar.hbs
│   ├── admin/
│   │   └── dashboard.hbs
│   ├── auth/
│   │   └── login.hbs
│   ├── sellers/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   ├── edit.hbs
│   │   └── detail.hbs
│   ├── products/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   ├── edit.hbs
│   │   └── detail.hbs
│   └── layout.hbs
├── .env
├── package.json
└── tsconfig.json
```

## Fitur Pencarian

### Search Sellers
Cari sellers berdasarkan:
- Nama seller
- Email
- Nomor telepon

### Search Products
Cari products berdasarkan:
- Nama product
- Deskripsi
- Kategori

## Development

### Prisma Studio
Untuk melihat dan mengelola data dengan GUI:
```bash
npm run prisma:studio
```

### Watch Mode
```bash
npm run start:dev
```

### Build Production
```bash
npm run build
npm run start:prod
```

## Notes

- Semua halaman menggunakan server-side rendering (SSR) dengan Handlebars
- Session disimpan di memory
- Styling menggunakan Tailwind CSS via CDN
- Pattern MVC diterapkan dengan jelas:
  - **Model**: Prisma schema & services
  - **View**: Handlebars templates
  - **Controller**: NestJS controllers

## License

MIT