### 👸🏻For users:

Fully responsive design on devices (laptop, tablet and mobile).

| Page                            | Features                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                            | - show theaters, movies and showtime schedules                                                                                                                                        |
| Movie details                   | - show movie details                                                                                                                                                                  |
| Authentication (login + signup) | - validate login and signup forms                                                                                                                                                     |
| Ticket booking                  | - build grid-shaped seat layout with different types of seat<br> - map each seat row in alphabetical order <br> - allow to select a maximum of 5 seats<br> - cannot select sold seats |
| Profile                         | - allow to change user information<br> - show transaction history                                                                                                                     |

### 👩🏻‍💼For administrators:

| Page             | Features                                                                                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User management  | - display the table of users (both clients and administrators)<br> - search user by name<br> - create, update and delete user. Validate user information forms.                                                      |
| Movie management | - display the table of movies<br> - search movie by name<br> - create, update and delete movie. Validate movie information forms<br> - create movie showtime schedules. Validate showtime schedule information forms |
## Project structure

### Main source structure

```
root
└── src
    ├── api                         # Axios client configuration and request setup
    ├── assets                      # Shared multimedia files
    ├── components                  # Shared components
    ├── constants                   # Shared constants
    ├── containers                  # Pages
    │   ├── AdminTemplate           # Admin pages
    │   │   ├── index.js            # Admin template
    │   │   ├── components          # Shared components for admin template
    │   │   ├── UserDashBoard
    │   │   └── MovieDashBoard
    │   ├── AuthTemplate            # Authentication pages
    │   │   ├── index.js            # Authentication template
    │   │   ├── components          # Shared components for authentication template
    │   │   ├── LoginPage
    │   │   └── RegisterPage
    │   ├── HomeTemplate            # Home pages
    │   │   ├── index.js            # Home template
    │   │   ├── components          # Shared components for home template
    │   │   ├── HomePage
    │   │   ├── MovieDetailsPage
    │   │   ├── ProfilePage
    │   │   └── TicketBookingPage
    │   └── NotFoundPage            # 404 not found page
    ├── guard                       # Protect private routes
    ├── hooks                       # Shared hooks
    ├── i18n                        # Translation feature configuration
    ├── routes                      # Routing setup
    ├── store                       # Redux configuration and reducer setup
    ├── validators                  # Schema validators for user inputs
    ├── App.js
    └── index.js
```

### Routing setup
## Installation and run

Clone the project

```bash
git clone 
cd  BookingTicketSystem_FrontEnd
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm start
```

Open http://localhost:3000 with your favorite browser to see the project 😎.
