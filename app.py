from flask import Flask, request, jsonify
from flask_cors import CORS  # Ajout de flask_cors
from leaf_analysis import analyze_leaf
import os

app = Flask(__name__, static_folder='static')
CORS(app)  # Active CORS pour éviter l'erreur "Failed to fetch"

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filepath = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(filepath)
    
    try:
        severity_data = analyze_leaf(filepath)
        return jsonify({
            'severity': f"{severity_data['percentage']:.2f}% ({severity_data['level']})",
            'image_url': f'/uploads/{file.filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Définit le port dynamique pour Render
    app.run(host='0.0.0.0', port=port, debug=True)  # Autorise l'accès externe
