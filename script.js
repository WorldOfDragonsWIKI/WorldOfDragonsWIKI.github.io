/* script.js
   Funções separadas e comentadas para:
    - Scroll suave a partir do Hero
    - Comportamento do accordion (apenas 1 aberto por vez)
    - Animação de abertura suave usando max-height
    - Injeção do ano atual no footer
*/

/* ===== Helpers ===== */

/**
 * Smoothly scrolls the window to an element.
 * @param {Element} targetEl - Element to scroll to.
 */
function smoothScrollTo(targetEl) {
  if (!targetEl) return;
  const top = targetEl.getBoundingClientRect().top + window.scrollY - 20; // pequeno offset
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

/**
 * Sets the max-height of a panel to its scrollHeight to enable CSS transition.
 * @param {HTMLElement} panel
 */
function openPanel(panel) {
  panel.style.maxHeight = panel.scrollHeight + 'px';
}

/**
 * Collapses a panel by clearing maxHeight.
 * @param {HTMLElement} panel
 */
function closePanel(panel) {
  panel.style.maxHeight = null;
}

/* ===== Accordion logic ===== */

/**
 * Initializes accordion behavior:
 * - Every header button toggles its panel.
 * - Only one panel may stay open at a time.
 * - Adds/removes .open class to item for styling/arrow rotation.
 */
function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  // Query all items
  const items = Array.from(accordion.querySelectorAll('.accordion__item'));

  // For each item, wire header click
  items.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const panelId = header.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    // Ensure panel starts closed (no inline max-height) and aria
    panel.style.maxHeight = null;
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items first
      items.forEach(other => {
        other.classList.remove('open');
        const otherHeader = other.querySelector('.accordion__header');
        const otherPanelId = otherHeader.getAttribute('aria-controls');
        const otherPanel = document.getElementById(otherPanelId);
        otherHeader.setAttribute('aria-expanded', 'false');
        closePanel(otherPanel);
      });

      // If it was closed before click, open it now
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        openPanel(panel);

        // Scroll the opened header into view on small screens (nice UX)
        setTimeout(() => {
          header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 240);
      } else {
        // clicking an open item closes it (we already closed all above)
      }
    });

    // Accessibility: toggle with Enter/Space when header focused (button handles this by default)
    // Also allow keyboard navigation if needed in the future.
  });

  // Optional: close all on click outside accordion (not required but sometimes useful)
  document.addEventListener('click', (ev) => {
    const target = ev.target;
    if (!accordion.contains(target)) {
      items.forEach(other => {
        other.classList.remove('open');
        const otherHeader = other.querySelector('.accordion__header');
        const otherPanelId = otherHeader.getAttribute('aria-controls');
        const otherPanel = document.getElementById(otherPanelId);
        otherHeader.setAttribute('aria-expanded', 'false');
        closePanel(otherPanel);
      });
    }
  });
}

/* ===== Hero button: scroll to accordion ===== */
function initHeroButton() {
  const btn = document.getElementById('enterEncyclopediaBtn');
  const accordion = document.getElementById('accordion');

  if (!btn || !accordion) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(accordion);

    // Optionally open the first accordion item after scroll completes
    setTimeout(() => {
      const firstItem = accordion.querySelector('.accordion__item');
      if (firstItem) {
        const header = firstItem.querySelector('.accordion__header');
        header.click();
      }
    }, 600);
  });
}

/* ===== Footer year injection ===== */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (!yearEl) return;
  const now = new Date();
  yearEl.textContent = now.getFullYear();
}

/* ===== Initialize everything on DOM ready ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initHeroButton();
  initFooterYear();

  // Perf: remove video controls focus outline on mobile tap (visual polish)
  const video = document.getElementById('heroVideo');
  if (video) {
    video.setAttribute('playsinline', '');
  }
});

/* ===== Note:
   - As as future improvement, you may want to lazy-load gallery/map images,
     or replace the placeholder video with a streaming embed.
   - All IDs and classes were chosen para facilitar futuras expansões.
*/
