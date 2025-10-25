# UK Supermarket Price Comparison App

A full-stack Vue.js application for comparing food prices across top UK supermarkets with community-verified pricing, user authentication, photo upload capabilities, and price history tracking.

## Features

### 1. Price Comparison
- Compare prices for the same products across 10 major UK supermarkets:
  - Tesco, Sainsbury's, Asda, Morrisons, Aldi, Lidl, Waitrose, Co-op, Iceland, M&S Food
- View best prices highlighted for each product
- Filter products by category or search by name
- Track price variations across different store locations

### 2. User Authentication
- Secure user registration and login with JWT tokens
- Protected routes for adding and verifying prices
- User profile management
- Session persistence with localStorage

### 3. Community Price Verification
- Users can verify submitted prices to maintain accuracy
- Verification count displayed for each price entry
- Pending price submissions review system
- Community-driven data quality assurance

### 4. Photo Upload
- Upload photos of price tags for verification
- Visual proof helps build trust in the data
- Photos stored securely on the server
- Image preview before submission

### 5. Store Identifier
- Each price entry includes specific store location (city and area)
- Track price variations across different regions
- Helps users find the best deals near them

### 6. Price History Charts
- Interactive price history charts using Chart.js
- Track price changes over time (7, 14, 30, 60, or 90 days)
- Compare prices across multiple supermarkets
- Visualize price trends and fluctuations

### 7. Backend API
- RESTful API built with Express.js
- PostgreSQL database for persistent storage
- File upload handling with Multer
- Comprehensive error handling and validation

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing with navigation guards
- **Axios** - HTTP client for API requests
- **Chart.js & Vue-ChartJS** - Interactive data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)

### Database Setup

1. Install PostgreSQL if not already installed:
```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS with Homebrew
brew install postgresql
```

2. Create the database:
```bash
sudo -u postgres psql
CREATE DATABASE supermarket_prices;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE supermarket_prices TO postgres;
\q
```

3. Initialize the database schema:
```bash
cd server
npm run init-db
```

This will create all necessary tables and insert sample data including:
- Demo user: `demo_user` / `password123`
- 10 UK supermarkets
- Sample products with prices
- Price history data

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd supermarket
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

4. Configure environment variables
```bash
# Frontend (.env in root directory)
cp .env.example .env

# Backend (server/.env)
cp server/.env.example server/.env
```

Update the server/.env file with your database credentials if different from defaults.

### Running the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm start
```

This will start:
- Frontend dev server on `http://localhost:3000`
- Backend API server on `http://localhost:5000`

#### Option 2: Run Separately

Terminal 1 - Backend:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### Build for Production

Frontend:
```bash
npm run build
```

The built files will be in the `dist` directory.

Backend:
```bash
npm run server
```

## Project Structure

```
supermarket/
├── src/                      # Frontend source code
│   ├── assets/              # CSS and static assets
│   ├── components/          # Reusable Vue components
│   │   └── PriceHistoryChart.vue
│   ├── views/              # Page components
│   │   ├── Home.vue               # Price comparison view
│   │   ├── AddPrice.vue           # Add new prices
│   │   ├── VerifyPrices.vue       # Verify submitted prices
│   │   ├── Login.vue              # User login
│   │   └── Register.vue           # User registration
│   ├── stores/             # Pinia stores
│   │   ├── authStore.js           # Authentication state
│   │   └── priceStore.js          # Price data management
│   ├── services/           # API services
│   │   └── api.js                 # API client
│   ├── router/             # Vue Router configuration
│   │   └── index.js
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── server/                 # Backend source code
│   ├── config/            # Configuration files
│   │   └── database.js          # Database connection
│   ├── controllers/       # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product management
│   │   ├── priceController.js   # Price management
│   │   └── supermarketController.js
│   ├── middleware/        # Express middleware
│   │   └── auth.js             # JWT authentication
│   ├── scripts/           # Database scripts
│   │   ├── schema.sql          # Database schema
│   │   └── initDb.js           # Database initialization
│   ├── uploads/           # Uploaded files (created on first upload)
│   ├── .env               # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Supermarkets
- `GET /api/supermarkets` - Get all supermarkets
- `GET /api/supermarkets/:id` - Get supermarket by ID

### Products
- `GET /api/products` - Get all products (supports search and category filters)
- `GET /api/products/:id` - Get product by ID with prices
- `POST /api/products` - Create new product (protected)
- `GET /api/categories` - Get all categories

### Prices
- `GET /api/prices` - Get all prices
- `POST /api/prices` - Create new price (protected)
- `GET /api/prices/pending` - Get pending verifications (protected)
- `POST /api/prices/:id/verify` - Verify price (protected)

### Price History
- `GET /api/price-history` - Get price history (requires productId and supermarketId)
- `GET /api/products/:productId/price-history` - Get price history for all supermarkets

### File Upload
- `POST /api/upload` - Upload photo (protected)

## Usage

### Viewing Price Comparisons
1. Navigate to the home page
2. Browse products or use the search bar
3. Filter by category if needed
4. See prices sorted from cheapest to most expensive
5. Best prices are highlighted with a green badge
6. Click "Show Price History" to view price trends over time

### User Registration & Login
1. Click "Register" in the navigation
2. Fill in username, email, and password
3. Or login with demo credentials:
   - Username: `demo_user`
   - Password: `password123`

### Adding a Price
1. Login to your account
2. Click "Add Price" in the navigation
3. Select an existing product or add a new one
4. Choose the supermarket
5. Enter the price
6. Specify the store location
7. Optionally upload a photo of the price tag
8. Submit the form

### Verifying Prices
1. Login to your account
2. Click "Verify Prices" in the navigation
3. Review pending price submissions
4. Check the details and compare with existing prices
5. View uploaded photos if available
6. Approve or reject based on accuracy
7. Your verification helps maintain data quality

## Database Schema

### Tables
- **users** - User accounts with authentication
- **supermarkets** - UK supermarket information
- **products** - Product catalog with categories
- **prices** - Current price entries with verification status
- **price_history** - Historical price data for charts
- **price_verifications** - Price verification records

## Security

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Protected API routes require valid tokens
- Input validation on all endpoints
- File upload restrictions (size and type)
- SQL injection prevention with parameterized queries

## Future Enhancements

- Real-time price alerts and notifications
- Personal shopping lists with price tracking
- Advanced analytics and price prediction
- Mobile app (React Native/Flutter)
- Barcode scanning functionality
- API integration with actual supermarket data
- Social features (share deals, follow users)
- Price history export (CSV, PDF)
- Multi-currency support
- Store finder with maps integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

## Credits

- Built with Vue.js and Express.js
- Charts powered by Chart.js
- Icons: Emoji-based for simplicity

---

Made with Claude Code
