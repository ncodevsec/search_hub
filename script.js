const globalInput = document.getElementById("global-search-input");
const favoritesContainer = document.getElementById("favorite-services");
const categoriesContainer = document.getElementById("service-categories");
const storageKey = "searchHubPinnedServices";
const defaultServiceKey = "searchHubDefaultServiceId";

const allServices = (window.sections || sections).flatMap((section) =>
  section.forms.map((form) => ({
    ...form,
    section: section.title,
    id: `${section.title}:${form.name}`,
  }))
);

const defaultFavorites = ["Google", "DuckDuckGo", "YouTube", "ChatGPT", "Wikipedia"];

const loadPinnedIds = () => {
  try {
    const item = localStorage.getItem(storageKey);
    const parsed = item ? JSON.parse(item) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePinnedIds = (ids) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch { }
};

const getPinnedIds = () => {
  const stored = loadPinnedIds();
  return stored.length ? stored : allServices.filter((svc) => defaultFavorites.includes(svc.name)).map((svc) => svc.id);
};

const isPinned = (id) => getPinnedIds().includes(id);

const loadDefaultServiceId = () => {
  try {
    const item = localStorage.getItem(defaultServiceKey);
    return item || "";
  } catch {
    return "";
  }
};

const saveDefaultServiceId = (id) => {
  try {
    localStorage.setItem(defaultServiceKey, id);
  } catch { }
};

const setDefaultService = (serviceId) => {
  saveDefaultServiceId(serviceId);
  renderFavorites();
};

const getDefaultServiceId = () => {
  const stored = loadDefaultServiceId();
  if (stored && allServices.some((svc) => svc.id === stored)) {
    return stored;
  }
  const firstFavorite = getFavoriteServices()[0];
  return firstFavorite ? firstFavorite.id : allServices[0]?.id;
};

const getDefaultService = () => {
  const defaultId = getDefaultServiceId();
  return allServices.find((svc) => svc.id === defaultId) || allServices[0];
};

const buildSearchUrl = (template, query) => template.replace("{q}", encodeURIComponent(query));

const openService = (service) => {
  const q = (globalInput.value || "").trim();
  if (!q) {
    globalInput.focus();
    return;
  }
  const url = buildSearchUrl(service.template, q);
  window.open(url, "_blank");
};

const togglePin = (serviceId) => {
  const pins = new Set(loadPinnedIds());
  if (pins.has(serviceId)) {
    pins.delete(serviceId);
  } else {
    pins.add(serviceId);
  }
  savePinnedIds([...pins]);
  renderFavorites();
  renderCategories();
};

const createFavoriteButton = (service, isDefault) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "favorite-service inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300";
  if (isDefault) {
    btn.classList.add("default-service");
  }
  btn.title = `Search with ${service.name}`;
  btn.addEventListener("click", () => openService(service));

  const img = document.createElement("img");
  img.src = service.icon;
  img.alt = `${service.name} icon`;
  img.className = "h-5 w-5 object-contain";
  img.onerror = () => {
    try {
      const fallbackUrl = new URL(service.template.replace("{q}", "x")).hostname;
      img.src = `https://icons.duckduckgo.com/ip3/${fallbackUrl}.ico`;
    } catch {
      // keep original if fallback fails
    }
  };

  const label = document.createElement("span");
  label.textContent = service.name;

  btn.appendChild(img);
  btn.appendChild(label);
  return btn;
};

const createCategoryChip = (service) => {
  const chip = document.createElement("div");
  chip.className = "service-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "flex items-center gap-2 rounded-full px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300";
  button.addEventListener("click", () => openService(service));

  const img = document.createElement("img");
  img.src = service.icon;
  img.alt = `${service.name} icon`;
  img.className = "h-4 w-4 object-contain";
  img.onerror = () => {
    try {
      const fallbackUrl = new URL(service.template.replace("{q}", "x")).hostname;
      img.src = `https://icons.duckduckgo.com/ip3/${fallbackUrl}.ico`;
    } catch {
      // keep original if fallback fails
    }
  };

  const label = document.createElement("span");
  label.textContent = service.name;

  button.appendChild(img);
  button.appendChild(label);

  const pinButton = document.createElement("button");
  pinButton.type = "button";
  pinButton.className = "pin-toggle inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-900";
  pinButton.innerHTML = isPinned(service.id)
    ? `
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
			</svg>`
    : `
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
			</svg>`;
  pinButton.title = isPinned(service.id) ? "Unpin from favorites" : "Pin to favorites";
  pinButton.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePin(service.id);
  });

  chip.appendChild(button);
  chip.appendChild(pinButton);
  return chip;
};

const getFavoriteServices = () => {
  const pinnedIds = getPinnedIds();
  const favorites = pinnedIds
    .map((id) => allServices.find((svc) => svc.id === id))
    .filter(Boolean);
  return favorites.length ? favorites : allServices.slice(0, 5);
};

const renderFavorites = () => {
  favoritesContainer.innerHTML = "";
  const favorites = getFavoriteServices();
  const defaultId = getDefaultServiceId();
  favorites.forEach((service, idx) => {
    const favoriteBtn = createFavoriteButton(service, idx === 0);
    if (service.id === defaultId) {
      favoriteBtn.classList.add("selected-default");
      favoriteBtn.title = `Default search: ${service.name}`;
    }
    favoritesContainer.appendChild(favoriteBtn);
  });
};

const renderCategories = () => {
  categoriesContainer.innerHTML = "";
  (window.sections || sections).forEach((section, idx) => {
    if (idx > 0) {
      const line = document.createElement("hr");
      line.className = "section-divider";
      categoriesContainer.appendChild(line);
    }

    const categorySection = document.createElement("div");
    categorySection.className = "space-y-3";

    const categoryTitle = document.createElement("h2");
    categoryTitle.className = "text-sm font-semibold text-slate-900";
    categoryTitle.textContent = section.title;
    categorySection.appendChild(categoryTitle);

    const categoryRow = document.createElement("div");
    categoryRow.className = "mt-1 flex flex-wrap gap-2";
    section.forms.forEach((form) => {
      const service = allServices.find((svc) => svc.id === `${section.title}:${form.name}`);
      if (service) {
        categoryRow.appendChild(createCategoryChip(service));
      }
    });

    categorySection.appendChild(categoryRow);
    categoriesContainer.appendChild(categorySection);
  });
};

const renderDefaultServicePicker = () => {
  const modalList = document.getElementById("modal-service-list");
  if (!modalList) return;

  modalList.innerHTML = "";
  const defaultId = getDefaultServiceId();

  (window.sections || sections).forEach((section) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "modal-service-category";

    const categoryTitle = document.createElement("div");
    categoryTitle.className = "modal-service-category-title";
    categoryTitle.textContent = section.title;
    categoryDiv.appendChild(categoryTitle);

    section.forms.forEach((form) => {
      const service = allServices.find((svc) => svc.id === `${section.title}:${form.name}`);
      if (!service) return;

      const option = document.createElement("button");
      option.type = "button";
      option.className = "modal-service-option w-full";
      if (service.id === defaultId) {
        option.classList.add("selected");
      }

      const img = document.createElement("img");
      img.src = service.icon;
      img.alt = service.name;
      img.onerror = () => {
        img.src = `https://icons.duckduckgo.com/ip3/${new URL(service.template).hostname}.ico`;
      };

      const label = document.createElement("span");
      label.textContent = service.name;

      option.appendChild(img);
      option.appendChild(label);
      option.addEventListener("click", () => {
        setDefaultService(service.id);
        closeModal();
      });

      categoryDiv.appendChild(option);
    });

    modalList.appendChild(categoryDiv);
  });
};

const openModal = () => {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.remove("hidden");
    renderDefaultServicePicker();
  }
};

const closeModal = () => {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

const setupModalListeners = () => {
  const settingsBtn = document.getElementById("settings-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const overlay = document.querySelector(".settings-modal-overlay");
  const modal = document.getElementById("settings-modal");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
};

const init = () => {
  renderFavorites();
  renderCategories();
  setupModalListeners();

  if (globalInput) {
    globalInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const defaultService = getDefaultService();
        if (defaultService) {
          openService(defaultService);
        }
      }
    });
  }
};

init();



