# Platform E-Commerce Marketplace

## Daftar Isi
- [Ringkasan Proyek](#ringkasan-proyek)
- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Desain Database](#desain-database)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Titik Akhir API](#titik-akhir-api)
- [Peran Pengguna](#peran-pengguna)
- [Tangkapan Layar](#tangkapan-layar)
- [Dependensi](#dependensi)
- [Panduan Pengembangan](#panduan-pengembangan)
- [Pengujian](#pengujian)
- [Deployment](#deployment)

---

## Ringkasan Proyek

Platform E-Commerce Marketplace adalah pasar online lengkap yang dibangun dengan NestJS dan Prisma. Aplikasi ini mendukung dua peran pengguna yang berbeda: administrator yang mengelola penjual dan produk, serta pelanggan yang dapat menjelajahi produk, menambahkan item ke keranjang mereka, dan menyelesaikan pembelian.

### Kemampuan Utama
- Autentikasi dan otorisasi pengguna dengan kontrol akses berbasis peran
- Katalog produk dengan fungsi pencarian
- Manajemen keranjang belanja
- Pemrosesan pesanan dan checkout
- Manajemen profil pengguna
- Panel admin untuk mengelola penjual dan produk
- Desain responsif menggunakan Tailwind CSS

![GAMBAR PREVIEW](public/11211.png)
---

## Fitur

### Fitur Pelanggan
Pengguna dapat menggunakan aplikasi sebagai pelanggan dengan kemampuan berikut:
- Melakukan pendaftaran akun dan masuk ke sistem
- Menjelajahi katalog produk yang tersedia dengan fitur pencarian
- Melihat informasi produk secara detail
- Menambahkan produk ke dalam keranjang belanja
- Mengubah jumlah produk di dalam keranjang
- Melakukan proses checkout dan membuat pesanan
- Melihat riwayat pesanan yang telah dibuat
- Mengelola data profil pengguna
- Mengubah kata sandi akun

### Fitur Admin
Admin memiliki akses khusus untuk mengelola sistem melalui dasbor, dengan fitur:
- Akses dasbor admin yang aman
- Mengelola data penjual (menambah, melihat, memperbarui, dan menghapus)
- Mengelola data produk (menambah, melihat, memperbarui, dan menghapus)
- Melihat statistik sistem serta aktivitas terbaru
- Melakukan pencarian data penjual dan produk

### Fitur Umum
Fitur-fitur yang tersedia untuk mendukung keseluruhan sistem:
- Autentikasi pengguna berbasis sesi
- Rendering sisi server menggunakan Handlebars
- Antarmuka responsif menggunakan Tailwind CSS
- Navigasi dan elemen antarmuka yang menyesuaikan peran pengguna
- Navigasi kembali yang bersifat dinamis sesuai konteks pengguna

---

## Teknologi yang Digunakan

### Backend
- **Framework**: NestJS 11.x  
- **Bahasa Pemrograman**: TypeScript 5.x
- **ORM**: Prisma 5.x  
  Digunakan untuk pemodelan database dan manajemen query
- **Database**: MySQL 8.x
- **Autentikasi & Keamanan**:
  - `bcrypt` untuk hashing kata sandi
  - `express-session` untuk manajemen sesi pengguna

---

### Frontend
- **Mesin Template**: Handlebars (`hbs`)
- **Framework CSS**: Tailwind CSS 3.x
- **Rendering**: Server-Side Rendering (SSR)
- **Pendekatan UI**: Antarmuka berbasis peran (admin dan pelanggan)

---

### Alat dan Lingkungan Pengembangan
- **Manajer Paket**: npm
- **Build Tool**: NestJS CLI
- **Testing**: Jest (unit test dan end-to-end test)
- **Linting & Formatting**:
  - ESLint
  - Prettier
- **Database Tools**:
  - Prisma Migrate
  - Prisma Studio untuk visualisasi dan manajemen data

---

## Desain Database

### Entity Relationship Diagram (ERD)

![Homepage](public/Untitled.svg)

### Database Schema

#### Users Table
- **id**: Integer, Primary Key, Auto-increment
- **email**: String, Unique, Required
- **password**: String, Required (bcrypt hashed)
- **name**: String, Required
- **role**: String, Default: 'customer' (admin or customer)
- **phone**: String, Nullable
- **address**: Text, Nullable
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated

#### Sellers Table
- **id**: Integer, Primary Key, Auto-increment
- **name**: String, Required
- **email**: String, Unique, Required
- **phone**: String, Required
- **address**: Text, Required
- **description**: Text, Nullable
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated

#### Products Table
- **id**: Integer, Primary Key, Auto-increment
- **name**: String, Required
- **description**: Text, Required
- **price**: Decimal(10,2), Required
- **stock**: Integer, Default: 0
- **category**: String, Required
- **imageUrl**: String, Nullable
- **sellerId**: Integer, Foreign Key (references Sellers)
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated

#### Carts Table
- **id**: Integer, Primary Key, Auto-increment
- **userId**: Integer, Foreign Key (references Users), Unique
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated

#### CartItems Table
- **id**: Integer, Primary Key, Auto-increment
- **cartId**: Integer, Foreign Key (references Carts)
- **productId**: Integer, Foreign Key (references Products)
- **quantity**: Integer, Default: 1
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated
- **Unique Constraint**: (cartId, productId)

#### Orders Table
- **id**: Integer, Primary Key, Auto-increment
- **userId**: Integer, Foreign Key (references Users)
- **totalAmount**: Decimal(10,2), Required
- **status**: String, Default: 'pending' (pending, processing, completed, cancelled)
- **shippingAddress**: Text, Required
- **createdAt**: DateTime, Auto-generated
- **updatedAt**: DateTime, Auto-updated

#### OrderItems Table
- **id**: Integer, Primary Key, Auto-increment
- **orderId**: Integer, Foreign Key (references Orders)
- **productId**: Integer, Foreign Key (references Products)
- **quantity**: Integer, Required
- **price**: Decimal(10,2), Required (snapshot of price at order time)
- **createdAt**: DateTime, Auto-generated

### Relasi Antar Entitas

1. **Penjual ke Produk**: One-to-Many (1:N)
   - Satu penjual dapat memiliki banyak produk
   - Aturan penghapusan: ON DELETE CASCADE

2. **Pengguna ke Keranjang**: One-to-One (1:1)
   - Setiap pengguna memiliki tepat satu keranjang
   - Aturan penghapusan: ON DELETE CASCADE

3. **Keranjang ke CartItems**: One-to-Many (1:N)
   - Satu keranjang dapat berisi banyak item keranjang
   - Aturan penghapusan: ON DELETE CASCADE

4. **Produk ke CartItems**: One-to-Many (1:N)
   - Satu produk dapat muncul di banyak item keranjang
   - Aturan penghapusan: ON DELETE CASCADE

5. **Pengguna ke Pesanan**: One-to-Many (1:N)
   - Satu pengguna dapat membuat banyak pesanan
   - Aturan penghapusan: ON DELETE CASCADE

6. **Pesanan ke OrderItems**: One-to-Many (1:N)
   - Satu pesanan terdiri dari banyak item pesanan
   - Aturan penghapusan: ON DELETE CASCADE

7. **Produk ke OrderItems**: One-to-Many (1:N)
   - Satu produk dapat tercatat pada banyak item pesanan
   - Aturan penghapusan: ON DELETE RESTRICT / NO ACTION

---

## Instalasi

### Prasyarat
- Node.js versi 18 atau lebih tinggi
- npm versi 9 atau lebih tinggi
- MySQL versi 8 atau lebih tinggi
- Git

### Instalasi Langkah demi Langkah

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal.

---

**1. Kloning repositori**

```bash
git clone https://github.com/arfan-ivan/challenge_fullstack_marketplace.git
cd challenge_fullstack_marketplace
```

---

**2. Instal dependensi**

```bash
npm install
```

---

**3. Buat database MySQL**

Masuk ke MySQL dan buat database baru:

```bash
mysql -u root -p
CREATE DATABASE marketplace_db;
EXIT;
```

---

**4. Konfigurasi variabel lingkungan**

Salin file environment dan sesuaikan isinya dengan konfigurasi database lokal Anda:

```bash
cp .env.example .env
```

Pastikan nilai `DATABASE_URL` di file `.env` sudah benar.

---

**5. Jalankan migrasi database**

Perintah ini akan:

* Membuat file migration
* Menjalankan migration ke database
* Menghasilkan Prisma Client secara otomatis

```bash
npx prisma migrate dev
```

---

**6. Seed database (opsional)**

Jika tersedia data awal (seed), jalankan perintah berikut:

```bash
npm run prisma:seed
```

---

***Catatan***

* Tidak perlu menjalankan `prisma generate` secara manual karena sudah dijalankan otomatis oleh `prisma migrate dev`.
* Untuk environment production, gunakan:

```bash
npx prisma migrate deploy
```


## Konfigurasi

### Variabel Lingkungan

Buat file `.env` di direktori root dengan variabel berikut:

```env
DATABASE_URL="mysql://username:password@localhost:3306/marketplace_db"

JWT_SECRET="your-jwt-secret-key-min-32-characters"
SESSION_SECRET="your-session-secret-key-min-32-characters"

NODE_ENV="development"
PORT=3000
```

### Format String Koneksi Database
```
mysql://[username]:[password]@[host]:[port]/[database_name]
```

Contoh konfigurasi untuk lingkungan berbeda:

**Pengembangan (MySQL Lokal)**
```
DATABASE_URL="mysql://root:password@localhost:3306/marketplace_db"
```

**Pengembangan (XAMPP/WAMP)**
```
DATABASE_URL="mysql://root:@localhost:3306/marketplace_db"
```

**Produksi**
```
DATABASE_URL="mysql://user:secure_password@production-host:3306/marketplace_db"
```

---

## Menjalankan Aplikasi

### Mode Pengembangan
```bash
npm run start:dev
```
Aplikasi akan tersedia di `http://localhost:3000`

### Mode Produksi
```bash
npm run build

npm run start:prod
```

### Manajemen Database
```bash
npm run prisma:studio

npm run prisma:migrate

npx prisma migrate reset

npm run prisma:seed
```

---

## Struktur Proyek

```
challenge_fullstack_marketplace/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── account/
│   │   ├── account.controller.ts
│   │   └── account.module.ts
│   ├── admin/
│   │   ├── admin.controller.ts
│   │   └── admin.module.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── cart/
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── cart.module.ts
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── public/
│   │   ├── public.controller.ts
│   │   └── public.module.ts
│   ├── sellers/
│   │   ├── sellers.controller.ts
│   │   ├── sellers.service.ts
│   │   └── sellers.module.ts
│   ├── app.module.ts
│   └── main.ts
├── views/
│   ├── partials/
│   │   ├── navbar.hbs
│   │   └── customer-navbar.hbs
│   ├── account/
│   │   ├── profile.hbs
│   │   └── change-password.hbs
│   ├── admin/
│   │   └── dashboard.hbs
│   ├── auth/
│   │   ├── login.hbs
│   │   └── register.hbs
│   ├── cart/
│   │   └── index.hbs
│   ├── orders/
│   │   ├── index.hbs
│   │   ├── checkout.hbs
│   │   └── detail.hbs
│   ├── products/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   ├── edit.hbs
│   │   └── detail.hbs
│   ├── public/
│   │   └── landing.hbs
│   ├── sellers/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   ├── edit.hbs
│   │   └── detail.hbs
│   └── layout.hbs
├── .env
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Titik Akhir API

### Rute Autentikasi
```
GET  /auth/login
POST /auth/login
GET  /auth/register
POST /auth/register
GET  /auth/logout
```

### Rute Publik
```
GET  /
GET  /admin/products/:id
```

### Rute Pelanggan (Autentikasi Diperlukan)
```
GET  /cart
POST /cart/add/:productId
POST /cart/update/:itemId
POST /cart/remove/:itemId
POST /cart/clear

GET  /orders
GET  /orders/checkout
POST /orders/checkout
GET  /orders/:id

GET  /account/profile
POST /account/profile
GET  /account/change-password
POST /account/change-password
```

### Rute Admin (Peran Admin Diperlukan)
```
GET  /admin/dashboard

GET  /admin/sellers
GET  /admin/sellers/create
POST /admin/sellers/create
GET  /admin/sellers/:id
GET  /admin/sellers/:id/edit
POST /admin/sellers/:id/edit
POST /admin/sellers/:id/delete

GET  /admin/products
GET  /admin/products/create
POST /admin/products/create
GET  /admin/products/:id/edit
POST /admin/products/:id/edit
POST /admin/products/:id/delete
```

---

## Peran Pengguna

### Peran Admin
- **Akses**: Akses penuh ke panel admin
- **Kemampuan**:
  - Kelola semua penjual (operasi CRUD)
  - Kelola semua produk (operasi CRUD)
  - Lihat dasbor dengan statistik
  - Cari penjual dan produk
- **Kredensial Default** (dari seed):
  - Email: admin@marketplace.com
  - Kata Sandi: admin123

### Peran Pelanggan
- **Akses**: Fitur menghadap pelanggan
- **Kemampuan**:
  - Jelajahi katalog produk
  - Cari produk
  - Tambahkan produk ke keranjang
  - Kelola item keranjang
  - Buat pesanan
  - Lihat riwayat pesanan
  - Kelola profil
- **Pendaftaran**: Pendaftaran mandiri melalui /auth/register

---

## Tangkapan Layar

### 1. Halaman Mendarat
Halaman katalog produk utama yang dapat diakses oleh semua pengguna. Menampilkan produk dalam tata letak grid responsif dengan fungsi pencarian.

**Fitur**:
- Grid produk dengan gambar, nama, harga, dan kategori
- Informasi penjual untuk setiap produk
- Tampilan ketersediaan stok
- Desain responsif (1-4 kolom berdasarkan ukuran layar)
- Navigasi bervariasi berdasarkan peran pengguna (masuk/keluar, admin/pelanggan)

**URL**: `http://localhost:3000/`

---

### 2. Halaman Login
Halaman autentikasi untuk pengguna admin dan pelanggan.

**Fitur**:
- Input email dan kata sandi
- Tampilan pesan kesalahan untuk kredensial tidak valid
- Tautan ke halaman pendaftaran
- Kredensial demo ditampilkan
- Pengalihan berdasarkan peran pengguna setelah login berhasil

**URL**: `http://localhost:3000/auth/login`

---

### 3. Halaman Pendaftaran
Halaman pendaftaran pengguna baru untuk pelanggan.

**Fitur**:
- Kolom formulir: nama, email, kata sandi, telepon, alamat
- Validasi formulir
- Login otomatis setelah pendaftaran berhasil
- Tautan ke halaman login untuk pengguna yang ada

**URL**: `http://localhost:3000/auth/register`

---

### 4. Dasbor Admin
Halaman ikhtisar untuk administrator yang menunjukkan statistik sistem dan aktivitas terbaru.

**Fitur**:
- Hitungan total penjual
- Hitungan total produk
- 5 penjual terbaru
- 5 produk terbaru dengan informasi penjual
- Navigasi cepat ke halaman manajemen

**URL**: `http://localhost:3000/admin/dashboard`

---

### 5. Manajemen Penjual (Admin)
Antarmuka admin untuk mengelola penjual.

**Fitur**:
- Tampilan tabel semua penjual
- Fungsi pencarian (nama, email, telepon)
- Hitungan produk per penjual
- Operasi CRUD: Lihat, Edit, Hapus
- Tombol buat penjual baru

**URL**: `http://localhost:3000/admin/sellers`

---

### 6. Halaman Detail Penjual (Admin)
Tampilan terperinci tentang penjual tertentu dan produk mereka.

**Fitur**:
- Informasi penjual (nama, email, telepon, alamat, deskripsi)
- Tanggal pendaftaran
- Daftar semua produk dari penjual ini
- Tombol edit dan hapus
- Tautan ke detail produk

**URL**: `http://localhost:3000/admin/sellers/:id`

---

### 7. Manajemen Produk (Admin)
Antarmuka admin untuk mengelola produk.

**Fitur**:
- Tampilan tabel semua produk dengan informasi penjual
- Fungsi pencarian (nama, deskripsi, kategori)
- Tampilan harga dalam format Rupiah
- Informasi stok
- Lencana kategori
- Operasi CRUD: Lihat, Edit, Hapus

**URL**: `http://localhost:3000/admin/products`

---

### 8. Halaman Detail Produk
Tampilan terperinci tentang produk tertentu dengan tindakan berbasis peran.

**Untuk Pelanggan**:
- Informasi produk dengan gambar
- Detail penjual
- Fungsi tambah ke keranjang dengan pemilih jumlah
- Pemberitahuan stok habis

**Untuk Admin**:
- Informasi produk yang sama
- Tombol edit dan hapus
- Tautan ke halaman detail penjual

**Untuk Pengguna Tidak Masuk**:
- Informasi produk terlihat
- Ajakan untuk login untuk membeli

**URL**: `http://localhost:3000/admin/products/:id`

---

### 9. Keranjang Belanja (Pelanggan)
Halaman keranjang belanja pelanggan.

**Fitur**:
- Daftar item keranjang dengan gambar produk
- Penyesuaian jumlah per item
- Tombol hapus item
- Perhitungan harga per item dan total
- Opsi kosongkan keranjang
- Tombol lanjut ke checkout
- Status keranjang kosong dengan ajakan bertindak

**URL**: `http://localhost:3000/cart`

---

### 10. Halaman Checkout (Pelanggan)
Halaman pesanan dan konfirmasi checkout.

**Fitur**:
- Ringkasan pesanan dengan semua item
- Perhitungan harga total
- Informasi pengiriman yang sudah diisi
- Alamat pengiriman yang dapat diedit
- Tombol buat pesanan
- Tautan kembali ke keranjang

**URL**: `http://localhost:3000/orders/checkout`

---

### 11. Riwayat Pesanan (Pelanggan)
Daftar semua pesanan pelanggan.

**Fitur**:
- Kartu pesanan dengan nomor pesanan dan tanggal
- Lencana status (pending, processing, completed, cancelled)
- Jumlah total per pesanan
- Hitungan item dan pratinjau
- Tautan lihat detail
- Status kosong untuk tanpa pesanan

**URL**: `http://localhost:3000/orders`

---

### 12. Detail Pesanan (Pelanggan)
Tampilan terperinci tentang pesanan tertentu.

**Fitur**:
- Nomor pesanan dan status
- Tanggal pesanan
- Daftar item yang dipesan dengan gambar
- Jumlah item dan harga
- Jumlah total
- Informasi pengiriman
- Tautan kembali ke pesanan

**URL**: `http://localhost:3000/orders/:id`

---

### 13. Profil Pengguna (Pelanggan)
Halaman manajemen profil pelanggan.

**Fitur**:
- Lihat dan edit informasi pribadi
- Tampilan email (hanya baca)
- Perbarui nama, telepon, dan alamat
- Tampilan pesan kesuksesan/kesalahan
- Tautan ke halaman ubah kata sandi

**URL**: `http://localhost:3000/account/profile`

---

### 14. Ubah Kata Sandi (Pelanggan)
Fungsi ubah kata sandi untuk pelanggan.

**Fitur**:
- Verifikasi kata sandi saat ini
- Input kata sandi baru
- Konfirmasi kata sandi
- Tampilan pesan kesuksesan/kesalahan
- Validasi kecocokan kata sandi
- Tautan kembali ke profil

**URL**: `http://localhost:3000/account/change-password`

---

## Dependensi

### Dependensi Produksi

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/config": "^3.1.1",
  "@prisma/client": "^5.7.1",
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.2",
  "express-session": "^1.17.3",
  "hbs": "^4.2.0",
  "reflect-metadata": "^0.1.13",
  "rxjs": "^7.8.1"
}
```

**Deskripsi Dependensi**:

- **@nestjs/common**: Fungsi kerangka NestJS inti
- **@nestjs/core**: Modul inti NestJS
- **@nestjs/platform-express**: Adaptor platform Express untuk NestJS
- **@nestjs/config**: Modul konfigurasi untuk variabel lingkungan
- **@prisma/client**: Klien ORM Prisma untuk operasi database
- **bcrypt**: Pustaka hashing kata sandi
- **body-parser**: Middleware penguraian badan permintaan HTTP
- **express-session**: Middleware sesi untuk Express
- **hbs**: Mesin tampilan Handlebars
- **reflect-metadata**: API refleksi metadata
- **rxjs**: Ekstensi reaktif untuk JavaScript

### Dependensi Pengembangan

```json
{
  "@nestjs/cli": "^10.0.0",
  "@nestjs/schematics": "^10.0.0",
  "@types/bcrypt": "^5.0.2",
  "@types/express": "^4.17.17",
  "@types/express-session": "^1.17.10",
  "@types/node": "^20.3.1",
  "prisma": "^5.7.1",
  "source-map-support": "^0.5.21",
  "ts-loader": "^9.4.3",
  "ts-node": "^10.9.1",
  "tsconfig-paths": "^4.2.0",
  "typescript": "^5.1.3"
}
```

**Deskripsi Dependensi Pengembangan**:

- **@nestjs/cli**: Antarmuka baris perintah NestJS
- **@nestjs/schematics**: Skema pembuatan kode
- **@types/\***: Definisi jenis TypeScript
- **prisma**: CLI Prisma dan manajemen skema
- **ts-node**: Mesin eksekusi TypeScript
- **typescript**: Kompiler TypeScript

### Menginstal Dependensi

**Instal semua dependensi**:
```bash
npm install
```

**Instal dependensi spesifik**:
```bash
npm install package-name
```

**Instal dependensi pengembangan**:
```bash
npm install --save-dev package-name
```

**Perbarui dependensi**:
```bash
npm update
```

**Audit dependensi untuk kerentanan**:
```bash
npm audit
npm audit fix
```

---

## Panduan Pengembangan

## Gaya Kode dan Konvensi

Proyek ini mengikuti gaya penulisan kode yang konsisten agar mudah dipahami, dirawat, dan dikembangkan bersama.

### TypeScript
- Menggunakan mode ketat TypeScript untuk menjaga kualitas dan keamanan kode
- Mengutamakan penggunaan `interface` dibandingkan `type` untuk mendefinisikan bentuk objek
- Menggunakan `async/await` agar alur kode asinkron lebih mudah dibaca
- Mengikuti konvensi penamaan dan struktur yang direkomendasikan oleh NestJS

### Penamaan File
Penamaan file dibuat konsisten untuk memudahkan navigasi dan pemeliharaan kode:
- Controller: `*.controller.ts`
- Service: `*.service.ts`
- Module: `*.module.ts`
- Template tampilan: `*.hbs`

**Struktur Modul**:
```
module-name/
├── module-name.controller.ts
├── module-name.service.ts
└── module-name.module.ts
```

### Menambahkan Fitur Baru

1. **Hasilkan modul**:
```bash
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

2. **Perbarui skema database** di `prisma/schema.prisma`

3. **Buat migrasi**:
```bash
npm run prisma:migrate
```

4. **Implementasikan logika bisnis** di layanan

5. **Buat titik akhir kontroler**

6. **Buat templat tampilan** di `views/`

7. **Daftarkan modul** di `app.module.ts`

### Migrasi Database

**Buat migrasi baru**:
```bash
npx prisma migrate dev --name migration_name
```

**Terapkan migrasi**:
```bash
npx prisma migrate deploy
```

**Reset database** (hanya pengembangan):
```bash
npx prisma migrate reset
```

### Debugging

**Aktifkan log debug**:
```bash
DEBUG=* npm run start:dev
```

**Debug dengan Chrome DevTools**:
```bash
npm run start:debug
```

Kemudian buka `chrome://inspect` di browser Chrome.

### Tugas Umum

**Tambahkan pembantu Handlebars baru**:
Edit `src/main.ts` dan tambahkan:
```typescript
hbs.registerHelper('helperName', function (param) {
  return result;
});
```

**Tambahkan middleware**:
```typescript
app.use(yourMiddleware);
```

**Ubah port**:
Edit `src/main.ts`:
```typescript
await app.listen(3001);
```

---

## Pengujian

### Daftar Periksa Pengujian Manual

Bagian ini berisi skenario pengujian manual untuk memastikan seluruh fitur utama aplikasi berjalan dengan baik sesuai perannya.

**Autentikasi**
- Mendaftarkan akun pelanggan baru
- Masuk ke sistem sebagai pelanggan
- Masuk ke sistem sebagai admin
- Keluar dari sistem (logout)
- Memastikan sesi pengguna tersimpan dengan benar
- Memastikan akses ke rute yang dilindungi dibatasi sesuai peran

**Fitur Pelanggan**
- Menjelajahi daftar produk pada halaman utama
- Mencari produk menggunakan fitur pencarian
- Melihat detail produk
- Menambahkan produk ke dalam keranjang
- Mengubah jumlah produk di keranjang
- Menghapus produk dari keranjang
- Melakukan proses checkout
- Melihat riwayat pesanan
- Melihat detail pesanan
- Memperbarui informasi profil pengguna
- Mengubah kata sandi akun

**Fitur Admin**
- Melihat statistik dan ringkasan pada dasbor admin
- Menambahkan data penjual baru
- Mengubah informasi penjual
- Menghapus penjual beserta produk terkait
- Melihat detail penjual
- Mencari data penjual
- Menambahkan produk baru
- Mengubah informasi produk
- Menghapus produk
- Mencari data produk

**Antarmuka Pengguna (UI/UX)**
- Navigasi berbasis peran ditampilkan dengan benar
- Tampilan aplikasi responsif pada perangkat desktop dan seluler
- Pesan validasi formulir ditampilkan dengan jelas
- Notifikasi keberhasilan dan kesalahan muncul sesuai kondisi
- Tombol navigasi kembali berfungsi dengan baik

### Data Pengujian

**Akun Admin** (dari seed):
```
Email: admin@gmail.com
Kata Sandi: admin123
```
---
## Deployment

### Prasyarat Produksi
Sebelum aplikasi dijalankan di lingkungan produksi, pastikan beberapa kebutuhan berikut telah tersedia:
1. Database MySQL yang siap digunakan untuk lingkungan produksi
2. Lingkungan hosting yang mendukung Node.js
3. Sertifikat SSL untuk mengaktifkan koneksi HTTPS
4. Variabel lingkungan (environment variables) telah dikonfigurasi dengan benar

### Daftar Periksa Produksi
Hal-hal berikut perlu diperhatikan untuk memastikan aplikasi berjalan dengan aman dan stabil di lingkungan produksi:
- Menggunakan nilai `JWT_SECRET` dan `SESSION_SECRET` yang kuat
- Mengonfigurasi koneksi ke database produksi
- Mengatur `NODE_ENV` ke mode `production`
- Mengaktifkan HTTPS pada server
- Mengonfigurasi CORS apabila aplikasi diakses lintas domain
- Menggunakan Redis sebagai penyimpanan sesi (direkomendasikan)
- Menerapkan pembatasan laju permintaan (rate limiting)
- Menyiapkan sistem logging dan monitoring
- Mengonfigurasi strategi pencadangan (backup) data
- Menyiapkan pipeline CI/CD untuk proses deploy yang lebih terkontrol

### Variabel Lingkungan untuk Produksi

```env
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-strong-secret-minimum-32-characters
SESSION_SECRET=your-strong-session-secret-minimum-32-characters
PORT=3000
```

### Build untuk Produksi

```bash
npm ci

npm run prisma:generate

npm run build

npm run prisma:migrate deploy

npm run start:prod
```

### Menggunakan PM2 (Manajer Proses)

```bash
npm install -g pm2

pm2 start dist/main.js --name marketplace-app

pm2 logs marketplace-app

pm2 restart marketplace-app

pm2 stop marketplace-app

pm2 startup
pm2 save
```

### Deployment Docker (Opsional)

Buat `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

Buat `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/marketplace_db
    depends_on:
      - db
  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: marketplace_db
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - mysql-data:/var/lib/mysql
volumes:
  mysql-data:
```

Jalankan dengan Docker:
```bash
docker-compose up -d
```

---

## Informasi Tambahan

### Manajemen Sesi

Saat ini, sesi disimpan dalam memori. Untuk lingkungan produksi, sangat disarankan untuk menggunakan penyimpanan sesi persisten seperti Redis:

```typescript
import * as session from 'express-session';
import * as RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
    },
  }),
);
```

## Pertimbangan Keamanan

Beberapa aspek keamanan telah diterapkan untuk melindungi data dan aktivitas pengguna:
- **Keamanan kata sandi**  
  Kata sandi pengguna disimpan dalam bentuk hash menggunakan `bcrypt` dengan 10 salt rounds.
- **Manajemen sesi**  
  Sesi pengguna akan berakhir setelah 1 jam tidak ada aktivitas.
- **Perlindungan terhadap SQL Injection**  
  Seluruh akses database menggunakan query berparameter melalui Prisma.
- **Perlindungan XSS**  
  Handlebars secara default melakukan escaping pada output untuk mencegah serangan XSS.
- **CSRF**  
  Untuk penggunaan di lingkungan produksi, disarankan menambahkan mekanisme perlindungan CSRF.

---

## Optimasi Kinerja

Beberapa pendekatan dilakukan dan dipertimbangkan untuk menjaga performa aplikasi:
- **Pengindeksan database**  
  Kolom email diindeks untuk mempercepat proses pencarian dan autentikasi.
- **Optimasi query**  
  Penggunaan fitur `select` dan `include` pada Prisma untuk mengambil data yang diperlukan saja.
- **Caching**  
  Implementasi caching menggunakan Redis direkomendasikan untuk data yang sering diakses.
- **Aset statis**  
  Pada lingkungan produksi, penggunaan CDN untuk aset statis dapat membantu meningkatkan waktu muat halaman.

---

## Peningkatan di Masa Depan

Beberapa fitur yang dapat dikembangkan pada tahap selanjutnya antara lain:
- Manajemen stok dengan pengurangan otomatis
- Integrasi payment gateway
- Notifikasi email untuk status pesanan
- Sistem ulasan dan peringkat produk
- Fitur wishlist
- Pencarian lanjutan dengan filter
- Dukungan multi-bahasa
- Sistem pelacakan pesanan
- Manajemen pesanan untuk admin
- Analitik dan pelaporan
- Varian produk (misalnya ukuran dan warna)
- Sistem diskon dan kupon

---

## Pemecahan Masalah

### Tidak dapat terhubung ke database
- Pastikan layanan MySQL sedang berjalan
- Periksa nilai `DATABASE_URL` pada file `.env`
- Pastikan database sudah dibuat
- Periksa pengaturan firewall atau akses jaringan

### Kesalahan Prisma
- Jalankan perintah `npx prisma generate`
- Periksa sintaks pada file `schema.prisma`
- Pastikan koneksi database valid

### Port sudah digunakan
- Ubah port aplikasi pada `main.ts`
- Hentikan proses yang menggunakan port tersebut:
```bash
lsof -ti:3000 | xargs kill
```

### Sesi tidak bertahan
- Pastikan `SESSION_SECRET` telah diatur
- Periksa konfigurasi cookie sesi
- Pertimbangkan penggunaan Redis sebagai penyimpanan sesi di lingkungan produksi