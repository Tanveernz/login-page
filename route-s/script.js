// Get login elements
const loginUsername = document.getElementById('login-username'); // Treat as email
const loginPassword = document.getElementById('login-password');
const loginBtn = document.querySelector('#login-section .submit-btn');

// Get signup elements
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('sign-email');
const signupUsername = document.getElementById('signup-username'); // not used by backend
const signupPassword = document.getElementById('signup-password');
const signupConfirm = document.getElementById('signup-confirm');
const signupBtn = document.querySelector('#signup-section .submit-btn');

// Helper alert
function showAlert(message) {
  alert(message);
}

// ✅ Login API call to backend
loginBtn.addEventListener('click', async () => {
  const email = loginUsername.value.trim(); // Use email instead of username
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showAlert('Please enter both email and password.');
    return;
  }

  try {
    const res = await fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showAlert(`Login successful!\nToken: ${data.token}`);
      localStorage.setItem('token', data.token); // save JWT token
    } else {
      showAlert(data.message || 'Login failed.');
    }

    // Optionally clear inputs
    loginUsername.value = '';
    loginPassword.value = '';
  } catch (err) {
    console.error(err);
    showAlert('Error connecting to server.');
  }
});

// ✅ Signup API call to backend
signupBtn.addEventListener('click', async () => {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const confirm = signupConfirm.value.trim();

  if (!name || !email || !password || !confirm) {
    showAlert('Please fill all fields.');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showAlert('Please enter a valid email address.');
    return;
  }

  if (password !== confirm) {
    showAlert('Passwords do not match.');
    return;
  }

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showAlert(data.message);
    } else {
      showAlert(data.message || 'Signup failed.');
    }

    // Optionally clear inputs
    signupName.value = '';
    signupEmail.value = '';
    signupUsername.value = ''; // not sent to backend
    signupPassword.value = '';
    signupConfirm.value = '';
  } catch (err) {
    console.error(err);
    showAlert('Error connecting to server.');
  }
});

const toggleButton = document.getElementById('darkModeToggle');

  // Toggle dark mode class
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Optional: Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      toggleButton.textContent = '☀️ Light Mode';
    } else {
      localStorage.setItem('theme', 'light');
      toggleButton.textContent = '🌙 Dark Mode';
    }
  });

  // Load preference from localStorage
  window.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      toggleButton.textContent = '☀️ Light Mode';
    }
  });