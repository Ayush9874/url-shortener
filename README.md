# Snip - Premium URL Shortener

A sleek and modern URL shortener built with Node.js, Express, and SQLite. Features a beautiful glassmorphism UI and comprehensive API for managing short links.

## 🚀 Features

- **Shorten URLs**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Automatically generated unique 6-character codes
- **URL Validation**: Ensures only valid URLs are shortened
- **Access Statistics**: Track how many times each link has been accessed
- **CRUD Operations**: Create, read, update, and delete short URLs via API
- **Modern UI**: Glassmorphism design with responsive layout
- **One-Click Copy**: Easily copy shortened URLs to clipboard
- **Automatic Redirects**: Seamless redirection from short links to original URLs

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Glassmorphism design with Google Fonts (Outfit)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush9874/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 API Endpoints

### Create Short URL
```http
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

### Get Original URL (Redirect)
```http
GET /shorten/:shortCode
```

### Get URL Statistics
```http
GET /shorten/:shortCode/stats
```

### Update Short URL
```http
PUT /shorten/:shortCode
Content-Type: application/json

{
  "url": "https://new-url.com"
}
```

### Delete Short URL
```http
DELETE /shorten/:shortCode
```

## 🗄️ Database Schema

The application uses SQLite with a single `urls` table:

```sql
CREATE TABLE urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    shortCode TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    accessCount INTEGER DEFAULT 0
);
```

## 🎨 Usage

1. **Shortening URLs**:
   - Enter a long URL in the input field
   - Click "Shorten"
   - Copy the generated short link

2. **Sharing Short Links**:
   - The short URL format is: `http://your-domain/?c=shortCode`
   - When accessed, it automatically redirects to the original URL

3. **Viewing Statistics**:
   - Use the API endpoint `/shorten/:shortCode/stats` to view access counts

## 🔧 Configuration

- **Port**: Set via `PORT` environment variable (default: 3000)
- **Database**: Automatically creates `database.sqlite` in the project root

## 📁 Project Structure

```
url-shortener/
├── server.js          # Main Express server
├── database.js        # SQLite database setup and queries
├── verify.js          # (Additional verification logic)
├── package.json       # Dependencies and scripts
└── public/
    ├── index.html     # Main UI
    ├── index.css      # Styling
    └── app.js         # Frontend JavaScript
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Design inspired by modern glassmorphism trends
- Built with love for clean, efficient URL shortening</content>
<parameter name="filePath">c:\Users\AYUSH BHATTACHARYYA\OneDrive\Documents\projects\url-shortener\README.md