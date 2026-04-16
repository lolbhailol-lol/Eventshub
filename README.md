# Event Discovery Platform (Latur College Fests)

## Setup and Run

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run backend from the `backend` folder:

```bash
uvicorn app.main:app --reload
```

3. Open frontend:
- Open `frontend/index.html` directly in your browser.

## Test Flow

1. Go to Signup page and create an account.
2. Go to Login page and log in with the same credentials.
3. On successful login, you are redirected to home.
4. Open browser DevTools -> Application -> Local Storage and verify `access_token` is present.

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Update values like `SECRET_KEY` and `CORS_ALLOW_ORIGINS` for your environment.

## Docker Deployment

1. Ensure Docker is installed.
2. From project root, run:

```bash
docker compose up --build
```

3. Access:
- Frontend: `http://127.0.0.1:5500`
- Backend: `http://127.0.0.1:8000`
