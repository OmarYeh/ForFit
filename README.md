# ForFit – E-Commerce Fashion Store with AR & AI

**ForFit** is a next-generation fashion e-commerce platform that transforms online shopping with **Augmented Reality (AR)** virtual try-on and an **AI-powered fashion assistant**. It allows users to visualize clothing on themselves in real time and get personalized outfit recommendations—making online fashion shopping more confident, interactive, and fun.

---

## About ForFit

ForFit bridges the gap between traditional online shopping and in-store experiences by using cutting-edge **AR** and **AI** technologies. With virtual try-on powered by pose tracking and an intelligent chatbot assistant, it helps users make informed fashion choices while reducing uncertainty and product return rates.

---

## Key Features

### E-Commerce Platform
- Intuitive product browsing, cart, wishlist, and order tracking.
- Smooth and secure checkout process with multiple payment options.
- Mobile-first shopping experience.

### AR-Based Virtual Try-On
- Built with **Unity** and **Vuforia SDK** for real-time clothing visualization.
- Supports a variety of garments to create an immersive virtual fitting experience.

### FitBot – AI Fashion Assistant
- Powered by **GPT-4o**, FitBot acts as a personal fashion advisor.
- Provides smart outfit recommendations based on user preferences.
- Offers style tips and current fashion trend insights.

---

## Development Overview

### Cross-Platform Front-End
- Built with **React Native (Expo)** to ensure a seamless experience across Android and iOS.
- Integrates AR view, chatbot, and shopping features into one cohesive interface.

### Backend Architecture
- **PHP Laravel** powers the backend APIs, handling user accounts, product data, and order management.
- RESTful API endpoints connect the front-end with business logic and databases.

### Server-Side Pose Estimation
- Pose estimation is performed on a **Python server** using **Google MediaPipe**.
- This offloads heavy computation from mobile devices, improving performance and ensuring accessibility on a wide range of smartphones.

### 3D Garment Hosting
- **Firebase** is used to host and serve 3D garment assets.
- Enables lightweight app builds and allows real-time updates to the clothing catalog without requiring app redeployment.

---

## Future Enhancements

- **Full Outfit Previews**  
  We’re working on allowing users to layer multiple garments and visualize complete outfit combinations in real time, enhancing the overall styling experience.

- **AI-Powered Body Measurement**  
  A system that uses AI to estimate user-specific body dimensions will be introduced, providing more accurate and personalized size recommendations.

- **Trend-Based Smart Styling**  
  FitBot will evolve to offer dynamic styling suggestions based on current fashion trends, seasons, and user history.

---

## Tech Stack

| Layer        | Technology               | Purpose                                      |
|--------------|--------------------------|----------------------------------------------|
| Front-End    | React Native (Expo)      | Cross-platform mobile app                    |
| Backend      | PHP Laravel              | API, authentication, database                |
| AR Engine    | Unity + Vuforia SDK      | Real-time virtual try-on                     |
| Pose Tracking| Python + MediaPipe       | Server-side pose detection                   |
| Asset Hosting| Firebase                 | Serving 3D garments                          |
| AI Assistant | OpenAI GPT-4o            | Fashion chatbot (FitBot)                     |

## Video Demo
- [Click here to watch the demo on Google Drive](https://drive.google.com/file/d/1M4VrTn4m29jMfqvuuT6o87vo2_S7l8Dy/view?usp=sharing)
