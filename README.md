# My Web Accountant

This API is developed specifically for the client side app but documentation for the endpoints can be found at the '/api' endpoint.

<br />

# Tech Stack

NodeJS, Express, MySQL, HTML, CSS, JavaScript

<a href="https://skillicons.dev">
<img src="https://skillicons.dev/icons?i=nodejs,express,mysql,html,css,js&perline=9" />
</a>

Libraries utilized: Bcryptjs, Jsonwebtoken, Nodemailer, Knex

<br/>

# Deployment Details

This API is deployed using heroku (the related database also deployed through heroku utilizing jawsdb).

<a href="https://skillicons.dev">
<img src="https://skillicons.dev/icons?i=heroku&perline=9" />
</a>

<br />

# Features

This end point allows you to:

- Register a user.
- Change passwords.
- Delete a user.

<br/>
To login, the user needs to first validate their email address.

Individual Users can log in and have access to the follow:

- Set up payment account information,
- View a list of payment accounts set up,
- View details for a single payment account,
- Delete a single payment account,

- View a breakdown of expenses by category and period,
- View a list of transactions by period,
- Record, View, Edit, or Delete a transaction,
- View all transactons for a specific user,

- View a breakdown of budget totals by category and period,
- View a list of budget records by period,
- Record, View, Edit, or Delete a budget record,
- View all budget records for a specific user,

- View a list of transfer records by period,
- Record, View, Edit, or Delete a transfer record,
- View all transfer records for a specific user,

- Get cashflow inflow for 3 month, 6 month, or 12 month periods.

- Users have access to information for their own user only.

<br />

# Run Locally

1. Clone or downlaod the repository nto your machine.
2. Open the terminal and cd into the repository root folder (i.e. where the package.json file is.)
3. Run 'npm i' to download the necessary node modules.
4. Create a database by the name: 'my_web_accountant'.
5. Create a .env file using the 'envexample' as reference. Your database username and password will be entered here as well as the Port you are using.
6. This endpoint utilizes sending emails from a mail service provider. Take a look at the .env example and update the required information.
7. Run the following command line in terminal to generate a key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
8. Update the .env file with the Key generated in point 7.
9. Refer to temp data files for test data to be included.

<br />

# General

The instructions to run locally presume that you have node, visual studio, and MySQL installed on your system. If you do not, then you will need to install and set up these first.
