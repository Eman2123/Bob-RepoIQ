# 🤖 Bob Business Translator

A full-stack web application that analyzes GitHub repositories and translates technical code into plain English explanations for business owners and non-technical stakeholders.

## 🌟 Features

- **Simple Repository Analysis**: Paste any GitHub repository URL and get instant analysis
- **Plain English Explanations**: Understand what the code does without technical jargon
- **Issue Detection**: Automatically identify broken or problematic code areas
- **Fix Suggestions**: Get actionable recommendations in simple language
- **Code Quality Score**: See overall code health at a glance
- **PDF Export**: Download comprehensive analysis reports

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API communication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **GitHub REST API** - Repository data fetching
- **IBM watsonx.ai** - AI-powered code analysis using Granite model

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- IBM Cloud account with watsonx.ai access
- GitHub account (optional, for private repos)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bob-business-translator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
GITHUB_TOKEN=your_github_token_here (optional for public repos)
WATSONX_API_KEY=your_ibm_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📖 Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Paste a GitHub repository URL** in the input field
   - Example: `https://github.com/username/repository`

3. **Click "Analyze Repository"** and wait for Bob to analyze the code

4. **View the Dashboard** with:
   - Simple explanation of what the app does
   - Code quality score
   - List of issues found
   - Fix suggestions in plain English

5. **Export PDF Report** by clicking the "Export PDF" button

## 🔑 Getting IBM watsonx.ai Credentials

1. Sign up for an IBM Cloud account at https://cloud.ibm.com
2. Create a watsonx.ai instance
3. Navigate to your watsonx.ai project
4. Get your API key from the IBM Cloud dashboard
5. Copy your Project ID from the watsonx.ai project settings

## 📁 Project Structure

```
bob-business-translator/
├── backend/
│   ├── routes/
│   │   ├── github.js          # GitHub API routes
│   │   └── analysis.js        # Analysis routes
│   ├── services/
│   │   ├── githubService.js   # GitHub API integration
│   │   └── analysisService.js # IBM watsonx.ai integration
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.js # Home page
│   │   │   └── Dashboard.js   # Analysis results
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔧 API Endpoints

### GitHub Routes
- `POST /api/github/repo-info` - Get repository information
- `POST /api/github/repo-tree` - Get repository file tree
- `POST /api/github/file-content` - Get file content

### Analysis Routes
- `POST /api/analysis/analyze` - Analyze repository codebase
- `POST /api/analysis/generate-report` - Generate PDF report

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by **IBM watsonx.ai** Granite Model
- GitHub REST API for repository data
- React and Tailwind CSS communities

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ by Bob