from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("✅ Gemini configured successfully")
except Exception as e:
    print(f"❌ Gemini configuration failed: {e}")
    model = None

# Define the fallback response function BEFORE the route that uses it
def generate_local_response(query):
    """Local fallback when API fails"""
    query = query.lower()
    advice_map = {
        "save": """• Pay yourself first (20% of income)
• Use high-yield savings accounts (~4% APY)
• Automate transfers on payday""",
        "invest": """1. Get 401k match (free money)
2. Open Roth IRA ($7,000/year limit)
3. Invest in index funds (VTI/VOO)""",
        "debt": """Debt repayment steps:
1. List all debts by interest rate
2. Pay minimums on all
3. Extra payments to highest interest debt""",
        "default": """Financial Health Basics:
1. Track spending (use apps like Mint)
2. Build $1,000 emergency fund
3. Pay credit cards in full
4. Invest 15% of income"""
    }
    
    for keyword in advice_map:
        if keyword in query:
            return advice_map[keyword]
    
    return advice_map["default"]

# Sample financial data
financial_goals = [
    {
        "id": 1,
        "name": "Emergency Fund",
        "target": 10000,
        "saved": 6500,
        "deadline": "2023-12-31",
        "priority": "high",
        "category": "emergency",
        "status": "active"
    },
    {
        "id": 2,
        "name": "Vacation to Japan",
        "target": 5000,
        "saved": 1200,
        "deadline": "2024-06-15",
        "priority": "medium",
        "category": "travel",
        "status": "active"
    }
]

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    
    if not user_message:
        return jsonify({"response": "Please enter a valid question"}), 400
    
    if model:
        try:
            response = model.generate_content(
                f"""As a financial expert, provide concise advice about: {user_message}
                
                Guidelines:
                - Maximum 150 words
                - Use bullet points if helpful
                - Suggest specific numbers/percentages
                - Avoid financial jargon"""
            )
            return jsonify({
                "response": response.text,
                "source": "gemini"
            })
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return jsonify({
                "response": generate_local_response(user_message),
                "source": "local"
            })
    
    return jsonify({
        "response": generate_local_response(user_message),
        "source": "local"
    })

@app.route('/api/goals', methods=['GET'])
def get_goals():
    return jsonify(financial_goals)

@app.route('/api/goals', methods=['POST'])
def add_goal():
    new_goal = request.get_json()
    financial_goals.append(new_goal)
    return jsonify({"message": "Goal added successfully"}), 201

@app.route('/')
def serve_frontend():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)