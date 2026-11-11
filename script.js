const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteNav?.classList.toggle("is-open", !isExpanded);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const briefingForm = document.querySelector("#event-briefing-form");
const serviceInputs = [...(briefingForm?.querySelectorAll('input[name="services"]') ?? [])];
const briefingStatus = document.querySelector("#briefing-status");

function validateServiceSelection() {
  const hasSelection = serviceInputs.some((input) => input.checked);
  serviceInputs[0]?.setCustomValidity(hasSelection ? "" : "Selecione pelo menos uma frente de serviço.");
}

serviceInputs.forEach((input) => input.addEventListener("change", validateServiceSelection));

briefingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  validateServiceSelection();
  if (!briefingForm.reportValidity()) return;

  const data = new FormData(briefingForm);
  const eventDate = String(data.get("eventDate") ?? "");
  const formattedDate = eventDate
    ? new Date(`${eventDate}T12:00:00`).toLocaleDateString("pt-BR")
    : "";
  const selectedServices = serviceInputs
    .filter((input) => input.checked)
    .map((input) => input.value);
  const notes = String(data.get("eventNotes") ?? "").trim();
  const body = [
    "Olá, equipe VZ! Gostaria de conversar sobre o apoio para este evento.",
    "",
    `Evento: ${String(data.get("eventName") ?? "").trim()}`,
    `Data prevista: ${formattedDate}`,
    `Cidade ou local: ${String(data.get("eventLocation") ?? "").trim()}`,
    `Serviços de interesse: ${selectedServices.join(", ")}`,
    ...(notes ? ["", `Observações: ${notes}`] : []),
  ].join("\n");
  const subject = encodeURIComponent(`Pedido de atendimento para evento - ${String(data.get("eventName") ?? "").trim()}`);
  const encodedBody = encodeURIComponent(body);

  if (briefingStatus) {
    briefingStatus.textContent = "Abrindo seu aplicativo de e-mail com os dados do evento.";
  }
  window.location.href = `mailto:atendimento@vzpromocoeseventos.com.br?subject=${subject}&body=${encodedBody}`;
});
