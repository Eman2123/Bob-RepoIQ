# 🚀 Bob Business Translator - Setup Guide

This guide will walk you through setting up the Bob Business Translator application step by step.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js (v16 or higher) installed
- [ ] npm (comes with Node.js)
- [ ] IBM Cloud account
- [ ] Text editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js

If you don't have Node.js installed:

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Get IBM watsonx.ai Credentials

1. **Create IBM Cloud Account**
   - Go to https://cloud.ibm.com
   - Click "Create an account" (free tier available)
   - Complete registration

2. **Set up watsonx.ai**
   - Log in to IBM Cloud
   - Search for "watsonx.ai" in the catalog
   - Create a new watsonx.ai instance
   - Create a new project

3. **Get Your Credentials**
   - **API Key**: 
     - Go to IBM Cloud dashboard
     - Click on "Manage" → "Access (IAM)"
     - Click "API keys" → "Create"
     - Copy and save your API key
   
   - **Project ID**:
     - Open your watsonx.ai project
     - Click on "Manage" tab
     - Copy the Project ID

### Step 3: Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd bob-business-translator

# Or download and extract the ZIP file
```

### Step 4: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # On Windows, use:
   copy .env.example .env
   ```

4. **Edit .env file**
   
   Open `backend/.env` in your text editor and fill in:
   ```env
   PORT=5000
   GITHUB_TOKEN=                    # Leave empty for public repos
   WATSONX_API_KEY=your_api_key_here
   WATSONX_PROJECT_ID=your_project_id_here
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   FRONTEND_URL=http://localhost:3000
   ```

5. **Test backend**
   ```bash
   npm run dev
   ```
   
   You should see: `Server is running on port 5000`

### Step 5: Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # On Windows, use:
   copy .env.example .env
   ```

5. **Edit .env file**
   
   Open `frontend/.env` and verify:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

6. **Start frontend**
   ```bash
   npm start
   ```
   
   Browser should open automatically at `http://localhost:3000`

## ✅ Verify Installation

1. **Check Backend**
   - Open http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Bob Business Translator API is running"}`

2. **Check Frontend**
   - Open http://localhost:3000
   - Should see the landing page with input field

3. **Test Analysis**
   - Paste a GitHub repo URL (e.g., `https://github.com/facebook/react`)
   - Click "Analyze Repository"
   - Wait for analysis to complete
   - View dashboard with results

## 🐛 Troubleshooting

### Backend won't start

**Problem**: Port 5000 already in use
```bash
# Solution: Change port in backend/.env
PORT=5001
# Also update frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
```

**Problem**: Module not found
```bash
# Solution: Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Frontend won't start

**Problem**: Port 3000 already in use
```bash
# Solution: React will ask to use another port
# Press 'Y' when prompted
```

**Problem**: Tailwind CSS not working
```bash
# Solution: Rebuild
npm run build
npm start
```

### API Errors

**Problem**: "Failed to fetch repository"
- Check if GitHub URL is correct
- Verify internet connection
- For private repos, add GitHub token to backend/.env

**Problem**: "Analysis failed"
- Verify IBM watsonx.ai credentials
- Check API key is valid
- Ensure project ID is correct
- Check IBM Cloud account has watsonx.ai access

### CORS Errors

**Problem**: CORS policy blocking requests
```bash
# Solution: Verify FRONTEND_URL in backend/.env matches your frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📝 Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start production server
npm run dev         # Start development server with auto-reload
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
```

## 🔐 Security Notes

- Never commit `.env` files to version control
- Keep your IBM API key secret
- Use environment variables for all sensitive data
- For production, use proper authentication

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [GitHub REST API](https://docs.github.com/en/rest)

## 💡 Tips

1. **Use nodemon for backend development** - Already configured with `npm run dev`
2. **Keep both terminals open** - One for backend, one for frontend
3. **Check browser console** - For frontend errors
4. **Check terminal output** - For backend errors
5. **Test with public repos first** - Before setting up GitHub token

## 🎉 Success!

If you can:
- ✅ See the landing page
- ✅ Paste a GitHub URL
- ✅ Get analysis results
- ✅ View the dashboard

You're all set! Start analyzing repositories! 🚀

---

Need help? Check the main README.md or open an issue on GitHub.