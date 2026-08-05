/* 
   DVC Estudio Jurídico - Interactividad JS
   Autor: WB Service (https://www.wbserviceinformatica.com.ar)
*/

document.addEventListener('DOMContentLoaded', () => {

    // 0. Años de experiencia dinámicos (se recalculan solos cada año)
    //    👉 Para actualizar, cambiar SOLO este número por el año real de fundación del estudio.
    const ANIO_FUNDACION = 2015; // PROVISORIO — confirmar año real con el cliente (llamada martes 8/7)
    const aniosExactos = new Date().getFullYear() - ANIO_FUNDACION;
    // Redondeo hacia abajo a múltiplos de 5 para que "Más de X" quede prolijo (10, 15, 20…) y siga siendo cierto.
    const aniosExperiencia = Math.max(10, Math.floor(aniosExactos / 5) * 5);
    const expBadge = document.getElementById('exp-years-badge');
    const expAccent = document.getElementById('exp-years-accent');
    if (expBadge) expBadge.textContent = aniosExperiencia;
    if (expAccent) expAccent.textContent = aniosExperiencia + '+';

    // Año del copyright del footer (se actualiza solo)
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // 1. Header Scrolled Styling
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar inicialmente en caso de recarga a mitad de página

    // 2. Control de Menú Móvil Lateral
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    };

    const closeMenu = () => {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. Resaltar Enlaces de Navegación Activos al hacer Scroll (Intersection Observer)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Captura la sección predominante en pantalla
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // 4. Expansor "Ver más" en tarjetas de especialidades con listas largas
    const cardToggles = document.querySelectorAll('.card-toggle');

    cardToggles.forEach(toggle => {
        const card = toggle.closest('.specialty-card');
        const label = toggle.querySelector('.card-toggle-text');
        const openText = label ? label.textContent : 'Ver más';

        toggle.addEventListener('click', () => {
            const isExpanded = card.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            if (label) {
                label.textContent = isExpanded ? 'Ver menos' : openText;
            }
        });
    });

    // 5. Formulario de Contacto: envio por EMAIL (Formspree) + opcion WhatsApp
    //
    //    ⚠️ CONFIGURAR ANTES DE PUBLICAR:
    //    1) Entrar a https://formspree.io y crear una cuenta (gratis, 50 consultas/mes).
    //    2) Crear un formulario nuevo con el email de destino: dvcestudiojuridico@gmail.com
    //    3) Formspree da un endpoint tipo https://formspree.io/f/xdorwqkv
    //       Copiar SOLO el ID final (ej: 'xdorwqkv') y pegarlo abajo.
    //    4) El primer envio real pide confirmar el email una unica vez.
    //    Mientras el ID no este configurado, el formulario avisa y ofrece WhatsApp.
    const FORMSPREE_ID = 'moeaqkad';
    // WhatsApp del estudio (+54 9 3489 69-5430). Confirmado con el cliente el 16/7.
    const WHATSAPP_ESTUDIO = '5493489695430';

    const contactForm = document.getElementById('legal-contact-form');
    const formAlert = document.getElementById('form-alert');

    if (contactForm) {
        const submitBtn = document.getElementById('btn-submit');
        const btnHtmlOriginal = submitBtn ? submitBtn.innerHTML : '';

        const showAlert = (html, type) => {
            formAlert.className = 'form-alert ' + type;
            formAlert.innerHTML = html;
            formAlert.style.display = 'block';
        };

        const buildWhatsappUrl = (d) => {
            const textMsg = `Hola DVC Estudio Jurídico. Envío una consulta:\n\n` +
                            `*Nombre:* ${d.name}\n` +
                            `*Teléfono:* ${d.phone}\n` +
                            `*Email:* ${d.email}\n` +
                            `*Área de interés:* ${d.specialty}\n\n` +
                            `*Consulta:* ${d.message}`;
            return `https://wa.me/${WHATSAPP_ESTUDIO}?text=${encodeURIComponent(textMsg)}`;
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot antispam: si un bot completó el campo invisible, simulamos éxito y no enviamos.
            const gotcha = document.getElementById('fgotcha');
            const honeypot = gotcha ? gotcha.value : '';
            if (honeypot) {
                contactForm.reset();
                showAlert('✓ Consulta enviada correctamente. Le responderemos a la brevedad.', 'success');
                return;
            }

            const data = {
                name: document.getElementById('fname').value.trim(),
                phone: document.getElementById('fphone').value.trim(),
                email: document.getElementById('femail').value.trim(),
                specialty: document.getElementById('fspecialty').value,
                message: document.getElementById('fmessage').value.trim()
            };

            formAlert.className = 'form-alert';
            formAlert.style.display = 'none';

            // Validacion basica
            if (!data.name || !data.phone || !data.email || !data.message) {
                showAlert('Por favor, complete todos los campos obligatorios (*).', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showAlert('Por favor, ingrese una dirección de correo electrónico válida.', 'error');
                return;
            }

            // Consentimiento para el tratamiento de datos personales (Ley 25.326)
            const consent = document.getElementById('fconsent');
            if (consent && !consent.checked) {
                showAlert('Para enviar su consulta debe aceptar la Política de Privacidad.', 'error');
                return;
            }

            const waUrl = buildWhatsappUrl(data);
            const waLink = `<a href="${waUrl}" target="_blank" rel="noopener" class="alert-link">enviarla por WhatsApp</a>`;

            // Si todavia no se configuro Formspree, no simulamos un envio que no ocurre.
            if (FORMSPREE_ID === 'TU_ID_DE_FORMSPREE') {
                showAlert(`El envío por email todavía no está configurado. Puede ${waLink} y le respondemos igual.`, 'error');
                return;
            }

            // Enviar por email
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
            }

            try {
                const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: data.name,
                        telefono: data.phone,
                        email: data.email,
                        area: data.specialty,
                        consulta: data.message,
                        _gotcha: honeypot,
                        _subject: `Nueva consulta web (${data.specialty}) - ${data.name}`
                    })
                });

                if (res.ok) {
                    contactForm.reset();
                    showAlert(`✓ Consulta enviada correctamente. Le responderemos a la brevedad.<br>Si prefiere una respuesta más ágil, también puede ${waLink}.`, 'success');
                } else {
                    showAlert(`No pudimos enviar la consulta en este momento. Por favor, intente nuevamente o ${waLink}.`, 'error');
                }
            } catch (err) {
                showAlert(`Hubo un problema de conexión. Por favor, intente nuevamente o ${waLink}.`, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = btnHtmlOriginal;
                }
            }
        });
    }

    // 6. Animaciones de entrada al hacer scroll (elegantes, respetan prefers-reduced-motion)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const revealGroups = [
            { selector: '.section-header', stagger: 0 },
            { selector: '.nosotros-image-wrapper, .nosotros-content', stagger: 140 },
            { selector: '.specialty-card', stagger: 90 },
            { selector: '.member-card', stagger: 130 },
            { selector: '.contacto-form-container, .sede-card, .otras-vias-card', stagger: 110 }
        ];

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        revealGroups.forEach(group => {
            document.querySelectorAll(group.selector).forEach((el, i) => {
                el.classList.add('reveal');
                if (group.stagger) {
                    el.style.transitionDelay = ((i % 3) * group.stagger) + 'ms';
                }
                revealObserver.observe(el);
            });
        });
    }

    // 7. Parallax sutil del fondo del hero
    if (!reduceMotion) {
        const heroBg = document.querySelector('.hero-bg');
        const heroSection = document.querySelector('.hero-section');
        if (heroBg && heroSection) {
            let ticking = false;
            const applyParallax = () => {
                if (heroSection.getBoundingClientRect().bottom > 0) {
                    heroBg.style.transform = 'translate3d(0, ' + (window.scrollY * 0.2) + 'px, 0)';
                }
                ticking = false;
            };
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(applyParallax);
                    ticking = true;
                }
            }, { passive: true });
        }
    }
});
