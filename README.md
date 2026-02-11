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
- [Berkontribusi](#berkontribusi)
- [Lisensi](#lisensi)

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

---

## Fitur

### Fitur Pelanggan
- Pendaftaran dan autentikasi pengguna
- Jelajahi katalog produk dengan pencarian
- Lihat informasi produk secara terperinci
- Tambahkan produk ke keranjang belanja
- Perbarui jumlah keranjang
- Checkout dan buat pesanan
- Lihat riwayat pesanan
- Kelola profil pengguna
- Ubah kata sandi

### Fitur Admin
- Dasbor admin yang aman
- Kelola penjual (Buat, Baca, Perbarui, Hapus)
- Kelola produk (Buat, Baca, Perbarui, Hapus)
- Lihat statistik dan aktivitas terbaru
- Fungsi pencarian untuk penjual dan produk

### Fitur Umum
- Autentikasi berbasis sesi
- Rendering sisi server dengan Handlebars
- Antarmuka responsif dengan Tailwind CSS
- Navigasi dan elemen UI berbasis peran
- Navigasi kembali dinamis berdasarkan konteks pengguna

---

## Teknologi yang Digunakan

### Backend
- **Framework**: NestJS 10.x (kerangka kerja Node.js)
- **Bahasa**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **Database**: MySQL 8.x
- **Autentikasi**: bcrypt untuk hashing kata sandi, express-session untuk manajemen sesi

### Frontend
- **Mesin Template**: Handlebars (hbs)
- **Kerangka CSS**: Tailwind CSS (melalui CDN)
- **Rendering**: Rendering Sisi Server (SSR)

### Alat Pengembangan
- **Manajer Paket**: npm
- **Alat Build**: NestJS CLI
- **GUI Database**: Prisma Studio

---

## Desain Database

### Diagram Hubungan Entitas

```
![Homepage](public/Untitled(1).svg)

```

### Skema Database

#### Tabel Users
- **id**: Integer, Kunci Utama, Auto-increment
- **email**: String, Unik, Diperlukan
- **password**: String, Diperlukan (di-hash dengan bcrypt)
- **name**: String, Diperlukan
- **role**: String, Default: 'customer' (admin atau customer)
- **phone**: String, Dapat Kosong
- **address**: Text, Dapat Kosong
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui

#### Tabel Sellers
- **id**: Integer, Kunci Utama, Auto-increment
- **name**: String, Diperlukan
- **email**: String, Unik, Diperlukan
- **phone**: String, Diperlukan
- **address**: Text, Diperlukan
- **description**: Text, Dapat Kosong
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui

#### Tabel Products
- **id**: Integer, Kunci Utama, Auto-increment
- **name**: String, Diperlukan
- **description**: Text, Diperlukan
- **price**: Decimal(10,2), Diperlukan
- **stock**: Integer, Default: 0
- **category**: String, Diperlukan
- **imageUrl**: String, Dapat Kosong
- **sellerId**: Integer, Kunci Asing (referensi ke Sellers)
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui

#### Tabel Carts
- **id**: Integer, Kunci Utama, Auto-increment
- **userId**: Integer, Kunci Asing (referensi ke Users), Unik
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui

#### Tabel CartItems
- **id**: Integer, Kunci Utama, Auto-increment
- **cartId**: Integer, Kunci Asing (referensi ke Carts)
- **productId**: Integer, Kunci Asing (referensi ke Products)
- **quantity**: Integer, Default: 1
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui
- **Batasan Unik**: (cartId, productId)

#### Tabel Orders
- **id**: Integer, Kunci Utama, Auto-increment
- **userId**: Integer, Kunci Asing (referensi ke Users)
- **totalAmount**: Decimal(10,2), Diperlukan
- **status**: String, Default: 'pending' (pending, processing, completed, cancelled)
- **shippingAddress**: Text, Diperlukan
- **createdAt**: DateTime, Otomatis dihasilkan
- **updatedAt**: DateTime, Otomatis diperbarui

#### Tabel OrderItems
- **id**: Integer, Kunci Utama, Auto-increment
- **orderId**: Integer, Kunci Asing (referensi ke Orders)
- **productId**: Integer, Kunci Asing (referensi ke Products)
- **quantity**: Integer, Diperlukan
- **price**: Decimal(10,2), Diperlukan (snapshot harga saat pemesanan)
- **createdAt**: DateTime, Otomatis dihasilkan

### Hubungan

1. **Penjual ke Produk**: Satu-ke-Banyak
   - Satu penjual dapat memiliki beberapa produk
   - Hapus cascade: Menghapus penjual menghapus semua produk mereka

2. **Pengguna ke Keranjang**: Satu-ke-Satu
   - Setiap pengguna memiliki satu keranjang
   - Hapus cascade: Menghapus pengguna menghapus keranjang mereka

3. **Keranjang ke CartItems**: Satu-ke-Banyak
   - Satu keranjang dapat memiliki beberapa item keranjang
   - Hapus cascade: Menghapus keranjang menghapus semua item keranjang

4. **Produk ke CartItems**: Satu-ke-Banyak
   - Satu produk dapat berada di berbagai keranjang
   - Hapus cascade: Menghapus produk menghapusnya dari semua keranjang

5. **Pengguna ke Pesanan**: Satu-ke-Banyak
   - Satu pengguna dapat memiliki beberapa pesanan
   - Hapus cascade: Menghapus pengguna menghapus pesanan mereka

6. **Pesanan ke OrderItems**: Satu-ke-Banyak
   - Satu pesanan berisi beberapa item pesanan
   - Hapus cascade: Menghapus pesanan menghapus semua item pesanan

7. **Produk ke OrderItems**: Satu-ke-Banyak
   - Satu produk dapat berada di beberapa pesanan
   - Tidak ada hapus cascade: Item pesanan mempertahankan referensi produk

---

## Instalasi

### Prasyarat
- Node.js versi 18 atau lebih tinggi
- npm versi 9 atau lebih tinggi
- MySQL versi 8 atau lebih tinggi
- Git

### Instalasi Langkah demi Langkah

1. Kloning repositori
```bash
git clone https://github.com/yourusername/marketplace-admin.git
cd marketplace-admin
```

2. Instal dependensi
```bash
npm install
```

3. Buat database MySQL
```bash
mysql -u root -p
CREATE DATABASE marketplace_db;
EXIT;
```

4. Konfigurasi variabel lingkungan
```bash
cp .env.example .env
```

5. Hasilkan Prisma Client
```bash
npm run prisma:generate
```

6. Jalankan migrasi database
```bash
npm run prisma:migrate
```

7. Tanam database (opsional)
```bash
npm run prisma:seed
```

---

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
marketplace-admin/
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

### Gaya Kode dan Konvensi

**TypeScript**:
- Gunakan mode ketat TypeScript
- Lebih suka interface daripada jenis untuk bentuk objek
- Gunakan async/await daripada janji
- Ikuti konvensi penamaan NestJS

**Penamaan File**:
- Kontroler: `*.controller.ts`
- Layanan: `*.service.ts`
- Modul: `*.module.ts`
- Tampilan: `*.hbs`

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

**Autentikasi**:
- Daftarkan akun pelanggan baru
- Login sebagai pelanggan
- Login sebagai admin
- Fungsi logout
- Persistensi sesi
- Akses rute terlindungi

**Fitur Pelanggan**:
- Jelajahi produk di halaman mendarat
- Cari produk
- Lihat detail produk
- Tambahkan produk ke keranjang
- Perbarui jumlah keranjang
- Hapus item dari keranjang
- Proses checkout
- Lihat riwayat pesanan
- Lihat detail pesanan
- Perbarui informasi profil
- Ubah kata sandi

**Fitur Admin**:
- Lihat statistik dasbor
- Buat penjual baru
- Edit informasi penjual
- Hapus penjual (hapus cascade produk)
- Lihat detail penjual
- Cari penjual
- Buat produk baru
- Edit informasi produk
- Hapus produk
- Cari produk

**UI/UX**:
- Navigasi berbasis peran ditampilkan dengan benar
- Desain responsif di perangkat seluler
- Pesan validasi formulir
- Pemberitahuan kesuksesan/kesalahan
- Navigasi tombol kembali berfungsi dengan benar

### Data Pengujian

**Akun Admin** (dari seed):
```
Email: admin@marketplace.com
Kata Sandi: admin123
```

**Penjual Sampel** (dari seed):
- John Doe Electronics
- Fashion Store Indo
- Food Market Semarang

**Produk Sampel** (dari seed):
- 3 produk Elektronik
- 3 produk Fashion
- 3 produk Makanan

---

## Deployment

### Prasyarat untuk Produksi

1. Database MySQL siap produksi
2. Lingkungan hosting Node.js
3. Sertifikat SSL untuk HTTPS
4. Variabel lingkungan dikonfigurasi

### Daftar Periksa Produksi

- Atur JWT_SECRET dan SESSION_SECRET yang kuat
- Konfigurasi koneksi database produksi
- Atur NODE_ENV ke "production"
- Aktifkan HTTPS
- Konfigurasi CORS jika diperlukan
- Atur Redis untuk penyimpanan sesi (direkomendasikan)
- Konfigurasi pembatasan laju
- Atur logging dan monitoring
- Konfigurasi strategi backup
- Atur pipeline CI/CD

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

## Berkontribusi

### Cara Berkontribusi

1. Fork repositori
2. Buat cabang fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke cabang (`git push origin feature/AmazingFeature`)
5. Buka Permintaan Tarik

### Standar Pengodean

- Ikuti praktik terbaik TypeScript dan NestJS
- Tulis pesan commit yang bermakna
- Tambahkan komentar untuk logika yang kompleks
- Perbarui dokumentasi untuk fitur baru
- Uji perubahan Anda secara menyeluruh

### Melaporkan Masalah

Saat melaporkan masalah, sertakan:
- Deskripsi jelas tentang masalahnya
- Langkah untuk mereproduksi
- Perilaku yang diharapkan
- Perilaku aktual
- Tangkapan layar jika berlaku
- Detail lingkungan (OS, versi Node, dll.)

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.

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

### Pertimbangan Keamanan

1. **Keamanan Kata Sandi**: Kata sandi di-hash menggunakan bcrypt dengan 10 putaran garam
2. **Keamanan Sesi**: Sesi berakhir setelah 1 jam tidak aktif
3. **SQL Injection**: Dicegah oleh kueri berparameter Prisma
4. **XSS Protection**: Handlebars secara otomatis menghindari output
5. **CSRF**: Pertimbangkan untuk menambahkan perlindungan CSRF untuk produksi

### Optimasi Kinerja

1. **Pengindeksan Database**: Kolom email diindeks untuk pencarian lebih cepat
2. **Optimasi Kueri**: Gunakan `include` dan `select` Prisma untuk kueri efisien
3. **Caching**: Pertimbangkan implementasi caching Redis untuk data yang sering diakses
4. **Aset Statis**: Pertimbangkan menggunakan CDN untuk Tailwind CSS dalam produksi

### Peningkatan Masa Depan

Fitur potensial untuk pengembangan di masa depan:
- Manajemen stok dengan pengurangan otomatis
- Integrasi gateway pembayaran
- Notifikasi email untuk pesanan
- Ulasan dan peringkat produk
- Fungsi wishlist
- Pencarian lanjutan dengan filter
- Dukungan multi-bahasa
- Sistem pelacakan pesanan
- Manajemen pesanan admin
- Analitik dan pelaporan
- Varian produk (ukuran, warna)
- Sistem diskon dan kupon

### Pemecahan Masalah

**Tidak dapat terhubung ke database**:
- Verifikasi MySQL berjalan
- Periksa DATABASE_URL di .env
- Pastikan database ada
- Periksa pengaturan firewall

**Kesalahan Prisma**:
- Jalankan `npm run prisma:generate`
- Periksa sintaks skema
- Verifikasi koneksi database

**Port sudah digunakan**:
- Ubah port di main.ts
- Bunuh proses menggunakan port: `lsof -ti:3000 | xargs kill`

**Sesi tidak bertahan**:
- Periksa SESSION_SECRET diatur
- Verifikasi pengaturan cookie
- Pertimbangkan menggunakan Redis untuk produksi
