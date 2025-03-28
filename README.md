# react_tugo

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/beckerbao/react_tugo)


npx expo prebuild -p android

create local.properties
echo "sdk.dir=/Users/minhbaonguyen/Library/Android/sdk" > android/local.properties

cd android && ./gradlew clean && cd ..
npx expo run:android

NODE_ENV=production eas build --platform android --profile local --local
======================
🛠️ Method 1: Debug APK (no EAS, fastest)
1️⃣ From project root run:

bash
Copy
expo prebuild -p android
2️⃣ Build the debug APK:

bash
Copy
cd android
./gradlew assembleDebug
3️⃣ You’ll find the APK here:

swift
Copy
android/app/build/outputs/apk/debug/app-debug.apk

./adb install -r /Users/minhbaonguyen/Downloads/react_tugo/react_tugo/android/app/build/outputs/apk/debug/app-debug.apk 

./adb -s R9JR90AA9WV install -r /Users/minhbaonguyen/Downloads/react_tugo/react_tugo/android/app/build/outputs/apk/debug/app-debug.apk

./adb -s emulator-5554 install -r /Users/minhbaonguyen/Downloads/react_tugo/react_tugo/android/app/build/outputs/apk/debug/app-debug.apk

======================
BUILD BANG EXPO.DEV

Để gửi (submit) một build lên **Expo’s cloud build service (expo.dev)** thay vì chạy local, bạn chỉ cần sử dụng **EAS Build** với profile được cấu hình trong **eas.json**. Dưới đây là các bước chi tiết:

---

## 1️⃣ Đăng nhập vào Expo

Nếu chưa login:

```bash
expo login
```

Hoặc với EAS CLI:

```bash
eas login
```

---

## 2️⃣ Kiểm tra & cấu hình eas.json

Mở file **eas.json** ở root project. Đảm bảo bạn có profile production (hoặc staging) cho Android/iOS. Ví dụ:

```jsonc
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

> Nếu bạn muốn tạo APK thay vì AAB, dùng `"buildType": "apk"`.

---

## 3️⃣ Chạy cloud build

### Android

```bash
eas build --platform android --profile production
```

### iOS

```bash
eas build --platform ios --profile production
```

Bạn có thể thêm `--local` nếu muốn build local; bỏ flag này để đẩy lên expo.dev.

---

## 4️⃣ Theo dõi build trên terminal hoặc expo.dev

- Terminal sẽ show URL tới build log trên expo.dev.
- Bạn cũng có thể truy cập https://expo.dev/accounts/{your‑username}/projects/{your‑slug}/builds để xem trạng thái và tải file khi hoàn tất.

---

## 5️⃣ (Tuỳ chọn) Thiết lập release channel

Nếu bạn dùng release channel khác mặc định (e.g., staging):

```bash
eas build --platform android --profile production --release-channel staging
```

---

✅ Sau khi build thành công, bạn sẽ nhận link download hoặc link upload trực tiếp lên Play Store/App Store thông qua dashboard expo.dev.
