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

    /* --------------------------------------------------------------------------
       5. SISTEMA DE RECORDATORIOS (LOCALSTORAGE, WEB AUDIO & VIBRATION)
       -------------------------------------------------------------------------- */
    const reminderForm = document.getElementById('reminder-form');
    const remindersList = document.getElementById('reminders-list');
    const enableNotificationsBtn = document.getElementById('enable-notifications');

    let reminders = JSON.parse(localStorage.getItem('marco_reminders')) || [];

    // Formatear fecha y hora para mostrar
    const formatDateTime = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year} a las ${timeStr}`;
    };

    // Renderizar lista de recordatorios
    const renderReminders = () => {
        if (!remindersList) return;

        if (reminders.length === 0) {
            remindersList.innerHTML = `
                <div class="reminders-empty">
                    <p>No tienes recordatorios programados. ¡Agrega el primero arriba!</p>
                </div>
            `;
            return;
        }

        // Ordenar por fecha/hora
        reminders.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        remindersList.innerHTML = '';
        reminders.forEach(reminder => {
            const isTriggered = reminder.triggered;
            const item = document.createElement('div');
            item.className = `reminder-item ${isTriggered ? 'triggered' : ''}`;
            item.innerHTML = `
                <div class="reminder-details">
                    <span class="reminder-title-text">${reminder.title}</span>
                    <span class="reminder-time-text">${formatDateTime(reminder.date, reminder.time)} ${isTriggered ? '(Activado)' : '(Pendiente)'}</span>
                </div>
                <button class="reminder-delete-btn" data-id="${reminder.id}" aria-label="Eliminar recordatorio">
                    <!-- Icono Trash SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trash-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            `;
            remindersList.appendChild(item);
        });

        // Configurar botones de eliminar
        document.querySelectorAll('.reminder-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                reminders = reminders.filter(r => r.id !== id);
                localStorage.setItem('marco_reminders', JSON.stringify(reminders));
                renderReminders();
            });
        });
    };

    // Habilitar permisos de notificación
    if (enableNotificationsBtn) {
        enableNotificationsBtn.addEventListener('click', () => {
            if (!('Notification' in window)) {
                alert('Este navegador no soporta notificaciones de escritorio.');
                return;
            }

            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    // Activar audio y vibración breve de prueba
                    playAlarmSound();
                    triggerVibration();
                    
                    new Notification("¡Permisos Concedidos!", {
                        body: "Recibirás las notificaciones de tus alarmas de Marco.mkt.",
                        icon: "img/icon-192.png"
                    });
                    
                    enableNotificationsBtn.innerHTML = "🔔 Notificaciones Activadas";
                    enableNotificationsBtn.style.borderColor = "#10B981";
                    enableNotificationsBtn.style.color = "#10B981";
                } else {
                    alert('Permisos de notificación denegados. Habilítalos en la barra de direcciones.');
                }
            });
        });

        // Actualizar visualización del botón si ya tiene permisos
        if ('Notification' in window && Notification.permission === 'granted') {
            enableNotificationsBtn.innerHTML = "🔔 Notificaciones Activadas";
            enableNotificationsBtn.style.borderColor = "#10B981";
            enableNotificationsBtn.style.color = "#10B981";
        }
    }

    // Agregar nuevo recordatorio
    if (reminderForm) {
        reminderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('reminder-title').value.trim();
            const date = document.getElementById('reminder-date').value;
            const time = document.getElementById('reminder-time').value;

            const newReminder = {
                id: Date.now(),
                title,
                date,
                time,
                triggered: false
            };

            reminders.push(newReminder);
            localStorage.setItem('marco_reminders', JSON.stringify(reminders));
            reminderForm.reset();
            renderReminders();
            
            // Solicitar permisos tácitamente al programar si no están concedidos
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        });
    }

    // Reproducir tono de alarma sintético (Web Audio API)
    function playAlarmSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();
            
            const playTone = (time, freq, dur) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                osc.frequency.setValueAtTime(freq, time);
                osc.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.4, time + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, time + dur);
                
                osc.start(time);
                osc.stop(time + dur);
            };

            const now = audioCtx.currentTime;
            playTone(now, 880, 0.25);
            playTone(now + 0.3, 880, 0.25);
            playTone(now + 0.6, 1100, 0.4);
        } catch (err) {
            console.warn("La reproducción de sonido falló: requiere interacción previa del usuario.", err);
        }
    }

    // Activar vibración en dispositivos móviles soportados
    function triggerVibration() {
        if ('vibrate' in navigator) {
            navigator.vibrate([400, 200, 400, 200, 600]);
        }
    }

    // Enviar notificación de sistema
    function sendNotification(titleText) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(titleText, {
                body: "¡Alarma activada en Marco.mkt!",
                icon: "img/icon-192.png",
                vibrate: [200, 100, 200],
                tag: 'reminder-' + Date.now()
            });
        }
    }

    // Bucle de chequeo continuo (cada 5 segundos)
    const checkReminders = () => {
        let hasChanges = false;
        const now = new Date();

        reminders.forEach(reminder => {
            if (!reminder.triggered) {
                const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
                
                // Si la hora actual es mayor o igual a la programada
                if (now >= reminderTime) {
                    reminder.triggered = true;
                    hasChanges = true;

                    // Desencadenar alarmas
                    playAlarmSound();
                    triggerVibration();
                    sendNotification(reminder.title);
                }
            }
        });

        if (hasChanges) {
            localStorage.setItem('marco_reminders', JSON.stringify(reminders));
            renderReminders();
        }
    };

    // Ejecutar render inicial y configurar intervalo
    renderReminders();
    setInterval(checkReminders, 5000);


    /* --------------------------------------------------------------------------
       6. REGISTRO DE SERVICE WORKER (PWA)
       -------------------------------------------------------------------------- */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[PWA] Service Worker registrado con éxito', reg.scope))
                .catch(err => console.error('[PWA] Error registrando Service Worker', err));
        });
    }
});
