# Bykea - Accessible Ride Hailing & Courier App

A fully functional React prototype for a ride-hailing and package courier service, designed with accessibility features for elderly users, non-English speakers, and people with disabilities.

## 🌟 Features

### Core Functionality

- **Ride Booking**: Book bikes, cars, and rickshaws
- **Package Delivery**: Send packages with quick delivery service
- **Multi-language Support**: Switch between English and Urdu
- **Responsive Design**: Works on all screen sizes (mobile, tablet, desktop)

### Accessibility Features (Following UI/UX Heuristics)

#### 1. For Elderly Users

- **Large Touch Targets**: All buttons and interactive elements have a minimum size of 44x44px (48px on mobile)
- **Adjustable Font Sizes**: 4 font size options (Small, Medium, Large, Extra Large)
- **Clear Visual Hierarchy**: Important elements are prominent with good spacing
- **Simple Navigation**: Clear, straightforward navigation with large icons
- **Reduced Cognitive Load**: Consistent layout and predictable interactions

#### 2. For Non-English Speakers (Urdu Support)

- **Bilingual Interface**: Complete English and Urdu translations
- **RTL Support**: Proper right-to-left layout for Urdu
- **Language Toggle**: Easy one-tap language switching in header
- **Urdu Font**: Uses Noto Nastaliq Urdu font for proper rendering
- **Icon Support**: Universal icons to aid understanding

#### 3. For Users with Disabilities

- **Color Blind Modes**:
  - Protanopia (Red-blind)
  - Deuteranopia (Green-blind)
  - Tritanopia (Blue-blind)
- **High Contrast Mode**: Enhanced visibility with bold borders and high contrast colors
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color-blind Friendly Palette**: Primary colors chosen to be distinguishable

### Design Heuristics Implemented

1. **Visibility of System Status**: Clear feedback for all actions
2. **Match Between System and Real World**: Familiar icons and simple language
3. **User Control and Freedom**: Easy navigation back and forth
4. **Consistency and Standards**: Consistent design patterns throughout
5. **Error Prevention**: Clear labels and confirmations
6. **Recognition Rather Than Recall**: Visible options and icons
7. **Flexibility and Efficiency**: Quick actions and shortcuts
8. **Aesthetic and Minimalist Design**: Clean, uncluttered interface
9. **Help Users with Errors**: Clear error messages (in placeholders)
10. **Help and Documentation**: Help section available in menu

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the app directory:

```bash
cd bykea-app
```

2. Install dependencies (if not already done):

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 App Structure

### Pages

- **Home**: Main landing page with service selection and quick actions
- **Settings**: Accessibility settings (font size, contrast, color blind mode)
- **Profile**: User profile (placeholder)
- **My Rides**: Ride history (placeholder)
- **My Packages**: Package tracking (placeholder)
- **Wallet**: Balance and transactions (placeholder)
- **Payment Methods**: Payment options (placeholder)
- **History**: Ride history (placeholder)
- **Notifications**: User notifications (placeholder)
- **Help & Support**: Help center (placeholder)
- **About**: About Bykea (placeholder)

### Components

- **Header**: Top navigation bar with menu button and language toggle
- **Sidebar**: Hamburger menu with navigation options
- **Service Cards**: Clickable cards for bike, car, rickshaw, and delivery
- **Location Inputs**: Pickup and destination selection
- **Quick Actions**: Fast access to common features

## 🎨 Accessibility Controls

### Font Size Adjustment

Navigate to **Settings** → Use A- and A+ buttons to adjust font size

### High Contrast Mode

Navigate to **Settings** → Toggle High Contrast Mode ON/OFF

### Color Blind Mode

Navigate to **Settings** → Select from:

- Normal
- Protanopia (Red-blind)
- Deuteranopia (Green-blind)
- Tritanopia (Blue-blind)

### Language Toggle

Click the language button in the top-right corner of the header (EN ↔ اردو)

## 🔄 Navigation Flow

1. **Home Screen** → Select service (Bike/Car/Rickshaw/Delivery)
2. Enter pickup and destination locations
3. Confirm booking
4. Access other features via hamburger menu
5. Manage settings via Settings page

## 📂 Project Structure

```
bykea-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Sidebar.js
│   │   └── Sidebar.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── Settings.js
│   │   ├── Settings.css
│   │   ├── PlaceholderPage.js
│   │   └── PlaceholderPage.css
│   ├── contexts/
│   │   └── AccessibilityContext.js
│   ├── translations/
│   │   └── translations.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🛠️ Technologies Used

- **React**: Frontend framework
- **React Router**: Navigation and routing
- **CSS3**: Styling with CSS variables for theming
- **Context API**: State management for accessibility settings
- **LocalStorage**: Persisting user preferences

## 🎯 Future Enhancements

- Add map integration for location selection
- Implement real-time ride tracking
- Add payment gateway integration
- Include chat support for deaf users
- Add voice commands for visually impaired users
- Implement fare estimation
- Add driver ratings and reviews
- Include promotional offers and discounts

## 📝 Notes

- This is a functional prototype with all navigation working
- Placeholder pages are included for features to be implemented
- All accessibility features are fully functional
- The app is fully responsive across all device sizes

## 🤝 Accessibility Guidelines Followed

- WCAG 2.1 Level AA compliance
- Touch target sizes: 44px minimum (iOS/Android guidelines)
- Color contrast ratios: 4.5:1 for normal text
- Keyboard navigation support
- Screen reader compatibility
- RTL language support

## 📧 Support

For help and support, navigate to the Help & Support section in the app menu.

---

Built with ❤️ for accessibility and inclusivity
