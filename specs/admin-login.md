# Admin Login

**URL:** `/vi/admin/login` (https://ts.stgcrv.dev/vi/admin/login)
**Seed:** `tests/seed.spec.ts`
**Page Object:** `pages/admin/login.page.ts`

## 1. Admin Login

### 1.1 Display the login form
**Steps:**
1. Navigate to the admin login page.

**Expected:**
- Page title is "TS Employer - Login".
- Email field, password field, "Login" button, and "Forgot Password?" link are visible.

### 1.2 Submit empty form shows validation errors
**Steps:**
1. Navigate to the admin login page.
2. Click "Login" without entering any value.

**Expected:**
- Email field shows "Enter your email".
- Password field shows "Please enter password".

### 1.3 Invalid email format is rejected
**Steps:**
1. Navigate to the admin login page.
2. Enter `not-an-email` in the Email field.
3. Click "Login".

**Expected:**
- Email field shows "Wrong email format".

### 1.4 Toggle password visibility
**Steps:**
1. Navigate to the admin login page.
2. Enter a value in the Password field.
3. Click the visibility toggle icon inside the Password field.

**Expected:**
- Password input `type` switches from `password` to `text`.

### 1.5 Invalid credentials show a login error
**Steps:**
1. Navigate to the admin login page.
2. Enter a well-formed but unregistered email and a password.
3. Click "Login".

**Expected:**
- Form-level error "Error occurr, please input again" is displayed.
- User stays on the login page.

### 1.6 Forgot password link navigates correctly
**Steps:**
1. Navigate to the admin login page.
2. Click "Forgot Password?".

**Expected:**
- Browser navigates to the `/admin/forgotpass` page.
