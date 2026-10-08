(function () {
    "use strict";

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const sidebar = $(".sidebar");
    const toggle = $(".mobile-toggle");
    const overlay = $(".overlay");

    function setSidebar(open) {
        if (!sidebar) return;
        sidebar.classList.toggle("open", open);
        overlay?.classList.toggle("show", open);
        document.body.style.overflow = open ? "hidden" : "";
    }

    toggle?.addEventListener("click", () => setSidebar(!sidebar.classList.contains("open")));
    overlay?.addEventListener("click", () => setSidebar(false));
    $$(".sidebar a").forEach(link => link.addEventListener("click", () => setSidebar(false)));

    $$("form[data-demo-form]").forEach(form => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const target = form.dataset.redirect;
            const message = form.dataset.message || "Acción realizada correctamente.";
            showToast(message);
            if (target) {
                setTimeout(() => { window.location.href = target; }, 350);
            }
        });
    });

    $$("[data-tab-button]").forEach(button => {
        button.addEventListener("click", () => {
            const group = button.closest("[data-tab-group]");
            const target = button.dataset.tabButton;
            $$("[data-tab-button]", group).forEach(btn => btn.classList.remove("active"));
            $$("[data-tab-panel]", group).forEach(panel => panel.classList.add("hidden"));
            button.classList.add("active");
            const panel = $(`[data-tab-panel="${target}"]`, group);
            panel?.classList.remove("hidden");
        });
    });

    const searchForm = $("#searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            const origin = $("#origen")?.value.trim().toLowerCase() || "";
            const destination = $("#destino")?.value.trim().toLowerCase() || "";
            const date = $("#fecha")?.value || "";
            const results = $$("[data-trip-result]");
            let shown = 0;

            results.forEach(card => {
                const matchesOrigin = !origin || card.dataset.origin.includes(origin);
                const matchesDestination = !destination || card.dataset.destination.includes(destination);
                const matchesDate = !date || card.dataset.date === date;
                const visible = matchesOrigin && matchesDestination && matchesDate;
                card.classList.toggle("hidden", !visible);
                if (visible) shown++;
            });

            const status = $("#searchStatus");
            if (status) status.textContent = `${shown} resultado(s) encontrado(s).`;
        });
    }

    const stars = $$(".star");
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            stars.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex <= index));
            const output = $("#ratingValue");
            if (output) output.textContent = `${index + 1} de 5 estrellas`;
        });
    });

    $$("[data-modal-open]").forEach(button => {
        button.addEventListener("click", () => {
            const modal = $(button.dataset.modalOpen);
            modal?.classList.add("show");
        });
    });
    $$("[data-modal-close]").forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal-backdrop");
            modal?.classList.remove("show");
        });
    });
    $$(".modal-backdrop").forEach(backdrop => {
        backdrop.addEventListener("click", event => {
            if (event.target === backdrop) backdrop.classList.remove("show");
        });
    });

    const profileForm = $("#profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(profileForm).entries());
            localStorage.setItem("cumaraProfile", JSON.stringify(data));
            showToast("Cambios guardados correctamente.");
        });

        const saved = localStorage.getItem("cumaraProfile");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.entries(data).forEach(([key, value]) => {
                    const field = profileForm.elements.namedItem(key);
                    if (field) field.value = value;
                });
            } catch (_) {}
        }
    }

    function showToast(message) {
        let toast = $("#cumaraToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cumaraToast";
            toast.style.position = "fixed";
            toast.style.right = "1rem";
            toast.style.bottom = "1rem";
            toast.style.zIndex = "100";
            toast.style.padding = ".8rem 1rem";
            toast.style.background = "#0B5D67";
            toast.style.color = "#FFFFFF";
            toast.style.borderRadius = "8px";
            toast.style.boxShadow = "0 8px 24px rgba(28,31,42,.18)";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove("hidden");
        clearTimeout(window.__cumaraToastTimer);
        window.__cumaraToastTimer = setTimeout(() => toast.remove(), 2300);
    }
})();
