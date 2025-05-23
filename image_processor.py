import google.generativeai as genai
from google.generativeai import types
from PIL import Image
import requests
import json
def send_image(prompt):
# Configure API key
    genai.configure(api_key="AIzaSyC8QxAJpeyZe2BySn6QymSOI9X0BHGrkTo")

    # Choose a multimodal model
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Example 1: Local image with PIL
    image = Image.open("Image.jpg")
    resp1 = model.generate_content([prompt, image])
    print(resp1.text)

    json_string = resp1.text.split("```")
        
    json_string = json_string[1]
    json_string = json_string.replace('json','')
    json_string = json_string.replace('\n{','{')
    json_string = json_string.replace('}\n','}')
    print(json_string)
    print('\n')
    json_string = json.loads(json_string)
    return json_string


# Example 2: Image from URL using types.Part
