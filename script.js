const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressBar = document.getElementById("progress-bar");
const stepIndicators = document.querySelectorAll("#progress-steps li");

let currentStep = 0;

function updateFormSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  stepIndicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index <= currentStep);
  });

  const progress = ((currentStep) / (steps.length - 1)) * 100;
  progressBar.style.setProperty("--progress", progress + "%");
  progressBar.style.width = `${progress}%`;
}

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateFormSteps();
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateFormSteps();
    }
  });
});

/* === BOTÕES SIM / NÃO === */
const toggleGroups = document.querySelectorAll(".toggle-btns");

toggleGroups.forEach(group => {
  const buttons = group.querySelectorAll("button");
  const field = group.dataset.field;
  const conditional = document.querySelector(`.conditional.${field}`);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      if (button.dataset.value === "sim") {
        conditional.classList.remove("hidden");
      } else {
        conditional.classList.add("hidden");
      }
    });
  });
});

/* === SUBMIT FINAL === */
document.getElementById("multiStepForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
});
