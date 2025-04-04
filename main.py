from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDVfEfdEHRSA5uc88qxU4WG10liyVvAsg0")
genai.configure(api_key=API_KEY)

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gemini-1.5-flash"

def format_response(response: str) -> str:
    """Format the response to handle special cases and improve readability."""
    # Remove HTML tags
    response = re.sub(r'<[^>]+>', '', response)
    
    # Remove asterisks
    response = re.sub(r'\*+', '', response)
    
    # Handle special cases
    if "I don't have access to real-time information" in response:
        return "I apologize, but I don't have access to real-time information. Please verify any time-sensitive information from reliable sources."
    
    # Handle code blocks
    response = re.sub(r'```(\w+)?\n(.*?)```', r'\2', response, flags=re.DOTALL)
    
    # Clean up extra whitespace
    response = re.sub(r'\s+', ' ', response)
    
    # Add proper line breaks for readability
    response = response.replace('. ', '.\n')
    
    return response.strip()

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        model = genai.GenerativeModel(request.model)
        response = model.generate_content(request.prompt)
        
        if response and response.text:
            formatted_response = format_response(response.text)
            return {
                "status": "success",
                "response": formatted_response,
                "model": request.model
            }
        else:
            return {
                "status": "error",
                "response": "No response generated.",
                "model": request.model
            }
    except Exception as e:
        return {
            "status": "error",
            "response": f"Error: {str(e)}",
            "model": request.model
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "gemini-1.5-flash"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 