# AI Financial Goal Planner

A web application that helps users set, track, and achieve their financial goals with AI assistance.

## Features

- Create and manage financial goals
- Track progress with visual indicators
- Get AI-powered financial advice
- View insights and recommendations
- Dark theme UI

## Technologies Used

- Frontend: HTML, CSS, JavaScript (with Chart.js)
- Backend: Python (Flask)
- AI: OpenAI API (free tier available)

## Setup Instructions

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set up OpenAI API key:
   - Create a `.env` file in the backend directory
   - Add: `OPENAI_API_KEY=your-api-key-here`
6. Run the app: `python backend/app.py`

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Go to Vercel and create a new project
3. Import your GitHub repository
4. Add environment variable `OPENAI_API_KEY` with your API key
5. Deploy!

## Configuration

You can modify the following in `backend/app.py`:
- OpenAI model (default: gpt-3.5-turbo)
- Response length (max_tokens)
- Temperature (controls creativity of responses)