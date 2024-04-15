const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');
const loginBtnGoogle = document.querySelector('.login-btn-google');
const logoutBtn = document.querySelector('.logout-btn');
const forgetPasswordForm = document.querySelector('.forget-password-form');
const resetPasswordForm = document.querySelector('.reset-password-form');

if (signupForm) {
   signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const { status, message } = await postJSON('/api/v1/auth/signup', { email, password });
      if (status === 'error') return showAlert('danger', message);
      showAlert('success', message);
      window.setTimeout(() => {
         location.assign('/login');
      }, 2000);
   });
}

if (loginForm) {
   loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const { status, message } = await postJSON('/api/v1/auth/login', { email, password });
      if (status === 'error') return showAlert('danger', message);
      showAlert('success', message);
      window.setTimeout(() => {
         location.assign('/');
      }, 2000);
   });
}

if (logoutBtn)
   logoutBtn.addEventListener('click', async () => {
      const { status, message } = await postJSON('/api/v1/auth/logout');
      if (status === 'error') return showAlert('danger', message);
      showAlert('success', message);
      window.setTimeout(() => {
         location.assign('/');
      }, 1500);
   });

if (loginBtnGoogle) {
   loginBtnGoogle.addEventListener('click', () => location.assign('/api/v1/auth/login/google'));
}

if (forgetPasswordForm) {
   forgetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const { status, message } = await postJSON('/api/v1/auth/forget', { email });
      if (status === 'error') return showAlert('danger', message);
      showAlert('success', message);
      window.setTimeout(() => {
         location.assign('/login');
      }, 1500);
   });
}

if (resetPasswordForm) {
   resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('floatingPassword').value;
      const passwordConfirm = document.getElementById('floatingPasswordConfirm').value;
      if (password !== passwordConfirm) return showAlert('danger', 'Passwords are different!');
      const { status, message } = await postJSON(location.pathname, { password });
      if (status === 'error') return showAlert('error', message);
      showAlert('success', message);
      window.setTimeout(() => {
         location.assign('/login');
      }, 1500);
   });
}

async function postJSON(url, data) {
   const response = await fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
   return response.json();
}

function showAlert(type, message) {
   hideAlert();
   const markup = [
      `<div class="alert alert-${type} alert-dismissible position-absolute translate-middle" style="top: 11%; left: 50%" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
   ].join('');

   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
   window.setTimeout(hideAlert, 5000);
}

function hideAlert() {
   const el = document.querySelector('.alert');
   if (el) el.parentElement.removeChild(el);
}

document.addEventListener('DOMContentLoaded', function () {
   // make all currently active items inactive
   // (you can delete this block if you know that there are no active items when loading the page)
   document.querySelectorAll('a.nav-link.active').forEach((li) => {
      li.classList.remove('active');
      li.attributes.removeNamedItem('aria-current');
   });

   // find the link to the current page and make it active
   document.querySelectorAll(`a[href="${location.pathname}"].nav-link`).forEach((a) => {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
   });
});
