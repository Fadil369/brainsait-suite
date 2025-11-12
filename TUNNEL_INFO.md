# 🌐 BrainSAIT Suite - Tunnel Access Information

## ✅ **ACTIVE TUNNEL URLs**

### 🧠 **Interactive Demo Page**
```
https://short-wombats-learn.loca.lt
```

### 🔌 **API Endpoint**
```
https://new-corners-cross.loca.lt
```

---

## 🔑 **TUNNEL PASSWORD: `82.25.101.65`**

When you first visit either URL, LocalTunnel shows a reminder page. To proceed:

### Option 1: Via Browser (Simple)
1. Click the **"Click to Continue"** button
2. You'll be redirected to the actual site
3. Works for 24 hours from that browser

### Option 2: Via SSH/Terminal (For API Access)
```bash
# On your remote machine, run:
curl https://loca.lt/mytunnelpassword

# Or:
wget -q -O - https://loca.lt/mytunnelpassword
```

This will return: `82.25.101.65` (the server IP)

---

## 🚀 **Bypass Methods for API Calls**

### Method 1: Custom Header (Recommended)
```bash
curl -H "bypass-tunnel-reminder: true" https://new-corners-cross.loca.lt/health
```

### Method 2: Custom User-Agent
```bash
curl -H "User-Agent: BrainSAIT-Client/1.0" https://new-corners-cross.loca.lt/health
```

### Method 3: Both Headers (Most Reliable)
```bash
curl -H "bypass-tunnel-reminder: true" \
     -H "User-Agent: BrainSAIT-Client/1.0" \
     https://new-corners-cross.loca.lt/health
```

---

## 📝 **Test Examples**

### Health Check
```bash
curl -s -H "bypass-tunnel-reminder: true" \
  https://new-corners-cross.loca.lt/health | jq
```

### AI Generation (English)
```bash
curl -s -X POST \
  -H "bypass-tunnel-reminder: true" \
  'https://new-corners-cross.loca.lt/test/generate?query=What%20is%20diabetes?' | jq
```

### AI Generation (Arabic)
```bash
curl -s -X POST \
  -H "bypass-tunnel-reminder: true" \
  'https://new-corners-cross.loca.lt/test/generate?query=%D9%85%D8%A7%20%D9%87%D9%88%20%D9%85%D8%B1%D8%B6%20%D8%A7%D9%84%D8%B3%D9%83%D8%B1%D9%8A%D8%9F' | jq
```

---

## 🌐 **For Web Testing (Browser)**

### Direct Links:
- **Demo Page**: https://short-wombats-learn.loca.lt
- **API Docs**: https://new-corners-cross.loca.lt/docs
- **Health Check**: https://new-corners-cross.loca.lt/health

### First Visit Steps:
1. Open the URL in your browser
2. You'll see a LocalTunnel reminder page
3. Click **"Click to Continue"** or enter IP: `82.25.101.65`
4. Done! The page will load

---

## 🔧 **For Developers/API Integration**

### JavaScript (with fetch)
```javascript
const API_URL = 'https://new-corners-cross.loca.lt';

fetch(`${API_URL}/test/generate?query=Hello`, {
  method: 'POST',
  headers: {
    'bypass-tunnel-reminder': 'true',
    'User-Agent': 'BrainSAIT-Client/1.0'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Python (with requests)
```python
import requests

url = "https://new-corners-cross.loca.lt/test/generate"
headers = {
    "bypass-tunnel-reminder": "true",
    "User-Agent": "BrainSAIT-Client/1.0"
}
params = {"query": "What is diabetes?"}

response = requests.post(url, headers=headers, params=params)
print(response.json())
```

### cURL (Complete Example)
```bash
curl -X POST \
  -H "bypass-tunnel-reminder: true" \
  -H "User-Agent: BrainSAIT-Client/1.0" \
  -H "Content-Type: application/json" \
  'https://new-corners-cross.loca.lt/test/generate?query=Explain%20hypertension' \
  | jq -r '.response'
```

---

## 📊 **Available Endpoints**

| Endpoint | Method | Description | Bypass Header? |
|----------|--------|-------------|----------------|
| `/` | GET | API info | Recommended |
| `/health` | GET | Health check | Recommended |
| `/docs` | GET | Swagger UI | Via Browser |
| `/test/generate` | POST | AI generation | Required |

---

## ⚠️ **Important Notes**

1. **Tunnel URLs Change**: If tunnels restart, URLs will change
2. **Password is IP**: Always `82.25.101.65` (your server IP)
3. **Headers for API**: Use bypass headers for programmatic access
4. **Browser Access**: Just click "Continue" on first visit
5. **Tunnels are Free**: No signup or payment needed
6. **24hr Cookie**: Browser remembers bypass for 24 hours

---

## 🛠️ **Troubleshooting**

### Issue: "Tunnel Unavailable"
**Solution**: Tunnels may have restarted. Check new URLs:
```bash
cat /tmp/api-tunnel.log | grep "your url"
cat /tmp/web-tunnel.log | grep "your url"
```

### Issue: Still seeing reminder page in browser
**Solution**: 
- Clear cookies for loca.lt
- Click the continue button again
- Or use incognito/private mode

### Issue: API returns HTML instead of JSON
**Solution**: Add bypass headers:
```bash
-H "bypass-tunnel-reminder: true"
```

### Issue: CORS errors in web app
**Solution**: The test page is already configured with bypass headers

---

## 🎯 **Quick Start Guide**

### For Browser Users:
1. Visit: https://short-wombats-learn.loca.lt
2. Click "Continue" button
3. Start testing!

### For API Users:
```bash
# Copy and paste this:
curl -H "bypass-tunnel-reminder: true" \
  https://new-corners-cross.loca.lt/health
```

### For Developers:
Use the JavaScript/Python examples above with bypass headers included.

---

## 📞 **Support**

- **GitHub**: https://github.com/Fadil369/brainsait-suite
- **Password**: `82.25.101.65` (server IP)
- **Tunnel Info**: Run `curl https://loca.lt/mytunnelpassword`

---

**Last Updated**: 2025-11-12T19:10:00Z  
**Tunnel Provider**: LocalTunnel v2.0.2  
**Server**: 82.25.101.65  

🎯 **Ready to test!** Just remember the password is your server IP! 🚀
