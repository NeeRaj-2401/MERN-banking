# MERN-banking

---

## Steps to Run the Project Locally

Backend:
1. Open the terminal and navigate to the `backend` directory.
2. Run the command `npm i` to install the required dependencies.
3. Start the backend server by running `npm start`.

Frontend:
1. Open another terminal window/tab and navigate to the `frontend` directory.
2. Run the command `npm i --force` to install the required dependencies.
3. Start the frontend development server by running `npm start`.

---

**NOTE 1:** Before running the project, make sure to create a `.env` file in the `backend` directory with the following information:

```
PORT=4040
CONNECTION_URL=""
SECRECT_KEY=""
```

These environment variables are necessary for the backend server to establish the port, database connection, and secret key for authentication.


**NOTE 2:** To login as a user, you can use the following default user credentials:
```
Username: admin1
Password: admin1
```
You can explore few others admin credentials in `backend > defaulrUsers.js `

---

## API Routes

### User Routes
- `POST /users/login-user`: Login a user.
- `POST /users/register-user`: Register a new user.
- `POST /users/get-user-balance`: Get the balance of a user.
- `POST /users/deposit-money`: Deposit money into a user's account.
- `POST /users/withdraw-money`: Withdraw money from a user's account.
- `POST /users/get-all-users`: Get data of all users.
- `POST /users/get-user-data`: Get data of a specific user.

### Transaction Routes
- `POST /transactions/get-user-transaction`: Get transactions of a user.

---

Feel free to explore and interact with these API routes to perform various banking operations and retrieve user data.
