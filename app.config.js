import 'dotenv/config';

export default {
  expo: {
    name: "Du lịch Tugo",
    slug: "du-lich-tugo",
    version: "1.0.6",
    orientation: "portrait",
    icon: "./assets/images/icon6.png",
    scheme: "tugo",
    deepLinking: true,
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash3.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: "com.tugo.travel.vn",
      supportsTablet: false,
      usesAppleSignIn: true,
      associatedDomains: ["applinks:review.tugo.com.vn"],
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIDeviceFamily: [1]
      }
    },
    android: {
      package: "com.tugo.travel.vn",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon6.png",
        backgroundColor: "#ffffff"
      },
      permissions: ["CAMERA", "NOTIFICATIONS"],
      intentFilters: [
        {
          action: "VIEW",
          data: [
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/reset-password" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/voucher*" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/voucher/detail" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/home" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/feed" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/search" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/home/tour*" },
            { scheme: "https", host: "review.tugo.com.vn", pathPrefix: "/home/destination*" }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-notifications",
      "expo-build-properties"
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "30a29066-52b8-4976-80bc-eb7ca759038f"
      }
    },
    owner: "beckerbao",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/30a29066-52b8-4976-80bc-eb7ca759038f"
    }
  }
};
