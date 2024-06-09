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
const startLocationMap = document.getElementById('start-location-map');
const createTourForm = document.querySelector('.create-tour-form');
const generateGeneralInfoBtn = document.querySelector('.generate-general-info');
const tourMap = document.getElementById('tour-map');
const createCheckoutSession = document.querySelector('.create-checkout-session');
const submitReviewForm = document.getElementById('submit-review');
const baseMap = document.getElementById('base-map');

if (signupForm) {
   signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('floatingEmail').value;
      const password = document.getElementById('floatingPassword').value;
      const passwordConfirm = document.getElementById('floatingPasswordConfirm').value;
      if (password !== passwordConfirm) return showAlert('danger', 'Passwords do not match!');

      const { status, data } = await sendJSON('/api/v1/auth/signup', 'POST', { email, password });
      if (status === 'error') {
         return showAlert('danger', data);
      }
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
   loginBtnGoogle.addEventListener('click', () => {
      window.open('/api/v1/auth/login/google', 'Google Login', 'popup=true');
      window.addEventListener('message', (event) => {
         if (event.data === 'google-success') {
            showAlert('success', 'Google auth success');
            setTimeout(() => location.assign('/'), 1500);
         }
         if (event.data === 'google-failure') {
            showAlert('warn', 'Google auth failure');
            setTimeout(() => location.assign('/login'), 1500);
         }
      });
   });
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
      uploadPhotoBtn.disabled = true;
      const photo = document.getElementById('inputPhoto').files[0];
      if (!photo) {
         uploadPhotoBtn.disabled = false;
         return showAlert('danger', 'First choose photo!');
      }
      const form = new FormData();
      form.append('inputPhoto', photo);
      const { status, data } = await fetchFormData('/api/v1/users/photo', 'POST', form);
      if (status === 'error') {
         uploadPhotoBtn.disabled = false;
         return showAlert('danger', data);
      }
      uploadPhotoBtn.disabled = false;
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (generatePhotoBtn) {
   generatePhotoBtn.addEventListener('click', async () => {
      generatePhotoBtn.disabled = true;
      const response = await fetch('/api/v1/users/photo', {
         method: 'PUT',
      });
      const { status, data } = await response.json();
      if (status === 'error') {
         generatePhotoBtn.disabled = false;
         return showAlert('danger', data);
      }
      generatePhotoBtn.disabled = false;
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (deletePhotoBtn) {
   deletePhotoBtn.addEventListener('click', async () => {
      deletePhotoBtn.disabled = true;
      const response = await fetch('/api/v1/users/photo', {
         method: 'DELETE',
      });
      const { status, data } = await response.json();
      if (status === 'error') {
         deletePhotoBtn.disabled = false;
         return showAlert('danger', data);
      }
      deletePhotoBtn.disabled = false;
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (deleteProfileBtn) {
   deleteProfileBtn.addEventListener('click', async () => {
      const response = await fetch('/api/v1/users/profile', {
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
      const { status, data } = await sendJSON('/api/v1/users/email', 'PUT', { email });
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
      const { status, data } = await sendJSON('/api/v1/users/password', 'PUT', {
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

if (createTourForm) {
   createTourForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.querySelector('.create-tour-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
         '<span class="spinner-border spinner-border-sm align-middle text-info" role="status" aria-hidden="true"></span> Creating...';
      submitBtn.disabled = true;
      const formData = new FormData();
      const inputsIds = [
         'name',
         'summary',
         'description',
         'price',
         'priceDiscount',
         'maxGroupSize',
         'difficulty',
         'duration',
         'locDesc',
      ];
      inputsIds.forEach((inputId) => {
         formData.append(inputId, document.getElementById(inputId).value);
      });

      formData.append('locCoords', [
         +document.getElementById('locLat').value,
         +document.getElementById('locLng').value,
      ]);
      formData.append('locImg', document.getElementById('locImg').files[0]);

      const { status, data } = await fetchFormData('/api/v1/tours', 'POST', formData);
      if (status === 'error') {
         submitBtn.disabled = false;
         submitBtn.innerHTML = originalText;
         return showAlert('danger', data);
      }
      showAlert('success', status);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
   });
}

if (generateGeneralInfoBtn) {
   generateGeneralInfoBtn.addEventListener('click', async () => {
      const originalText = generateGeneralInfoBtn.innerHTML;
      generateGeneralInfoBtn.innerHTML =
         '<span class="spinner-border spinner-border-sm align-middle text-info" role="status" aria-hidden="true"></span> Generating...';
      generateGeneralInfoBtn.disabled = true;

      const inputsIds = [
         'name',
         'summary',
         'description',
         'price',
         'priceDiscount',
         'maxGroupSize',
         'difficulty',
         'duration',
      ];

      const response = await fetch('/api/v1/tours/randomInfo', {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
      });
      const { status, data } = await response.json();

      if (status === 'error') {
         generateGeneralInfoBtn.disabled = false;
         generateGeneralInfoBtn.innerHTML = originalText;
         return showAlert('danger', data);
      }
      showAlert('success', status);
      generateGeneralInfoBtn.innerHTML = originalText;
      generateGeneralInfoBtn.disabled = false;

      inputsIds.forEach((inputId) => {
         document.getElementById(inputId).value = data[inputId];
      });
   });
}

if (submitReviewForm) {
   submitReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('reviewText').value;
      const rating = document.querySelector('input[name="rating"]:checked').value;
      if (!rating) {
         return showAlert('danger', 'Rate the tour!');
      }
      const { status, data } = await sendJSON('/api/v1/reviews', 'POST', { text, rating });
      if (status === 'error') return showAlert('danger', data);
      showAlert('success', status);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   });
}

if (createCheckoutSession) {
   createCheckoutSession.addEventListener('click', async () => {
      const tourSlug = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/v1/bookings/checkout/${tourSlug}`, { method: 'POST' });
      const { redirectTo } = await response.json();
      if (response.ok) window.location.href = redirectTo;
      //    TODO error handling
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

if (baseMap) {
   function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
   }

   mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kbWlyb24iLCJhIjoiY2x2bGRyMmkwMjcxbjJsbnpmOGsyZWprNCJ9.FMjD1-WaO4qXM28NY89C7g';
   const map = new mapboxgl.Map({
      container: baseMap.attributes.getNamedItem('id').value,
      style: 'mapbox://styles/andmiron/clddn3zn8000801nw8ooobs0y',
      center: [30, 50],
      interactive: false,
      zoom: 4,
   });

   let hoveredPolygonId = null;
   let countryColors = {};
   const WORLDVIEW = 'UA';
   const worldview_filter = [
      'any',
      ['==', ['get', 'disputed'], 'false'],
      ['all', ['==', ['get', 'disputed'], 'true'], ['in', WORLDVIEW, ['get', 'worldview']]],
   ];

   map.on('load', () => {
      map.addSource('countries-source', {
         type: 'vector',
         url: 'mapbox://mapbox.country-boundaries-v1',
      });

      map.addLayer(
         {
            id: 'countries',
            type: 'fill',
            source: 'countries-source',
            'source-layer': 'country_boundaries',
            filter: worldview_filter,
            paint: {
               'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0],
            },
         },
         'country-label',
      );
   });

   map.on('mousemove', 'countries', (e) => {
      if (e.features.length > 0) {
         if (hoveredPolygonId !== null) {
            map.setFeatureState(
               { source: 'countries-source', id: hoveredPolygonId, sourceLayer: 'country_boundaries' },
               { hover: false },
            );
         }
         hoveredPolygonId = e.features[0].id;
         if (!countryColors[hoveredPolygonId]) {
            countryColors[hoveredPolygonId] = getRandomColor();
         }

         map.setPaintProperty('countries', 'fill-color', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            countryColors[hoveredPolygonId],
            '#adb5bd',
         ]);

         map.setFeatureState(
            { source: 'countries-source', id: hoveredPolygonId, sourceLayer: 'country_boundaries' },
            { hover: true },
         );
      }
   });

   map.on('mouseleave', 'countries', () => {
      if (hoveredPolygonId !== null) {
         map.setFeatureState(
            { source: 'countries-source', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
            { hover: false },
         );
      }
      hoveredPolygonId = null;
   });
}

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

   map.on('load', () => {
      map.addControl(geocoder, 'top-left');
      map.addControl(nav, 'top-right');
   });

   geocoder.on('clear', function () {
      if (map.getLayer('country-boundaries')) map.removeLayer('country-boundaries').removeSource('country-boundaries');
   });

   geocoder.on('result', function (e) {
      if (map.getLayer('country-boundaries')) map.removeLayer('country-boundaries').removeSource('country-boundaries');
      const { result } = e;
      const [lng, lat] = result.center;
      const countryCode = result.context
         ? result.context.find((el) => el.id.includes('country')).short_code
         : result.properties.short_code;
      map.addLayer(
         {
            id: 'country-boundaries',
            source: {
               type: 'vector',
               url: 'mapbox://mapbox.country-boundaries-v1',
            },
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
               'fill-color': '#1e7ed2',
               'fill-opacity': 0.4,
            },
            filter: ['==', ['get', 'iso_3166_1'], countryCode.toUpperCase()],
         },
         'country-label',
      );
      marker.setLngLat([lng, lat]);
      document.getElementById('locLat').value = lat;
      document.getElementById('locLng').value = lng;
   });
}

if (tourMap) {
   const location = JSON.parse(tourMap.dataset.location);
   const [lat, lng] = location.coordinates;
   mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kbWlyb24iLCJhIjoiY2x2bGRyMmkwMjcxbjJsbnpmOGsyZWprNCJ9.FMjD1-WaO4qXM28NY89C7g';
   const map = new mapboxgl.Map({
      container: tourMap.attributes.getNamedItem('id').value,
      style: 'mapbox://styles/andmiron/clddn3zn8000801nw8ooobs0y',
      center: [lng - 20, lat],
      zoom: 4,
      interactive: false,
   });
   const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#0d6efd',
   });

   marker.setLngLat([lng, lat]).addTo(map);
}
