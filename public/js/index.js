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
const changeEmailForm = document.querySelector('.change-email-form');
const changePasswordForm = document.querySelector('.change-password-form');
const mapBox = document.getElementById('map');
const startLocationMap = document.getElementById('start-location-map');

if (signupForm) {
   signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const passwordConfirm = document.getElementById('floatingPasswordConfirm').value;
      if (password !== passwordConfirm) return showAlert('danger', 'Passwords do not match!');
      const { status, data } = await sendJSON('/api/v1/auth/signup', 'POST', { email, password });
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
      const { status, data } = await sendJSON('/api/v1/auth/login', 'POST', { email, password });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.assign('/');
      }, 2000);
   });
}

if (logoutBtn)
   logoutBtn.addEventListener('click', async () => {
      const { status, data } = await sendJSON('/api/v1/auth/logout', 'POST');
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
      const { status, data } = await sendJSON('/api/v1/auth/forget', 'POST', { email });
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
      const { status, data } = await sendJSON(`/api/v1/auth/${location.pathname}`, 'POST', { password });
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

if (changeEmailForm) {
   changeEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('inputEmail').value;
      const { status, data } = await sendJSON('api/v1/users/email', 'PUT', { email });
      console.log(status, data);
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (changePasswordForm) {
   changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const oldPassword = document.getElementById('inputOldPassword').value;
      const newPassword = document.getElementById('inputNewPassword').value;
      const newPasswordConfirm = document.getElementById('inputConfirmNewPassword').value;
      const { status, data } = await sendJSON('api/v1/users/password', 'PUT', {
         oldPassword,
         newPassword,
         newPasswordConfirm,
      });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

async function fetchFormData(url, method, body) {
   const response = await fetch(url, {
      method,
      body,
   });
   return response.json();
}

async function sendJSON(url, method, data) {
   const response = await fetch(url, {
      method,
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
      `<div class="alert alert-${type} alert-dismissible position-fixed translate-middle shadow" style="top: 11%; left: 50%; z-index: 10000" role="alert">`,
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

const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
requiredInputs.forEach((node) => {
   const label = document.querySelector(`label[for="${node.id}"]`);
   if (label) {
      label.innerHTML += ' <span style="color: red;">*</span>';
   }
});

if (startLocationMap) {
   mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kbWlyb24iLCJhIjoiY2x2bGRyMmkwMjcxbjJsbnpmOGsyZWprNCJ9.FMjD1-WaO4qXM28NY89C7g';
   const map = new mapboxgl.Map({
      container: startLocationMap.attributes.getNamedItem('id').value,
      style: 'mapbox://styles/andmiron/clddn3zn8000801nw8ooobs0y',
      center: [30, 50],
      zoom: 2,
   });

   const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#0d6efd',
   });

   const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Start typing for location...',
      language: 'en',
      marker: marker,
   });

   const nav = new mapboxgl.NavigationControl();

   geocoder.on('result', function (e) {
      const { result } = e;
      const [lng, lat] = result.center;
      marker.setLngLat([lng, lat]);
      document.getElementById('startLocCoords').value = result.place_name_en;
      popup.addTo(map);
      map.flyTo({ center: [lng, lat], zoom: 10 });
   });

   map.addControl(geocoder, 'top-left');
   map.addControl(nav, 'top-right');
}

document.getElementById('duration').addEventListener('change', (e) => {
   const container = document.getElementById('locations');
   for (day = 1; day <= e.target.value; day++) {
      container.appendChild(`
      <div class="row">
         <div class="col-6">
            <label class="form-control" for="location${i}Desc"></label>
            <input class="form-control" id="location1" required="required" type="text" name="location1" aria-describedby="location1Help"/>
            <p class="form-text" id="location1Help">Day 1 description.</p>
         </div>
         <div class="col-6">
            <label class="form-control" for="location1Coords"></label>
            <input class="form-control" id="location1" required="required" type="text" name="location1" aria-describedby="location1Help"/>
            <p class="form-text" id="location1Help">Day 1 location.</p>
         </div>
      </div>
      `);
   }
});
