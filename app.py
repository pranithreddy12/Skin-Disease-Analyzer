from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import random
import image_processor as ai
# Define skin conditions and their details
SKIN_CLASSES = [
    {"name": "Acne", "fullName": "Acne Vulgaris", "medications": ["Benzoyl Peroxide", "Retinoids"], "precautions": ["Wash face twice daily", "Avoid oily food"]},
    {"name": "Eczema", "fullName": "Atopic Dermatitis", "medications": ["Hydrocortisone", "Moisturizers"], "precautions": ["Use fragrance-free soap", "Avoid scratching"]},
    {"name": "Psoriasis", "fullName": "Psoriasis Vulgaris", "medications": ["Topical Steroids", "Vitamin D Analogues"], "precautions": ["Avoid stress", "Keep skin hydrated"]},
    {"name": "Rosacea", "fullName": "Rosacea", "medications": ["Metronidazole", "Azelaic Acid"], "precautions": ["Avoid spicy foods", "Use sunscreen"]},
    {"name": "Melanoma", "fullName": "Malignant Melanoma", "medications": ["Surgical Excision", "Immunotherapy"], "precautions": ["Avoid excessive sun exposure", "Regular dermatologist checkups"]}
]

class RequestHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        print(f"Received request: {self.path}")  # ✅ LOG every request
        
        if self.path == '/upload':
            try:
                # Set response headers
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()

                # Get content length safely
                content_length = self.headers.get('Content-Length')
                if not content_length:
                    raise ValueError("Missing Content-Length header")

                content_length = int(content_length)
                body = self.rfile.read(content_length)  # Read request body
                
                print(f"✅ Received data: {body}")  # ✅ LOG received data

                # Simulate AI analysis
                condition = ai.send_image('Based on the image sent tell me the skin diease and precautions. give output shortly in this format     {"name": "Acne","confidence":"7.0" "fullName": "Acne Vulgaris", "medications": ["Benzoyl Peroxide", "Retinoids"], "precautions": ["Wash face twice daily", "Avoid oily food"],"severity":"low"},')  # Call the image processing function

                response = {
                    'condition': condition['name'],
                    'fullName': condition['fullName'],
                    
                    'medications': condition['medications'],
                    'precautions': condition['precautions'],
                    'severity': condition['severity'],
                }

                print(f"✅ Sending response: {json.dumps(response, indent=2)}")  # ✅ LOG response
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = {'error': str(e)}
                print(f"❌ Backend Error: {str(e)}")  # ✅ LOG errors
                self.wfile.write(json.dumps(error_response).encode())

if __name__ == "__main__":
    server_address = ("", 5001)  # ✅ Ensure it's listening on the correct port (5000)
    httpd = HTTPServer(server_address, RequestHandler)
    
    print("✅ Server running on http://localhost:5000")  # 🔧 Corrected from 3000 to 5000
    httpd.serve_forever()
