# ClubSphere Client

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env` to `.env` and fill in:
```bash
cp .env
```

Fill in your Firebase config, API URL, and Stripe publishable key.

### 3. Run
```bash
npm run dev
```

---

## Folder Structure
```
src/
├── api/
│   └── axiosInstance.js       
├── components/
│   └── shared/
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       ├── LoadingSpinner.jsx
│       ├── ClubCard.jsx
│       └── EventCard.jsx
├── context/
│   └── AuthContext.jsx         
├── firebase/
│   └── firebase.config.js
├── layouts/
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx     
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Clubs/
│   │   ├── Clubs.jsx           
│   │   └── ClubDetail.jsx      
│   ├── Events/
│   │   ├── Events.jsx
│   │   └── EventDetail.jsx    
│   ├── Home/
│   │   └── Home.jsx           
│   ├── Dashboard/
│   │   ├── Admin/
│   │   │   ├── AdminOverview.jsx   
│   │   │   ├── ManageUsers.jsx     
│   │   │   ├── ManageClubs.jsx     
│   │   │   └── AdminPayments.jsx
│   │   ├── Manager/
│   │   │   ├── ManagerOverview.jsx
│   │   │   ├── MyClubs.jsx         
│   │   │   ├── ClubMembers.jsx
│   │   │   ├── ManageEvents.jsx    
│   │   │   └── EventRegistrations.jsx
│   │   └── Member/
│   │       ├── MemberOverview.jsx
│   │       ├── MyMemberships.jsx
│   │       ├── MyEvents.jsx
│   │       └── PaymentHistory.jsx
│   └── NotFound.jsx
├── routes/
│   ├── router.jsx              
│     
├── index.css
└── main.jsx
```

## Key npm packages
- react-router-dom
- @tanstack/react-query
- react-hook-form
- firebase
- axios
- framer-motion
- @stripe/react-stripe-js + @stripe/stripe-js
- recharts
- react-hot-toast
- sweetalert2
- react-icons
- tailwindcss + daisyui
