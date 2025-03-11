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
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('secao-visible');
        observer.unobserve(entry.target);
        
        // Animar os cards dentro da seção
        const cards = entry.target.querySelectorAll('.musica, .artista');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Configurar os cards para animação
  const allCards = document.querySelectorAll('.musica, .artista');
  allCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
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
  // Pequeno atraso para garantir que outros scripts foram carregados
  setTimeout(() => {
    initializeCarousels();
    initializeFeedAnimations();
    initializeLazyLoading();
  }, 100);
}); 