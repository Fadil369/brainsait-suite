# 🌐 BrainSAIT Suite - Public Tunnel Access

## ✅ Live Public URLs (via LocalTunnel)

### 🧠 **Interactive Demo Page**
```
https://brainsait-demo.loca.lt
```
- Beautiful web interface for testing
- Works with English and Arabic
- Real-time AI responses
- No authentication required

### 🔌 **API Endpoint**
```
https://brainsait-api.loca.lt
```
- RESTful API access
- Swagger documentation available
- Health monitoring
- Test endpoints

---

## 🚀 Quick Test Examples

### Test via Web Interface
Simply visit: **https://brainsait-demo.loca.lt**

### Test via API (curl)

#### Health Check
```bash
curl https://brainsait-api.loca.lt/health
```

#### AI Generation (English)
```bash
curl -X POST 'https://brainsait-api.loca.lt/test/generate?query=What%20is%20diabetes?'
```

#### AI Generation (Arabic)
```bash
curl -X POST 'https://brainsait-api.loca.lt/test/generate?query=%D9%85%D8%A7%20%D9%87%D9%88%20%D9%85%D8%B1%D8%B6%20%D8%A7%D9%84%D8%B3%D9%83%D8%B1%D9%8A%D8%9F'
```

#### View API Documentation
```
https://brainsait-api.loca.lt/docs
```

---

## 📊 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/test/generate` | POST | AI text generation |
| `/docs` | GET | Interactive API docs |

---

## 🔧 Technical Details

### Tunnel Setup
- **Tool**: LocalTunnel (npm package)
- **API Port**: 8001 → https://brainsait-api.loca.lt
- **Web Port**: 8888 → https://brainsait-demo.loca.lt
- **Protocol**: HTTPS (automatic SSL)

### Services Running
- ✅ FastAPI (Python 3.11)
- ✅ Google Gemini AI (2.0 Flash)
- ✅ PostgreSQL 16
- ✅ Redis 7
- ✅ Docker Compose

### Tunnel Commands
```bash
# API Tunnel
lt --port 8001 --subdomain brainsait-api

# Web Tunnel
lt --port 8888 --subdomain brainsait-demo
```

---

## 🎯 Testing Scenarios

### Scenario 1: Quick Health Check
```bash
curl https://brainsait-api.loca.lt/health | jq
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-12T19:00:00.000000",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ai_model": "gemini-2.0-flash-exp"
  }
}
```

### Scenario 2: AI Query (English)
```bash
curl -X POST 'https://brainsait-api.loca.lt/test/generate?query=Explain%20diabetes' | jq
```

### Scenario 3: AI Query (Arabic)
```bash
curl -X POST 'https://brainsait-api.loca.lt/test/generate?query=اشرح%20مرض%20السكري' | jq
```

### Scenario 4: Interactive Web Test
1. Open browser
2. Visit: https://brainsait-demo.loca.lt
3. Try example queries or type your own
4. See real-time AI responses

---

## 🔒 Security Notes

- ⚠️ **First-time access**: LocalTunnel may show a security page - click "Continue"
- ✅ **HTTPS**: All traffic encrypted via tunnel
- ✅ **Public test endpoint**: No authentication required
- ⚠️ **Production**: Should use authenticated endpoints
- ℹ️ **Tunnel stability**: Free tier tunnels may disconnect

---

## 🌍 Alternative Access Methods

### Method 1: Direct IP (Firewall configured)
```
http://82.25.101.65:8001/health
http://82.25.101.65:8888/test.html
```

### Method 2: LocalTunnel (Public HTTPS)
```
https://brainsait-api.loca.lt
https://brainsait-demo.loca.lt
```

### Method 3: Ngrok (Requires auth token)
```bash
# Requires signup and auth token
ngrok config add-authtoken YOUR_TOKEN
ngrok http 8001
```

---

## 📝 Example Queries to Try

### English Medical Queries
- "What are the symptoms of diabetes?"
- "Explain hypertension in simple terms"
- "What is the difference between Type 1 and Type 2 diabetes?"
- "How does insulin work in the body?"

### Arabic Medical Queries
- "ما هي أعراض مرض السكري؟"
- "اشرح ارتفاع ضغط الدم بطريقة بسيطة"
- "ما الفرق بين السكري النوع الأول والثاني؟"
- "كيف يعمل الأنسولين في الجسم؟"

---

## 🛠️ Troubleshooting

### Issue: "This site can't be reached"
**Solution**: Tunnel may have disconnected. Check if services are running:
```bash
ps aux | grep lt
```

### Issue: LocalTunnel security warning
**Solution**: Click "Continue" or "Click to Continue" on the warning page

### Issue: Slow response times
**Solution**: 
- First request may be slow (cold start)
- Try again - subsequent requests are faster
- Check tunnel status

### Issue: 502 Bad Gateway
**Solution**: Check if Docker services are running:
```bash
docker compose ps
```

---

## 🎉 Success Indicators

✅ API Health Check returns `"status": "healthy"`
✅ Test endpoint returns AI-generated text
✅ Web interface loads and accepts queries
✅ Both English and Arabic queries work
✅ Response time < 5 seconds

---

## 📞 Support & Resources

- **GitHub**: https://github.com/Fadil369/brainsait-suite
- **API Docs**: https://brainsait-api.loca.lt/docs
- **Test Page**: https://brainsait-demo.loca.lt
- **Health Check**: https://brainsait-api.loca.lt/health

---

## 🚦 Current Status

| Service | Status | URL |
|---------|--------|-----|
| API | 🟢 Running | https://brainsait-api.loca.lt |
| Web Demo | 🟢 Running | https://brainsait-demo.loca.lt |
| Database | 🟢 Running | Internal (PostgreSQL) |
| Cache | 🟢 Running | Internal (Redis) |
| AI Model | 🟢 Connected | Gemini 2.0 Flash |

---

**Last Updated**: 2025-11-12T19:02:00Z
**Tunnel Method**: LocalTunnel v2.0.2
**Deployment**: Production Server (82.25.101.65)

🎯 **Ready for testing!** Visit https://brainsait-demo.loca.lt to start! 🚀
