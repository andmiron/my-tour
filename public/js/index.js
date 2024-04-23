const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');
const loginBtnGoogle = document.querySelector('.login-btn-google');
const logoutBtn = document.querySelector('.logout-btn');
const forgetPasswordForm = document.querySelector('.forget-password-form');
const resetPasswordForm = document.querySelector('.reset-password-form');
const uploadPhotoBtn = document.querySelector('.upload-photo');
const generatePhotoBtn = document.querySelector('.generate-photo');
const deletePhotoBtn = document.querySelector('.delete-photo');
const deleteProfileBtn = document.querySelector('.delete-profile');
const confirmEmailForm = document.querySelector('.confirm-email-form');

if (signupForm) {
   signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const { status, data } = await postJSON('/api/v1/auth/signup', { email, password });
      console.log(status, data);
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
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
      const { status, data } = await postJSON('/api/v1/auth/login', { email, password });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.assign('/');
      }, 2000);
   });
}

if (logoutBtn)
   logoutBtn.addEventListener('click', async () => {
      const { status, data } = await postJSON('/api/v1/auth/logout');
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
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
      const { status, data } = await postJSON('/api/v1/auth/forget', { email });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
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
      const { status, data } = await postJSON(`/api/v1/auth/${location.pathname}`, { password });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.assign('/login');
      }, 1500);
   });
}

if (uploadPhotoBtn) {
   uploadPhotoBtn.addEventListener('click', async () => {
      const photo = document.getElementById('inputPhoto').files[0];
      if (!photo) return showAlert('danger', 'First choose photo!');
      const form = new FormData();
      form.append('inputPhoto', photo);
      const { status, data } = await fetchFormData('api/v1/users/photo', 'PUT', form);
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (generatePhotoBtn) {
   generatePhotoBtn.addEventListener('click', async () => {
      const response = await fetch('api/v1/users/photoGenerate', {
         method: 'POST',
      });
      const { status, data } = await response.json();
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (deletePhotoBtn) {
   deletePhotoBtn.addEventListener('click', async () => {
      const response = await fetch('api/v1/users/photoDelete', {
         method: 'DELETE',
      });
      const { status, data } = await response.json();
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (deleteProfileBtn) {
   deleteProfileBtn.addEventListener('click', async () => {
      const response = await fetch('api/v1/users/profile', {
         method: 'DELETE',
      });
      const { status, data } = await response.json();
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.assign('/');
      }, 1000);
   });
}

if (confirmEmailForm) {
   confirmEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('confirmEmail').value;
      const { status, data } = await postJSON('/api/v1/users/email/verify', { email });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
   });
}

async function fetchFormData(url, method, body) {
   const response = await fetch(url, {
      method,
      body,
   });
   return response.json();
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
      `<div class="alert alert-${type} alert-dismissible position-fixed translate-middle" style="top: 11%; left: 50%; z-index: 100" role="alert">`,
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
   document.querySelectorAll('a.nav-link.active').forEach((li) => {
      li.classList.remove('active');
      li.attributes.removeNamedItem('aria-current');
   });
   document.querySelectorAll(`a[href="${location.pathname}"].nav-link`).forEach((a) => {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
   });
});
