import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = "cv_scanner.db"

def get_db():
    return sqlite3.connect(DB_PATH)

def create_user(username, password):
    db = get_db()
    cursor = db.cursor()
    hashed = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed)
    )
    db.commit()
    db.close()

def get_user(username):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT id, username, password FROM users WHERE username = ?",
        (username,)
    )
    user = cursor.fetchone()
    db.close()
    return user

def verify_password(stored_hash, password):
    return check_password_hash(stored_hash, password)
