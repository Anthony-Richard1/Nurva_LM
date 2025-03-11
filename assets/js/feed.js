// Funcionalidades do feed da Nurva Music

/**
 * Inicializa os carrosséis horizontais em cada seção do feed
 */
function initializeCarousels() {
  const carousels = document.querySelectorAll('.grid-cards');
  
  carousels.forEach(carousel => {
    const section = carousel.closest('.secao');
    
    // Adicionar botões de navegação
    const prevBtn = document.createElement('div');
    const nextBtn = document.createElement('div');
    
    prevBtn.className = 'navigation-indicator nav-prev';
    nextBtn.className = 'navigation-indicator nav-next';
    
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    section.appendChild(prevBtn);
    section.appendChild(nextBtn);
    
    // Eventos de navegação
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: carousel.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -carousel.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    // Detectar quando o mouse está sobre o carrossel para mostrar os botões
    section.addEventListener('mouseenter', () => {
      if (carousel.scrollWidth > carousel.offsetWidth) {
        prevBtn.style.opacity = carousel.scrollLeft > 10 ? '1' : '0.3';
        nextBtn.style.opacity = 
          carousel.scrollLeft < carousel.scrollWidth - carousel.offsetWidth - 10 ? '1' : '0.3';
      }
    });
    
    section.addEventListener('mouseleave', () => {
      prevBtn.style.opacity = '0';
      nextBtn.style.opacity = '0';
    });
    
    // Atualizar estado dos botões durante o scroll
    carousel.addEventListener('scroll', () => {
      prevBtn.style.opacity = carousel.scrollLeft > 10 ? '1' : '0.3';
      nextBtn.style.opacity = 
        carousel.scrollLeft < carousel.scrollWidth - carousel.offsetWidth - 10 ? '1' : '0.3';
    });
  });
}

/**
 * Inicializa as animações de entrada para seções e cards
 */
function initializeFeedAnimations() {
  const sections = document.querySelectorAll('.secao');
  
  // Garantir que todos os cards estejam visíveis desde o início
  const allCards = document.querySelectorAll('.musica, .artista');
  allCards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  
  // Garantir que todas as seções sejam visíveis
  sections.forEach(section => {
    section.classList.add('secao-visible');
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
  });
  
  // Aplicar efeitos de hover e clique
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mousedown', () => {
      card.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('mouseup', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Carrega conteúdo adicional conforme o usuário rola a página
 */
function initializeLazyLoading() {
  // Implementação futura quando o feed for funcional
  console.log('Lazy loading preparado para implementação futura');
}

// Inicializar todas as funcionalidades do feed
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar imediatamente para evitar atrasos visíveis
  initializeCarousels();
  initializeFeedAnimations();
  initializeLazyLoading();
}); 