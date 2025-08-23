# About react_tugo

This document provides an overview of the `react_tugo` project, a mobile application built with React Native and Expo. It outlines the project's purpose, key features, and the organization of its codebase.

## Project Purpose and Overview

`react_tugo` is a mobile application designed for travel and tourism, likely serving as a platform for users to explore destinations, book tours, manage vouchers, and engage with loyalty programs. The name "tugo" suggests a focus on facilitating travel experiences.

## Key Technologies

The application is built using a modern mobile development stack, emphasizing performance, scalability, and developer experience:

*   **Frontend Framework:** [`React Native`](https://reactnative.dev/) - A JavaScript framework for building native mobile apps.
*   **Development Platform:** [`Expo`](https://expo.dev/) - A framework and platform for universal React applications, simplifying development, build, and deployment processes.
*   **Language:** [`TypeScript`](https://www.typescriptlang.org/) - A superset of JavaScript that adds static type definitions, enhancing code quality and maintainability.
*   **Backend-as-a-Service (BaaS):** [`Supabase`](https://supabase.com/) - Provides database, authentication, and real-time capabilities, acting as the primary backend for the application.
*   **Navigation:** [`React Navigation`](https://reactnavigation.org/) - A popular navigation solution for React Native applications, enabling complex navigation patterns like tabs and stacks.
*   **Icons:** [`Lucide Icons`](https://lucide.dev/) - A collection of open-source icons used throughout the application's UI.

## Main Features

`react_tugo` offers a comprehensive set of features to enhance the user's travel experience:

*   **User Authentication & Profile Management:**
    *   Secure user login, registration, password reset, and account recovery.
    *   Personalized user profiles with options to view and edit details.
*   **Travel Exploration & Booking:**
    *   Browse and discover various travel destinations.
    *   Explore and book tours and other travel-related services.
*   **Engagement & Rewards:**
    *   Access and manage promotional vouchers and deals.
    *   Participate in a loyalty program to earn rewards.
    *   Engage with a "Lucky Wheel" gamified feature for potential prizes.
*   **Communication & Updates:**
    *   Receive in-app notifications and push notifications for important updates and alerts.
*   **Content & Discovery:**
    *   A dynamic feed displaying relevant content or updates.
    *   Search functionality to easily find destinations, tours, vouchers, and other information.

## Codebase Organization

The project's codebase is structured logically to promote modularity, separation of concerns, and ease of maintenance. It largely follows conventions common in Expo/React Native projects:

*   **`app/`**: This is the core application directory, organized using [`Expo Router`](https://expo.github.io/router/) for declarative navigation.
    *   **`app/(tabs)/`**: Contains the primary tab-based navigation routes (e.g., `feed`, `search`, `home`, `profile`, `voucher`), representing major sections of the application.
    *   **`app/(stack)/`**: Houses screens that are part of a navigation stack, typically used for sequential flows or screens pushed from tab navigators (e.g., `lucky-wheel.tsx`).
    *   **Root-level screens**: Standalone screens directly under `app/` (e.g., `login.tsx`, `signup.tsx`, `notifications.tsx`) often handle authentication or initial application flows.
*   **`components/`**: A dedicated directory for reusable UI components (e.g., `ErrorView`, `LoginPromptModal`, `NotificationBell`), ensuring consistency and reducing code duplication.
*   **`contexts/`**: Manages global application state using the [`React Context API`](https://react.dev/learn/passing-props-with-a-context), such as `PushNotificationContext.tsx` for notification-related state.
*   **`hooks/`**: Contains custom [`React Hooks`](https://react.dev/learn/reusing-logic-with-custom-hooks) to encapsulate and abstract away complex logic, including API interactions (`useApi.ts`), authentication (`useAuth.ts`), and notification handling (`usePushNotifications.ts`).
*   **`services/`**: Responsible for interacting with external services and APIs. This includes `api.ts` for general API calls and `supabase.ts` for specific Supabase backend operations.
*   **`styles/`**: Centralizes styling definitions, with individual files (e.g., `auth.ts`, `home.ts`, `profile.ts`) for different features or screens, promoting organized and maintainable styling.
*   **`supabase/`**: Contains Supabase-specific files, notably the `migrations/` subdirectory with SQL scripts for database schema management.
*   **`types/`**: Houses TypeScript type definitions for API responses, Supabase entities, and other data structures, ensuring type safety across the application.
*   **`utils/`**: Provides general-purpose utility functions (e.g., `format.ts`) that can be used throughout the codebase.
*   **`assets/`**: Stores static assets such as images (`assets/images/`).
*   **Configuration Files**: Standard project configuration files like `app.config.js`, `babel.config.js`, `eas.json`, `package.json`, and `tsconfig.json` define project settings, build processes, dependencies, and TypeScript configurations.
*   **Documentation & Notes**: Various Markdown files (`README.md`, `knowissue.md`, `tasklist.md`, etc.) provide project documentation, track known issues, and manage development tasks.

This structured approach facilitates collaboration, simplifies debugging, and ensures the long-term maintainability and scalability of the `react_tugo` application.