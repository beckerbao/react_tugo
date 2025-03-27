# react_tugo

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/beckerbao/react_tugo)


npx expo prebuild -p android

create local.properties
echo "sdk.dir=/Users/minhbaonguyen/Library/Android/sdk" > android/local.properties

cd android && ./gradlew clean && cd ..
npx expo run:android