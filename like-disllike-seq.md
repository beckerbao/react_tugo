@startuml
actor "User" as User
participant "App" as App
participant "Backend" as BE
database "Supabase\n(PostgreSQL)" as DB

== Gửi yêu cầu like/dislike từ App ==
User -> App: Nhấn nút like/dislike
App -> App: Thực hiện optimistic update UI
App -> BE: Gửi HTTP request (ID bài, loại phản ứng, token)
 
== Xử lý tại Backend ==
BE -> BE: Xác thực thông tin người dùng\nKiểm tra quyền truy cập
BE -> BE: Xử lý logic nghiệp vụ\nEnrich dữ liệu (toggle, cập nhật số lượt)
BE -> DB: Gọi API update dữ liệu (update like/dislike)
DB --> BE: Xác nhận cập nhật thành công
BE -> App: Trả về dữ liệu enrich (số lượt like mới, trạng thái)

== Cập nhật realtime ==
DB -> App: Gửi thông báo qua WebSocket (update số lượt like)
App -> App: Cập nhật UI realtime

@enduml

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
