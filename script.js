const globalInput = document.getElementById("global-search-input");
const favoritesContainer = document.getElementById("favorite-services");
const categoriesContainer = document.getElementById("service-categories");
const storageKey = "searchHubPinnedServices";
const defaultServiceKey = "searchHubDefaultServiceId";
const themeStorageKey = "searchHubThemePreference";
const layoutStorageKey = "searchHubLayoutPreference";
const defaultServiceIndicator = document.getElementById("default-service-indicator");
const defaultServiceIcon = document.getElementById("default-service-icon");
const clockElement = document.getElementById("digital-clock");
const clockDescription = document.getElementById("clock-description");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoListElement = document.getElementById("todo-list");
const todoEmptyMessage = document.getElementById("todo-empty");
const todoStorageKey = "searchHubTodoItems";
const iconPlaceholder = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e2e8f0"/><circle cx="12" cy="12" r="8" fill="%23cbd5e1"/></svg>');

const getIconCandidates = (service) => {
  const candidates = [];
  const addCandidate = (url) => {
    if (typeof url === "string" && url.trim()) {
      const normalized = url.trim();
      if (!candidates.includes(normalized)) {
        candidates.push(normalized);
      }
    }
  };

  addCandidate(service?.icon);

  const templateHost = service?.template?.match(/^https?:\/\/([^/]+)/i)?.[1];
  if (templateHost) {
    const normalizedHost = templateHost.replace(/^www\./i, "");
    addCandidate(`https://www.google.com/s2/favicons?sz=24&domain_url=https://${normalizedHost}`);
    addCandidate(`https://icons.duckduckgo.com/ip3/${normalizedHost}.ico`);
  }

  const name = service?.name?.toLowerCase() || "";
  if (name.includes("linkedin")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://www.linkedin.com");
  }
  if (name.includes("threads")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://www.threads.net");
  }
  if (name.includes("mastodon")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://mastodon.social");
  }
  if (name.includes("perplexity")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://www.perplexity.ai");
  }
  if (name.includes("notion")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://www.notion.so");
  }
  if (name.includes("wolfram")) {
    addCandidate("https://www.google.com/s2/favicons?sz=24&domain_url=https://www.wolframalpha.com");
  }

  return candidates;
};

const setServiceIcon = (img, service) => {
  const candidates = getIconCandidates(service);
  if (!candidates.length) {
    img.src = iconPlaceholder;
    return;
  }

  let currentIndex = 0;
  const tryNextIcon = () => {
    if (currentIndex >= candidates.length) {
      img.src = iconPlaceholder;
      img.onerror = null;
      return;
    }

    const nextUrl = candidates[currentIndex++];
    img.src = nextUrl;
    img.onerror = () => {
      img.onerror = null;
      tryNextIcon();
    };
  };

  tryNextIcon();
};

const allServices = (window.sections || sections).flatMap((section) =>
  section.forms.map((form) => ({
    ...form,
    section: section.title,
    id: `${section.title}:${form.name}`,
  }))
);

const defaultFavorites = ["Google", "YouTube", "ChatGPT", "Google Drive"];

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

const saveThemePreference = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch { }
};

const loadThemePreference = () => {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
};

const prefersDarkMode = () => {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const applyThemePreference = (preference) => {
  const isDark = preference === "dark" || (preference === "system" && prefersDarkMode());
  document.body.classList.toggle("dark-theme", isDark);
  document.body.classList.toggle("light-theme", !isDark);
};

const formatClockValue = (value) => String(value).padStart(2, "0");

const formatHour = (hour) => {
  const normalized = hour % 12;
  return normalized === 0 ? 12 : normalized;
};

const updateClock = () => {
  if (!clockElement) return;
  const now = new Date();
  const hours = formatClockValue(formatHour(now.getHours()));
  const minutes = formatClockValue(now.getMinutes());
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  clockElement.textContent = `${hours}:${minutes} ${ampm}`;
  if (clockDescription) {
    clockDescription.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

const loadTodoItems = () => {
  try {
    const stored = localStorage.getItem(todoStorageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveTodoItems = (items) => {
  try {
    localStorage.setItem(todoStorageKey, JSON.stringify(items));
  } catch {
    // ignore write failures
  }
};

const renderTodoList = () => {
  if (!todoListElement || !todoEmptyMessage) return;
  const items = loadTodoItems();
  todoListElement.innerHTML = "";
  if (!items.length) {
    todoEmptyMessage.classList.remove("hidden");
    return;
  }
  todoEmptyMessage.classList.add("hidden");

  items.forEach((item) => {
    const task = document.createElement("li");
    task.className = "todo-item flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900";
    if (item.completed) {
      task.classList.add("completed");
    }

    const label = document.createElement("label");
    label.className = "flex items-center gap-3 flex-1 cursor-pointer";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.className = "todo-checkbox h-4 w-4 rounded border-slate-300 text-slate-900";
    checkbox.addEventListener("change", () => toggleTodoComplete(item.id));

    const text = document.createElement("span");
    text.textContent = item.text;
    text.className = "todo-text break-words";
    if (item.completed) {
      text.style.textDecoration = "line-through";
      text.style.opacity = "0.7";
    }

    label.appendChild(checkbox);
    label.appendChild(text);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "todo-remove text-slate-500 hover:text-slate-900 transition";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeTodoItem(item.id));

    task.appendChild(label);
    task.appendChild(removeButton);
    todoListElement.appendChild(task);
  });
};

const addTodoItem = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return;
  const items = loadTodoItems();
  const newItem = {
    id: `todo-${Date.now()}`,
    text: trimmed,
    completed: false,
  };
  saveTodoItems([newItem, ...items]);
  renderTodoList();
};

const toggleTodoComplete = (id) => {
  const items = loadTodoItems().map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  saveTodoItems(items);
  renderTodoList();
};

const removeTodoItem = (id) => {
  const items = loadTodoItems().filter((item) => item.id !== id);
  saveTodoItems(items);
  renderTodoList();
};

const setupTodoListeners = () => {
  if (!todoForm || !todoInput) return;
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodoItem(todoInput.value);
    todoInput.value = "";
    todoInput.focus();
  });
};

const renderThemeSelection = () => {
  const preference = loadThemePreference();
  document.querySelectorAll('button[data-theme]').forEach((btn) => {
    const isSelected = btn.dataset.theme === preference;
    btn.classList.toggle('selected-theme', isSelected);
  });
};

const setThemePreference = (theme) => {
  saveThemePreference(theme);
  applyThemePreference(theme);
  renderThemeSelection();
};

const watchSystemTheme = () => {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    if (loadThemePreference() === "system") {
      applyThemePreference("system");
    }
  };
  if (query.addEventListener) {
    query.addEventListener("change", listener);
  } else if (query.addListener) {
    query.addListener(listener);
  }
};

const setDefaultService = (serviceId) => {
  saveDefaultServiceId(serviceId);
  renderFavorites();
  renderDefaultServiceIndicator();
  renderDefaultServicePicker();
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

const renderDefaultServiceIndicator = () => {
  if (!defaultServiceIndicator || !defaultServiceIcon) return;

  const service = getDefaultService();
  if (!service) {
    defaultServiceIndicator.classList.add("hidden");
    return;
  }

  defaultServiceIndicator.classList.remove("hidden");
  defaultServiceIndicator.title = `Default search: ${service.name}`;
  defaultServiceIndicator.setAttribute("aria-label", `Default search engine: ${service.name}`);

  defaultServiceIcon.alt = `${service.name} icon`;
  defaultServiceIcon.loading = "lazy";
  setServiceIcon(defaultServiceIcon, service);
};

const buildSearchUrl = (template, query) => template.replace("{q}", encodeURIComponent(query));

const openService = (service) => {
  const q = (globalInput.value || "").trim();
  if (!q) {
    globalInput.focus();
    return;
  }
  updateClock();
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
  btn.className = "favorite-service inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300";
  if (isDefault) {
    btn.classList.add("default-service");
  }
  btn.title = `Search with ${service.name}`;
  btn.addEventListener("click", () => openService(service));

  const img = document.createElement("img");
  img.alt = `${service.name} icon`;
  img.className = "h-5 w-5 object-contain";
  img.loading = "lazy";
  setServiceIcon(img, service);

  const label = document.createElement("span");
  label.textContent = service.name;

  btn.appendChild(img);
  btn.appendChild(label);
  return btn;
};

const createCategoryChip = (service) => {
  const chip = document.createElement("div");
  chip.className = "service-chip inline-flex justify-between items-center rounded-full border border-slate-200";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "flex items-center gap-2 rounded-full px-2 py-2 text-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300";
  button.addEventListener("click", () => openService(service));

  const img = document.createElement("img");
  img.alt = `${service.name} icon`;
  img.className = "h-4 w-4 object-contain";
  img.loading = "lazy";
  setServiceIcon(img, service);

  const label = document.createElement("span");
  label.textContent = service.name;

  button.appendChild(img);
  button.appendChild(label);

  const pinButton = document.createElement("button");
  pinButton.type = "button";
  pinButton.className = "pin-toggle inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-300";
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
  favorites.forEach((service) => {
    const favoriteBtn = createFavoriteButton(service, service.id === defaultId);
    if (service.id === defaultId) {
      favoriteBtn.classList.add("selected-default");
      favoriteBtn.title = `Default search: ${service.name}`;
    }
    favoritesContainer.appendChild(favoriteBtn);
  });
  renderDefaultServiceIndicator();
};

const renderCategories = () => {
  categoriesContainer.innerHTML = "";
  const layout = getLayoutPreference();

  (window.sections || sections).forEach((section, idx) => {
    const categorySection = document.createElement("div");
    categorySection.className = "space-y-2 bg-white shadow-sm border border-slate-200 rounded-3xl px-2 py-2";

    const categoryTitle = document.createElement("h2");
    categoryTitle.className = "text-md font-semibold text-center p-2";
    categoryTitle.textContent = section.title;
    categorySection.appendChild(categoryTitle);

    const categoryRow = document.createElement("div");
    categoryRow.className = layout === "horizontal" ? "flex flex-wrap gap-2 justify-center" : "flex flex-col gap-2";
    categoryRow.id = `category-row-${idx}`;

    const services = section.forms.map((form) => {
      return allServices.find((svc) => svc.id === `${section.title}:${form.name}`);
    }).filter(Boolean);

    // In vertical mode, show only first 5 services and hide the rest
    const isVertical = layout !== "horizontal";
    const visibleServices = isVertical ? services.slice(0, 4) : services;
    const hiddenServices = isVertical ? services.slice(4) : [];

    visibleServices.forEach((service) => {
      categoryRow.appendChild(createCategoryChip(service));
    });

    // Create a wrapper for all services and toggle button
    const servicesWrapper = document.createElement("div");
    servicesWrapper.className = "flex flex-col gap-2 w-full";

    servicesWrapper.appendChild(categoryRow);

    // Add accordion toggle and hidden services container for vertical mode
    if (isVertical && hiddenServices.length > 0) {
      // Create hidden services container
      const hiddenServicesContainer = document.createElement("div");
      hiddenServicesContainer.className = "hidden-services-container hidden flex flex-col gap-2";
      hiddenServicesContainer.id = `hidden-services-${idx}`;

      hiddenServices.forEach((service) => {
        hiddenServicesContainer.appendChild(createCategoryChip(service));
      });

      servicesWrapper.appendChild(hiddenServicesContainer);

      // Create toggle button
      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = "category-toggle-btn w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-all flex items-center justify-center gap-2";
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("data-category", idx);

      // Create SVG icon with proper namespace
      const svgNS = "http://www.w3.org/2000/svg";
      const toggleIcon = document.createElementNS(svgNS, "svg");
      toggleIcon.setAttribute("class", "toggle-icon h-4 w-4 transition-transform");
      toggleIcon.setAttribute("viewBox", "0 0 24 24");
      toggleIcon.setAttribute("fill", "none");
      toggleIcon.setAttribute("stroke", "currentColor");
      toggleIcon.setAttribute("stroke-width", "2");
      toggleIcon.setAttribute("stroke-linecap", "round");
      toggleIcon.setAttribute("stroke-linejoin", "round");

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", "M19 14l-7 7m0 0l-7-7m7 7V3");
      toggleIcon.appendChild(path);

      toggleButton.appendChild(toggleIcon);
      toggleButton.appendChild(document.createTextNode(`Show ${hiddenServices.length} more`));

      servicesWrapper.appendChild(toggleButton);

      // Add toggle event listener
      toggleButton.addEventListener("click", () => {
        const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
        toggleButton.setAttribute("aria-expanded", !isExpanded);
        hiddenServicesContainer.classList.toggle("hidden");

        const toggleIconSvg = toggleButton.querySelector(".toggle-icon");
        const textNode = Array.from(toggleButton.childNodes).find(node => node.nodeType === 3);

        if (!isExpanded) {
          toggleIconSvg.style.transform = "rotate(180deg)";
          if (textNode) textNode.textContent = `Show less`;
        } else {
          toggleIconSvg.style.transform = "rotate(0deg)";
          if (textNode) textNode.textContent = `Show ${hiddenServices.length} more`;
        }
      });
    }

    categorySection.appendChild(servicesWrapper);
    categoriesContainer.appendChild(categorySection);
  });
};

const getLayoutPreference = () => {
  try {
    const stored = localStorage.getItem(layoutStorageKey);
    return stored === "horizontal" || stored === "vertical" ? stored : "vertical";
  } catch {
    return "vertical";
  }
};

const saveLayoutPreference = (layout) => {
  try {
    localStorage.setItem(layoutStorageKey, layout);
  } catch { }
};

const setLayoutPreference = (layout) => {
  saveLayoutPreference(layout);
  applyLayoutPreference(layout);
};

const applyLayoutPreference = (layout) => {
  if (layout === "horizontal") {
    categoriesContainer.className = "space-y-4 overflow-x-hidden";
  } else {
    categoriesContainer.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-hidden";
  }
  renderCategories();
};

const toggleLayoutView = () => {
  const currentLayout = getLayoutPreference();
  const newLayout = currentLayout === "vertical" ? "horizontal" : "vertical";
  setLayoutPreference(newLayout);
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
      option.className = "modal-service-option border border-slate-200 rounded-full";
      if (service.id === defaultId) {
        option.classList.add("selected");
      }

      const img = document.createElement("img");
      img.alt = service.name;
      img.className = "h-5 w-5 object-contain";
      img.loading = "lazy";
      setServiceIcon(img, service);

      const label = document.createElement("span");
      label.textContent = service.name;

      option.appendChild(img);
      option.appendChild(label);
      option.addEventListener("click", () => {
        setDefaultService(service.id);
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

  document.querySelectorAll('button[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setThemePreference(btn.dataset.theme);
    });
  });

  const resetBtn = document.getElementById('reset-theme-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      setThemePreference('system');
      // keep modal open and refresh visuals
    });
  }

  const layoutToggleBtn = document.getElementById('layout-toggle-btn');
  if (layoutToggleBtn) {
    layoutToggleBtn.addEventListener('click', toggleLayoutView);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
};

const init = () => {
  applyThemePreference(loadThemePreference());
  renderThemeSelection();
  watchSystemTheme();
  applyLayoutPreference(getLayoutPreference());
  renderFavorites();
  setupModalListeners();
  setupTodoListeners();
  renderTodoList();
  updateClock();
  setInterval(updateClock, 1000);

  if (defaultServiceIndicator) {
    defaultServiceIndicator.addEventListener("click", () => {
      const defaultService = getDefaultService();
      if (defaultService) {
        openService(defaultService);
      }
    });
  }

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



