# Railway Migration Checklist

Quick reference checklist for migrating from Render to Railway.

## Pre-Deployment

- [ ] Sign up for Railway account at https://railway.app
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login to Railway: `railway login`
- [ ] Have your current environment variables ready (from Render or `.env` file)

## Deployment Steps

- [ ] Initialize Railway project: `railway init`
- [ ] Set all environment variables (see below)
- [ ] Deploy to Railway: `railway up`
- [ ] Note your Railway URL (e.g., `melodymatch-backend.up.railway.app`)
- [ ] Update `BACKEND_URL` and `REDIRECT_URI` variables with Railway URL
- [ ] Redeploy: `railway up --detach`

## Environment Variables to Set

Copy these from your current Render deployment:

- [ ] `CONNECTION_STRING` (MongoDB Atlas)
- [ ] `CLIENT_ID` (Spotify)
- [ ] `CLIENT_SECRET` (Spotify)
- [ ] `JWT_SECRET`
- [ ] `SESSION_SECRET`
- [ ] `FRONTEND_URL` (your Vercel URL)
- [ ] `BACKEND_URL` (update to Railway URL after first deployment)
- [ ] `REDIRECT_URI` (update to Railway URL + /callback)

Set via CLI:
```bash
railway variables set CONNECTION_STRING="your_value"
railway variables set CLIENT_ID="your_value"
railway variables set CLIENT_SECRET="your_value"
railway variables set JWT_SECRET="your_value"
railway variables set SESSION_SECRET="your_value"
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"
railway variables set BACKEND_URL="https://your-app.up.railway.app"
railway variables set REDIRECT_URI="https://your-app.up.railway.app/callback"
```

## Post-Deployment

- [ ] Update Vercel environment variable `VITE_API_URL` to Railway URL
- [ ] Redeploy Vercel frontend
- [ ] Add Railway callback URL to Spotify Developer Dashboard
- [ ] Test authentication flow end-to-end
- [ ] Test Socket.io messaging (should be instant!)
- [ ] Test API endpoints
- [ ] Monitor logs: `railway logs`

## Testing Checklist

- [ ] User registration works
- [ ] Login with email/password works
- [ ] Spotify OAuth flow works
- [ ] Real-time messaging works (Socket.io)
- [ ] Matches load correctly
- [ ] Profile views work
- [ ] No cold starts (test after 30+ minutes of inactivity)

## Verification

- [ ] Wait 30 minutes without accessing the backend
- [ ] Try accessing your app again
- [ ] **Backend should respond INSTANTLY** (no 30-60s delay!)
- [ ] Check Railway metrics dashboard for usage

## Cleanup (After 48 Hours of Testing)

- [ ] Verify Railway is working perfectly
- [ ] Delete Render service
- [ ] Remove old Render URL from Spotify Developer Dashboard (optional)
- [ ] Update any other documentation with new Railway URL

## Cost Monitoring

- [ ] Check Railway dashboard for usage metrics
- [ ] Expected cost: ~$3-5/month (covered by $5 monthly credit)
- [ ] Set up spending limit alerts (optional)

## Useful Commands

```bash
# View logs
railway logs

# Check status
railway status

# View variables
railway variables

# Redeploy
railway up --detach

# Open dashboard
railway open --dashboard

# SSH into container
railway shell
```

## Troubleshooting

If something goes wrong:
- Check logs: `railway logs`
- Verify environment variables: `railway variables`
- Redeploy: `railway up --detach`
- See full guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## Expected Timeline

- **Setup & Deploy**: 15-20 minutes
- **Testing**: 15-30 minutes
- **Total**: ~30-45 minutes

## Success Criteria

✅ Backend deploys successfully
✅ All environment variables set correctly
✅ Authentication works (Spotify OAuth)
✅ Socket.io real-time messaging works
✅ **No cold starts - instant response**
✅ Costs stay within $5/month credit

---

**Need detailed instructions?** See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
