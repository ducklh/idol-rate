# Idol Rate

Ứng dụng đánh giá thần tượng với Next.js, Supabase và Google OAuth.

## Chạy local

1. Copy env mẫu và điền Supabase:

```bash
cp .env.example .env.local
```

2. Cài dependency và chạy:

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Deploy lên Vercel

### 1. Đẩy code lên GitHub

Đảm bảo repo đã push lên GitHub (hoặc GitLab/Bitbucket nếu Vercel hỗ trợ).

### 2. Tạo project trên Vercel

- Vào [vercel.com](https://vercel.com) → **Add New** → **Project**.
- Import repo GitHub của bạn.
- **Framework Preset**: Next.js (tự nhận).
- **Root Directory**: để trống (hoặc thư mục gốc của app).

### 3. Cấu hình Environment Variables

Trong bước thiết lập project (hoặc sau khi tạo: **Settings** → **Environment Variables**), thêm:

| Name | Value | Ghi chú |
|------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Cùng trang API, mục "anon public" |

Chọn **Production**, **Preview**, **Development** nếu muốn dùng cho mọi môi trường → **Save**.

### 4. Deploy

Bấm **Deploy**. Vercel sẽ build và cho bạn URL dạng `https://idol-rate-xxx.vercel.app`.

### 5. Cấu hình Supabase cho production

Để Google đăng nhập hoạt động trên domain Vercel:

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**.
2. Trong **Redirect URLs** thêm URL callback của Vercel, ví dụ:
   - `https://idol-rate-xxx.vercel.app/auth/callback`
   - Hoặc custom domain: `https://yourdomain.com/auth/callback`
3. **Save**.

Sau khi deploy, kiểm tra đăng nhập Google và trang `/admin` trên domain Vercel.
