# Event-App

## Project Description

This application was created as part of a bachelor's degree project, the goal of this project was to create a web application that facilitates organizing and attending local events. The app is designed for people who actively spend their time and for organizers who need an intuitive tool to manage events.

Technologies used in this project:
- **Frontend:** ReactJS  
- **Backend:** Express.js  
- **Database:** Neo4j  

The application allows quick event creation, participant management, seat reservations, and ticket generation via QR codes. Users can browse events in various categories, receive personalized recommendations, and track their participation statistics.

---

## Features

### Registration and Login
- User login and registration using **Auth0**  
- Unauthenticated users can only browse events  

### Browsing Events
- List of available events with sorting, filtering, and search capabilities  
- Event details: description, organizer nickname, date, time, location  
- Event categories:
  - **Your Events:** upcoming events created by or registered by the user  
  - **Popular:** events with the highest number of participants  
  - **Recommended:** events matching user interests  
  - **Upcoming:** events with the nearest start date  
  - **Map:** interactive map displaying event locations  

### Event Creation and Management
- Logged-in users can create new events  
- Event data: name, number of seats, description, address, date, time, event types  
- Add a background image to the event or select from available images  

### Participation and Tickets
- Register participation in events  
- Automatic seat allocation for events with limited capacity  
- Download tickets as **QR codes**  

### Notifications
- Notify users about upcoming events  
- Email reminders for registered events  
- Reminders to rate events after they finish  

### Event Rating
- Users can rate events from 0 to 5 stars  
- Organizer's average rating is visible to other users and used for event filtering  

### User Statistics
- Overview of created events, participation, average ratings, and number of reviewers  

---

## Non-Functional Requirements

### Security
- Advanced authentication and authorization using **Auth0**  
- Encrypted client-server communication using **SSL**  

### Compatibility
- Works on Chrome, Firefox, Edge, Safari  
- Responsive layout for desktop, tablet, and mobile  

### Usability
- Intuitive user interface for easy navigation  
- Can run in a **Docker** container, facilitating deployment and scaling  

---

## Deployment

### Development Mode

The application uses **Docker**, which packages the program and all dependencies (libraries, configuration files, local databases, etc.) in a lightweight, portable container.

#### Docker Compose
Frontend, backend, and database run on separate ports connected via **Docker Compose**.  
Docker Compose allows easy definition and management of multi-container applications with a single command:

```bash
docker-compose up
```

### GitHub Actions

The application is integrated with Continuous Integration (CI) using **GitHub Actions**.  
On every `git push`:

- Frontend and backend tests run automatically.
- Production Docker images are built and published to Docker Hub.

### Production Deployment

The application is deployed using free hosting services: (https://event-app-usy2.onrender.com/)

