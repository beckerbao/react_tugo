This project is a React Native application built with **Expo** and using **Expo Router** for navigation. The main functionalities include user authentication (login, signup), browsing and viewing destinations, tours, and vouchers, managing bookings, and handling push notifications. The project uses **Supabase** for backend services and **TypeScript** as the programming language.

**Folder Structure:**

*   `.vscode`: VSCode settings.
*   `app`: Contains the main application screens and navigation.
    *   `(tabs)`: Screens within the tab navigator.
        *   `home`: Home screen and related nested screens (booking, destination, tour, voucher).
        *   `profile`: User profile screens (edit, history).
        *   `voucher`: Voucher related screens (detail).
    *   Other top-level screens (login, signup, notifications, test-notifications, _layout, +not-found).
*   `assets`: Contains static assets like images.
    *   `images`: Various image files.
*   `components`: Reusable UI components (ErrorView, LoadingView, NotificationBell, PermissionModal, PopUpModal).
*   `contexts`: React contexts for state management (PushNotificationContext).
*   `hooks`: Custom React hooks (useApi, useAuth, useFrameworkReady, useNotifications, useProfile, usePushNotifications).
*   `issue`: Contains issue related files (screenshot).
*   `services`: API and backend service integrations (api.ts, supabase.ts, testHelpers.ts).
*   `styles`: Styling files for different parts of the application.
*   `supabase`: Supabase related files, including migrations.
    *   `migrations`: SQL migration files.
*   `types`: TypeScript type definitions (api.ts, supabase.ts).
*   `utils`: Utility functions (format.ts).
*   Root level files: configuration files (**app.json**, babel.config.js, **eas.json**, tsconfig.json), dependency files (package.json, package-lock.json), documentation/notes (README.md, knowissue.md, prompt.md, tasklist.md), and other files (pandoc-3.6.4-x86_64-macOS.pkg).



Tôi đã gửi file. Bạn hãy:

Giữ nguyên toàn bộ logic gốc

Chỉ thêm đoạn code cần thiết

Không biết code. Bạn chỉ được thêm, không được thay. Ghi rõ thêm ở đâu.