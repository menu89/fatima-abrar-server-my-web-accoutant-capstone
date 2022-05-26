# My Web Accountant

This API is developed specifically for the client side app but documentation for the endpoints can be found at the '/api' endpoint.

# Tech Stack

NodeJS, Express, Knex, MySQL

# Features

This end point allows you to:

- Register a user.
- Individual Users can log in and have access to the follow:
- Set up payment account information,
- Record purchases,
- View a breakdown of expenses by category and period,
- View a list of payment accounts set up,
- Users only have access to information for their own user only.

# Run Locally

1. Clone or downlaod the repository nto your machine.
2. Open the terminal and cd into the repository root folder (i.e. where the package.json file is.)
3. Run 'npm i' to download the necessary node modules.
4. Create a database by the name: 'my_web_accountant'.
5. Create a .env file using the 'envexample' as reference. Your database username and password will be entered here as well as the Port you are using.
6. Run the following command line in terminal to generate a key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
7. Update the .env file with the Key generated in point 6.
8. Refer to temp data files for test data to be included.

# General

The instructions to run locally presume that you have node, visual studio, and MySQL installed on your system. If you do not, then you will need to install and set up these first.
