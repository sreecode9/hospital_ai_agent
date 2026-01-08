# 🚀 Deployment Configuration

Your AI Symptom Checking Assistant is configured for production deployment!

## 🌐 Current Deployment URLs

- **Frontend:** https://hospitalaiagent1.vercel.app/
- **Backend:** https://hospital-ai-agent-2.onrender.com

## ✅ CORS Configuration

**Backend CORS Settings (Updated):**
```python
allow_origins=[
    "http://localhost:5173",     # Vite dev server
    "http://localhost:3000",     # Alternative dev server
    "https://hospitalaiagent1.vercel.app",  # Deployed frontend
]
```

**Frontend API Configuration:**
```javascript
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://hospital-ai-agent-8csv.onrender.com/chat'
    : 'http://localhost:8000/chat')
```

## 🔧 Deployment Checklist

### Backend (Render)
- ✅ CORS configured for frontend domain
- ✅ Environment variables set (Google API key, Supabase credentials)
- ✅ FastAPI application running
- ✅ Gemini AI integration working

### Frontend (Vercel)
- ✅ API calls point to production backend
- ✅ Build configuration correct
- ✅ Medical disclaimer displayed
- ✅ Chat interface functional

## 🧪 Testing Production

### Test CORS
```bash
curl -X OPTIONS https://hospital-ai-agent-2.onrender.com/chat \
  -H "Origin: https://hospitalaiagent1.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### Test API Endpoint
```bash
curl -X POST https://hospital-ai-agent-2.onrender.com/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://hospitalaiagent1.vercel.app" \
  -d '{"message": "headache", "session_id": "test"}'
```

## 🌍 Environment Variables

### Backend (.env on Render)
```
GOOGLE_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
WEBHOOK_URL=https://your-webhook-url.com
```

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://hospital-ai-agent-2.onrender.com/chat
```

## 🔄 Redeployment Steps

### If Backend Changes:
1. Commit changes to GitHub
2. Render auto-deploys from main branch

### If Frontend Changes:
1. Commit changes to GitHub
2. Vercel auto-deploys from main branch

### If CORS Issues:
1. Check backend CORS settings in `main.py`
2. Verify frontend API URL in `ChatInterface.jsx`
3. Clear browser cache

## 🐛 Troubleshooting

### CORS Errors
- Check browser developer tools for CORS errors
- Verify `allow_origins` includes your frontend domain
- Ensure HTTPS URLs (not HTTP) for production

### API Connection Issues
- Test backend health: `https://hospital-ai-agent-8csv.onrender.com/health`
- Check environment variables are set in Render dashboard
- Verify Gemini API key is valid and has quota

### Frontend Not Loading
- Check Vercel deployment logs
- Verify build process completes successfully
- Test with different browsers

## 📊 Monitoring

- **Render Dashboard:** Monitor backend performance and logs
- **Vercel Dashboard:** Monitor frontend deployments and analytics
- **Supabase Dashboard:** Monitor database usage and queries
- **Google AI Studio:** Monitor Gemini API usage

## 🔒 Security Notes

- API keys are stored securely in deployment platforms
- CORS prevents unauthorized cross-origin requests
- Supabase RLS protects database access
- Gemini API has built-in content safety filters

## 🎯 Performance Optimization

- Backend: FastAPI with async support
- Frontend: React with code splitting
- Database: Supabase with connection pooling
- AI: Gemini Pro with efficient prompting

## 📞 Support

If issues persist:
1. Check deployment logs in Render/Vercel dashboards
2. Test API endpoints manually
3. Verify environment variables
4. Check browser console for errors

**Your AI health assistant is production-ready! 🏥🤖**

