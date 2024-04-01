const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');

if (signupForm) {
   signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const response = await postJSON('/signup', { email, password });
      const responseData = await response.json();
      if (!response.ok) {
         showAlert('danger', responseData.message);
      } else {
         showAlert('success', 'You are signed up!');
         window.setTimeout(() => {
            location.assign('/login');
         }, 2000);
      }
   });
}

if (loginForm) {
   loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const response = await postJSON('/login', { email, password });
      const responseData = await response.json();
      if (!response.ok) {
         showAlert('danger', responseData.message);
      } else {
         showAlert('success', 'You are logged in!');
         window.setTimeout(() => {
            location.assign('/');
         }, 2000);
      }
   });
}

async function postJSON(url, data) {
   const response = await fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
   return response;
}

function showAlert(type, message) {
   hideAlert();
   const markup = [
      `<div class="alert alert-${type} alert-dismissible position-absolute top-0 start-50 translate-middle" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
   ].join('');
   document.querySelector('footer').insertAdjacentHTML('afterbegin', markup);
   window.setTimeout(hideAlert, 5000);
}

function hideAlert() {
   const el = document.querySelector('.alert');
   if (el) el.parentElement.removeChild(el);
}
