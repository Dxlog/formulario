const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressBar = document.getElementById("progress-bar");
const stepIndicators = document.querySelectorAll("#progress-steps li");

let currentStep = 0;

function updateFormSteps() {
  steps.forEach((step,index)=>step.classList.toggle("active", index===currentStep));
  stepIndicators.forEach((indicator,index)=>indicator.classList.toggle("active", index<=currentStep));
  progressBar.style.width = `${(currentStep/(steps.length-1))*100}%`;
}

nextBtns.forEach(btn => btn.addEventListener("click", () => {
  if(currentStep<steps.length-1){ currentStep++; updateFormSteps(); }
}));

prevBtns.forEach(btn => btn.addEventListener("click", () => {
  if(currentStep>0){ currentStep--; updateFormSteps(); }
}));

/* === Botões Sim / Não === */
const toggleGroups = document.querySelectorAll(".toggle-btns");
toggleGroups.forEach(group=>{
  const buttons = group.querySelectorAll("button");
  const field = group.dataset.field;
  const conditional = document.querySelector(`.conditional.${field}`);
  buttons.forEach(button=>{
    button.addEventListener("click", ()=>{
      buttons.forEach(b=>b.classList.remove("active"));
      button.classList.add("active");
      if(button.dataset.value==="sim"){ conditional.classList.remove("hidden"); } 
      else{ conditional.classList.add("hidden"); }
      const hiddenInput = group.querySelector(`input[name="${field}_hidden"]`);
      if(hiddenInput){ hiddenInput.value = button.dataset.value; }
    });
  });
});

/* === EmailJS + jsPDF === */
const EMAILJS_SERVICE_ID = 'service_j3h34ih';
const EMAILJS_TEMPLATE_ID = 'template_xknc0k5';
const EMAILJS_PUBLIC_KEY = 'QmXUKZJcC3OiOdYGL';
emailjs.init(EMAILJS_PUBLIC_KEY);

async function gerarPdfDataUri(formDataObj){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  const margin=40; let y=margin; const sectionGap=18; const titleBgHeight=28; const titlePadding=8;
  const pageWidth = doc.internal.pageSize.getWidth();

  function drawSectionTitle(title){
    doc.setFillColor(255,127,50);
    doc.roundedRect(margin,y,140,titleBgHeight,6,6,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(10,10,10);
    doc.text(title.toUpperCase(), margin+152, y+titleBgHeight/1.7); y+=titleBgHeight+titlePadding;
  }

  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text('FICHA DE AVALIAÇÃO', pageWidth/2, y, {align:'center'}); y+=28;

  const addLines = lines => { doc.setFontSize(10); doc.setFont('helvetica','normal');
    lines.forEach(line=>{ doc.text(line,margin,y); y+=14; }); y+=sectionGap; }

  drawSectionTitle('Informações Pessoais');
  addLines([`Nome: ${formDataObj.nome||'—'}`, `Idade: ${formDataObj.idade||'—'}`, `Peso: ${formDataObj.peso||'—'}`, 
  `Altura: ${formDataObj.altura||'—'}`, `Endereço: ${formDataObj.endereco||'—'}`, `Instagram: ${formDataObj.instagram||'—'}`,
  `Objetivos: ${formDataObj.objetivos||'—'}`]);

  drawSectionTitle('Rotina Diária');
  addLines([`Acorda: ${formDataObj.acorda||'—'}`, `Trabalho: ${formDataObj.trabalho_inicio||'—'} até ${formDataObj.trabalho_fim||'—'}`,
  `Horário de treino: ${formDataObj.treino_horario||'—'}`, `Dorme: ${formDataObj.dorme||'—'}`]);

  drawSectionTitle('Alimentação');
  addLines([`Restrição/alergia: ${formDataObj.restricao_quais||'Não'}`, `Incluir: ${formDataObj.incluir_alimentos||'—'}`,
  `Não incluir: ${formDataObj.excluir_quais||'—'}`, `Frutas, legumes e verduras preferidos: ${formDataObj.preferencias_flv||'—'}`,
  `Alimentação atual: ${formDataObj.alimentacao_atual||'—'}`, `Leva marmita: ${formDataObj.marmita||'Não'}`]);

  drawSectionTitle('Saúde & Exercícios');
  addLines([`Alergia: ${formDataObj.alergia_quais||'Não'}`, `Doença crônica: ${formDataObj.doenca_quais||'Não'}`,
  `Lesão: ${formDataObj.lesao_quais||'Não'}`, `Realiza atividades aeróbicas: ${formDataObj.aerobico||'Não'}`,
  `Horário aeróbico: ${formDataObj.aerobico_horario||'—'}`, `Freq. treino/semana: ${formDataObj.freq_treino||'—'}`,
  `Tipo treino: ${formDataObj.tipo_treino||'—'}`]);

  drawSectionTitle('Suplementos & Protocolos');
  addLines([`Suplementos: ${formDataObj.suplemento_quais||'Não'}`, `Protocolo hormonal: ${formDataObj.hormonal_quais||'—'}`]);

  drawSectionTitle('Observações');
  addLines([`${formDataObj.observacoes||'—'}`]);

  return doc.output('datauristring');
}

document.getElementById('multiStepForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const formData = new FormData(e.target);
  const formDataObj = {};
  formData.forEach((v,k)=>formDataObj[k]=v);
  const pdfDataUri = await gerarPdfDataUri(formDataObj);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: 'diegossilva03@gmail.com',
    message: 'Ficha de avaliação em anexo',
    attachment: pdfDataUri
  }).then(()=>{ alert('Formulário enviado com sucesso!'); e.target.reset(); currentStep=0; updateFormSteps(); })
    .catch(err=>{ alert('Erro ao enviar: '+err); });
});
