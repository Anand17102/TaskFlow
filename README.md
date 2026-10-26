# TaskFlow 🚀

A full-stack task management application built with Django REST Framework and React.

## Features

* User registration and JWT authentication
* User profile management and profile image uploads
* Create, view, update, and delete tasks
* Task search, filtering, sorting, and prioritization
* Organize tasks into spaces
* Space cover image uploads
* Dashboard with task summary cards
* Responsive user interface

## Tech Stack

**Frontend**

* React
* Vite
* Axios
* CSS

**Backend**

* Python
* Django
* Django REST Framework
* Simple JWT

**Database**

* PostgreSQL

**Media Storage**

* Cloudinary

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/TaskFlow.git
cd TaskFlow
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file in the backend directory and configure the required Django, database, and Cloudinary environment variables.

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Testing

Backend:

```bash
cd backend
python manage.py test
```

Frontend production build:

```bash
cd frontend
npm run build
```

## Security

* Never commit `.env` files or API secrets.
* Use environment variables for production configuration.
* Configure production database and allowed hosts before deployment.

## Author

**Anand**

GitHub: https://github.com/Anand17102
