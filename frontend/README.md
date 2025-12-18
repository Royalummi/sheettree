# SheetTree Frontend

A modern React application for managing Google Sheets integration with forms and data collection. Built with React 18, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **Modern React 18** - Latest React features with hooks and concurrent rendering
- **Redux Toolkit** - Predictable state management with modern Redux patterns
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Google OAuth Integration** - Seamless authentication with Google accounts
- **Form Builder** - Create and manage forms connected to Google Sheets
- **Real-time Validation** - Client-side form validation with error feedback
- **Admin Dashboard** - Administrative interface for user and data management
- **Toast Notifications** - User-friendly feedback for all actions

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and suspense
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - Official Redux toolset for efficient Redux development
- **React Router** - Declarative routing for React applications
- **Axios** - Promise-based HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with easy validation
- **Lucide React** - Beautiful & consistent icon pack
- **React Toastify** - Elegant toast notifications

## 📋 Requirements

- Node.js 16.0 or higher
- npm 8.0 or higher (or yarn/pnpm)
- Modern web browser with ES6+ support

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configurations
```

### 3. Configure Environment Variables

Edit `.env` file with your settings:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google API Configuration
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# App Configuration
VITE_APP_NAME=SheetTree
VITE_APP_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── Layout/         # Layout components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── UI/             # Generic UI components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard pages
│   ├── Sheets/         # Google Sheets management
│   ├── Forms/          # Form management
│   ├── Profile/        # User profile
│   └── Admin/          # Admin panel
├── store/              # Redux store configuration
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       ├── sheetsSlice.js
│       ├── formsSlice.js
│       └── adminSlice.js
├── services/           # API and external services
│   └── api.js          # Axios configuration
├── config/             # Configuration files
│   └── constants.js    # App constants
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🔄 Redux State Management

### Store Structure

```javascript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  sheets: {
    sheets: Sheet[],
    selectedSheet: Sheet | null,
    previewData: any,
    loading: boolean,
    error: string | null
  },
  forms: {
    forms: Form[],
    selectedForm: Form | null,
    submissions: Submission[],
    loading: boolean,
    submissionLoading: boolean,
    error: string | null
  },
  admin: {
    users: User[],
    selectedUser: User | null,
    allSheets: Sheet[],
    allForms: Form[],
    analytics: Analytics | null,
    loading: boolean,
    error: string | null
  }
}
```

### Redux Toolkit Slices

#### Auth Slice

```javascript
// Async actions
export const initiateGoogleAuth = createAsyncThunk(...)
export const getUserProfile = createAsyncThunk(...)
export const updateUserProfile = createAsyncThunk(...)

// Synchronous actions
export const { loginSuccess, logout, clearError, setLoading } = authSlice.actions
```

#### Sheets Slice

```javascript
// Async actions
export const getUserSheets = createAsyncThunk(...)
export const connectSheet = createAsyncThunk(...)
export const disconnectSheet = createAsyncThunk(...)
export const previewSheet = createAsyncThunk(...)

// Synchronous actions
export const { clearError, clearPreview, setSelectedSheet } = sheetsSlice.actions
```

### Using Redux in Components

```javascript
import { useSelector, useDispatch } from "react-redux";
import { getUserSheets } from "../store/slices/sheetsSlice";

function SheetsComponent() {
  const dispatch = useDispatch();
  const { sheets, loading, error } = useSelector((state) => state.sheets);

  useEffect(() => {
    dispatch(getUserSheets());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {sheets.map((sheet) => (
        <div key={sheet.id}>{sheet.name}</div>
      ))}
    </div>
  );
}
```

### Redux Best Practices

1. **Use createAsyncThunk** for async operations
2. **Keep state normalized** - avoid nested objects
3. **Use extraReducers** for async action handling
4. **Separate concerns** - one slice per domain
5. **Use selectors** for computed state (with Reselect if needed)

## 🎨 Styling with Tailwind CSS

### Utility Classes

Tailwind provides utility classes for rapid UI development:

```javascript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Flexbox
<div className="flex items-center justify-between">

// Spacing
<div className="p-4 m-2 space-y-4">

// Colors
<button className="bg-blue-500 hover:bg-blue-600 text-white">

// Typography
<h1 className="text-2xl font-bold text-gray-900">
```

### Custom Component Classes

Defined in `src/index.css`:

```css
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.card {
  @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
}

.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500;
}
```

### Responsive Design Patterns

```javascript
// Mobile-first responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Responsive text sizes
<h1 className="text-xl sm:text-2xl lg:text-3xl">

// Conditional visibility
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🛣️ Routing with React Router

### Route Configuration

```javascript
// App.jsx
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/form/:formId" element={<FormSubmission />} />

  {/* Private Routes */}
  <Route
    path="/"
    element={
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    }
  >
    <Route index element={<Navigate to="/dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="sheets/*" element={<SheetsRoutes />} />
    <Route path="forms/*" element={<FormsRoutes />} />

    {/* Admin Routes */}
    <Route
      path="admin/*"
      element={
        <AdminRoute>
          <AdminRoutes />
        </AdminRoute>
      }
    />
  </Route>
</Routes>
```

### Navigation

```javascript
// Programmatic navigation
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // After successful submission
    navigate('/dashboard');
  };
}

// Declarative navigation
import { Link, NavLink } from 'react-router-dom';

<Link to="/dashboard">Go to Dashboard</Link>

<NavLink
  to="/sheets"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Sheets
</NavLink>
```

## 🔒 Authentication & Authorization

### Private Routes

```javascript
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

### Admin Routes

```javascript
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.is_admin) return <Navigate to="/dashboard" />;

  return children;
};
```

### Token Management

```javascript
// API interceptor for token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 📝 Form Handling

### React Hook Form Integration

```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} className="form-input" />
      {errors.name && (
        <span className="text-red-500">{errors.name.message}</span>
      )}

      <button type="submit" className="btn-primary">
        Submit
      </button>
    </form>
  );
}
```

### Form Validation Patterns

```javascript
// Validation constants
export const VALIDATION_RULES = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  required: {
    required: "This field is required",
  },
};

// Dynamic validation
const createValidationSchema = (fields) => {
  const schema = {};
  fields.forEach((field) => {
    if (field.validation?.required) {
      schema[field.name] = yup.string().required("This field is required");
    }
    if (field.validation?.email) {
      schema[field.name] = yup.string().email("Invalid email format");
    }
  });
  return yup.object(schema);
};
```

## 🎯 Performance Optimization

### Code Splitting

```javascript
// Lazy loading components
import { lazy, Suspense } from "react";

const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
```

### Memoization

```javascript
import { memo, useMemo, useCallback } from "react";

// Component memoization
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Value memoization
function Component({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  const handleItemClick = useCallback((id) => {
    // Handle click
  }, []);

  return <div>{/* Render */}</div>;
}
```

### Virtual Scrolling

```javascript
// For large lists, consider react-window or react-virtualized
import { FixedSizeList as List } from "react-window";

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <List height={600} itemCount={items.length} itemSize={50}>
      {Row}
    </List>
  );
}
```

## 🧪 Testing

### Unit Testing with Vitest

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Testing Components

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import LoginForm from "./LoginForm";

test("renders login button", () => {
  render(
    <Provider store={store}>
      <LoginForm />
    </Provider>
  );

  const loginButton = screen.getByRole("button", {
    name: /continue with google/i,
  });
  expect(loginButton).toBeInTheDocument();
});

test("handles form submission", () => {
  const mockSubmit = vi.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  fireEvent.click(screen.getByRole("button"));
  expect(mockSubmit).toHaveBeenCalled();
});
```

## 📦 Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment-specific Builds

```bash
# Development
VITE_APP_ENV=development npm run build

# Staging
VITE_APP_ENV=staging npm run build

# Production
VITE_APP_ENV=production npm run build
```

### Deployment Checklist

1. **Environment Variables**

   - Set production API URLs
   - Configure Google API keys
   - Set proper CORS origins

2. **Performance**

   - Enable gzip compression
   - Configure CDN for assets
   - Optimize images

3. **Security**
   - Use HTTPS
   - Set proper CSP headers
   - Validate environment variables

## 🐛 Troubleshooting

### Common Issues

1. **Module Resolution Errors**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Vite Dev Server Issues**

   ```bash
   # Clear Vite cache
   npx vite --force

   # Check port availability
   lsof -ti:5173
   ```

3. **Redux State Issues**

   - Use Redux DevTools for debugging
   - Check action dispatch and reducer logic
   - Verify initial state structure

4. **API Connection Issues**
   - Check CORS configuration
   - Verify API base URL
   - Check network tab in browser dev tools

### Debugging Tools

1. **React DevTools** - Component tree and props inspection
2. **Redux DevTools** - State management debugging
3. **Network Tab** - API request/response debugging
4. **Console Logs** - Application flow debugging

## 📚 Additional Resources

### React Ecosystem

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

### Styling & UI

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Headless UI](https://headlessui.com/) - Unstyled, accessible components

### Build Tools

- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

### Best Practices

- [React Patterns](https://reactpatterns.com/)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
