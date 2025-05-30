# DishQuest

DishQuest is a full-stack web application designed to help users discover, explore, and share dishes from around the world. The project is organized into a `client` (frontend) and a `server` (backend), leveraging modern web technologies for a seamless user experience.

## Live Demo
[DishQuest](http://104.131.189.144:3000/dishquest)

## Features

- User authentication
- Add, edit, and review recipes
- Add to favorites
- Responsive design for desktop and mobile
- RESTful API backend

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB Atlas 
- Angular CLI

### Installation

1. Clone the repository
2. cd into client direcory
3. npm install for dependencies

### Running the Application

1. cd into server directory
2. npm install for dependencies
3. create MongoDB collection within your cluster
4. modify app.js mongoose.connect as needed
5. Create `.env` file with MongoDB credentials:
   ```env
   DB_USER = your_MongoDB_username
   DB_PWD  = your_MongoDB_password
   ```
6. npm start to run server on localhost:3000

## Technologies Used

- **Frontend:** TypeScript, Angular, and Bootstrap CSS
- **Backend:** Node.js/Express with MongoDB
- **API:** RESTful endpoints

## Contact

For questions or feedback, please open an issue in the repository.

