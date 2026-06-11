/* ==========================================================================
   PORTFOLIO PREMIUM - SCRIPTS DE INTERACTIVIDAD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. NAV TOGGLE (MENÚ MÓVIL HAMBURGUESA)
       -------------------------------------------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Cerrar el menú móvil al hacer clic en cualquier enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    });

    /* --------------------------------------------------------------------------
       2. CABECERA PEGAJOSA (STICKY HEADER)
       -------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Ejecución inicial por si la página carga ya con scroll

    /* --------------------------------------------------------------------------
       3. ILUMINACIÓN ACTIVA SEGÚN SECCIÓN (SCROLL SPY)
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset para compensar el header
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);

    /* --------------------------------------------------------------------------
       4. ENVÍO DE FORMULARIO A WHATSAPP
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const btnSubmit = document.getElementById('btn-submit');

    if (contactForm && formSuccess && btnSubmit) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga de página

            // Activar estado de carga (Spinner)
            const btnText = btnSubmit.querySelector('.btn-text');
            const spinner = btnSubmit.querySelector('.loading-spinner');

            if (btnText && spinner) {
                btnText.textContent = 'Enviando...';
                spinner.classList.remove('hidden');
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.8';
            }

            // Obtener datos de los campos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectSelect = document.getElementById('project-type');
            const projectTypeText = projectSelect.options[projectSelect.selectedIndex].text;
            const message = document.getElementById('message').value.trim();

            // Construir el mensaje formateado para WhatsApp
            const textMessage = `Hola Marco, he llenado el formulario de contacto de tu web para solicitar un servicio:\n\n` +
                                `*Nombre:* ${name}\n` +
                                `*Correo:* ${email}\n` +
                                `*Servicio:* ${projectTypeText}\n` +
                                `*Mensaje:* ${message}`;

            const whatsappNumber = "51993910125";
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;

            // Simular envío y abrir WhatsApp tras 1.5 segundos
            setTimeout(() => {
                // Abrir la URL de WhatsApp en una pestaña nueva
                window.open(whatsappUrl, '_blank');

                // Ocultar formulario y mostrar mensaje de éxito en la interfaz
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                // Resetear campos
                contactForm.reset();
            }, 1500);
        });
    }
});
