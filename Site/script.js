// Navegação suave
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('.nav-menu a, .hero-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Animação de scroll para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.feature-card, .command-category, .add-option');
    animateElements.forEach(el => observer.observe(el));

    // Contador animado para estatísticas
    const stats = document.querySelectorAll('.stat span');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }, 20);
    };

    // Animar contadores quando visíveis
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statText = entry.target.textContent;
                const number = parseInt(statText.replace(/[^\d]/g, ''));
                if (number) {
                    animateCounter(entry.target, number);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
});

// Sistema de estatísticas em tempo real
async function updateStats() {
    const stats = document.querySelectorAll('.stat span');
    if (stats.length > 0) {
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const statsData = data.data;
                    animateCounter(stats[0], statsData.servers + '+');
                    animateCounter(stats[1], statsData.users + '+');
                    animateCounter(stats[2], statsData.songsPlayed + '+');
                }
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            // Fallback para dados simulados
            animateCounter(stats[0], '50+');
            animateCounter(stats[1], '100+');
            animateCounter(stats[2], '500+');
        }
    }
}

// Sistema de estatísticas em tempo real
function updateStatsPeriodically() {
    // Atualizar estatísticas a cada 30 segundos
    setInterval(updateStats, 30000);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos para notificações
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1db954;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        transform: translateY(-100px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .notification-error {
        background: #ff6b6b;
    }
    
    .notification-success {
        background: #1db954;
    }
    
    .notification-warning {
        background: #ffa726;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2em;
    }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${notificationStyles}</style>`);

// Funções de utilidade
function addToDiscord() {
    const inviteLink = 'https://discord.com/api/oauth2/authorize?client_id=1398354228149354638&permissions=314880&scope=bot%20applications.commands';
    window.open(inviteLink, '_blank');
    showNotification('Link do Discord aberto!', 'success');
}

function copyLink() {
    const inviteLink = 'https://discord.com/api/oauth2/authorize?client_id=1398354228149354638&permissions=314880&scope=bot%20applications.commands';
    navigator.clipboard.writeText(inviteLink).then(() => {
        showNotification('Link copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar link', 'error');
    });
}

function copyCommand() {
    const command = 'n!ajuda';
    try {
        navigator.clipboard.writeText(command).then(() => {
            showNotification('Comando copiado!', 'success');
        });
    } catch (err) {
        showNotification('Erro ao copiar comando', 'error');
    }
}

// Verificar QR code quando a página carregar
function checkQRCodeImage() {
    const qrImage = document.querySelector('.qr-code-image');
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    
    if (qrImage && qrPlaceholder) {
        qrImage.addEventListener('error', function() {
            this.style.display = 'none';
            qrPlaceholder.style.display = 'flex';
        });
        
        qrImage.addEventListener('load', function() {
            qrPlaceholder.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', checkQRCodeImage); 