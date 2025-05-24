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


Installation and run
Check out the website -> Finnkino Cinema or run locally by running the following commands:

Clone the project

git clone https://github.com/scoobytux/finnkino-cinema.git
cd finnkino-cinema
Install dependencies

npm install
Run the development server

npm start
