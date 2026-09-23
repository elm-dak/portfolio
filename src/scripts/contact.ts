import { emailjs, person } from '../data/person';
import { finePointer, motionOn, ScrollTrigger } from './motion';

const REST_WEIGHT = 600;

/**
 * "Let's talk." responds to the pointer: letters close to it grow heavy and
 * the rest thin out, using the variable weight axis of Geist. It settles back
 * to its normal weight when the pointer leaves.
 */
function initProximity() {
  const title = document.querySelector<HTMLElement>('[data-proximity]');
  const section = document.querySelector<HTMLElement>('[data-contact]');
  if (!title || !section || !motionOn() || !finePointer()) return;

  const chars = Array.from(title.querySelectorAll<HTMLElement>('.pc:not(.sp)'));
  const current = chars.map(() => REST_WEIGHT);
  const target = chars.map(() => REST_WEIGHT);
  let centers: { x: number; y: number }[] = [];
  let frame = 0;

  const measure = () => {
    const box = title.getBoundingClientRect();
    centers = chars.map((char) => {
      const r = char.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
  };

  const loop = () => {
    let moving = false;
    chars.forEach((char, i) => {
      const delta = target[i] - current[i];
      if (Math.abs(delta) > 0.5) {
        current[i] += delta * 0.14;
        moving = true;
      } else {
        current[i] = target[i];
      }
      char.style.fontWeight = String(Math.round(current[i]));
    });
    frame = moving ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => {
    if (!frame) frame = requestAnimationFrame(loop);
  };

  section.addEventListener('pointermove', (event) => {
    if (!centers.length) measure();
    const box = title.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    const reach = box.height * 2.4;
    const near = py > -box.height * 1.2 && py < box.height * 2.2;
    chars.forEach((_, i) => {
      if (!near) {
        target[i] = REST_WEIGHT;
        return;
      }
      const d = Math.hypot(px - centers[i].x, py - centers[i].y);
      const pull = Math.max(0, 1 - d / reach);
      target[i] = 250 + 650 * pull ** 1.4;
    });
    kick();
  });
  section.addEventListener('pointerleave', () => {
    target.fill(REST_WEIGHT);
    kick();
  });
  ScrollTrigger.addEventListener('refresh', () => {
    centers = [];
  });
}

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const status = button.querySelector<HTMLElement>('[data-copy-status]');
    let timer = 0;
    button.addEventListener('click', async () => {
      const text = button.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        window.location.href = `mailto:${text}`; // no clipboard access: open the mail app instead
        return;
      }
      button.classList.add('is-copied');
      if (status) status.textContent = 'Email address copied';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, 1800);
    });
  });
}

type Field = 'user_name' | 'user_email' | 'message';

function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const fields: Field[] = ['user_name', 'user_email', 'message'];

  const input = (name: Field) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const errorBox = (name: Field) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  const setError = (name: Field, message: string) => {
    const el = input(name);
    const box = errorBox(name);
    if (box) box.textContent = message;
    if (message) {
      el.setAttribute('aria-invalid', 'true');
      if (box) el.setAttribute('aria-describedby', box.id);
    } else {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    }
  };

  const validate = (values: Record<Field, string>) => {
    const errors: Partial<Record<Field, string>> = {};
    if (!values.user_name) errors.user_name = 'Please tell me your name.';
    if (!values.user_email) errors.user_email = 'I need an email address to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.user_email)) {
      errors.user_email = 'This email address looks incomplete.';
    }
    if (values.message.length < 10) errors.message = 'A few more words, please (10 characters at least).';
    return errors;
  };

  const setStatus = (text: string, isError = false) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  };

  fields.forEach((name) => input(name).addEventListener('input', () => setError(name, '')));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const values = Object.fromEntries(fields.map((f) => [f, String(data.get(f) ?? '').trim()])) as Record<Field, string>;

    if (String(data.get('company') ?? '').trim()) {
      // Filled by a bot: pretend it worked and send nothing.
      form.reset();
      setStatus("Thanks, your message is on its way. I'll reply by email.");
      return;
    }

    const errors = validate(values);
    fields.forEach((name) => setError(name, errors[name] ?? ''));
    const firstInvalid = fields.find((name) => errors[name]);
    if (firstInvalid) {
      input(firstInvalid).focus();
      return;
    }

    submit?.setAttribute('aria-busy', 'true');
    if (label) label.textContent = 'Sending…';
    setStatus('');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjs.serviceId,
          template_id: emailjs.templateId,
          user_id: emailjs.publicKey,
          template_params: values,
        }),
      });
      if (!response.ok) throw new Error(`EmailJS ${response.status}: ${await response.text()}`);
      form.reset();
      setStatus("Thanks, your message is on its way. I'll reply by email.");
    } catch (error) {
      console.error(error);
      setStatus(`Sending failed. Please write to me at ${person.email} instead.`, true);
    } finally {
      submit?.removeAttribute('aria-busy');
      if (label) label.textContent = 'Send message';
    }
  });
}

export function initContact() {
  initProximity();
  initCopy();
  initForm();
}
