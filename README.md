# UK Supermarket Price Comparison App

A Vue.js application for comparing food prices across top UK supermarkets with community-verified pricing and photo upload capabilities.

## Features

### 1. Price Comparison
- Compare prices for the same products across 10 major UK supermarkets:
  - Tesco
  - Sainsbury's
  - Asda
  - Morrisons
  - Aldi
  - Lidl
  - Waitrose
  - Co-op
  - Iceland
  - M&S Food

### 2. Community Price Verification
- Users can verify submitted prices to maintain accuracy
- Verification count displayed for each price entry
- Community-driven data quality

### 3. Photo Upload
- Upload photos of price tags for verification
- Visual proof helps build trust in the data
- Photos are optional but encouraged

### 4. Store Identifier
- Each price entry includes specific store location (city and area)
- Track price variations across different regions
- Helps users find the best deals near them

### 5. Additional Features
- Search products by name
- Filter by category
- See the best price highlighted for each product
- Track when prices were last updated
- Add new products to the database
- Responsive design for mobile and desktop

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd supermarket
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
supermarket/
├── src/
│   ├── assets/          # CSS and static assets
│   ├── components/      # Reusable Vue components
│   ├── views/          # Page components
│   │   ├── Home.vue           # Price comparison view
│   │   ├── AddPrice.vue       # Add new prices
│   │   └── VerifyPrices.vue   # Verify submitted prices
│   ├── stores/         # Pinia stores
│   │   └── priceStore.js      # Price data management
│   ├── router/         # Vue Router configuration
│   │   └── index.js
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
└── package.json        # Project dependencies
```

## Usage

### Viewing Price Comparisons
1. Navigate to the home page
2. Browse products or use the search bar
3. Filter by category if needed
4. See prices sorted from cheapest to most expensive
5. Best prices are highlighted with a green badge

### Adding a Price
1. Click "Add Price" in the navigation
2. Select an existing product or add a new one
3. Choose the supermarket
4. Enter the price
5. Specify the store location
6. Optionally upload a photo of the price tag
7. Submit the form

### Verifying Prices
1. Click "Verify Prices" in the navigation
2. Review pending price submissions
3. Check the details and compare with existing prices
4. Approve or reject based on accuracy
5. Your verification helps maintain data quality

## Data Storage

Currently, the app uses in-memory storage (Pinia store). For production use, you would want to:
- Implement a backend API (Node.js/Express, Python/Django, etc.)
- Add a database (PostgreSQL, MongoDB, etc.)
- Implement user authentication
- Add cloud storage for uploaded photos (AWS S3, Cloudinary, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Enhancements

- User authentication and profiles
- Personal shopping lists
- Price history charts
- Price alerts and notifications
- Mobile app (React Native/Flutter)
- Barcode scanning
- API integration with actual supermarket data
- Advanced analytics and insights
- Social features (share deals, follow users)

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
