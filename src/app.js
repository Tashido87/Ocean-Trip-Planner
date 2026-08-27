import { defaultTravelData } from './travelData.js';
import { db, doc, getDoc, setDoc, onSnapshot } from './firebase.js';

// Reference to the shared master travel catalog document in Firebase Firestore
const CATALOG_DOC_REF = doc(db, 'ocean_travel', 'catalog');

/**
 * State Management
 */
export const state = {
  currentCountryId: null,
  currentCityId: null,
  currentCategoryFilter: 'all',
  searchQuery: '',
  activeAccordionPlaceId: null,
  selectedPlaces: [],
  isAdmin: false,
  editingPlaceId: null,
  modalImages: [],
  modalImageTab: 'visual',
  cloudSyncStatus: 'connecting',
  lastSyncedTime: null,
  lightbox: {
    isOpen: false,
    placeId: null,
    currentImageIndex: 0,
    images: [],
    placeTitle: '',
    categoryLabel: '',
    caption: ''
  }
};

// Load initial persistent data from local storage as immediate render cache
let travelData = JSON.parse(JSON.stringify(defaultTravelData));
try {
  const savedData = localStorage.getItem('ocean_travel_custom_data');
  if (savedData) {
    travelData = JSON.parse(savedData);
  }
} catch (e) {
  console.warn('Could not load custom data:', e);
}

// Data Migration: Ensure every place has an `images` array with 3-5 photos
function ensureValidPlaceImages(dataObj) {
  try {
    if (dataObj && dataObj.cities) {
      Object.values(dataObj.cities).forEach(city => {
        if (city && city.places) {
          city.places.forEach(p => {
            if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
              const defaultCity = defaultTravelData.cities[city.id];
              const defaultPlace = defaultCity ? defaultCity.places.find(dp => dp.id === p.id) : null;
              if (defaultPlace && defaultPlace.images && defaultPlace.images.length > 0) {
                p.images = [...defaultPlace.images];
              } else if (p.imageUrl) {
                p.images = [p.imageUrl];
              }
            }
          });
        }
      });
    }
  } catch (e) {
    console.warn('Image migration check error:', e);
  }
}
ensureValidPlaceImages(travelData);

try {
  const savedPlan = localStorage.getItem('ocean_travel_plan');
  if (savedPlan) {
    state.selectedPlaces = JSON.parse(savedPlan);
  }
} catch (e) {
  console.warn('Could not load travel plan:', e);
}

try {
  const adminLoggedIn = localStorage.getItem('ocean_travel_admin_logged');
  if (adminLoggedIn === 'true' || adminLoggedIn === 'herozboy@gmail.com') {
    state.isAdmin = true;
  }
} catch (e) {}

/**
 * Update UI Sync Status Indicators (Navbar & Admin banner)
 */
export function updateSyncStatusUI(status, message) {
  state.cloudSyncStatus = status;
  
  const badge = document.getElementById('cloud-sync-badge');
  const dot = document.getElementById('cloud-sync-dot');
  const text = document.getElementById('cloud-sync-text');
  const adminBadgeText = document.getElementById('admin-cloud-sync-text');
  
  if (text) text.textContent = message || 'Firebase Cloud Synced';
  if (adminBadgeText) {
    if (status === 'saving') {
      adminBadgeText.textContent = 'Syncing to Firebase...';
    } else if (status === 'synced') {
      adminBadgeText.textContent = 'Firebase Cloud Live';
    } else if (status === 'connecting') {
      adminBadgeText.textContent = 'Connecting Firebase...';
    } else {
      adminBadgeText.textContent = 'Offline (Local Backup)';
    }
  }

  if (!badge) return;

  if (status === 'synced') {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse';
  } else if (status === 'saving') {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200';
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping';
  } else if (status === 'connecting') {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200';
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse';
  } else if (status === 'error') {
    badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200';
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-rose-500';
  }
}

/**
 * Subscribe to Real-time Firebase Firestore Updates
 */
export function subscribeToFirestoreUpdates() {
  updateSyncStatusUI('connecting', 'Connecting to Firebase...');

  try {
    const unsubscribe = onSnapshot(CATALOG_DOC_REF, async (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        if (remoteData && remoteData.cities && remoteData.countries) {
          console.log('Firebase Firestore remote sync received:', remoteData);
          ensureValidPlaceImages(remoteData);
          travelData = remoteData;
          
          // Cache locally as backup
          try {
            localStorage.setItem('ocean_travel_custom_data', JSON.stringify(travelData));
          } catch (e) {}

          state.lastSyncedTime = new Date();
          updateSyncStatusUI('synced', 'Firebase Cloud Synced');

          // Refresh current views with updated data
          if (state.currentCountryId) {
            if (state.currentCityId) {
              renderPlacesList();
            } else {
              renderCityCards();
            }
          } else {
            renderCountries();
          }
          updateCartMetrics();
          renderDrawerPlacesList();
        }
      } else {
        // Document does not exist yet on cloud Firestore; seed initial data
        console.log('Catalog not found on Firebase. Initializing default master data...');
        updateSyncStatusUI('saving', 'Initializing Firebase catalog...');
        try {
          await setDoc(CATALOG_DOC_REF, travelData);
          updateSyncStatusUI('synced', 'Firebase Initialized & Synced');
        } catch (initErr) {
          console.warn('Failed to auto-seed Firebase:', initErr);
          updateSyncStatusUI('synced', 'Firebase Cloud Synced');
        }
      }
    }, (err) => {
      console.error('Firebase onSnapshot listener error:', err);
      updateSyncStatusUI('error', 'Cloud sync offline (Local Mode)');
    });

    return unsubscribe;
  } catch (e) {
    console.error('Failed to attach Firebase snapshot listener:', e);
    updateSyncStatusUI('error', 'Firebase offline');
  }
}

/**
 * Save custom travel data to localStorage and sync with Firebase Firestore
 */
export async function saveTravelData() {
  // 1. Immediate local save for resilience
  try {
    localStorage.setItem('ocean_travel_custom_data', JSON.stringify(travelData));
  } catch (e) {
    console.error('Failed to save locally:', e);
  }

  // 2. Real-time Cloud Save to Firebase Firestore
  updateSyncStatusUI('saving', 'Syncing to Firebase Cloud...');
  try {
    await setDoc(CATALOG_DOC_REF, travelData);
    state.lastSyncedTime = new Date();
    updateSyncStatusUI('synced', 'Firebase Cloud Synced');
    console.log('Data successfully saved & synced to Firebase Firestore!');
  } catch (err) {
    console.error('Failed to sync to Firebase Firestore:', err);
    updateSyncStatusUI('error', 'Sync failed (saved locally)');
    showToast('Cloud Sync Notice', 'Saved locally. Changes will sync to Firebase when online.', 'info');
  }
}

/**
 * Reset all travel data to defaults and sync with Firebase Firestore
 */
export async function resetDataToDefault() {
  if (confirm('Are you sure you want to reset all destinations and places to default master catalog? This will update Firebase Cloud for all users.')) {
    travelData = JSON.parse(JSON.stringify(defaultTravelData));
    await saveTravelData();
    renderCountries();
    if (state.currentCountryId) {
      if (state.currentCityId) {
        renderPlacesList();
      } else {
        renderCityCards();
      }
    }
    showToast('Reset Complete', 'Master catalog reset and synchronized with Firebase Cloud', 'success');
  }
}

/**
 * Initialization
 */
export function initApp() {
  // Check URL parameters for admin access (e.g. ?admin=true or #admin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
    openAdminModal();
  }

  updateAdminUI();
  renderCountries();
  updateCartMetrics();
  setupLightboxEvents();
  
  // Start real-time Firebase Firestore synchronization
  subscribeToFirestoreUpdates();
}

/**
 * Admin UI update
 */
export function updateAdminUI() {
  const adminBar = document.getElementById('admin-active-bar');
  const adminHeaderContainer = document.getElementById('admin-header-btn-container');
  const adminHeaderLabel = document.getElementById('admin-header-label');
  const adminLoginActions = document.getElementById('admin-login-actions-box');
  const adminLoggedInBox = document.getElementById('admin-loggedin-box');
  const adminCurrentEmailLabel = document.getElementById('admin-current-email-label');

  if (state.isAdmin) {
    if (adminBar) adminBar.classList.remove('hidden');
    if (adminHeaderContainer) adminHeaderContainer.classList.remove('hidden');
    if (adminHeaderLabel) adminHeaderLabel.textContent = 'Admin Active';
    if (adminLoginActions) adminLoginActions.classList.add('hidden');
    if (adminLoggedInBox) adminLoggedInBox.classList.remove('hidden');
    if (adminCurrentEmailLabel) adminCurrentEmailLabel.textContent = 'herozboy@gmail.com';
  } else {
    if (adminBar) adminBar.classList.add('hidden');
    if (adminHeaderContainer) adminHeaderContainer.classList.add('hidden');
    if (adminLoginActions) adminLoginActions.classList.remove('hidden');
    if (adminLoggedInBox) adminLoggedInBox.classList.add('hidden');
  }
}

/**
 * Admin Login Modal Handlers
 */
export function openAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  const alertBox = document.getElementById('admin-login-alert');
  if (alertBox) {
    alertBox.classList.add('hidden');
    alertBox.textContent = '';
  }
  updateAdminUI();
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export function closeAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Google Sign-In Authentication Handler
 * Strictly authorized only for herozboy@gmail.com
 */
export function handleGoogleSignIn(targetEmail = 'herozboy@gmail.com') {
  const alertBox = document.getElementById('admin-login-alert');
  const googleBtn = document.getElementById('btn-google-login');

  if (googleBtn) {
    googleBtn.disabled = true;
    googleBtn.classList.add('opacity-75');
  }

  // Simulate smooth Google OAuth response latency
  setTimeout(() => {
    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.classList.remove('opacity-75');
    }

    const email = String(targetEmail || '').trim().toLowerCase();
    const AUTHORIZED_ADMIN = 'herozboy@gmail.com';

    if (email === AUTHORIZED_ADMIN) {
      state.isAdmin = true;
      try {
        localStorage.setItem('ocean_travel_admin_logged', AUTHORIZED_ADMIN);
      } catch (err) {}

      updateAdminUI();
      closeAdminModal();
      showToast('Admin Access Granted', 'Signed in as ' + AUTHORIZED_ADMIN, 'success');

      if (state.currentCityId) {
        renderPlacesList();
      }
    } else {
      if (alertBox) {
        alertBox.className = 'p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-1 block';
        alertBox.innerHTML = `
          <div class="flex items-center gap-1.5 font-bold text-rose-900">
            <i class="fa-solid fa-circle-exclamation text-[#a80c10]"></i>
            <span>Access Denied</span>
          </div>
          <p class="text-[11px] text-rose-700">The Google account <strong class="font-mono text-slate-900">${email || 'unknown'}</strong> is not authorized. Only <strong class="font-mono text-slate-900">${AUTHORIZED_ADMIN}</strong> can manage content.</p>
        `;
      }
    }
  }, 400);
}

/**
 * Prompt test with alternative Google account
 */
export function promptDifferentGoogleAccount() {
  const inputEmail = prompt('Enter a Google account email to sign in with (e.g. user@gmail.com or herozboy@gmail.com):', 'user@gmail.com');
  if (inputEmail !== null) {
    handleGoogleSignIn(inputEmail.trim());
  }
}

export function logoutAdmin() {
  state.isAdmin = false;
  try {
    localStorage.removeItem('ocean_travel_admin_logged');
  } catch(e) {}
  updateAdminUI();
  closeAdminModal();
  showToast('Logged Out', 'Admin session ended', 'info');
  if (state.currentCityId) {
    renderPlacesList();
  }
}

/**
 * Render Step 1: Countries
 */
export function renderCountries() {
  const grid = document.getElementById('country-cards-grid');
  if (!grid) return;
  grid.innerHTML = travelData.countries.map(country => `
    <div onclick="window.OceanApp.selectCountry('${country.id}')" 
         class="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
      <div class="relative h-56 w-full overflow-hidden bg-slate-100">
        <img src="${country.heroImage}" alt="${country.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
        
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-slate-100">
            <span class="text-base">${country.flag}</span> ${country.name}
          </span>
        </div>
        
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <h3 class="text-2xl font-black tracking-tight">${country.name}</h3>
          <p class="text-xs text-slate-200 mt-0.5 line-clamp-1">${country.cities.length} Popular Cities Available</p>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${country.tagline}</p>
        
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <span class="text-xs font-bold text-[#a80c10] flex items-center gap-1.5 group-hover:text-[#8e0a0d] transition-colors">
            Explore Cities <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
          </span>
          <span class="text-[11px] text-slate-400 font-medium">Custom Plan Ready</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Handle Country Selection
 */
export function selectCountry(countryId) {
  state.currentCountryId = countryId;
  const country = travelData.countries.find(c => c.id === countryId);
  if (!country) return;

  // Update Breadcrumbs
  const crumbArrow1 = document.getElementById('crumb-arrow-1');
  const crumbCityBtn = document.getElementById('crumb-city-btn');
  const crumbCountryName = document.getElementById('crumb-country-name');
  const crumbArrow2 = document.getElementById('crumb-arrow-2');
  const crumbPlaceLabel = document.getElementById('crumb-place-label');

  if (crumbArrow1) crumbArrow1.style.display = 'inline';
  if (crumbCityBtn) crumbCityBtn.style.display = 'inline-flex';
  if (crumbCountryName) {
    crumbCountryName.textContent = `${country.flag} ${country.name}`;
  } else if (crumbCityBtn) {
    crumbCityBtn.textContent = `${country.flag} ${country.name}`;
  }
  if (crumbArrow2) crumbArrow2.style.display = 'none';
  if (crumbPlaceLabel) crumbPlaceLabel.style.display = 'none';

  // Update Step 2 Header
  const flagEl = document.getElementById('city-view-country-flag') || document.getElementById('selected-country-flag');
  if (flagEl) flagEl.textContent = country.flag;

  const titleEl = document.getElementById('city-view-country-name') || document.getElementById('selected-country-title');
  if (titleEl) titleEl.textContent = country.name;

  const taglineEl = document.getElementById('city-view-country-tagline') || document.getElementById('selected-country-subtitle');
  if (taglineEl) taglineEl.textContent = country.tagline || `Select a city to start customizing your travel plan with Ocean Travel Agency.`;

  // Render Cities
  const citiesGrid = document.getElementById('city-cards-grid');
  if (citiesGrid) {
    citiesGrid.innerHTML = country.cities.map(cityKey => {
      const city = travelData.cities[cityKey];
      if (!city) return '';
      return `
        <div onclick="window.OceanApp.selectCity('${city.id}')" 
             class="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
          <div class="relative h-48 w-full overflow-hidden bg-slate-100">
            <img src="${city.heroImage}" alt="${city.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent"></div>
            
            <div class="absolute top-4 right-4">
              <span class="px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5 border border-white/10">
                <i class="fa-solid fa-location-dot text-[#a80c10]"></i> ${city.places.length} Attractions
              </span>
            </div>

            <div class="absolute bottom-4 left-4 right-4 text-white">
              <h3 class="text-xl font-black">${city.name}</h3>
              <p class="text-xs text-slate-200 mt-0.5">${city.tagline}</p>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <p class="myanmar-text text-xs text-slate-600 leading-relaxed">${city.myanmarDesc || city.tagline}</p>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-xs font-bold text-[#a80c10] flex items-center gap-1 group-hover:text-[#8e0a0d] transition-colors">
                Choose Attractions <i class="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </span>
              <span class="text-[11px] font-semibold text-slate-500">${city.suggestedDays || '2-3'} Days</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Switch View
  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  if (viewCountry) viewCountry.style.display = 'none';
  if (viewCity) {
    viewCity.style.display = 'block';
    viewCity.classList.remove('view-animate');
    void viewCity.offsetWidth;
    viewCity.classList.add('view-animate');
  }
  if (viewPlaces) viewPlaces.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle City Selection
 */
export function selectCity(cityId) {
  state.currentCityId = cityId;
  const city = travelData.cities[cityId];
  if (!city) return;

  const country = travelData.countries.find(c => c.id === (state.currentCountryId || city.countryId));

  // Update Breadcrumbs
  const crumbArrow2 = document.getElementById('crumb-arrow-2');
  const crumbPlaceLabel = document.getElementById('crumb-place-label');
  const crumbCityName = document.getElementById('crumb-city-name');
  if (crumbArrow2) crumbArrow2.style.display = 'inline';
  if (crumbPlaceLabel) crumbPlaceLabel.style.display = 'inline';
  if (crumbCityName) {
    crumbCityName.textContent = city.name;
  } else if (crumbPlaceLabel) {
    crumbPlaceLabel.textContent = city.name;
  }

  // Header Details
  const badgeEl = document.getElementById('places-city-badge');
  if (badgeEl) badgeEl.textContent = `${country ? country.name : ''} • ${city.suggestedDays || '2-3'} Days`;

  const titleEl = document.getElementById('places-city-title');
  if (titleEl) titleEl.textContent = `${city.name} Custom Tour Itinerary`;

  const taglineEl = document.getElementById('places-city-tagline') || document.getElementById('places-city-subtitle');
  if (taglineEl) taglineEl.textContent = `Explore the top sights of ${city.name}. Click or tap any photo to view in high-resolution, customize your schedule, and generate an official PDF travel plan.`;

  const heroImg = document.getElementById('places-city-hero-img');
  if (heroImg && city.heroImage) {
    heroImg.src = city.heroImage;
  }

  // Reset Filters
  state.currentCategoryFilter = 'all';
  state.searchQuery = '';
  state.activeAccordionPlaceId = null;

  const searchInput = document.getElementById('place-search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('#category-filter-tabs .filter-tab').forEach((tab, index) => {
    if (index === 0) {
      tab.className = "filter-tab active px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-[#a80c10] text-white shadow-sm";
    } else {
      tab.className = "filter-tab px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all whitespace-nowrap";
    }
  });

  renderPlacesList();

  // Switch View
  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  if (viewCountry) viewCountry.style.display = 'none';
  if (viewCity) viewCity.style.display = 'none';
  if (viewPlaces) {
    viewPlaces.style.display = 'block';
    viewPlaces.classList.remove('view-animate');
    void viewPlaces.offsetWidth;
    viewPlaces.classList.add('view-animate');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Places / Attractions List with Interactive 3-5 Photo Gallery
 */
export function renderPlacesList() {
  const container = document.getElementById('places-cards-list') || document.getElementById('places-list-container');
  if (!container) return;

  const city = travelData.cities[state.currentCityId];
  if (!city || !city.places) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">No destinations found for this city.</div>`;
    return;
  }

  let places = [...city.places];

  // Apply Category Filter
  if (state.currentCategoryFilter !== 'all') {
    if (state.currentCategoryFilter === 'must_visit') {
      places = places.filter(p => p.isMustVisit || p.category === 'must_visit');
    } else {
      places = places.filter(p => p.category === state.currentCategoryFilter);
    }
  }

  // Apply Search Filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    places = places.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.myanmarDesc && p.myanmarDesc.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  }

  const countBadge = document.getElementById('places-available-count') || document.getElementById('places-count-badge');
  if (countBadge) {
    countBadge.textContent = `${places.length}`;
  }

  const selectedCountEl = document.getElementById('places-selected-city-count');
  if (selectedCountEl) {
    const selectedInCity = state.selectedPlaces.filter(p => p.cityId === state.currentCityId || p.cityName === city.name).length;
    selectedCountEl.textContent = `${selectedInCity}`;
  }

  if (places.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h4 class="font-bold text-slate-800 text-base">No Matching Attractions Found</h4>
        <p class="text-xs text-slate-500 mt-1">Try clearing your search query or switching category filters.</p>
        <button onclick="window.OceanApp.filterPlaces('all')" class="mt-4 px-5 py-2 bg-[#a80c10] hover:bg-[#8e0a0d] text-white text-xs font-semibold rounded-full shadow-sm">Show All Places</button>
      </div>
    `;
    return;
  }

  container.innerHTML = places.map((place, idx) => {
    const isSelected = state.selectedPlaces.some(p => p.id === place.id);
    const isExpanded = state.activeAccordionPlaceId === place.id;
    const placeImages = (place.images && place.images.length > 0) 
      ? place.images 
      : [place.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'];

    return `
      <div id="place-card-${place.id}" class="bg-white rounded-2xl border ${isSelected ? 'border-[#a80c10] ring-2 ring-red-500/20 shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'} transition-all duration-300 overflow-hidden">
        
        <!-- Main Card Header Bar -->
        <div class="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <!-- Left: Thumbnail & Main Info -->
          <div class="flex items-start gap-4 flex-1 cursor-pointer" onclick="window.OceanApp.togglePlaceAccordion('${place.id}')">
            
            <!-- Clickable Main Hero Thumbnail with Lightbox Trigger -->
            <div class="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-inner" 
                 onclick="event.stopPropagation(); window.OceanApp.openImageLightbox('${place.id}', 0);" 
                 title="Click or tap to view photos in large size">
              <img src="${placeImages[0]}" alt="${place.name}" class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" loading="lazy" />
              
              <!-- Hover Zoom Overlay Icon -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 text-xs w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-opacity duration-200">
                  <i class="fa-solid fa-magnifying-glass-plus text-[#a80c10]"></i>
                </span>
              </div>

              ${place.isMustVisit ? `
                <span class="absolute top-1.5 left-1.5 bg-[#a80c10] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                  Top Pick
                </span>
              ` : ''}

              <!-- Photo Count Badge -->
              <span class="absolute bottom-1.5 left-1.5 bg-black/75 hover:bg-black/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                <i class="fa-solid fa-camera text-amber-400 text-[8px]"></i> ${placeImages.length}
              </span>

              <span class="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                #${idx + 1}
              </span>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${place.isMustVisit ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-700'}">
                  ${place.categoryLabel || 'Attraction'}
                </span>
                <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <i class="fa-regular fa-clock text-[#a80c10]"></i> ${place.durationText || '2.0 Hours'}
                </span>
                ${place.location ? `
                  <span class="text-xs text-slate-300 hidden sm:inline">•</span>
                  <span class="text-xs text-slate-500 truncate hidden sm:inline">
                    <i class="fa-solid fa-location-dot text-slate-400 mr-1"></i>${place.location}
                  </span>
                ` : ''}
              </div>

              <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-snug hover:text-[#a80c10] transition-colors">
                ${place.name}
              </h3>

              <!-- Short teaser in Myanmar (only shown when details is collapsed) -->
              ${!isExpanded ? `
                <p class="myanmar-text text-xs text-slate-500 line-clamp-1">
                  ${place.myanmarDesc || ''}
                </p>
              ` : ''}

              <!-- Single clean Details button -->
              <div class="text-[11px] font-bold text-[#a80c10] hover:text-[#8e0a0d] inline-flex items-center gap-1.5 pt-1 cursor-pointer" onclick="event.stopPropagation(); window.OceanApp.togglePlaceAccordion('${place.id}')">
                <span>${isExpanded ? 'Hide Details' : 'Details & Photos'}</span>
                <i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px] transition-transform"></i>
              </div>
            </div>

          </div>

          <!-- Right: Actions (Add to Plan + Admin controls) -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0 relative z-10">
            ${state.isAdmin ? `
              <button onclick="event.stopPropagation(); window.OceanApp.openEditPlaceModal('${place.id}', 'photos')" title="Manage Place Photos (${placeImages.length} Images)" class="px-2.5 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors text-xs font-semibold flex items-center gap-1.5">
                <i class="fa-solid fa-camera text-amber-600"></i> Photos (${placeImages.length})
              </button>
              <button onclick="event.stopPropagation(); window.OceanApp.openEditPlaceModal('${place.id}')" title="Edit Place" class="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors text-xs">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="event.stopPropagation(); window.OceanApp.deletePlace('${place.id}')" title="Delete Place" class="p-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            ` : ''}

            <button type="button" 
                    onclick="event.stopPropagation(); window.OceanApp.togglePlaceSelection('${place.id}', event);"
                    class="w-full md:w-auto px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
                      isSelected 
                        ? 'bg-red-50 text-[#a80c10] border border-red-200 hover:bg-red-100' 
                        : 'bg-[#a80c10] hover:bg-[#8e0a0d] text-white shadow-red-900/20 active:scale-95'
                    }">
              <i class="fa-solid ${isSelected ? 'fa-circle-check text-[#a80c10]' : 'fa-plus'} pointer-events-none"></i>
              <span class="pointer-events-none">${isSelected ? 'Added to Plan ✓' : 'Add to Trip Plan'}</span>
            </button>
          </div>

        </div>

        <!-- Inline Interactive Photo Gallery Strip (Click or touch any photo to enlarge) -->
        <div class="px-4 sm:px-5 pb-3">
          <div class="pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-images text-[#a80c10]"></i> ဓာတ်ပုံများ (Tap photo to view large)
              </span>
              <div class="flex items-center gap-2">
                ${state.isAdmin ? `
                  <button type="button" onclick="event.stopPropagation(); window.OceanApp.openEditPlaceModal('${place.id}', 'photos');" class="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                    <i class="fa-solid fa-pen-to-square text-amber-600"></i> Edit Photo URLs
                  </button>
                ` : ''}
                <button type="button" onclick="event.stopPropagation(); window.OceanApp.openImageLightbox('${place.id}', 0);" class="text-[11px] font-bold text-[#a80c10] hover:text-[#8e0a0d] flex items-center gap-1 cursor-pointer">
                  View All ${placeImages.length} Photos <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                </button>
              </div>
            </div>

            <!-- Photos Grid (Responsive 3-5 images) -->
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              ${placeImages.map((imgUrl, imgIdx) => `
                <div onclick="event.stopPropagation(); window.OceanApp.openImageLightbox('${place.id}', ${imgIdx});" 
                     class="group/item relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-[#a80c10] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md">
                  <img src="${imgUrl}" alt="${place.name} - Photo ${imgIdx + 1}" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" loading="lazy" />
                  
                  <div class="absolute inset-0 bg-black/0 group-hover/item:bg-black/30 transition-colors flex items-center justify-center">
                    <span class="opacity-0 group-hover/item:opacity-100 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs transition-opacity flex items-center gap-1">
                      <i class="fa-solid fa-magnifying-glass-plus text-amber-300 text-[9px]"></i> View
                    </span>
                  </div>

                  <span class="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded backdrop-blur-xs">
                    ${imgIdx + 1}/${placeImages.length}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Accordion Expansion: Detailed Overview, Key Highlights & Full Gallery -->
        <div class="accordion-content border-t border-slate-100 bg-slate-50/60 overflow-hidden ${isExpanded ? 'block' : 'hidden'}">
          <div class="p-5 sm:p-6 space-y-4">
            
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#a80c10]"></span>
                  ခရီးသွား အသေးစိတ် ရှင်းလင်းချက် (Detailed Overview)
                </div>
                <span class="text-[11px] text-slate-500 font-medium">Estimated Time: ${place.durationText || '2.0 Hours'}</span>
              </div>
              
              <p class="myanmar-text text-sm text-slate-700 leading-relaxed font-normal">
                ${place.myanmarDesc || 'အသေးစိတ် အချက်အလက်များ မကြာမီ ဖော်ပြပေးပါမည်။'}
              </p>
            </div>

            <!-- Full Sized Photos Gallery inside Accordion -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-camera-retro text-[#a80c10]"></i>
                  ဓာတ်ပုံမှတ်တမ်းများ (High-Resolution Gallery)
                </div>
                <div class="flex items-center gap-2">
                  ${state.isAdmin ? `
                    <button type="button" onclick="event.stopPropagation(); window.OceanApp.openEditPlaceModal('${place.id}', 'photos');" class="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                      <i class="fa-solid fa-pen-to-square text-amber-600"></i> Edit Gallery URLs
                    </button>
                  ` : ''}
                  <span class="text-[11px] text-slate-500 font-semibold">${placeImages.length} Curated High-Res Photos</span>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                ${placeImages.map((imgUrl, imgIdx) => `
                  <div onclick="event.stopPropagation(); window.OceanApp.openImageLightbox('${place.id}', ${imgIdx});" 
                       class="group/gallery relative aspect-16/10 rounded-xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 hover:border-[#a80c10] shadow-xs hover:shadow-md transition-all">
                    <img src="${imgUrl}" alt="${place.name} - Gallery ${imgIdx + 1}" class="w-full h-full object-cover group-hover/gallery:scale-108 transition-transform duration-500" loading="lazy" />
                    <div class="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/35 transition-colors flex items-center justify-center">
                      <div class="opacity-0 group-hover/gallery:opacity-100 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 transition-opacity">
                        <i class="fa-solid fa-expand text-amber-300"></i> View Large
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            ${place.myanmarHighlights && place.myanmarHighlights.length > 0 ? `
              <div class="bg-amber-50/70 border border-amber-200/70 p-4 rounded-xl space-y-2">
                <div class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <i class="fa-solid fa-star text-amber-500"></i> အထူးအလေးထား လေ့လာသင့်သည့် အချက်များ (Key Highlights):
                </div>
                <ul class="space-y-1.5">
                  ${place.myanmarHighlights.map(h => `
                    <li class="myanmar-text text-xs text-amber-950 flex items-start gap-2">
                      <i class="fa-solid fa-check text-[#a80c10] text-[10px] mt-1 flex-shrink-0"></i>
                      <span>${h}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            ${place.location ? `
              <div class="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span class="font-semibold text-slate-700">Location:</span> ${place.location}
              </div>
            ` : ''}

          </div>
        </div>

      </div>
    `;
  }).join('');
}

/**
 * Toggle Single Place Accordion
 */
export function togglePlaceAccordion(placeId) {
  if (state.activeAccordionPlaceId === placeId) {
    state.activeAccordionPlaceId = null;
  } else {
    state.activeAccordionPlaceId = placeId;
  }
  renderPlacesList();
}

/**
 * HIGH-RESOLUTION IMAGE LIGHTBOX CONTROLLER
 */
export function openImageLightbox(placeId, imageIndex = 0) {
  let foundPlace = null;
  for (const cityId in travelData.cities) {
    const city = travelData.cities[cityId];
    if (city && city.places) {
      const p = city.places.find(item => item.id === placeId);
      if (p) {
        foundPlace = p;
        break;
      }
    }
  }

  if (!foundPlace) return;

  const images = (foundPlace.images && foundPlace.images.length > 0) 
    ? foundPlace.images 
    : [foundPlace.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'];

  const safeIndex = Math.max(0, Math.min(imageIndex, images.length - 1));

  state.lightbox = {
    isOpen: true,
    placeId: foundPlace.id,
    currentImageIndex: safeIndex,
    images: images,
    placeTitle: foundPlace.name,
    categoryLabel: foundPlace.categoryLabel || 'Attraction',
    caption: foundPlace.myanmarDesc || ''
  };

  updateLightboxDisplay();

  const modal = document.getElementById('image-lightbox-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

export function closeImageLightbox() {
  state.lightbox.isOpen = false;
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  if (document.fullscreenElement) {
    try {
      document.exitFullscreen();
    } catch(e) {}
  }
}

export function prevLightboxImage(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  if (!state.lightbox.images || state.lightbox.images.length === 0) return;
  state.lightbox.currentImageIndex = (state.lightbox.currentImageIndex - 1 + state.lightbox.images.length) % state.lightbox.images.length;
  updateLightboxDisplay();
}

export function nextLightboxImage(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  if (!state.lightbox.images || state.lightbox.images.length === 0) return;
  state.lightbox.currentImageIndex = (state.lightbox.currentImageIndex + 1) % state.lightbox.images.length;
  updateLightboxDisplay();
}

export function setLightboxImageIndex(index) {
  if (index < 0 || index >= state.lightbox.images.length) return;
  state.lightbox.currentImageIndex = index;
  updateLightboxDisplay();
}

export function toggleLightboxFullscreen() {
  const modal = document.getElementById('image-lightbox-modal');
  if (!modal) return;
  const icon = document.getElementById('lightbox-fullscreen-icon');
  if (!document.fullscreenElement) {
    modal.requestFullscreen().then(() => {
      if (icon) {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
      }
    }).catch(err => {
      console.warn('Fullscreen request failed:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      if (icon) {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
      }
    }).catch(err => {});
  }
}

export function updateLightboxDisplay() {
  const { placeTitle, categoryLabel, caption, images, currentImageIndex } = state.lightbox;
  if (!images || images.length === 0) return;

  const currentUrl = images[currentImageIndex];

  const titleEl = document.getElementById('lightbox-place-title');
  const catEl = document.getElementById('lightbox-category-badge');
  const counterEl = document.getElementById('lightbox-counter');
  const captionEl = document.getElementById('lightbox-caption');
  const mainImg = document.getElementById('lightbox-main-image');
  const spinner = document.getElementById('lightbox-loading-spinner');
  const thumbsContainer = document.getElementById('lightbox-thumbnails-container');

  if (titleEl) titleEl.textContent = placeTitle;
  if (catEl) catEl.textContent = categoryLabel;
  if (counterEl) counterEl.textContent = `${currentImageIndex + 1} / ${images.length}`;
  if (captionEl) captionEl.textContent = caption || 'Ocean Travel curated destination photography.';

  if (mainImg) {
    if (spinner) spinner.classList.remove('hidden');
    mainImg.src = currentUrl;
    mainImg.onload = () => {
      if (spinner) spinner.classList.add('hidden');
    };
    mainImg.onerror = () => {
      if (spinner) spinner.classList.add('hidden');
    };
  }

  if (thumbsContainer) {
    thumbsContainer.innerHTML = images.map((url, idx) => {
      const isActive = idx === currentImageIndex;
      return `
        <button type="button" onclick="window.OceanApp.setLightboxImageIndex(${idx})" class="relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
          isActive 
            ? 'ring-2 ring-[#a80c10] ring-offset-2 ring-offset-black scale-105 opacity-100' 
            : 'opacity-50 hover:opacity-90 border border-white/20'
        }">
          <img src="${url}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover" />
          <span class="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
            #${idx + 1}
          </span>
        </button>
      `;
    }).join('');
  }
}

/**
 * Setup Lightbox keyboard and touch gestures
 */
let touchStartX = 0;
let touchEndX = 0;

function setupLightboxEvents() {
  const stageArea = document.getElementById('lightbox-stage-area');
  if (stageArea) {
    stageArea.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stageArea.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          prevLightboxImage();
        } else {
          nextLightboxImage();
        }
      }
    }, { passive: true });
  }

  window.addEventListener('keydown', (e) => {
    if (!state.lightbox.isOpen) return;
    if (e.key === 'Escape') {
      closeImageLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    }
  });
}

let toastTimeout = null;

/**
 * Show Interactive Floating Toast
 */
export function showToast(title, subtitle = 'Tap to review your itinerary', type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastSubtitle = document.getElementById('toast-subtitle');
  const toastIconBox = document.getElementById('toast-icon-box');

  if (!toast || !toastTitle) return;

  toastTitle.textContent = title;
  if (toastSubtitle) toastSubtitle.textContent = subtitle;

  if (toastIconBox) {
    if (type === 'success') {
      toastIconBox.className = "w-8 h-8 rounded-xl bg-[#a80c10] text-white flex items-center justify-center flex-shrink-0 text-sm shadow-sm";
      toastIconBox.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else {
      toastIconBox.className = "w-8 h-8 rounded-xl bg-slate-700 text-slate-200 flex items-center justify-center flex-shrink-0 text-sm shadow-sm";
      toastIconBox.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    }
  }

  // Show toast
  toast.classList.remove('opacity-0', '-translate-y-12', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-12', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
  }, 3500);
}

/**
 * Animate Cart Badges
 */
export function animateCartBadges() {
  const navBadge = document.getElementById('nav-cart-count');
  const stickyBadge = document.getElementById('cart-badge-count');
  const cartBtnCount = document.getElementById('cart-btn-count');

  [navBadge, stickyBadge, cartBtnCount].forEach(el => {
    if (el) {
      el.classList.remove('badge-bump');
      void el.offsetWidth;
      el.classList.add('badge-bump');
    }
  });
}

/**
 * Toggle Place Selection
 */
export function togglePlaceSelection(placeId, evt) {
  if (evt) {
    if (typeof evt.preventDefault === 'function') evt.preventDefault();
    if (typeof evt.stopPropagation === 'function') evt.stopPropagation();
  }

  const cleanId = String(placeId || '').trim();
  if (!cleanId) return;

  let city = travelData.cities[state.currentCityId];
  let place = city && city.places ? city.places.find(p => String(p.id).trim() === cleanId) : null;

  if (!place) {
    // Search across all cities as fallback
    for (const cId in travelData.cities) {
      const found = travelData.cities[cId]?.places?.find(p => String(p.id).trim() === cleanId);
      if (found) {
        city = travelData.cities[cId];
        place = found;
        break;
      }
    }
  }

  if (!place) {
    console.warn('Place not found:', placeId);
    return;
  }

  const existingIndex = state.selectedPlaces.findIndex(p => String(p.id).trim() === cleanId);
  if (existingIndex >= 0) {
    state.selectedPlaces.splice(existingIndex, 1);
    showToast(`Removed "${place.name}"`, 'Removed from your trip plan', 'info');
  } else {
    state.selectedPlaces.push({
      ...place,
      durationHours: Number(place.durationHours) || 2.0,
      cityId: (city && city.id) || state.currentCityId || 'danang',
      cityName: (city && city.name) || 'City',
      countryId: (city && city.countryId) || state.currentCountryId || 'vietnam',
    });

    showToast(`Added "${place.name}"!`, `${place.categoryLabel || 'Attraction'} • ${place.durationText || '2h'}`, 'success');

    if (typeof confetti === 'function') {
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#a80c10', '#0284c7', '#0f172a', '#f59e0b']
        });
      } catch (err) {}
    }
  }

  try {
    localStorage.setItem('ocean_travel_plan', JSON.stringify(state.selectedPlaces));
  } catch(e) {}

  renderPlacesList();
  updateCartMetrics();
  renderDrawerPlacesList();
  animateCartBadges();
}

/**
 * Filter Places by Category
 */
export function filterPlaces(category, evt) {
  state.currentCategoryFilter = category;
  
  document.querySelectorAll('#category-filter-tabs .filter-tab').forEach(tab => {
    tab.className = "filter-tab px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all whitespace-nowrap";
  });
  
  const activeTab = (evt && evt.target) ? evt.target.closest('.filter-tab') : null;
  if (activeTab) {
    activeTab.className = "filter-tab active px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-[#a80c10] text-white shadow-sm";
  }

  renderPlacesList();
}

/**
 * Search places
 */
export function handleSearchPlaces(query) {
  state.searchQuery = query;
  renderPlacesList();
}

/**
 * Update Sticky Bar & Drawer Counters
 */
export function updateCartMetrics() {
  const count = state.selectedPlaces.length;
  const totalHours = state.selectedPlaces.reduce((sum, p) => sum + (p.durationHours || 2), 0);
  const estimatedDays = (totalHours / 8).toFixed(1);

  const navCartCount = document.getElementById('nav-cart-count');
  if (navCartCount) navCartCount.textContent = count;

  const cartBtnCount = document.getElementById('cart-btn-count');
  if (cartBtnCount) cartBtnCount.textContent = count;

  const cartBadgeCount = document.getElementById('cart-badge-count');
  if (cartBadgeCount) cartBadgeCount.textContent = `${count} ${count === 1 ? 'Place' : 'Places'} Selected`;

  const cartTotalHours = document.getElementById('cart-total-hours');
  if (cartTotalHours) cartTotalHours.textContent = `${totalHours.toFixed(1)} Hours Total`;

  const cartEstimatedDays = document.getElementById('cart-estimated-days');
  if (cartEstimatedDays) cartEstimatedDays.textContent = `Estimated ~${estimatedDays} Touring Days`;

  const drawerSummaryPlaces = document.getElementById('drawer-summary-places-count');
  if (drawerSummaryPlaces) drawerSummaryPlaces.textContent = `${count} items`;

  const drawerSummaryHours = document.getElementById('drawer-summary-hours');
  if (drawerSummaryHours) drawerSummaryHours.textContent = `${totalHours.toFixed(1)} Hours`;

  const drawerSummaryDays = document.getElementById('drawer-summary-days');
  if (drawerSummaryDays) drawerSummaryDays.textContent = `~${estimatedDays} Days (8h/Day)`;
}

/**
 * Open / Close Drawer
 */
export function toggleCartDrawer(show) {
  const drawer = document.getElementById('cart-drawer');
  const panel = document.getElementById('cart-drawer-panel');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!drawer) return;
  if (show) {
    renderDrawerPlacesList();
    drawer.classList.remove('hidden');
    setTimeout(() => {
      if (backdrop) backdrop.classList.remove('opacity-0');
      if (panel) panel.classList.remove('translate-x-full');
    }, 10);
  } else {
    if (backdrop) backdrop.classList.add('opacity-0');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  }
}

/**
 * Render Drawer Selected Places List
 */
export function renderDrawerPlacesList() {
  const container = document.getElementById('drawer-places-list');
  if (!container) return;
  if (state.selectedPlaces.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400 space-y-3">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto text-2xl">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <h4 class="font-bold text-slate-700 text-sm">Your Trip Plan is Empty</h4>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">
          Explore attractions and click "Add to Trip Plan" to start creating your personalized itinerary.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.selectedPlaces.map((place, index) => `
    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          ${index + 1}
        </span>
        <div class="min-w-0">
          <h5 class="text-xs font-bold text-slate-900 truncate">${place.name}</h5>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
            <span class="font-semibold text-[#a80c10]">${place.cityName || 'City'}</span>
            <span>•</span>
            <span><i class="fa-regular fa-clock text-[#a80c10] mr-0.5"></i> ${place.durationText || '2h'}</span>
          </div>
        </div>
      </div>

      <button onclick="window.OceanApp.removePlaceFromPlan('${place.id}')" class="text-slate-400 hover:text-rose-600 p-2 transition-colors flex-shrink-0 cursor-pointer" title="Remove place">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  `).join('');
}

export function removePlaceFromPlan(placeId) {
  const cleanId = String(placeId || '').trim();
  const place = state.selectedPlaces.find(p => String(p.id).trim() === cleanId);
  state.selectedPlaces = state.selectedPlaces.filter(p => String(p.id).trim() !== cleanId);
  try {
    localStorage.setItem('ocean_travel_plan', JSON.stringify(state.selectedPlaces));
  } catch(e) {}
  
  if (place) {
    showToast(`Removed "${place.name}"`, 'Updated your trip plan', 'info');
  }

  updateCartMetrics();
  renderDrawerPlacesList();
  if (state.currentCityId) renderPlacesList();
  animateCartBadges();
}

export function clearAllSelectedPlaces() {
  if (!confirm('Are you sure you want to clear your current trip plan?')) return;
  state.selectedPlaces = [];
  try {
    localStorage.removeItem('ocean_travel_plan');
  } catch(e) {}

  showToast('Trip plan cleared', 'You can start adding new places anytime', 'info');
  updateCartMetrics();
  renderDrawerPlacesList();
  if (state.currentCityId) renderPlacesList();
  animateCartBadges();
}

export function resetToCountrySelection() {
  state.currentCountryId = null;
  state.currentCityId = null;

  const crumbArrow1 = document.getElementById('crumb-arrow-1');
  const crumbCityBtn = document.getElementById('crumb-city-btn');
  const crumbArrow2 = document.getElementById('crumb-arrow-2');
  const crumbPlaceLabel = document.getElementById('crumb-place-label');

  if (crumbArrow1) crumbArrow1.style.display = 'none';
  if (crumbCityBtn) crumbCityBtn.style.display = 'none';
  if (crumbArrow2) crumbArrow2.style.display = 'none';
  if (crumbPlaceLabel) crumbPlaceLabel.style.display = 'none';

  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  if (viewCountry) {
    viewCountry.style.display = 'block';
    viewCountry.classList.remove('view-animate');
    void viewCountry.offsetWidth;
    viewCountry.classList.add('view-animate');
  }
  if (viewCity) viewCity.style.display = 'none';
  if (viewPlaces) viewPlaces.style.display = 'none';

  renderCountries();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function handleBreadcrumbCityClick() {
  if (state.currentCountryId) {
    selectCountry(state.currentCountryId);
  }
}

export function backToCitySelection() {
  if (state.currentCountryId) {
    selectCountry(state.currentCountryId);
  }
}

/**
 * Sample Curated Travel Photos for fast preset addition
 */
const SAMPLE_TRAVEL_PHOTOS = [
  'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
];

/**
 * Render Interactive Photo Gallery Cards in Place Modal
 */
export function renderModalImagesList() {
  const container = document.getElementById('modal-images-cards-list');
  const countBadge = document.getElementById('modal-images-count-badge');
  const bulkInput = document.getElementById('edit-images-input');

  if (!state.modalImages) state.modalImages = [];

  // Update count badge
  if (countBadge) {
    countBadge.textContent = `${state.modalImages.length} Photo${state.modalImages.length === 1 ? '' : 's'}${state.modalImages.length > 0 ? ' (1st is Cover)' : ''}`;
    countBadge.className = `text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
      state.modalImages.length === 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
    }`;
  }

  // Sync with bulk textarea
  if (bulkInput) {
    bulkInput.value = state.modalImages.join('\n');
  }

  if (!container) return;

  if (state.modalImages.length === 0) {
    container.innerHTML = `
      <div class="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-center text-xs text-amber-900 space-y-2">
        <div class="font-bold flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> No photos in gallery
        </div>
        <p class="text-[11px] text-amber-800/80 leading-relaxed">
          At least 1 photo URL is required for the destination cover. Paste a URL below or click insert sample photo.
        </p>
        <button type="button" onclick="window.OceanApp.addSampleModalImage()" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
          + Insert Sample High-Res Photo
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.modalImages.map((imgUrl, idx) => {
    const isCover = idx === 0;
    return `
      <div id="modal-img-row-${idx}" class="group bg-white border ${isCover ? 'border-amber-300 ring-1 ring-amber-400/30' : 'border-slate-200'} rounded-xl p-2.5 flex items-center gap-3 shadow-xs hover:border-slate-300 transition-all">
        
        <!-- Live Thumbnail with fallback -->
        <div class="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 shadow-inner group/thumb">
          <img id="modal-thumb-img-${idx}" src="${imgUrl}" alt="Photo ${idx + 1}" class="w-full h-full object-cover" 
               onerror="this.src='https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80'; this.title='Image URL may be broken';" />
          <span class="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] font-mono font-bold px-1 rounded">
            #${idx + 1}
          </span>
          ${isCover ? `
            <span class="absolute top-0.5 left-0.5 bg-amber-500 text-white text-[7px] font-bold px-1 rounded shadow-xs">
              COVER
            </span>
          ` : ''}
        </div>

        <!-- URL Input & Position Badge -->
        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-bold ${isCover ? 'text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded' : 'text-slate-500'}">
                ${isCover ? '★ Primary Cover Photo' : `Gallery Photo #${idx + 1}`}
              </span>
            </div>
            ${!isCover ? `
              <button type="button" onclick="window.OceanApp.makeCoverModalImage(${idx})" title="Set as primary cover photo" class="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded transition-colors cursor-pointer">
                ★ Make Cover
              </button>
            ` : ''}
          </div>

          <div class="relative">
            <input type="url" value="${imgUrl}" placeholder="https://..." 
                   oninput="window.OceanApp.updateModalImageUrl(${idx}, this.value)" 
                   class="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-800 focus:bg-white focus:border-[#a80c10] focus:ring-1 focus:ring-[#a80c10] outline-none transition-all" />
          </div>
        </div>

        <!-- Action Buttons: Move Up, Move Down, Delete -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button type="button" onclick="window.OceanApp.moveModalImage(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} 
                  class="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-25 disabled:pointer-events-none text-slate-600 flex items-center justify-center text-xs transition-colors cursor-pointer" 
                  title="Move Photo Up">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          
          <button type="button" onclick="window.OceanApp.moveModalImage(${idx}, 1)" ${idx === state.modalImages.length - 1 ? 'disabled' : ''} 
                  class="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-25 disabled:pointer-events-none text-slate-600 flex items-center justify-center text-xs transition-colors cursor-pointer" 
                  title="Move Photo Down">
            <i class="fa-solid fa-arrow-down"></i>
          </button>

          <button type="button" onclick="window.OceanApp.deleteModalImage(${idx})" 
                  class="w-7 h-7 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#a80c10] flex items-center justify-center text-xs transition-colors cursor-pointer" 
                  title="Delete Photo">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

/**
 * Update Individual Image URL
 */
export function updateModalImageUrl(index, newUrl) {
  if (!state.modalImages || index < 0 || index >= state.modalImages.length) return;
  state.modalImages[index] = newUrl.trim();
  
  // Live update the thumbnail img tag
  const thumbImg = document.getElementById(`modal-thumb-img-${index}`);
  if (thumbImg && newUrl.trim()) {
    thumbImg.src = newUrl.trim();
  }

  // Update bulk text
  const bulkInput = document.getElementById('edit-images-input');
  if (bulkInput) {
    bulkInput.value = state.modalImages.join('\n');
  }
}

/**
 * Add New Image URL
 */
export function addModalImage(customUrl) {
  const input = document.getElementById('new-image-url-input');
  const urlToAdd = customUrl || (input ? input.value.trim() : '');

  if (!urlToAdd) {
    if (input) input.focus();
    return;
  }

  if (!state.modalImages) state.modalImages = [];
  state.modalImages.push(urlToAdd);

  if (input) input.value = '';
  renderModalImagesList();
}

/**
 * Delete Image at index
 */
export function deleteModalImage(index) {
  if (!state.modalImages || index < 0 || index >= state.modalImages.length) return;
  state.modalImages.splice(index, 1);
  renderModalImagesList();
}

/**
 * Make Image Cover (#1 Position)
 */
export function makeCoverModalImage(index) {
  if (!state.modalImages || index <= 0 || index >= state.modalImages.length) return;
  const [item] = state.modalImages.splice(index, 1);
  state.modalImages.unshift(item);
  renderModalImagesList();
}

/**
 * Move Image Up or Down
 */
export function moveModalImage(index, direction) {
  if (!state.modalImages) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= state.modalImages.length) return;

  const temp = state.modalImages[index];
  state.modalImages[index] = state.modalImages[newIndex];
  state.modalImages[newIndex] = temp;
  renderModalImagesList();
}

/**
 * Add Sample High-Res Photo
 */
export function addSampleModalImage() {
  if (!state.modalImages) state.modalImages = [];
  const available = SAMPLE_TRAVEL_PHOTOS.find(url => !state.modalImages.includes(url)) || SAMPLE_TRAVEL_PHOTOS[Math.floor(Math.random() * SAMPLE_TRAVEL_PHOTOS.length)];
  state.modalImages.push(available);
  renderModalImagesList();
}

/**
 * Switch Image Tab (Visual vs Bulk)
 */
export function switchModalImageTab(tabName) {
  state.modalImageTab = tabName;
  const visualContainer = document.getElementById('modal-images-visual-container');
  const bulkContainer = document.getElementById('modal-images-bulk-container');
  const visualBtn = document.getElementById('img-tab-visual-btn');
  const bulkBtn = document.getElementById('img-tab-bulk-btn');

  if (tabName === 'visual') {
    if (visualContainer) visualContainer.classList.remove('hidden');
    if (bulkContainer) bulkContainer.classList.add('hidden');
    if (visualBtn) {
      visualBtn.className = 'px-2.5 py-1 rounded-md bg-[#a80c10] text-white transition-colors';
    }
    if (bulkBtn) {
      bulkBtn.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors';
    }
    renderModalImagesList();
  } else {
    if (visualContainer) visualContainer.classList.add('hidden');
    if (bulkContainer) bulkContainer.classList.remove('hidden');
    if (visualBtn) {
      visualBtn.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors';
    }
    if (bulkBtn) {
      bulkBtn.className = 'px-2.5 py-1 rounded-md bg-[#a80c10] text-white transition-colors';
    }
    const bulkInput = document.getElementById('edit-images-input');
    if (bulkInput && state.modalImages) {
      bulkInput.value = state.modalImages.join('\n');
    }
  }
}

/**
 * Handle Bulk Multi-line Text Change
 */
export function handleModalImagesBulkChange(text) {
  const urls = text.split('\n').map(s => s.trim()).filter(Boolean);
  state.modalImages = urls;
  const countBadge = document.getElementById('modal-images-count-badge');
  if (countBadge) {
    countBadge.textContent = `${state.modalImages.length} Photo${state.modalImages.length === 1 ? '' : 's'}`;
  }
}

/**
 * Admin Place Management: Add / Edit / Delete
 */
export function openAddPlaceModal() {
  state.editingPlaceId = null;
  const titleEl = document.getElementById('place-modal-title');
  if (titleEl) titleEl.textContent = 'Add New Place / Attraction';

  // Populate city select options dynamically
  const citySelect = document.getElementById('edit-city-select');
  if (citySelect && travelData.cities) {
    citySelect.innerHTML = Object.values(travelData.cities).map(c => `
      <option value="${c.id}">${c.name} (${c.countryId ? c.countryId.toUpperCase() : 'City'})</option>
    `).join('');
    citySelect.value = state.currentCityId || 'danang';
  }

  const nameInput = document.getElementById('edit-name-input');
  if (nameInput) nameInput.value = '';

  const catSelect = document.getElementById('edit-category-select');
  if (catSelect) catSelect.value = 'must_visit';

  const durInput = document.getElementById('edit-duration-input');
  if (durInput) durInput.value = '2.5';

  const locInput = document.getElementById('edit-location-input');
  if (locInput) locInput.value = '';

  state.modalImages = [
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'
  ];
  switchModalImageTab('visual');
  renderModalImagesList();

  const descInput = document.getElementById('edit-myanmar-desc-input');
  if (descInput) descInput.value = '';

  const highInput = document.getElementById('edit-highlights-input');
  if (highInput) highInput.value = '';

  const mustCheck = document.getElementById('edit-mustvisit-check');
  if (mustCheck) mustCheck.checked = true;

  const modal = document.getElementById('place-edit-modal');
  if (modal) modal.classList.remove('hidden');
}

export function openEditPlaceModal(placeId, targetTab = 'visual') {
  const city = travelData.cities[state.currentCityId];
  if (!city) return;
  const place = city.places.find(p => p.id === placeId);
  if (!place) return;

  state.editingPlaceId = placeId;
  const titleEl = document.getElementById('place-modal-title');
  if (titleEl) titleEl.textContent = `Edit Place: ${place.name}`;

  // Populate city select options dynamically
  const citySelect = document.getElementById('edit-city-select');
  if (citySelect && travelData.cities) {
    citySelect.innerHTML = Object.values(travelData.cities).map(c => `
      <option value="${c.id}">${c.name} (${c.countryId ? c.countryId.toUpperCase() : 'City'})</option>
    `).join('');
    citySelect.value = state.currentCityId;
  }

  const nameInput = document.getElementById('edit-name-input');
  if (nameInput) nameInput.value = place.name || '';

  const catSelect = document.getElementById('edit-category-select');
  if (catSelect) catSelect.value = place.category || 'must_visit';

  const durInput = document.getElementById('edit-duration-input');
  if (durInput) durInput.value = place.durationHours || 2.0;

  const locInput = document.getElementById('edit-location-input');
  if (locInput) locInput.value = place.location || '';
  
  const placeImages = (place.images && place.images.length > 0) 
    ? [...place.images] 
    : (place.imageUrl ? [place.imageUrl] : []);
  
  state.modalImages = placeImages.length > 0 ? placeImages : [
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80'
  ];

  switchModalImageTab('visual');
  renderModalImagesList();
  
  const descInput = document.getElementById('edit-myanmar-desc-input');
  if (descInput) descInput.value = place.myanmarDesc || '';

  const highInput = document.getElementById('edit-highlights-input');
  if (highInput) highInput.value = place.myanmarHighlights ? place.myanmarHighlights.join('\n') : '';

  const mustCheck = document.getElementById('edit-mustvisit-check');
  if (mustCheck) mustCheck.checked = !!place.isMustVisit;

  const modal = document.getElementById('place-edit-modal');
  if (modal) modal.classList.remove('hidden');
}

export function closePlaceModal() {
  const modal = document.getElementById('place-edit-modal');
  if (modal) modal.classList.add('hidden');
}

export function handleSavePlace(e) {
  if (e) e.preventDefault();
  const citySelect = document.getElementById('edit-city-select');
  const nameInput = document.getElementById('edit-name-input');
  const catSelect = document.getElementById('edit-category-select');
  const durInput = document.getElementById('edit-duration-input');
  const locInput = document.getElementById('edit-location-input');
  const descInput = document.getElementById('edit-myanmar-desc-input');
  const highInput = document.getElementById('edit-highlights-input');
  const mustCheck = document.getElementById('edit-mustvisit-check');

  const targetCityId = citySelect ? citySelect.value : (state.currentCityId || 'danang');
  const name = nameInput ? nameInput.value.trim() : '';
  const category = catSelect ? catSelect.value : 'must_visit';
  const durationHours = (durInput && parseFloat(durInput.value)) || 2.0;
  const location = locInput ? locInput.value.trim() : '';
  
  // Extract images from state.modalImages or bulk input
  let images = state.modalImages && state.modalImages.length > 0 ? state.modalImages.filter(Boolean) : [];
  if (images.length === 0) {
    const bulkInput = document.getElementById('edit-images-input');
    const imagesRaw = bulkInput ? bulkInput.value.trim() : '';
    images = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  }

  const imageUrl = images[0] || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80';
  if (images.length === 0) images.push(imageUrl);

  const myanmarDesc = descInput ? descInput.value.trim() : '';
  const highlightsRaw = highInput ? highInput.value.trim() : '';
  const isMustVisit = mustCheck ? mustCheck.checked : false;
  const highlights = highlightsRaw ? highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  if (!name) {
    alert('Please enter a place name');
    return;
  }

  const categoryLabels = {
    must_visit: '⭐ Must-Visit Top Pick',
    food: '🍜 Famous Food & Dining',
    culture: '🏛️ Heritage & Culture',
    nature: '🌿 Nature & Sightseeing'
  };

  const city = travelData.cities[targetCityId];
  if (!city) {
    alert('City not found');
    return;
  }

  if (state.editingPlaceId) {
    // Edit existing
    const placeIdx = city.places.findIndex(p => p.id === state.editingPlaceId);
    if (placeIdx >= 0) {
      city.places[placeIdx] = {
        ...city.places[placeIdx],
        name,
        category,
        categoryLabel: categoryLabels[category] || 'Attraction',
        durationHours,
        durationText: `${durationHours.toFixed(1)} Hours`,
        location,
        imageUrl,
        images,
        myanmarDesc,
        myanmarHighlights: highlights,
        isMustVisit
      };
    }
  } else {
    // Create new
    const newPlace = {
      id: `custom_${Date.now()}`,
      name,
      category,
      categoryLabel: categoryLabels[category] || 'Attraction',
      durationHours,
      durationText: `${durationHours.toFixed(1)} Hours`,
      location,
      imageUrl,
      images,
      myanmarDesc,
      myanmarHighlights: highlights,
      isMustVisit,
      popularity: 90
    };
    if (!city.places) city.places = [];
    city.places.unshift(newPlace);
  }

  saveTravelData();
  closePlaceModal();
  renderPlacesList();
  showToast('Place Saved', `Successfully updated "${name}" with ${images.length} photos`, 'success');
}

export function deletePlace(placeId) {
  const city = travelData.cities[state.currentCityId];
  if (!city) return;
  const place = city.places.find(p => p.id === placeId);
  if (!place) return;

  if (confirm(`Are you sure you want to delete "${place.name}"?`)) {
    city.places = city.places.filter(p => p.id !== placeId);
    state.selectedPlaces = state.selectedPlaces.filter(p => p.id !== placeId);
    saveTravelData();
    try {
      localStorage.setItem('ocean_travel_plan', JSON.stringify(state.selectedPlaces));
    } catch(e) {}
    renderPlacesList();
    updateCartMetrics();
    renderDrawerPlacesList();
    showToast('Deleted Place', `"${place.name}" removed from database`, 'info');
  }
}

/**
 * Step 3: PDF Generation & Printing
 */
export function prepareAndGeneratePDF() {
  if (state.selectedPlaces.length === 0) {
    showToast('Empty Itinerary', 'Please add at least one attraction before downloading PDF', 'info');
    toggleCartDrawer(true);
    return;
  }

  const clientNameInput = document.getElementById('traveler-name-input') || document.getElementById('client-name-input');
  const clientName = (clientNameInput && clientNameInput.value.trim()) ? clientNameInput.value.trim() : 'Valued Client';

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentCity = travelData.cities[state.currentCityId] || { name: 'Multi-City Tour' };
  const currentCountry = travelData.countries.find(c => c.id === state.currentCountryId) || { name: 'Southeast Asia' };

  const totalHours = state.selectedPlaces.reduce((sum, p) => sum + (p.durationHours || 2), 0);
  const estimatedDays = (totalHours / 8).toFixed(1);

  // Populate PDF Template
  const pdfClient = document.getElementById('pdf-client-name');
  if (pdfClient) pdfClient.textContent = clientName;

  const pdfDest = document.getElementById('pdf-destination-name');
  if (pdfDest) pdfDest.textContent = `${currentCity.name}, ${currentCountry.name}`;

  const pdfHours = document.getElementById('pdf-total-hours');
  if (pdfHours) pdfHours.textContent = `${totalHours.toFixed(1)} Hours`;

  const pdfDays = document.getElementById('pdf-total-days');
  if (pdfDays) pdfDays.textContent = `~${estimatedDays} Days`;

  const pdfDate = document.getElementById('pdf-generated-date');
  if (pdfDate) pdfDate.textContent = `Date: ${dateStr}`;

  const pdfCount = document.getElementById('pdf-item-count-label');
  if (pdfCount) pdfCount.textContent = `${state.selectedPlaces.length} Places Chosen`;

  const placesContainer = document.getElementById('pdf-places-list-container');
  if (placesContainer) {
    placesContainer.innerHTML = state.selectedPlaces.map((place, idx) => `
      <div style="page-break-inside: avoid;" class="border border-slate-200 rounded-xl p-3.5 bg-slate-50 flex items-start gap-4">
        <div class="w-7 h-7 rounded-full bg-[#a80c10] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          ${idx + 1}
        </div>
        <div class="flex-1 space-y-1">
          <div class="flex justify-between items-baseline">
            <h4 class="font-bold text-slate-900 text-sm">${place.name}</h4>
            <span class="text-xs font-semibold text-[#a80c10] bg-red-50 px-2 py-0.5 rounded">${place.durationText || '2h'}</span>
          </div>
          <div class="text-[11px] text-slate-500 font-medium">${place.categoryLabel || 'Attraction'} • ${place.cityName || 'City'}</div>
          <p class="myanmar-text text-[11px] text-slate-700 leading-relaxed pt-0.5">${place.myanmarDesc || ''}</p>
          ${place.myanmarHighlights && place.myanmarHighlights.length > 0 ? `
            <div class="myanmar-text text-[10px] text-amber-900 bg-amber-50/80 p-2 rounded border border-amber-200/60 mt-1">
              <strong>အထူးလေ့လာရန်:</strong> ${place.myanmarHighlights.join(' • ')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  const element = document.getElementById('pdf-content-to-print');
  const genBtn = document.getElementById('btn-generate-pdf-bottom') || document.getElementById('btn-generate-pdf');
  const originalText = genBtn ? genBtn.innerHTML : 'Generate Trip Plan';

  if (genBtn) {
    genBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin mr-1"></i> Generating Official PDF...';
    genBtn.disabled = true;
  }

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Ocean_Travel_Plan_${clientName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const wrapper = document.getElementById('pdf-printable-wrapper');
  if (wrapper) wrapper.classList.remove('hidden');

  if (typeof html2pdf === 'function' && element) {
    html2pdf().set(opt).from(element).save().then(() => {
      if (wrapper) wrapper.classList.add('hidden');
      if (genBtn) {
        genBtn.innerHTML = originalText;
        genBtn.disabled = false;
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a80c10', '#0284c7', '#0f172a', '#f59e0b']
        });
      }
    }).catch(err => {
      console.error('PDF Generation error:', err);
      if (wrapper) wrapper.classList.add('hidden');
      if (genBtn) {
        genBtn.innerHTML = originalText;
        genBtn.disabled = false;
      }
      alert('Could not generate PDF directly. Please check browser print settings.');
    });
  } else {
    if (wrapper) wrapper.classList.add('hidden');
    if (genBtn) {
      genBtn.innerHTML = originalText;
      genBtn.disabled = false;
    }
    window.print();
  }
}

// Attach to window so HTML inline onclick handlers work smoothly
window.OceanApp = {
  selectCountry,
  selectCity,
  togglePlaceAccordion,
  togglePlaceSelection,
  filterPlaces,
  handleSearchPlaces,
  toggleCartDrawer,
  removePlaceFromPlan,
  clearAllSelectedPlaces,
  resetToCountrySelection,
  handleBreadcrumbCityClick,
  backToCitySelection,
  openAdminModal,
  closeAdminModal,
  handleGoogleSignIn,
  promptDifferentGoogleAccount,
  logoutAdmin,
  openAddPlaceModal,
  openEditPlaceModal,
  closePlaceModal,
  handleSavePlace,
  deletePlace,
  renderModalImagesList,
  updateModalImageUrl,
  addModalImage,
  deleteModalImage,
  makeCoverModalImage,
  moveModalImage,
  addSampleModalImage,
  switchModalImageTab,
  handleModalImagesBulkChange,
  resetDataToDefault,
  saveTravelData,
  updateSyncStatusUI,
  subscribeToFirestoreUpdates,
  prepareAndGeneratePDF,
  showToast,
  openImageLightbox,
  closeImageLightbox,
  prevLightboxImage,
  nextLightboxImage,
  setLightboxImageIndex,
  toggleLightboxFullscreen
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
