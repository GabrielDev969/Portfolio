const translations = {
    pt: {
        title: "Gabriel Santos - Portfólio",
        name: "Gabriel Santos",
        "nav-about": "Sobre",
        "nav-technologies": "Tecnologias",
        "nav-projects": "Projetos",
        "nav-contact": "Contato",
        "hero-title": "Olá, eu sou Gabriel Santos",
        "hero-subtitle": "Um desenvolvedor apaixonado que busca melhorar a vida das pessoas com a tecnologia",
        "hero-cta": "Entre em contato",
        "about-title": "Sobre Mim",
        "about-text": "Sou um desenvolvedor de software dedicado e apaixonado por criar soluções inovadoras. Com experiência em desenvolvimento web e sólida formação em tecnologias como Python, Django, Typescript, JavaScript, Node e C#, meu foco é resolver problemas complexos, entregar aplicativos fáceis de usar e que ajude a facilitar a vida das pessoas. No meu tempo livre, gosto de explorar novos frameworks e busco contribuir para projetos de código aberto.",
        "technologies-title": "Tecnologias com as quais trabalho",
        "tech-python": "Python",
        "tech-javascript": "JavaScript",
        "tech-react": "React",
        "tech-django": "Django",
        "projects-title": "Meus Projetos",
        "project1-title": "BookOwl",
        "project1-desc": "Um sistema de gerenciamento de biblioteca usando Django, com recursos de autenticação de usuário e rastreamento de livros.",
        "project2-title": "Site Piano Só Para Baixinhos",
        "project2-desc": "Um site estático para trabalho de piano para crianças.",
        "project-cta": "Ver Projeto",
        "contact-title": "Entre em contato",
        "contact-text": "Estou sempre aberto a novas oportunidades e colaborações. Entre em contato comigo!",
        "contact-email": "gabriel.dev969@gmail.com",
        "footer": "© 2025 Gabriel Santos. Todos os direitos reservados."
    },
    en: {
        title: "Gabriel Santos - Portfolio",
        name: "Gabriel Santos",
        "nav-about": "About",
        "nav-technologies": "Technologies",
        "nav-projects": "Projects",
        "nav-contact": "Contact",
        "hero-title": "Hello, I'm Gabriel Santos",
        "hero-subtitle": "A passionate developer aiming to improve people's lives through technology",
        "hero-cta": "Get in Touch",
        "about-title": "About Me",
        "about-text": "I am a dedicated software developer passionate about creating innovative solutions. With experience in web development and a strong background in technologies like Python, Django, TypeScript, JavaScript, Node, and C#, my focus is on solving complex problems and delivering user-friendly applications that make life easier. In my free time, I enjoy exploring new frameworks and contributing to open-source projects.",
        "technologies-title": "Technologies I Work With",
        "tech-python": "Python",
        "tech-javascript": "JavaScript",
        "tech-react": "React",
        "tech-django": "Django",
        "projects-title": "My Projects",
        "project1-title": "BookOwl",
        "project1-desc": "A library management system built with Django, featuring user authentication and book tracking.",
        "project2-title": "Piano for Kids Website",
        "project2-desc": "A static website for a children's piano teaching service.",
        "project-cta": "View Project",
        "contact-title": "Get in Touch",
        "contact-text": "I'm always open to new opportunities and collaborations. Reach out to me!",
        "contact-email": "gabriel.dev969@gmail.com",
        "footer": "© 2025 Gabriel Santos. All rights reserved."
    },
    es: {
        title: "Gabriel Santos - Portafolio",
        name: "Gabriel Santos",
        "nav-about": "Sobre Mí",
        "nav-technologies": "Tecnologías",
        "nav-projects": "Proyectos",
        "nav-contact": "Contacto",
        "hero-title": "Hola, soy Gabriel Santos",
        "hero-subtitle": "Un desarrollador apasionado que busca mejorar la vida de las personas con la tecnología",
        "hero-cta": "Ponte en contacto",
        "about-title": "Sobre Mí",
        "about-text": "Soy un desarrollador de software dedicado y apasionado por crear soluciones innovadoras. Con experiencia en desarrollo web y una sólida formación en tecnologías como Python, Django, TypeScript, JavaScript, Node y C#, mi enfoque es resolver problemas complejos y entregar aplicaciones fáciles de usar que ayuden a facilitar la vida de las personas. En mi tiempo libre, me gusta explorar nuevos frameworks y contribuir a proyectos de código abierto.",
        "technologies-title": "Tecnologías con las que trabajo",
        "tech-python": "Python",
        "tech-javascript": "JavaScript",
        "tech-react": "React",
        "tech-django": "Django",
        "projects-title": "Mis Proyectos",
        "project1-title": "BookOwl",
        "project1-desc": "Un sistema de gestión de bibliotecas con Django, con autenticación de usuarios y seguimiento de libros.",
        "project2-title": "Sitio Web Piano Para Niños",
        "project2-desc": "Un sitio web estático para un servicio de enseñanza de piano para niños.",
        "project-cta": "Ver Proyecto",
        "contact-title": "Ponte en contacto",
        "contact-text": "Siempre estoy abierto a nuevas oportunidades y colaboraciones. ¡Contáctame!",
        "contact-email": "gabriel.dev969@gmail.com",
        "footer": "© 2025 Gabriel Santos. Todos los derechos reservados."
    }
};

// Navbar responsive toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
});

function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.title = translations[lang].title;
    
    // Define o atributo lang da página (pt-br, en, es)
    const langAttr = { pt: 'pt-br', en: 'en', es: 'es' };
    document.documentElement.lang = langAttr[lang] || 'pt-br';

    // Define a bandeira correta no botão principal
    const flags = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' };
    document.getElementById('language-toggle').textContent = flags[lang] || '🇧🇷';
    
    localStorage.setItem('language', lang);
    document.getElementById('language-dropdown').classList.add('hidden');
    document.getElementById('language-toggle').setAttribute('aria-expanded', 'false');
}

// Toggle dropdown visibility
document.getElementById('language-toggle').addEventListener('click', () => {
    const dropdown = document.getElementById('language-dropdown');
    const isHidden = dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', !isHidden);
    document.getElementById('language-toggle').setAttribute('aria-expanded', isHidden);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('language-dropdown');
    const toggle = document.getElementById('language-toggle');
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
    }
});

// Initialize language
const savedLang = localStorage.getItem('language') || 'pt';
updateLanguage(savedLang);

// Smooth Scroll Script
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fecha o menu mobile ao clicar em um link de navegação
const navLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});