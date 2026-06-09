import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Redis } from "@upstash/redis";

// Initialize Redis if credentials are in env (supports Upstash and Vercel KV env vars)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const hasRedis = !!(redisUrl && redisToken);

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (!hasRedis) return null;
  if (!_redis) {
    _redis = new Redis({ url: redisUrl!, token: redisToken! });
  }
  return _redis;
}

const GH_OWNER = "asjad-rehman";
const GH_REPO = "ichattiesburg";
const GH_BRANCH = "main";

/**
 * Reads data from:
 * 1. Redis (if available)
 * 2. GitHub API Contents (if token available - bypasses raw CDN cache)
 * 3. Local /tmp/<key>.json
 * 4. public/<key>.json
 * 5. Fallback seed
 */
export async function remoteRead<T>(name: string, fallback: T): Promise<T> {
  const tmpPath = `/tmp/ichattiesburg-${name}.json`;
  const bundlePath = join(process.cwd(), "public", `${name}.json`);

  // 1. Try Redis
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<T>(`ichattiesburg:${name}`);
      if (cached) return cached;
    } catch (e) {
      console.warn(`[remote-storage] Redis read failed for ${name}:`, e);
    }
  }

  // 2. Try GitHub API Contents (bypasses raw.githubusercontent.com caching)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/public/${name}.json`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json() as { content: string };
        const decoded = Buffer.from(json.content, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded) as T;
        
        // Write to Redis/tmp for faster subsequent reads
        if (redis) {
          await redis.set(`ichattiesburg:${name}`, parsed).catch(() => {});
        }
        return parsed;
      }
    } catch (e) {
      console.warn(`[remote-storage] GitHub API read failed for ${name}:`, e);
    }
  }

  // 3. Try /tmp
  try {
    if (existsSync(tmpPath)) {
      const data = JSON.parse(readFileSync(tmpPath, "utf-8"));
      return data as T;
    }
  } catch { /* ignore */ }

  // 4. Try public/
  try {
    if (existsSync(bundlePath)) {
      const data = JSON.parse(readFileSync(bundlePath, "utf-8"));
      return data as T;
    }
  } catch { /* ignore */ }

  return fallback;
}

/**
 * Writes data to:
 * 1. Redis (if available)
 * 2. Local /tmp/<key>.json
 * 3. GitHub API (if token available)
 */
export async function remoteWrite<T>(name: string, data: T): Promise<void> {
  const tmpPath = `/tmp/ichattiesburg-${name}.json`;

  // 1. Write to Redis
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(`ichattiesburg:${name}`, data);
    } catch (e) {
      console.warn(`[remote-storage] Redis write failed for ${name}:`, e);
    }
  }

  // 2. Write to /tmp
  try {
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn(`[remote-storage] /tmp write failed for ${name}:`, e);
  }

  // 3. Commit to GitHub (fire-and-forget, async in background)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/public/${name}.json`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    (async () => {
      try {
        const shaRes = await fetch(url, { headers, cache: "no-store" });
        let sha: string | undefined;
        if (shaRes.ok) {
          const body = await shaRes.json() as { sha: string };
          sha = body.sha;
        }
        
        const contentB64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
        const putRes = await fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            message: `chore: update ${name} via admin dashboard`,
            content: contentB64,
            sha,
            branch: GH_BRANCH,
          }),
        });
        
        if (!putRes.ok) {
          const errBody = await putRes.json().catch(() => ({}));
          console.error(`[remote-storage] GitHub PUT failed for ${name}:`, putRes.status, errBody);
        }
      } catch (e) {
        console.error(`[remote-storage] GitHub write error for ${name}:`, e);
      }
    })();
  }
}
