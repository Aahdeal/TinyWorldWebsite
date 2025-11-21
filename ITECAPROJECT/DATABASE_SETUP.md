# Database Setup Instructions

## Step 1: Start MySQL (if not running)
```bash
brew services start mysql
```

## Step 2: Run the database setup script

### Option A: If MySQL root has no password (default local setup)
```bash
cd /Users/aadil/Cursor/TinyWorldWebsite/ITECAPROJECT
mysql -u root < setup_database.sql
```

### Option B: If MySQL root has a password
```bash
cd /Users/aadil/Cursor/TinyWorldWebsite/ITECAPROJECT
mysql -u root -p < setup_database.sql
```
(You'll be prompted to enter your MySQL root password)

## Step 3: Update dbconn.php if needed

The `dbconn.php` file has been updated with local credentials:
- Username: `root`
- Password: `` (empty - change if your MySQL root has a password)
- Database: `tinyworld_db`

If your MySQL root user has a password, update line 4 in `dbconn.php`:
```php
$password = "your_mysql_root_password";
```

## Step 4: Test the connection

Start your PHP server:
```bash
cd /Users/aadil/Cursor/TinyWorldWebsite/ITECAPROJECT
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Default Admin Account

After running the setup script, you can log in with:
- Email: `admin@tinyworld.com`
- Password: `admin123`

**Important:** Change this password after first login!

