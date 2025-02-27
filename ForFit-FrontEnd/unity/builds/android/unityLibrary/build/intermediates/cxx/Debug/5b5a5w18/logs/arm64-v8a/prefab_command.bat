@echo off
"C:\\Program Files\\Java\\jdk-17\\bin\\java" ^
  --class-path ^
  "C:\\Users\\User\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  arm64-v8a ^
  --os-version ^
  31 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  26 ^
  --output ^
  "C:\\Users\\User\\AppData\\Local\\Temp\\agp-prefab-staging7987185701077267315\\staged-cli-output" ^
  "C:\\Users\\User\\.gradle\\caches\\8.10.2\\transforms\\e85e61e67d3e457145be06e4630b0681\\transformed\\games-activity-3.0.5\\prefab" ^
  "C:\\Users\\User\\.gradle\\caches\\8.10.2\\transforms\\58d00a6f189ec38af7f5fbaf90ee74b9\\transformed\\games-frame-pacing-1.10.0\\prefab"
