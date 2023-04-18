Payment Gateway APIs
This project consists of a set of APIs that mimic the basic behavior of a payment gateway. These APIs allow users to initiate a payment, send a verification code, and verify the code to complete a purchase.

Technologies Used
The following technologies were used to build this project:

Node.js
javascript
Mongodb
Getting Started
To get started with these APIs, follow these steps:

Clone the repository to your local machine.
Install the necessary dependencies using npm install.
Create a MySQL database using the script in the database directory.
Copy the .env.example file to .env and update it with your database credentials and email credentials.
Run the server using npm start.
API Documentation
Create User
This API allows a user to create an account in the payment gateway.

URL: /api/users
Method: POST

Create Product
This API allows an admin user to create a product that can be purchased through the payment gateway.

URL: /api/products
Method: POST

Initiate Payment
This API allows a user to initiate a payment. It takes a product ID as input and returns a transaction ID which can be used to continue the transaction.

URL: /api/payments

Method: POST

Send Verification Code
This API sends a verification code to the user's email address. It takes a transaction ID as input and uses the email service specified in the .env file to send the code.

URL: /api/payments/send-verification-code

Method: POST

Verify Code
This API allows the user to verify the verification code they received. It takes the transaction ID and verification code as input and returns a success message if the code is correct.

URL: /api/payments/verify-code

Method: POST



Conclusion
The Payment Gateway APIs are a simple yet powerful set of APIs that allow users to initiate payments, send verification codes, and verify the codes to complete transactions. These APIs are easy to use and integrate with any application that requires payment processing capabilities. By following the steps outlined in this guide, you can quickly get started with these APIs and begin processing payments in no time.