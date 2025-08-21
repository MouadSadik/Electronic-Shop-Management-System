# Internship Project - Electronic Shop Management System

This project is a full-stack commercial management web application for an electronic shop.  
It allows **administrators** to manage products, clients, and orders, while **clients** have their own dashboard to track purchases, invoices, and account information.

Built with **Next.js, Prisma ORM, Supabase, Supabase Auth, TailwindCSS**, and deployed on **Vercel**.

---

## 🚀 Features

### 👨‍💼 Admin Dashboard
- Manage products (**CRUD: create, update, delete**).
- Manage clients.
- Manage orders and update their status.
- Track invoices and payments.
- Supported order statuses:
  - **DEVIS** (Quote)  
  - **CONFIRMEE** (Confirmed)  
  - **LIVREE** (Delivered)  
  - **FACTUREE** (Invoiced)  
  - **ANNULEE** (Cancelled)  

### 👤 Client Dashboard
- View all available products with **search** and **category filtering**.
- Place orders and view order history.
- Access invoices and payment history.
- Update personal information (**address, phone, etc.**).

### 🌍 Public Pages
- Landing page introducing the shop.
- Products page with **search and filter by category**.
- Authentication handled with **Supabase Auth**.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js + TailwindCSS  
- **Database ORM:** Prisma  
- **Database:** PostgreSQL (via Supabase)  
- **Authentication:** Supabase Auth  
- **Deployment:** Vercel  

---

## 📑 Database Schema

The project uses a relational schema designed for commercial management:

- **Utilisateur** (User: Admin or Client)  
- **Client** (extends User with client details)  
- **Produit** (Product with category, price, stock, image, etc.)  
- **Categorie** (Product categories)  
- **Commande** (Order linked to a client)  
- **LigneCommande** (Order line with product & quantity)  
- **Facture** (Invoice with total and linked orders)  
- **Paiement** (Payment details)  
- **LignePaiement** (Payment line linked to invoices)  
- **CommandeFacture** (junction table between orders and invoices)  

### Enums
- **StatutCommande:** `DEVIS`, `CONFIRMEE`, `LIVREE`, `FACTUREE`, `ANNULEE`  
- **ModePaiement:** `ESPECE`, `CARTE_BANCAIRE`, `CHEQUE`, `VIREMENT`  

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MouadSadik/Gestion-Commerciale.git
   cd Gestion-Commerciale
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Create a .env file with:
   ```bash
   DATABASE_URL=your_postgres_database_url
   DIRECT_URL=your_postgres_direct_url
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Install dependencies**
   ```bash
   npx prisma migrate dev
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```
6. **Access the app**
- Go to http://localhost:3000
  ---

### 🌐 Deployement 
- This project is deployed on Vercel.
- When pushing to the main branch, Vercel automatically builds and deploys the application.

- ➡️ Make sure to configure your environment variables on Vercel (same as .env file).y
  ---

### 🧑‍💻 Author 
- Developed by **Mouad Sadik**
- Full-stack developer passionate about web applications and software engineering.
