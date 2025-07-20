import requests

def summarize_deal(target: str, buyer: str, description: str) -> str:
    
    #we will use Ollama to generate a summary of an M&A deal using our local llm(in my case utilising gemma3n)
    
    prompt = (
        f"Summarize this investment banking M&A deal in 4 to 6 sentences. "
        f"Include the buyer ({buyer}), the target ({target}), and key motivations or highlights.\n\n"
        f"{description}"
    )

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma3n:e4b",  
                # or "deepseek", "gemma", whatever you may have installed.
                "prompt": prompt,
                "stream": False
            }
        )
        return response.json()["response"].strip()
    except Exception as e:
        return f"Error from local AI: {str(e)}"

# This Sends a prompt to my gemma model running in ollama and then returns a clean summary string to use in the frontend

