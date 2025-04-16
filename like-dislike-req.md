
# 🧩 Front-end Requirement – Like/Dislike in Feed (with Login Prompt)

## 🎯 Mục tiêu
- Cho phép người dùng **like hoặc dislike** một bài trong feed.
- Mỗi bài chỉ cho phép chọn 1 trong 2 trạng thái: **Like** hoặc **Dislike**.
- Hiển thị tổng số lượt **Like** cho mỗi bài.
- **Tự động cập nhật** số lượt like khi có thay đổi (realtime).
- **Hiển thị nút** like/dislike cho cả user chưa đăng nhập, nhưng khi click sẽ yêu cầu đăng nhập.

---

## 🔒 Ràng buộc theo trạng thái đăng nhập

- **Nếu user đã đăng nhập:**
  - Cho phép tương tác like/dislike.
  - Gửi phản ứng qua API.
  - UI cập nhật realtime hoặc optimistic.

- **Nếu user chưa đăng nhập:**
  - Vẫn hiển thị nút like/dislike.
  - Khi nhấn vào một trong hai nút:
    - **Không gọi API**.
    - Hiển thị modal/popup:  
      _"Bạn cần đăng nhập để tương tác với bài viết này."_
    - Có nút chuyển hướng đến màn hình `login.tsx`.

---

## 🧱 Thành phần giao diện

### Feed Item (`app/(tabs)/feed.tsx`)
- Với mỗi bài viết:
  - Hiển thị:
    - [👍 Like] button (đã chọn nếu user đã like).
    - [👎 Dislike] button (đã chọn nếu user đã dislike).
    - Số lượt **Like** (ví dụ: `123 likes`)
- **Xử lý click:**
  - Nếu `user != null`:  
    → gọi `sendReaction(postId, 'like' | 'dislike')`
  - Nếu `user == null`:  
    → gọi `showLoginPromptModal()`

---

## 🔌 API Integration

### `types/api.ts`
- Tạo hàm:
  ```ts
  export async function sendReaction(postId: string, type: 'like' | 'dislike') { ... }
  ```
- Gửi request đến backend chứa:
  - `post_id`
  - `reaction_type`
  - `user_id` (lấy từ Supabase session)

---

## 🔁 Realtime cập nhật

### `types/supabase.ts`
- Kết nối Supabase Realtime:
  - Subscribe vào bảng `post_reactions` hoặc `posts`.
  - Khi có thay đổi số lượt like:
    - Update lại UI tương ứng ngay lập tức.

---

## 💬 Modal login prompt

- Khi user chưa login nhấn Like/Dislike:
  - Hiển thị `Alert` hoặc `Modal` với nội dung:
    > **"Bạn cần đăng nhập để tương tác với bài viết này."**
  - Có nút `Đăng nhập ngay` → dẫn đến màn `app/login.tsx`

---

## ♻️ Optimistic UI Update

- Khi user đăng nhập nhấn like/dislike:
  - UI cập nhật ngay (tô màu nút, thay đổi số lượt).
  - Sau khi nhận phản hồi API, xác nhận và sync dữ liệu thật.

---

## 📁 Cấu trúc đề xuất

```
app/
  (tabs)/
    feed.tsx                 # Giao diện chính của danh sách bài viết
  components/
    ReactionButtons.tsx      # (gợi ý) tách nút like/dislike + modal
types/
  api.ts                     # Gửi reaction đến backend
  supabase.ts                # Subcribe realtime cập nhật like
contexts/
  AuthContext.tsx            # Lấy trạng thái user từ Supabase session
```

---

## ✅ Yêu cầu kiểm thử

- [ ] Nút like/dislike luôn hiển thị.
- [ ] Nếu chưa đăng nhập → hiện modal yêu cầu đăng nhập.
- [ ] Nếu đã đăng nhập → gửi reaction API, update UI.
- [ ] Chỉ cho phép chọn 1 trong 2 trạng thái.
- [ ] Số lượt like cập nhật realtime qua Supabase.
- [ ] Không reload màn hình khi có thay đổi.
