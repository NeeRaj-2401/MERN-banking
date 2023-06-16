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

**NOTE:** Before running the project, make sure to create a `.env` file in the `backend` directory with the following information:

```
PORT=4040
CONNECTION_URL="mongodb+srv://admin:admin@cluster0.b7eppky.mongodb.net/"
SECRECT_KEY="NEERAJ_BANKING"
```

These environment variables are necessary for the backend server to establish the port, database connection, and secret key for authentication.
