# Railway Deployment Guide for MelodyMatch Backend

This guide will help you migrate your backend from Render to Railway, eliminating cold starts while keeping costs minimal.

## Why Railway?

- ✅ **No cold starts** - instant response times
- ✅ **$5/month credit** - effectively free for light usage
- ✅ **WebSocket support** - Socket.io works perfectly
- ✅ **Simple deployment** - similar to Render
- ✅ **Great developer experience** - excellent logs and metrics

---

## Prerequisites

- [x] Railway account (sign up at https://railway.app)
- [x] Railway CLI installed
- [x] GitHub repository connected
- [x] MongoDB Atlas database (already set up)
- [x] Spotify API credentials (already set up)

---

## Step 1: Install Railway CLI

```bash
# Install Railway CLI (macOS/Linux)
npm install -g @railway/cli

# Or using Homebrew (macOS)
brew install railway

# Verify installation
railway --version
```

---

## Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate with Railway.

---

## Step 3: Initialize Railway Project

Navigate to your project root:

```bash
cd /Users/miles/code/MelodyMatch
```

Initialize Railway project:

```bash
# Option A: Create new project
railway init

# Option B: Link to existing Railway project (if you created one in the dashboard)
railway link
```

Follow the prompts to:
- Name your project (e.g., "melodymatch-backend")
- Select your Railway team/account

---

## Step 4: Set Environment Variables

You need to set all environment variables in Railway. You can do this via CLI or dashboard.

### Option A: Set via CLI (Recommended)

```bash
# Set all environment variables
railway variables set CONNECTION_STRING="your_mongodb_connection_string"
railway variables set CLIENT_ID="your_spotify_client_id"
railway variables set CLIENT_SECRET="your_spotify_client_secret"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set SESSION_SECRET="your_session_secret"

# These will be updated after deployment to use Railway URLs
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"
railway variables set BACKEND_URL="https://your-app.up.railway.app"
railway variables set REDIRECT_URI="https://your-app.up.railway.app/callback"

# PORT is automatically set by Railway, but you can override if needed
# railway variables set PORT=4000
```

### Option B: Set via Railway Dashboard

1. Go to https://railway.app/dashboard
2. Select your project
3. Click "Variables" tab
4. Add each environment variable manually

### Environment Variables Checklist

Make sure you set these variables:

- [ ] `CONNECTION_STRING` - MongoDB Atlas connection string
- [ ] `CLIENT_ID` - Spotify API client ID
- [ ] `CLIENT_SECRET` - Spotify API client secret
- [ ] `JWT_SECRET` - Your JWT secret (should be a secure random string)
- [ ] `SESSION_SECRET` - Your session secret (should be a secure random string)
- [ ] `FRONTEND_URL` - Your Vercel frontend URL (e.g., https://melodymatch.vercel.app)
- [ ] `BACKEND_URL` - Will be your Railway URL (update after first deployment)
- [ ] `REDIRECT_URI` - Railway URL + /callback (update after first deployment)

**Important**: Copy these from your current Render deployment or local `.env` file!

---

## Step 5: Deploy to Railway

```bash
# Deploy your application
railway up

# Or deploy with detached mode
railway up --detach
```

This will:
1. Upload your code to Railway
2. Install dependencies (`cd server && npm install`)
3. Start your server (`cd server && node server.js`)
4. Provide you with a deployment URL

**Note your Railway URL** - it will look like: `https://your-app.up.railway.app`

---

## Step 6: Get Your Railway URL

After deployment, get your public URL:

```bash
railway domain
```

Or create a custom domain:

```bash
railway domain create
```

Copy your Railway URL (e.g., `melodymatch-backend.up.railway.app`)

---

## Step 7: Update Environment Variables with Railway URL

Now update the URL-dependent variables:

```bash
# Update backend URL to your Railway URL
railway variables set BACKEND_URL="https://melodymatch-backend.up.railway.app"

# Update redirect URI
railway variables set REDIRECT_URI="https://melodymatch-backend.up.railway.app/callback"
```

After updating, redeploy:

```bash
railway up --detach
```

---

## Step 8: Update Vercel Frontend Environment Variables

Go to your Vercel dashboard and update the frontend environment variable:

1. Go to https://vercel.com/dashboard
2. Select your MelodyMatch frontend project
3. Go to Settings → Environment Variables
4. Update `VITE_API_URL` to your Railway backend URL:
   ```
   VITE_API_URL=https://melodymatch-backend.up.railway.app
   ```
5. Redeploy your frontend (Vercel will auto-deploy or trigger manually)

---

## Step 9: Update Spotify Developer Dashboard

Update your Spotify app's redirect URIs:

1. Go to https://developer.spotify.com/dashboard
2. Select your MelodyMatch app
3. Click "Edit Settings"
4. Under "Redirect URIs", add:
   ```
   https://melodymatch-backend.up.railway.app/callback
   ```
5. **Keep your localhost URI** for local development:
   ```
   http://localhost:4000/callback
   ```
6. Click "Save"

---

## Step 10: Test Your Deployment

### Check Deployment Status

```bash
# View logs
railway logs

# Check service status
railway status

# Open your app in browser
railway open
```

### Test Endpoints

Test these endpoints to verify everything works:

1. **Health check** (if you have one):
   ```
   https://your-railway-url.up.railway.app/
   ```

2. **Authentication flow**:
   - Go to your frontend
   - Try logging in with Spotify
   - Verify redirect works correctly

3. **Socket.io connection**:
   - Test real-time messaging
   - Should connect instantly (no cold start!)

4. **API endpoints**:
   - Test user registration
   - Test login
   - Test getting matches

### Verify No Cold Starts

- Wait 30 minutes
- Try accessing your backend again
- **It should respond instantly!** ✨

---

## Step 11: Monitor Usage & Costs

```bash
# View usage metrics
railway metrics

# Check current credit usage
railway status
```

Monitor your usage in the Railway dashboard:
- Go to https://railway.app/dashboard
- Select your project
- Click "Metrics" tab
- Monitor CPU, Memory, and Network usage

**Expected costs**:
- $3-5/month for light usage
- You get $5/month credit, so effectively free!

---

## Step 12: Update Documentation

The main README.md has been updated with Railway deployment instructions.

For local development, remember to use:

```bash
cd server
npm run dev  # This uses nodemon for auto-reload
```

For production (Railway uses):

```bash
cd server
npm start  # This uses node server.js
```

---

## Troubleshooting

### Issue: Build fails

**Solution**: Check logs with `railway logs` and verify:
- All dependencies are in `package.json`
- `railway.json` build command is correct
- Environment variables are set

### Issue: Server won't start

**Solution**: 
- Check logs: `railway logs`
- Verify `PORT` environment variable (Railway sets this automatically)
- Ensure MongoDB connection string is correct

### Issue: Socket.io won't connect

**Solution**:
- Verify CORS settings in `server/config/security.js`
- Make sure your frontend URL is whitelisted
- Check Socket.io logs in Railway dashboard

### Issue: Authentication fails

**Solution**:
- Verify Spotify redirect URI matches exactly
- Check `REDIRECT_URI` environment variable
- Ensure `CLIENT_ID` and `CLIENT_SECRET` are correct

### Issue: 502 Bad Gateway

**Solution**:
- Server might be crashing - check logs
- Verify server is listening on `process.env.PORT`
- Check Railway deployment status

---

## Useful Railway Commands

```bash
# View logs (real-time)
railway logs

# View logs (follow mode)
railway logs --follow

# SSH into your container (for debugging)
railway shell

# View environment variables
railway variables

# Redeploy
railway up --detach

# View project status
railway status

# Open Railway dashboard
railway open --dashboard

# View metrics
railway metrics
```

---

## Rolling Back (If Needed)

If something goes wrong, you can:

1. **Redeploy previous version**:
   - Go to Railway dashboard
   - Click "Deployments"
   - Click "..." on a previous deployment
   - Click "Redeploy"

2. **Keep Render running** until you verify Railway works
   - Don't delete Render service yet
   - Test Railway thoroughly first
   - Switch DNS/URLs only after confirmation

---

## Cleanup (After Successful Migration)

Once Railway is working perfectly:

1. **Delete Render service**:
   - Go to Render dashboard
   - Select your backend service
   - Settings → Delete Service

2. **Remove old URLs**:
   - Clean up old environment variables
   - Update any documentation with old URLs

3. **Celebrate!** 🎉
   - No more cold starts!
   - Better performance!
   - Happy users!

---

## Cost Optimization Tips

1. **Monitor usage**: Check Railway dashboard weekly
2. **Optimize queries**: Reduce database calls where possible
3. **Use caching**: Implement Redis for frequently accessed data (optional)
4. **Scale wisely**: Railway auto-scales, but monitor if costs increase
5. **Set spending limits**: Configure in Railway dashboard

---

## Support & Resources

- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app
- **Pricing**: https://railway.app/pricing

---

## Next Steps

1. [ ] Complete deployment to Railway
2. [ ] Test all features thoroughly
3. [ ] Monitor for 24-48 hours
4. [ ] Verify no cold starts
5. [ ] Update DNS (if using custom domain)
6. [ ] Delete Render service
7. [ ] Update team documentation

---

**Questions?** Check the troubleshooting section or Railway documentation.

**Need help?** The Railway Discord community is very active and helpful!
