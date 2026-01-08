# 🚀 Render Deployment Guide

## Fixed: Port Binding Issue

The port binding error has been resolved! Here's what was changed:

### **✅ Changes Made:**

1. **Updated `main.py`** - Now uses `PORT` environment variable from Render
2. **Created `start.py`** - Production startup script
3. **Updated CORS** - Frontend now points to: `https://hospital-ai-agent-2.onrender.com`

### **🔧 Render Configuration:**

#### **Build Command:**
```bash
pip install -r requirements.txt
```

#### **Start Command:**
```bash
python start.py
```

#### **Root Directory Files:**
- `requirements.txt` - Dependencies (copied from backend/)
- `start.py` - Production startup script
- `backend/` - All backend application code

#### **Environment Variables:**
```
GOOGLE_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://iyobtnkcfmgxvrdlnaqo.supabase.co
SUPABASE_KEY=your_supabase_key_here
WEBHOOK_URL=optional_webhook_url
```

### **🌐 Current URLs:**

- **Backend:** https://hospital-ai-agent-2.onrender.com
- **Frontend:** https://hospitalaiagent1.vercel.app/

### **🧪 Testing Deployment:**

#### **Test Health Endpoint:**
```bash
curl https://hospital-ai-agent-2.onrender.com/health
```
Expected: `{"status": "healthy"}`

#### **Test API Endpoint:**
```bash
curl -X POST https://hospital-ai-agent-2.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "headache", "session_id": "test"}'
```
Expected: AI response with awareness guidance

#### **Test CORS:**
```bash
curl -X OPTIONS https://hospital-ai-agent-2.onrender.com/chat \
  -H "Origin: https://hospitalaiagent1.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```
Expected: CORS headers in response

### **🚨 Important Notes:**

1. **Environment Variables:** Make sure all required env vars are set in Render dashboard
2. **Port Binding:** The app now automatically uses Render's `PORT` environment variable
3. **CORS:** Frontend can now communicate with backend without CORS errors
4. **Health Check:** The `/health` endpoint is available for monitoring

### **🔄 Redeployment Steps:**

1. **Commit changes** to your Git repository
2. **Push to GitHub** (if using auto-deployment)
3. **Or manually redeploy** in Render dashboard
4. **Wait** for deployment to complete
5. **Test** the endpoints above

### **📊 Monitoring:**

- **Render Dashboard:** Check logs and deployment status
- **Health Endpoint:** Monitor `/health` for uptime
- **API Testing:** Use the curl commands above

### **🐛 Troubleshooting:**

#### **Still getting port binding error:**
- Check that `start.py` exists in your repository
- Verify Render start command is `python start.py`
- Check Render logs for any import errors

#### **API not responding:**
- Verify environment variables are set correctly
- Check Google Gemini API key is valid
- Test with simple curl commands

#### **CORS issues:**
- Frontend URL should be in `allow_origins` in `main.py`
- Check browser developer tools for CORS errors

### **🎉 Success Checklist:**

- [ ] Health endpoint returns `{"status": "healthy"}`
- [ ] API endpoint returns AI response
- [ ] CORS headers present in OPTIONS response
- [ ] Frontend loads at https://hospitalaiagent1.vercel.app/
- [ ] Chat interface works without errors

**Your AI health assistant is now properly configured for Render deployment! 🏥🤖**
