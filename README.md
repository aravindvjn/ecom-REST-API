# ECOM-REST-API

## Overview
This is a REST API for an eCommerce application that supports user authentication, product management, and cart operations. It allows users to add, update, and delete items from their cart, while admins can manage products. The API also includes features like password reset and email verification during signup.

## Features
- **User Authentication** (Signup, Signin, Logout)
- **Email Verification** during signup
- **Password Reset** functionality
- **Cart Management** (Add, Update, Remove items)
- **Product Management** (Admins can add, update, delete products)
- **Order Management** (Placing and viewing orders)


## API Endpoints
### Authentication
- `POST /auth/signup` - Register a new user and request email verification
- `POST /auth/verify/:token` - Email verification
- `POST /auth/signin` - Login with email and password
- `POST /auth/logout` - Logout user
- `POST /auth/reset-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password with token

### Products
- `GET /products` - Get all products ( includes pagination )
- `GET /products/:id` - Get a single product

### Products (Admin Only)
- `POST /products` - Add a new product
- `PUT /products/:id` - Update product details
- `DELETE /products/:id` - Remove a product

### Cart
- `GET /cart` - Get all cart by user
- `POST /cart` - Add product to cart and Update cart item quantity
- `DELETE /cart/:productId` - Remove product from cart

### Orders
- `POST /orders` - Place an order ( can order an array of products )
- `GET /orders` - Get user orders

## Technologies Used
- **Node.js** with **Express.js** (Backend Framework)
- **MongoDB** (Database)
- **Mongoose** (ORM)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)

## License
This project is open-source and available under the MIT License.

## Contribution
Feel free to contribute by submitting a pull request or opening an issue!

