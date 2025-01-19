# Learn English App

This is a web application designed to help children learn English. The application includes features such as learning new words, parent control, and user authentication. Translations from English to Finnish.

## Live Demo

You can access the live demo of the application at [Learn English App](https://fullstack-test-g0xp.onrender.com/).

## Features

- **Learn Words**: Users can learn new words and get points from it. Words can be filter with tags.
- **Parent Control**: Parents can manage the words and tags for their children.
- **User Authentication**: Users can register, log in, and log out.

## Technologies Used

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: Sqlite
- **Authentication**: JWT (JSON Web Tokens)

## Installation

To run the application locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/LeeviHaukijarvi/Learn-English-App
    cd learn-english-app
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root of backend directory and add the following environment variables:
    ```env
    SECRET_KEY=your_jwt_secret
    MODE=dev // add this if using app in development
    ```
4. **Run the application**:
    ```sh
    npm run start
    ```

## Usage

### Learn Words

1. Navigate to the "Learn" section.
2. Translate the words and check your answers.
3. Track your points.

### Parent Control

1. Navigate to the "Parent Control" section.
2. Add, update, or delete words and tags.
3. Manage the learning content for your children.

### User Authentication

1. Register a new account or log in with an existing account.
2. Access the "Parent Control" section and do changes.
3. Log out when your child wants to play.

## Contact

For any questions or feedback, please contact [leevi.haukijarvi@tuni.fi](mailto:leevi.haukijarvi@tuni.fi)