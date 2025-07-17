const container = document.getElementById("search-sections");

sections.forEach((section) => {
	const category = document.createElement("div");

	const html = `
          <div class="card shadow-lg">
              <div class="card-header ${section.bg} ${section.color}">
                <h2 class="h5 mb-0">
                  <i class="fa ${section.icon} me-2"></i>${section.title}
                </h2>
              </div>
              <div class="card-body bg-light">
                <div class="row g-3">
                  ${section.forms
						.map(
							(form) => `
                    <div class="col-12">
                      <form action="${form.action}" target="_blank" class="input-group">
                        <input type="text" name="${form.param}" class="form-control" placeholder="Search ${form.name}" />
                        <button type="submit" class="input-group-text bg-white">
                          <img src="${form.icon}" alt="${form.name}" width="20" class="me-1" />  
                        </button>
                      </form>
                    </div>`
						)
						.join("")}
                </div>
              </div>
          </div>`;

	category.innerHTML = html;
	container.appendChild(category);
});


