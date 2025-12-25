import './i18n';
import i18next from './i18n';

document.addEventListener('DOMContentLoaded', async () => {
  // Update all elements with data-i18n attribute
  const updateContent = () => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = i18next.t(key);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          (element as HTMLInputElement | HTMLTextAreaElement).placeholder =
            translation;
        } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
          // For links and buttons, update text content but preserve inner HTML structure
          const span = element.querySelector('span[data-i18n]');
          if (span) {
            span.textContent = translation;
          } else {
            element.textContent = translation;
          }
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update attributes with data-i18n-attr
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrData = element.getAttribute('data-i18n-attr');
      if (attrData) {
        const [attr, key] = attrData.split(':');
        if (attr && key) {
          const translation = i18next.t(key);
          element.setAttribute(attr, translation);
        }
      }
    });

    // Update document title
    document.title = i18next.t('title');
    document.documentElement.lang = i18next.language;

    // Update summary with dynamic years
    updateSummaryYears();
  };

  // Calculate total work experience (only as Full-stack Developer from March 1, 2022)
  const calculateTotalExperience = (): { years: number; months: number } => {
    // Start date as Full-stack Developer
    const startDate = new Date('2022-03-01');
    const endDate = new Date();

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    // If we're in the same month but before the start day, adjust
    if (months === 0 && endDate.getDate() < startDate.getDate()) {
      years--;
      months = 11;
    }

    return { years, months };
  };

  // Update summary text with dynamic years
  const updateSummaryYears = () => {
    const experience = calculateTotalExperience();
    const { years, months } = experience;

    // Simply show the number of years with + if there are additional months
    const yearsText =
      years > 0
        ? months > 0
          ? `${years}+`
          : years.toString()
        : months > 0
        ? `${months}+`
        : '1';

    const summaryElement = document.querySelector('[data-i18n="summary.text"]');
    if (summaryElement) {
      // Get translation from i18n config
      const template = i18next.t('summary.text');
      // Replace placeholder with calculated years
      const text = template.replace('{{years}}', yearsText);
      summaryElement.textContent = text;
    }
  };

  // Initial update
  updateContent();

  // Update active language button
  const updateLangButtons = () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === i18next.language) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // Listen for language changes
  i18next.on('languageChanged', () => {
    updateContent();
    updateLangButtons();
    updateSummaryYears();
  });

  // Language switcher
  const langSwitcher = document.querySelector('.lang-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('lang-btn')) {
        const lang = target.getAttribute('data-lang');
        if (lang) {
          i18next.changeLanguage(lang);
        }
      }
    });
  }

  // Initial language button state
  updateLangButtons();

  // Experience date tooltip
  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = endDate === 'present' ? new Date() : new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastDayOfMonth = new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();
      days += lastDayOfMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }
    if (days > 0 && years === 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Less than a month';
  };

  const createTooltip = (text: string): HTMLElement => {
    const tooltip = document.createElement('div');
    tooltip.className = 'experience-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    return tooltip;
  };

  const showTooltip = (element: HTMLElement, tooltip: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${
      rect.left + rect.width / 2 - tooltip.offsetWidth / 2
    }px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    tooltip.classList.add('visible');
  };

  const hideTooltip = (tooltip: HTMLElement) => {
    tooltip.classList.remove('visible');
  };

  // Setup tooltips for experience dates
  document.querySelectorAll('.experience-date').forEach(dateElement => {
    const startDate = dateElement.getAttribute('data-start-date');
    const endDate = dateElement.getAttribute('data-end-date');

    if (startDate && endDate) {
      const duration = calculateDuration(startDate, endDate);
      const tooltip = createTooltip(duration);

      dateElement.addEventListener('mouseenter', () => {
        showTooltip(dateElement as HTMLElement, tooltip);
      });

      dateElement.addEventListener('mouseleave', () => {
        hideTooltip(tooltip);
      });

      (dateElement as HTMLElement).style.cursor = 'help';
    }
  });

  // Accordion functionality for Work Experience
  const accordionBox = document.querySelector('.accordion-box');
  const accordionHeader = document.querySelector('.accordion-header');

  if (accordionBox && accordionHeader) {
    // Set closed by default
    accordionBox.classList.add('closed');

    accordionHeader.addEventListener('click', () => {
      accordionBox.classList.toggle('closed');
    });
  }
});
