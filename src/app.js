import { defaultTravelData } from './travelData.js';

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
};

// Load persistent data
let travelData = JSON.parse(JSON.stringify(defaultTravelData));
try {
  const savedData = localStorage.getItem('ocean_travel_custom_data');
  if (savedData) {
    travelData = JSON.parse(savedData);
  }
} catch (e) {
  console.warn('Could not load custom data:', e);
}

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
  if (adminLoggedIn === 'true') {
    state.isAdmin = true;
  }
} catch (e) {}

/**
 * Save custom travel data
 */
export function saveTravelData() {
  try {
    localStorage.setItem('ocean_travel_custom_data', JSON.stringify(travelData));
  } catch (e) {
    console.error('Failed to save data:', e);
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
}

/**
 * Admin UI update
 */
export function updateAdminUI() {
  const adminBar = document.getElementById('admin-active-bar');
  const adminHeaderLabel = document.getElementById('admin-header-label');
  if (state.isAdmin) {
    if (adminBar) adminBar.classList.remove('hidden');
    if (adminHeaderLabel) adminHeaderLabel.textContent = 'Admin (Logged in)';
  } else {
    if (adminBar) adminBar.classList.add('hidden');
    if (adminHeaderLabel) adminHeaderLabel.textContent = 'Admin Portal';
  }
}

/**
 * Admin Login
 */
export function openAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.getElementById('admin-email-input').value = 'herozboy@gmail.com';
  }
}

export function closeAdminModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.classList.add('hidden');
}

export function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('admin-email-input').value.trim();
  if (email.toLowerCase() === 'herozboy@gmail.com') {
    state.isAdmin = true;
    try {
      localStorage.setItem('ocean_travel_admin_logged', 'true');
    } catch(err) {}
    updateAdminUI();
    closeAdminModal();
    if (state.currentCityId) {
      renderPlacesList();
    }
  } else {
    alert('Unauthorized: Admin access is restricted to herozboy@gmail.com');
  }
}

export function logoutAdmin() {
  state.isAdmin = false;
  try {
    localStorage.removeItem('ocean_travel_admin_logged');
  } catch(e) {}
  updateAdminUI();
  if (state.currentCityId) {
    renderPlacesList();
  }
}

/**
 * Reset data to defaults
 */
export function resetDataToDefault() {
  if (confirm('Are you sure you want to reset all destination places to original curated data?')) {
    travelData = JSON.parse(JSON.stringify(defaultTravelData));
    saveTravelData();
    if (state.currentCityId) {
      renderPlacesList();
    }
    alert('Data reset successfully to default.');
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

  // Update Breadcrumb
  document.getElementById('crumb-arrow-1').style.display = 'inline-block';
  document.getElementById('crumb-city-btn').style.display = 'inline-flex';
  document.getElementById('crumb-country-name').textContent = country.name;
  document.getElementById('crumb-arrow-2').style.display = 'none';
  document.getElementById('crumb-place-label').style.display = 'none';

  // Update View
  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  viewCountry.style.display = 'none';
  viewCity.style.display = 'block';
  viewCity.classList.remove('view-animate');
  void viewCity.offsetWidth; // Trigger reflow for animation
  viewCity.classList.add('view-animate');
  viewPlaces.style.display = 'none';

  // Set City View Labels
  document.getElementById('city-view-country-flag').textContent = country.flag;
  document.getElementById('city-view-country-name').textContent = country.name;
  document.getElementById('city-view-country-tagline').textContent = country.tagline;

  renderCities(country.cities);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Step 2: Cities
 */
export function renderCities(cityIds) {
  const grid = document.getElementById('city-cards-grid');
  if (!grid) return;
  grid.innerHTML = cityIds.map(cityId => {
    const city = travelData.cities[cityId];
    if (!city) return '';
    
    const selectedInCity = state.selectedPlaces.filter(p => p.cityId === cityId).length;

    return `
      <div onclick="window.OceanApp.selectCity('${city.id}')"
           class="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
        
        <div class="relative h-60 w-full overflow-hidden bg-slate-100">
          <img src="${city.heroImage}" alt="${city.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
          
          ${selectedInCity > 0 ? `
            <div class="absolute top-4 right-4">
              <span class="px-3 py-1 bg-[#a80c10] text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-check"></i> ${selectedInCity} in Plan
              </span>
            </div>
          ` : ''}

          <div class="absolute bottom-4 left-4 right-4 text-white">
            <div class="text-[10px] font-bold text-[#a80c10] bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
              Featured Destination
            </div>
            <h3 class="text-2xl font-black tracking-tight">${city.name}</h3>
            <p class="text-xs text-slate-200 mt-0.5">${city.places ? city.places.length : 0} Places & Activities</p>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">${city.tagline}</p>
          
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-[#a80c10] flex items-center gap-1.5 group-hover:text-[#8e0a0d] transition-colors">
              Plan ${city.name} Trip <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </span>
            <span class="text-xs text-slate-400 font-medium">
              <i class="fa-solid fa-camera mr-1"></i> Top Rated
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Handle City Selection
 */
export function selectCity(cityId) {
  state.currentCityId = cityId;
  const city = travelData.cities[cityId];
  if (!city) return;

  const country = travelData.countries.find(c => c.id === city.countryId);

  // Update Breadcrumbs
  document.getElementById('crumb-arrow-1').style.display = 'inline-block';
  document.getElementById('crumb-city-btn').style.display = 'inline-flex';
  document.getElementById('crumb-country-name').textContent = country ? country.name : 'Country';
  document.getElementById('crumb-arrow-2').style.display = 'inline-block';
  document.getElementById('crumb-place-label').style.display = 'inline-flex';
  document.getElementById('crumb-city-name').textContent = city.name;

  // Update View
  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  viewCountry.style.display = 'none';
  viewCity.style.display = 'none';
  viewPlaces.style.display = 'block';
  viewPlaces.classList.remove('view-animate');
  void viewPlaces.offsetWidth; // Trigger reflow
  viewPlaces.classList.add('view-animate');

  // Banner elements
  document.getElementById('places-city-hero-img').src = city.heroImage;
  document.getElementById('places-city-title').textContent = `Explore ${city.name}`;
  document.getElementById('places-city-tagline').textContent = city.tagline;
  document.getElementById('places-city-badge').textContent = country ? country.name : 'Destination';

  state.currentCategoryFilter = 'all';
  state.searchQuery = '';
  state.activeAccordionPlaceId = null;
  const searchInput = document.getElementById('place-search-input');
  if (searchInput) searchInput.value = '';
  
  // Filter tabs active state reset
  document.querySelectorAll('#category-filter-tabs .filter-tab').forEach((tab, index) => {
    if (index === 0) {
      tab.className = "filter-tab active px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-[#a80c10] text-white shadow-sm";
    } else {
      tab.className = "filter-tab px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all whitespace-nowrap";
    }
  });

  renderPlacesList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Step 3: Places List
 */
export function renderPlacesList() {
  const city = travelData.cities[state.currentCityId];
  if (!city) return;

  const container = document.getElementById('places-cards-list');
  if (!container) return;
  
  let places = city.places ? [...city.places] : [];

  // Sort
  places.sort((a, b) => {
    if (a.isMustVisit && !b.isMustVisit) return -1;
    if (!a.isMustVisit && b.isMustVisit) return 1;
    return (b.popularity || 0) - (a.popularity || 0);
  });

  // Filter by category
  if (state.currentCategoryFilter !== 'all') {
    if (state.currentCategoryFilter === 'must_visit') {
      places = places.filter(p => p.isMustVisit);
    } else {
      places = places.filter(p => p.category === state.currentCategoryFilter);
    }
  }

  // Filter by search
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    places = places.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.myanmarDesc && p.myanmarDesc.includes(q)) || 
      (p.location && p.location.toLowerCase().includes(q))
    );
  }

  // Update counts
  const availCount = document.getElementById('places-available-count');
  if (availCount) availCount.textContent = city.places ? city.places.length : 0;
  
  const selectedInThisCity = state.selectedPlaces.filter(p => p.cityId === city.id).length;
  const selCityCount = document.getElementById('places-selected-city-count');
  if (selCityCount) selCityCount.textContent = selectedInThisCity;

  if (places.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
        <i class="fa-solid fa-magnifying-glass text-3xl text-slate-300 mb-3"></i>
        <h4 class="text-base font-bold text-slate-800">No attractions found</h4>
        <p class="text-xs text-slate-500 mt-1">Try clearing your search query or switching category filters.</p>
        <button onclick="window.OceanApp.filterPlaces('all')" class="mt-4 px-5 py-2 bg-[#a80c10] hover:bg-[#8e0a0d] text-white text-xs font-semibold rounded-full shadow-sm">Show All Places</button>
      </div>
    `;
    return;
  }

  container.innerHTML = places.map((place, idx) => {
    const isSelected = state.selectedPlaces.some(p => p.id === place.id);
    const isExpanded = state.activeAccordionPlaceId === place.id;

    return `
      <div id="place-card-${place.id}" class="bg-white rounded-2xl border ${isSelected ? 'border-[#a80c10] ring-2 ring-red-500/20 shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'} transition-all duration-300 overflow-hidden">
        
        <!-- Main Card Header Bar -->
        <div class="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <!-- Left: Thumbnail & Main Info -->
          <div class="flex items-start gap-4 flex-1 cursor-pointer" onclick="window.OceanApp.togglePlaceAccordion('${place.id}')">
            
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-inner">
              <img src="${place.imageUrl}" alt="${place.name}" class="w-full h-full object-cover" loading="lazy" />
              ${place.isMustVisit ? `
                <span class="absolute top-1.5 left-1.5 bg-[#a80c10] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                  Top Pick
                </span>
              ` : ''}
              <span class="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
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
                <span>${isExpanded ? 'Hide Details' : 'Details'}</span>
                <i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px] transition-transform"></i>
              </div>
            </div>

          </div>

          <!-- Right: Actions (Add to Plan + Admin controls) -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
            ${state.isAdmin ? `
              <button onclick="event.stopPropagation(); window.OceanApp.openEditPlaceModal('${place.id}')" title="Edit Place" class="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors text-xs">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="event.stopPropagation(); window.OceanApp.deletePlace('${place.id}')" title="Delete Place" class="p-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            ` : ''}

            <button type="button" 
                    onclick="event.stopPropagation(); window.OceanApp.togglePlaceSelection('${place.id}')"
                    class="w-full md:w-auto px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
                      isSelected 
                        ? 'bg-red-50 text-[#a80c10] border border-red-200 hover:bg-red-100' 
                        : 'bg-[#a80c10] hover:bg-[#8e0a0d] text-white shadow-red-900/20 active:scale-95'
                    }">
              <i class="fa-solid ${isSelected ? 'fa-circle-check text-[#a80c10]' : 'fa-plus'}"></i>
              <span>${isSelected ? 'Added to Plan ✓' : 'Add to Trip Plan'}</span>
            </button>
          </div>

        </div>

        <!-- Accordion Expansion: Detailed Overview & Highlights -->
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
export function togglePlaceSelection(placeId) {
  let city = travelData.cities[state.currentCityId];
  let place = city && city.places ? city.places.find(p => p.id === placeId) : null;

  if (!place) {
    // Search across all cities as fallback
    for (const cId in travelData.cities) {
      const found = travelData.cities[cId]?.places?.find(p => p.id === placeId);
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

  const existingIndex = state.selectedPlaces.findIndex(p => p.id === placeId);
  if (existingIndex >= 0) {
    state.selectedPlaces.splice(existingIndex, 1);
    showToast(`Removed "${place.name}"`, 'Removed from your trip plan', 'info');
  } else {
    state.selectedPlaces.push({
      ...place,
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
      } catch (err) {
        // Safe confetti catch
      }
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
export function filterPlaces(category) {
  state.currentCategoryFilter = category;
  
  document.querySelectorAll('#category-filter-tabs .filter-tab').forEach(tab => {
    tab.className = "filter-tab px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all whitespace-nowrap";
  });
  
  const activeTab = event ? event.target.closest('.filter-tab') : null;
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
  if (!drawer) return;
  if (show) {
    renderDrawerPlacesList();
    drawer.style.opacity = '1';
    drawer.style.pointerEvents = 'auto';
  } else {
    drawer.style.opacity = '0';
    drawer.style.pointerEvents = 'none';
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

      <button onclick="window.OceanApp.removePlaceFromPlan('${place.id}')" class="text-slate-400 hover:text-rose-600 p-2 transition-colors flex-shrink-0" title="Remove place">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  `).join('');
}

export function removePlaceFromPlan(placeId) {
  const place = state.selectedPlaces.find(p => p.id === placeId);
  state.selectedPlaces = state.selectedPlaces.filter(p => p.id !== placeId);
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

  document.getElementById('crumb-arrow-1').style.display = 'none';
  document.getElementById('crumb-city-btn').style.display = 'none';
  document.getElementById('crumb-arrow-2').style.display = 'none';
  document.getElementById('crumb-place-label').style.display = 'none';

  const viewCountry = document.getElementById('view-country');
  const viewCity = document.getElementById('view-city');
  const viewPlaces = document.getElementById('view-places');

  viewCountry.style.display = 'block';
  viewCountry.classList.remove('view-animate');
  void viewCountry.offsetWidth;
  viewCountry.classList.add('view-animate');
  viewCity.style.display = 'none';
  viewPlaces.style.display = 'none';

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
 * Admin Place Management: Add / Edit / Delete
 */
export function openAddPlaceModal() {
  state.editingPlaceId = null;
  document.getElementById('place-modal-title').textContent = 'Add New Place / Attraction';
  document.getElementById('edit-city-select').value = state.currentCityId || 'danang';
  document.getElementById('edit-name-input').value = '';
  document.getElementById('edit-category-select').value = 'must_visit';
  document.getElementById('edit-duration-input').value = '2.5';
  document.getElementById('edit-location-input').value = '';
  document.getElementById('edit-image-input').value = 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80';
  document.getElementById('edit-myanmar-desc-input').value = '';
  document.getElementById('edit-highlights-input').value = '';
  document.getElementById('edit-mustvisit-check').checked = true;
  document.getElementById('place-edit-modal').classList.remove('hidden');
}

export function openEditPlaceModal(placeId) {
  const city = travelData.cities[state.currentCityId];
  if (!city) return;
  const place = city.places.find(p => p.id === placeId);
  if (!place) return;

  state.editingPlaceId = placeId;
  document.getElementById('place-modal-title').textContent = `Edit Place: ${place.name}`;
  document.getElementById('edit-city-select').value = state.currentCityId;
  document.getElementById('edit-name-input').value = place.name || '';
  document.getElementById('edit-category-select').value = place.category || 'must_visit';
  document.getElementById('edit-duration-input').value = place.durationHours || 2.0;
  document.getElementById('edit-location-input').value = place.location || '';
  document.getElementById('edit-image-input').value = place.imageUrl || '';
  document.getElementById('edit-myanmar-desc-input').value = place.myanmarDesc || '';
  document.getElementById('edit-highlights-input').value = place.myanmarHighlights ? place.myanmarHighlights.join('\n') : '';
  document.getElementById('edit-mustvisit-check').checked = !!place.isMustVisit;
  document.getElementById('place-edit-modal').classList.remove('hidden');
}

export function closePlaceModal() {
  document.getElementById('place-edit-modal').classList.add('hidden');
}

export function handleSavePlace(e) {
  if (e) e.preventDefault();
  const targetCityId = document.getElementById('edit-city-select').value;
  const name = document.getElementById('edit-name-input').value.trim();
  const category = document.getElementById('edit-category-select').value;
  const durationHours = parseFloat(document.getElementById('edit-duration-input').value) || 2.0;
  const location = document.getElementById('edit-location-input').value.trim();
  const imageUrl = document.getElementById('edit-image-input').value.trim() || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80';
  const myanmarDesc = document.getElementById('edit-myanmar-desc-input').value.trim();
  const highlightsRaw = document.getElementById('edit-highlights-input').value.trim();
  const isMustVisit = document.getElementById('edit-mustvisit-check').checked;
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
  if (state.currentCityId) renderPlacesList();
  alert('Place saved successfully!');
}

export function deletePlace(placeId) {
  if (!confirm('Are you sure you want to delete this place?')) return;
  const city = travelData.cities[state.currentCityId];
  if (!city) return;
  city.places = city.places.filter(p => p.id !== placeId);
  saveTravelData();
  removePlaceFromPlan(placeId);
  renderPlacesList();
}

/**
 * PDF Generation
 */
export function prepareAndGeneratePDF() {
  if (state.selectedPlaces.length === 0) {
    alert('Please select at least 1 attraction to generate your trip plan PDF.');
    return;
  }

  toggleCartDrawer(false);

  const clientName = (document.getElementById('traveler-name-input')?.value || '').trim() || 'Ocean Travel Client';
  const travelDates = (document.getElementById('travel-dates-input')?.value || '').trim() || 'Custom Date Itinerary';
  
  const totalHours = state.selectedPlaces.reduce((sum, p) => sum + (p.durationHours || 2), 0);
  const totalDays = (totalHours / 8).toFixed(1);
  const cityNames = [...new Set(state.selectedPlaces.map(p => p.cityName || 'Destination'))].join(', ');

  document.getElementById('pdf-client-name').textContent = `${clientName} (${travelDates})`;
  document.getElementById('pdf-destination-name').textContent = cityNames || 'Vietnam / Asia';
  document.getElementById('pdf-total-hours').textContent = `${totalHours.toFixed(1)} Hours`;
  document.getElementById('pdf-total-days').textContent = `~${totalDays} Touring Days (8h/Day)`;
  document.getElementById('pdf-item-count-label').textContent = `${state.selectedPlaces.length} Attractions Selected`;
  document.getElementById('pdf-generated-date').textContent = `Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const pdfPlacesContainer = document.getElementById('pdf-places-list-container');
  pdfPlacesContainer.innerHTML = state.selectedPlaces.map((place, index) => `
    <div style="page-break-inside: avoid;" class="border border-slate-200 rounded-lg p-3 bg-white space-y-1.5 mb-2">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-[#a80c10] text-white text-[10px] font-bold flex items-center justify-center">
            ${index + 1}
          </span>
          <span class="font-bold text-slate-900 text-xs">${place.name}</span>
          <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">${place.categoryLabel || 'Attraction'}</span>
        </div>
        <span class="text-[11px] font-bold text-[#a80c10]">${place.durationText || '2.0 Hours'}</span>
      </div>
      
      <p class="myanmar-text text-[11px] text-slate-700 leading-relaxed pl-7">
        ${place.myanmarDesc || ''}
      </p>

      ${place.myanmarHighlights && place.myanmarHighlights.length > 0 ? `
        <div class="pl-7 pt-1">
          <div class="text-[10px] font-semibold text-slate-500">Key Highlights:</div>
          <div class="myanmar-text text-[10px] text-slate-600">
            • ${place.myanmarHighlights.join(' • ')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('');

  const element = document.getElementById('pdf-content-to-print');
  const genBtn = document.getElementById('btn-generate-pdf-bottom');
  const originalText = genBtn ? genBtn.innerHTML : '';
  if (genBtn) {
    genBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
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
  wrapper.classList.remove('hidden');

  html2pdf().set(opt).from(element).save().then(() => {
    wrapper.classList.add('hidden');
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
    wrapper.classList.add('hidden');
    if (genBtn) {
      genBtn.innerHTML = originalText;
      genBtn.disabled = false;
    }
    alert('Could not generate PDF directly. Please check browser print settings.');
  });
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
  handleAdminLogin,
  logoutAdmin,
  openAddPlaceModal,
  openEditPlaceModal,
  closePlaceModal,
  handleSavePlace,
  deletePlace,
  resetDataToDefault,
  prepareAndGeneratePDF,
  showToast
};

window.addEventListener('DOMContentLoaded', initApp);
