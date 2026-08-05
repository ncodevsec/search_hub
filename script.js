const container = document.getElementById("search-sections");

sections.forEach((section) => {
  const category = document.createElement("div");

  const html = `
    <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-4 py-3 bg-transparent">
        <h2 class="text-sm font-medium leading-6 text-slate-700">${section.title}</h2>
      </div>

      <div class="grid grid-cols-1 gap-2 px-4 py-4">
        ${section.forms
      .map(
        (form) => `
          <form action="${form.action}" method="get" target="_blank" class="flex w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white">
            <label class="sr-only" for="${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">Search ${form.name}</label>
            <input id="${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" type="search" name="${form.param}" placeholder="Search ${form.name}" class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" />
            <button type="submit" class="inline-flex items-center justify-center rounded-r-lg bg-slate-100 px-3 py-2 text-white transition hover:bg-slate-200">
              <img src="${form.icon}" alt="${form.name} icon" class="h-4 w-4 object-contain" />
            </button>
          </form>`
      )
      .join("")}
      </div>
    </article>`;

  category.innerHTML = html;
  container.appendChild(category);
});


