# CropMate Platform

CropMate is a comprehensive agricultural e-commerce platform that connects farmers directly with buyers, supported by reliable delivery services. The platform aims to revolutionize the agricultural supply chain, increase farmer incomes, reduce costs for vendors, and minimize food waste.

![CropMate Platform](public/hero-bg.jpg)

## 🌱 Features

### For Farmers

- **Crop Management**: Create, update, and manage crop listings with detailed information
- **Order Tracking**: Monitor orders from payment through delivery
- **Revenue Dashboard**: Track earnings and sales performance
- **Inventory Management**: Keep crop availability updated in real-time

### For Customers

- **Browse Marketplace**: Discover fresh produce from local farmers
- **Order Management**: Place orders and track delivery status
- **Payment Processing**: Secure payment options with proof upload
- **Delivery Tracking**: Follow your order from farm to door

### For Drivers

- **Delivery Management**: Accept and manage delivery assignments
- **Route Optimization**: Efficiently deliver orders along optimized routes
- **Earnings Tracking**: Monitor delivery earnings and performance

### For Administrators

- **Platform Oversight**: Monitor all activities across the platform
- **User Management**: Manage farmer, customer, and driver accounts
- **Crop Management**: Review and moderate crop listings
- **Order Oversight**: Track all orders and resolve disputes

## 💻 Technology Stack

- **Frontend**: Next.js with App Router, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes with Server Actions
- **Database**: Prisma ORM with MongoDB
- **Authentication**: NextAuth.js for secure user authentication
- **File Storage**: Cloudinary for image uploads
- **Progressive Web App**: Supports offline mode and installable experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (or connection string)
- Cloudinary account for image uploads

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/cropmate-platform.git
cd cropmate-platform
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run database migrations:

```bash
npx prisma generate
npx prisma db push
```

5. Seed the database (optional):

```bash
npx prisma db seed
```

6. Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📱 Progressive Web App Features

CropMate is designed as a Progressive Web App (PWA) with:

- Offline functionality for essential features
- Installable on mobile and desktop devices
- Push notifications for order updates
- Responsive design for all screen sizes

## 📚 Project Structure

```
src/
  ├── app/           # Next.js App Router pages
  ├── components/    # Reusable UI components
  ├── lib/           # Utility functions and custom hooks
  │   ├── actions/   # Server actions for API functionality
  │   └── hooks/     # Custom React hooks
  ├── types/         # TypeScript type definitions
  └── prisma/        # Database schema and migrations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Thanks to all contributors and supporters
- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- ORM by [Prisma](https://prisma.io)
