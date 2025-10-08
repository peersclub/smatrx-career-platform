# 🚀 Push to Deploy - Instructions

## ⚠️ Current Status

You have **2 local commits** that fix the Vercel build error and add deployment infrastructure:

```bash
2c4ed86 - fix: Add type-safe auth helpers to resolve build error
27c9871 - feat: Add Phase 3 deployment infrastructure and NextAuth types
```

These commits need to be pushed to GitHub for Vercel to deploy successfully.

---

## 🔧 The Build Error

**Error on Vercel:**
```
Type error: Property 'id' does not exist on type '{ name?: string...}'
./app/api/onboarding/complete/route.ts:9:25
```

**Root Cause:**
- Vercel is building from commit `fdd03eb` (old)
- The fixes are in commits `27c9871` and `2c4ed86` (local, not pushed)

**Solution:**
Push the local commits to GitHub → Vercel will auto-deploy with the fix

---

## 📋 Step-by-Step: How to Push

### **Option 1: If You Have Push Access**

```bash
# Simply push the commits
git push origin main

# Vercel will automatically:
# 1. Detect the new commit
# 2. Start building
# 3. Deploy the fixed version
```

---

### **Option 2: If You Don't Have Push Access**

#### **A. Request Repository Access**

1. Go to: `https://github.com/peersclub/smatrx-career-platform/settings/access`
2. Ask repository owner to add you as collaborator with **Write** access
3. Accept the invitation
4. Run: `git push origin main`

#### **B. Use Personal Access Token (PAT)**

1. **Generate GitHub PAT:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "SMATRX Deployment"
   - Expiration: 90 days
   - Scopes: Check **`repo`** (full control)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Update Git Remote:**
   ```bash
   # Replace YOUR_TOKEN with the PAT you just copied
   git remote set-url origin https://YOUR_TOKEN@github.com/peersclub/smatrx-career-platform.git
   ```

3. **Push:**
   ```bash
   git push origin main
   ```

4. **Secure the Token:**
   ```bash
   # After pushing, switch back to HTTPS (more secure)
   git remote set-url origin https://github.com/peersclub/smatrx-career-platform.git
   ```

#### **C. Use SSH Key**

1. **Generate SSH Key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Press Enter twice to skip passphrase (or set one)
   ```

2. **Add SSH Key to GitHub:**
   ```bash
   # Copy your public key
   cat ~/.ssh/id_ed25519.pub

   # Then:
   # - Go to: https://github.com/settings/keys
   # - Click "New SSH key"
   # - Title: "SMATRX Development"
   # - Paste the key
   # - Click "Add SSH key"
   ```

3. **Update Git Remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:peersclub/smatrx-career-platform.git
   ```

4. **Push:**
   ```bash
   git push origin main
   ```

---

### **Option 3: Manual File Upload (Last Resort)**

If you absolutely cannot push via git:

1. **Go to GitHub Web Interface:**
   https://github.com/peersclub/smatrx-career-platform

2. **Navigate to:** `apps/web/lib/auth-helpers.ts`

3. **Click "Edit" (pencil icon)**

4. **Replace entire contents with:**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Extended session type with user.id
 * This matches our NextAuth callbacks configuration in auth.ts
 */
export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  expires: string;
}

/**
 * Type-safe auth helper that includes user.id
 *
 * The session callback in auth.ts adds user.id to the session,
 * but TypeScript doesn't know about it by default.
 * This helper provides proper typing.
 */
export async function auth(): Promise<ExtendedSession | null> {
  const session = await getServerSession(authOptions);
  return session as ExtendedSession | null;
}

/**
 * Helper to get authenticated user ID or throw
 *
 * Usage:
 * ```ts
 * const userId = await requireAuth();
 * // userId is guaranteed to be a string here
 * ```
 */
export async function requireAuth(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}
```

5. **Commit message:** `fix: Add type-safe auth helpers to resolve build error`

6. **Commit directly to main**

7. **Vercel will auto-deploy**

---

## ✅ Verify the Fix

After pushing:

1. **Check Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Find your project
   - Watch the deployment progress

2. **Build Should Succeed:**
   ```
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Creating an optimized production build
   ✓ Collecting page data
   ✓ Finalizing page optimization
   ```

3. **Deployment URL:**
   - Vercel will provide a URL like: `https://smatrx-career-platform-xyz.vercel.app`
   - Test it!

---

## 🎯 What's Included in These Commits

### Commit `2c4ed86` - Type-Safe Auth Fix
- ✅ Fixes TypeScript build error
- ✅ Type-safe `auth()` helper with `user.id`
- ✅ New `requireAuth()` helper for convenience

### Commit `27c9871` - Phase 3 Complete
- ✅ 18 UI components (Credibility + Career Planner)
- ✅ 3 API endpoints
- ✅ Background job system (BullMQ)
- ✅ Email notification system
- ✅ Verification workflows
- ✅ 4 deployment scripts
- ✅ 11 documentation files
- ✅ NextAuth type declarations
- ✅ 76 files changed, 57,508 insertions

---

## 🔥 Quick Commands Reference

```bash
# Check current branch and commits
git status
git log --oneline -5

# Push to GitHub (if you have access)
git push origin main

# If push fails, try with token
git remote set-url origin https://YOUR_TOKEN@github.com/peersclub/smatrx-career-platform.git
git push origin main

# Or with SSH
git remote set-url origin git@github.com:peersclub/smatrx-career-platform.git
git push origin main
```

---

## 💡 After Successful Push

Once the commits are pushed and Vercel deploys successfully:

1. **Review deployment:**
   ```bash
   # Visit the deployment URL
   open https://your-deployment-url.vercel.app
   ```

2. **Test health endpoint:**
   ```bash
   curl https://your-deployment-url.vercel.app/api/health
   ```

3. **Review the deployment infrastructure:**
   - Read `DEPLOYMENT_READY.md` for next steps
   - Check `docs/PRODUCTION_CHECKLIST.md`
   - Review `scripts/README.md` for automation tools

---

## 🚨 Troubleshooting

### "Permission denied (publickey)"
- You need to set up SSH keys (see Option 2C above)
- Or use Personal Access Token (Option 2B)

### "403 Forbidden"
- You don't have write access to the repository
- Request access from repository owner
- Or use Personal Access Token with repo scope

### "fatal: Authentication failed"
- Your credentials are incorrect
- Try using Personal Access Token
- Or set up SSH key authentication

### "Build still failing after push"
- Check Vercel build logs
- Ensure all commits are pushed: `git log origin/main..HEAD` (should be empty)
- Contact me for debugging

---

## 📞 Need Help?

If you're stuck:

1. **Check your git status:**
   ```bash
   git status
   git log --oneline -3
   ```

2. **Verify remote:**
   ```bash
   git remote -v
   ```

3. **Test GitHub connection:**
   ```bash
   ssh -T git@github.com
   # Or
   git ls-remote origin
   ```

---

**Once pushed, Vercel will automatically build and deploy your fixed platform!** 🚀

The deployment will include:
- ✅ All Phase 3 features
- ✅ Complete deployment infrastructure
- ✅ TypeScript build fix
- ✅ Production-ready code

**You're one `git push` away from going live!**
