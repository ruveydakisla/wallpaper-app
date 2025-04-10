# 📱 Wallpaper App
<table>
  <tr>
    <td><img src="assets/screenshots/welcome.png" width="200"></td>
    <td><img src="assets/screenshots/home.png" width="200"></td>
    <td><img src="assets/screenshots/image.png" width="200"></td>
         <td><img src="assets/screenshots/bottom-sheet.png" width="200"></td>

  </tr>
</table>



This is a modern and fast wallpaper application built using [Expo](https://expo.dev/). It uses the **Pixabay API** to fetch and display high-quality wallpapers for users.

---

## 🚀 Features

- 📸 High-quality wallpapers (via Pixabay API)
- 🔍 Fast and effective search
- 📥 Save and share images to device
- 🧭 Modern navigation with user-friendly UI
- 🧩 Category selection with bottom sheet

---

## 🛠️ Key Packages Used

| Package                           | Description |
|-----------------------------------|-------------|
| `@expo/vector-icons`              | Icon sets for a customizable UI |
| `@gorhom/bottom-sheet`            | Elegant and functional bottom sheet component |
| `@react-navigation/native`        | Navigation within the app |
| `@shopify/flash-list`             | High-performance list rendering |
| `axios`                           | HTTP client for API requests |
| `expo-image`                      | Optimized image rendering |
| `expo-media-library`              | Access to media for saving images |
| `react-native-toast-message`      | For displaying toast notifications |

---

## 🌐 API

The app uses the [Pixabay](https://pixabay.com/api/docs/) API to fetch images. To get started, register on Pixabay and obtain a free API key.

```env
API_KEY=your_pixabay_api_key
