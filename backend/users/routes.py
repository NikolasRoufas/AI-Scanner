from flask import request, jsonify
import sqlite3


@app.route('/api/register', methods=['POST'])
def register_user():
    """
    Endpoint to register a new user.
    Requires: email and password in request JSON
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # In a real application, you should hash the password
        # For this example, we'll store it as plain text (not recommended for production)
        password_hash = password  # Replace with proper hashing in production
        
        with sqlite3.connect(app.config['DATABASE']) as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('''
                INSERT INTO users (email, password_hash, created_at)
                VALUES (?, ?, datetime('now'))
                ''', (email, password_hash))
                conn.commit()
                user_id = cursor.lastrowid
                
                return jsonify({
                    "success": True,
                    "user_id": user_id,
                    "email": email
                })
            except sqlite3.IntegrityError:
                return jsonify({"error": "Email already registered"}), 409
    
    except Exception as e:
        logger.error(f"Error in register_user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """
    Endpoint to login a user.
    Requires: email and password in request JSON
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        with sqlite3.connect(app.config['DATABASE']) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            
            if not user or user['password_hash'] != password:  # Replace with proper password checking in production
                return jsonify({"error": "Invalid email or password"}), 401
            
            return jsonify({
                "success": True,
                "user_id": user['id'],
                "email": user['email']
            })
    
    except Exception as e:
        logger.error(f"Error in login_user: {str(e)}")
        return jsonify({"error": str(e)}), 500