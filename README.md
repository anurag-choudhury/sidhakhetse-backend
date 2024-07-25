# Seedhakhet

**Seedhakhet** is a fully functional e-commerce application designed specifically for mobile devices. It focuses on selling tea leaves (chai patti) and offers a seamless shopping experience for users looking to purchase premium tea products.

## Features

- **Mobile-Optimized**: The application is designed to be fully responsive and user-friendly on mobile devices.
- **Product Catalog**: Browse a variety of tea leaves with detailed descriptions and images.
- **Shopping Cart**: Add products to the cart, view cart details, and proceed to checkout.
- **Order Management**: Manage orders with cash on delivery (COD) or online payment options.
- **User Authentication**: Secure login and registration for users.
- **Order Confirmation**: Receive an email confirmation upon successful order placement.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Payment Gateway**: Razorpay for online payments
- **Email Service**: cPanel email for order confirmations

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (For local development)
- [Razorpay Account](https://razorpay.com/) (For payment integration)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/sidhakhet.git
    ```

2. **Navigate to the project directory**

    ```bash
    cd sidhakhetse-backend
    ```


3. **Install Backend dependencies**

    ```bash
    npm install
    ```
4. **Set up environment variables**

    Create a `.env` file in the `backend` directory and add your configuration settings:

    ```bash
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    RAZORPAY_KEY=your_razorpay_key
    RAZORPAY_SECRET=your_razorpay_secret
    EMAIL_USER=your_email_username
    EMAIL_PASS=your_email_password
    ```



5. **Start the development server**
    For the frontend:

    find my other repo for frontend(sidhakhetse-ecommerce) clone that then   ``` npm start```


    ```bash
    npm start || node server.js
    ```

## Usage

1. **Navigate to `http://localhost:3000`** to view the application.
2. **Browse products** and **add them to your cart**.
3. **Proceed to checkout**, fill in your shipping details, and select a payment method.
4. **Complete your order** and receive a confirmation email.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For any inquiries or issues, please contact:

- **Anurag Choudhury**: [your.email@example.com](mailto:idanurag567@gmail.com)
