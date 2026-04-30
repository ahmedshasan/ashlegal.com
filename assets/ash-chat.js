/**
 * ASH Chat Widget
 *
 * Self-contained intake chatbot for ASH Legal. Floating button bottom-right,
 * branded panel, Netlify Forms submission. No third-party dependencies.
 *
 * Disclosure: introduces itself as an automated intake assistant, not the
 * attorney. Compliant with California Bus & Prof Code 6157.1.
 */
(function () {
    'use strict';

    if (window.__ashChatLoaded) return;
    window.__ashChatLoaded = true;

    // ===== STYLES =====
    const css = `
        .ash-chat-fab {
            position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 60;
            width: 60px; height: 60px; border-radius: 9999px;
            background: #582A35; color: #F0EAD6; border: 2px solid #C5A065;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 10px 25px -5px rgba(42, 26, 30, 0.5);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            font-family: 'Manrope', sans-serif;
        }
        .ash-chat-fab:hover { transform: scale(1.06); box-shadow: 0 14px 30px -5px rgba(42, 26, 30, 0.6); }
        .ash-chat-fab svg { width: 26px; height: 26px; stroke: #F0EAD6; fill: none; stroke-width: 2; }
        .ash-chat-fab[data-open="true"] svg.ash-chat-icon-open { display: none; }
        .ash-chat-fab[data-open="true"] svg.ash-chat-icon-close { display: block; }
        .ash-chat-fab svg.ash-chat-icon-close { display: none; }

        .ash-chat-panel {
            position: fixed; bottom: 6rem; right: 1.25rem; z-index: 59;
            width: 380px; max-width: calc(100vw - 2.5rem);
            background: #F0EAD6; color: #2A1A1E;
            border: 1px solid rgba(88, 42, 53, 0.2);
            border-radius: 12px; overflow: hidden;
            box-shadow: 0 20px 50px -10px rgba(42, 26, 30, 0.4);
            font-family: 'Manrope', sans-serif;
            transform-origin: bottom right;
            opacity: 0; transform: translateY(12px) scale(0.96);
            transition: opacity 0.22s ease, transform 0.22s ease;
            pointer-events: none;
        }
        .ash-chat-panel[data-open="true"] {
            opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
        }

        .ash-chat-header {
            background: #2A1A1E; color: #F0EAD6;
            padding: 16px 20px; display: flex; align-items: center; gap: 12px;
        }
        .ash-chat-header-mark {
            width: 36px; height: 36px; border-radius: 9999px; background: #582A35;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Playfair Display', serif; font-weight: 700; color: #F0EAD6;
            font-size: 14px; letter-spacing: 0.04em;
        }
        .ash-chat-header-text { flex: 1; }
        .ash-chat-header-title {
            font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600;
            line-height: 1.1;
        }
        .ash-chat-header-sub {
            font-size: 11px; color: rgba(240, 234, 214, 0.6);
            text-transform: uppercase; letter-spacing: 0.15em; margin-top: 2px;
        }

        .ash-chat-body {
            padding: 20px; max-height: 60vh; overflow-y: auto;
        }

        .ash-chat-greeting {
            background: rgba(88, 42, 53, 0.06); border-left: 2px solid #C5A065;
            padding: 12px 14px; border-radius: 4px;
            font-size: 14px; line-height: 1.55; color: #2A1A1E;
            margin-bottom: 18px;
        }
        .ash-chat-greeting strong { color: #582A35; font-weight: 600; }

        .ash-chat-form { display: flex; flex-direction: column; gap: 12px; }
        .ash-chat-field { display: flex; flex-direction: column; gap: 4px; }
        .ash-chat-label {
            font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
            color: rgba(42, 26, 30, 0.6); font-weight: 600;
        }
        .ash-chat-input, .ash-chat-textarea {
            background: #FFFFFF; border: 1px solid rgba(88, 42, 53, 0.2);
            border-radius: 6px; padding: 10px 12px; font-size: 14px;
            color: #2A1A1E; font-family: inherit; resize: vertical;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ash-chat-input:focus, .ash-chat-textarea:focus {
            outline: none; border-color: #582A35;
            box-shadow: 0 0 0 3px rgba(88, 42, 53, 0.12);
        }
        .ash-chat-textarea { min-height: 70px; max-height: 140px; }

        .ash-chat-submit {
            background: #582A35; color: #F0EAD6; border: 0;
            border-radius: 6px; padding: 12px 16px; font-size: 14px; font-weight: 600;
            cursor: pointer; transition: background 0.2s ease, transform 0.1s ease;
            font-family: inherit; letter-spacing: 0.02em; margin-top: 4px;
        }
        .ash-chat-submit:hover { background: #421C24; }
        .ash-chat-submit:active { transform: translateY(1px); }
        .ash-chat-submit:disabled { background: #888; cursor: wait; }

        .ash-chat-disclaimer {
            font-size: 11px; line-height: 1.5; color: rgba(42, 26, 30, 0.55);
            margin-top: 14px; padding-top: 14px;
            border-top: 1px solid rgba(88, 42, 53, 0.1);
        }
        .ash-chat-disclaimer a { color: #582A35; text-decoration: underline; }

        .ash-chat-success {
            text-align: center; padding: 20px 8px;
        }
        .ash-chat-success-icon {
            width: 56px; height: 56px; border-radius: 9999px; background: rgba(197, 160, 101, 0.18);
            color: #C5A065; display: flex; align-items: center; justify-content: center;
            margin: 0 auto 14px;
        }
        .ash-chat-success-icon svg { width: 28px; height: 28px; }
        .ash-chat-success-title {
            font-family: 'Playfair Display', serif; font-size: 22px; color: #582A35;
            margin-bottom: 6px;
        }
        .ash-chat-success-text {
            font-size: 14px; line-height: 1.55; color: #2A1A1E;
        }
        .ash-chat-success-call {
            margin-top: 16px; padding: 12px;
            background: rgba(88, 42, 53, 0.06); border-radius: 6px;
            font-size: 13px; line-height: 1.5;
        }
        .ash-chat-success-call a { color: #582A35; font-weight: 600; text-decoration: none; }

        @media (max-width: 480px) {
            .ash-chat-panel {
                right: 0.75rem; left: 0.75rem; bottom: 5.5rem; width: auto; max-width: none;
            }
            .ash-chat-fab { bottom: 1rem; right: 1rem; width: 54px; height: 54px; }
            .ash-chat-fab svg { width: 22px; height: 22px; }
        }
    `;

    // ===== HTML =====
    const html = `
        <button type="button" class="ash-chat-fab" aria-label="Chat with ASH Legal" aria-expanded="false">
            <svg class="ash-chat-icon-open" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-3.8-7.32L21 4l-1.2 3.6A8.95 8.95 0 0 1 21 12Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 11h.01M12 11h.01M16 11h.01"/>
            </svg>
            <svg class="ash-chat-icon-close" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <div class="ash-chat-panel" role="dialog" aria-label="ASH Legal intake chat" data-open="false">
            <div class="ash-chat-header">
                <div class="ash-chat-header-mark">ASH</div>
                <div class="ash-chat-header-text">
                    <div class="ash-chat-header-title">ASH Intake Assistant</div>
                    <div class="ash-chat-header-sub">Replies within 1 hour</div>
                </div>
            </div>
            <div class="ash-chat-body">
                <div class="ash-chat-form-wrapper">
                    <div class="ash-chat-greeting">
                        Hi — I'm <strong>ASH's intake bot</strong>. Ahmed responds personally within 1 hour. Urgent? Call <a href="tel:5105456515" style="color:#582A35;font-weight:600;">(510) 545-6515</a>.
                    </div>

                    <form class="ash-chat-form" name="chat-intake" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" novalidate>
                        <input type="hidden" name="form-name" value="chat-intake" />
                        <p style="display:none"><label>Don't fill this out: <input name="bot-field" /></label></p>

                        <div class="ash-chat-field">
                            <label class="ash-chat-label" for="ash-chat-name">Name</label>
                            <input type="text" id="ash-chat-name" name="name" class="ash-chat-input" required placeholder="Your name" autocomplete="name" />
                        </div>
                        <div class="ash-chat-field">
                            <label class="ash-chat-label" for="ash-chat-phone">Phone</label>
                            <input type="tel" id="ash-chat-phone" name="phone" class="ash-chat-input" required placeholder="(555) 123-4567" autocomplete="tel" />
                        </div>
                        <div class="ash-chat-field">
                            <label class="ash-chat-label" for="ash-chat-email">Email</label>
                            <input type="email" id="ash-chat-email" name="email" class="ash-chat-input" required placeholder="you@example.com" autocomplete="email" />
                        </div>
                        <div class="ash-chat-field">
                            <label class="ash-chat-label" for="ash-chat-message">What's going on?</label>
                            <textarea id="ash-chat-message" name="message" class="ash-chat-textarea" required placeholder="A few words about your situation..."></textarea>
                        </div>

                        <button type="submit" class="ash-chat-submit">Send to Ahmed</button>
                    </form>

                    <div class="ash-chat-disclaimer">
                        Submitting this form does not create an attorney-client relationship. See the <a href="/disclaimer">Disclaimer</a> and <a href="/privacy">Privacy Policy</a>.
                    </div>
                </div>

                <div class="ash-chat-success" hidden>
                    <div class="ash-chat-success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div class="ash-chat-success-title">Got it.</div>
                    <div class="ash-chat-success-text">
                        Ahmed will respond personally within 1 hour during business hours. After hours? You'll hear from him first thing tomorrow.
                    </div>
                    <div class="ash-chat-success-call">
                        Urgent? Call <a href="tel:5105456515">(510) 545-6515</a> directly.
                    </div>
                </div>
            </div>
        </div>
    `;

    // ===== INSTALL =====
    function install() {
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        const container = document.createElement('div');
        container.id = 'ash-chat-widget';
        container.innerHTML = html;
        document.body.appendChild(container);

        const fab = container.querySelector('.ash-chat-fab');
        const panel = container.querySelector('.ash-chat-panel');
        const form = container.querySelector('form.ash-chat-form');
        const formWrapper = container.querySelector('.ash-chat-form-wrapper');
        const success = container.querySelector('.ash-chat-success');
        const submitBtn = container.querySelector('.ash-chat-submit');

        function setOpen(open) {
            panel.dataset.open = open ? 'true' : 'false';
            fab.dataset.open = open ? 'true' : 'false';
            fab.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) {
                setTimeout(() => container.querySelector('#ash-chat-name')?.focus(), 250);
            }
        }

        fab.addEventListener('click', () => {
            const isOpen = panel.dataset.open === 'true';
            setOpen(!isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.dataset.open === 'true') setOpen(false);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            try {
                const formData = new FormData(form);
                const params = new URLSearchParams();
                for (const [key, value] of formData.entries()) params.append(key, value);

                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                });

                if (!response.ok) throw new Error('Form submission failed: ' + response.status);

                formWrapper.hidden = true;
                success.hidden = false;
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send to Ahmed';
                alert('Something went wrong sending your message. Please call (510) 545-6515 directly or email ahmed@ashlegal.com.');
                console.error('ASH Chat submission error:', err);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', install);
    } else {
        install();
    }
})();
