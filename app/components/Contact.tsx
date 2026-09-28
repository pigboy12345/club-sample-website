'use client';

import React, { useMemo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import SlideText from './SlideText';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqkgzjo';

type FormStatus = 'idle' | 'submitting';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const isSubmitting = status === 'submitting';

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (!emailRegex.test(email.trim())) return false;
    if (message.trim().length < 5) return false;
    return true;
  }, [email, message, name]);

  useEffect(() => {
    if (!isSubmitting) return;
    // no-op: keeps logic minimal
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n) return toast.error('Please enter your name.');
    if (!emailRegex.test(em)) return toast.error('Please enter a valid email address.');
    if (msg.length < 5) return toast.error('Please enter a message (at least 5 characters).');

    setStatus('submitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: n,
          email: em,
          message: msg,
        }),
      });

      if (!res.ok) {
        let serverMessage: string | undefined;
        try {
          const data = await res.json();
          serverMessage = data?.error ?? data?.message;
        } catch {
          // ignore
        }
        throw new Error(serverMessage ?? `Request failed with status ${res.status}`);
      }

      toast.success('Message sent successfully...!', { duration: 5000 });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : undefined;
      toast.error(msg ?? 'Failed to send message...!', { duration: 5000 });
    } finally {
      setStatus('idle');
    }
  };

  const fieldClass =
    'w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-200';

  return (
    <section id="contact" className="bg-white py-16 sm:py-24">
      <div data-scroll-y="80" className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Say hello"
            title="Contact us"
            subtitle="Write to the forum about programmes, membership, or a visit to Kalkuzhy."
            align="left"
          />
          <SlideText delay={0.12}>
          <ul className="space-y-4 text-stone-700">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <span>Kalkuzhy, Thrissur, Kerala, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-teal-700" />
              <a href="tel:+918139076084" className="hover:text-teal-800">+91 81390 76084</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-teal-700" />
              <a href="mailto:bappujikalkuzhy@gmail.com" className="break-all hover:text-teal-800">bappujikalkuzhy@gmail.com</a>
            </li>
          </ul>
          </SlideText>
          <div className="mt-8 overflow-hidden rounded-3xl shadow-sm">
            <img
              src="/images/contact-village.png"
              alt="A quiet village lane in Kalkuzhy, Thrissur"
              data-speed="0.88"
              className="h-52 w-full scale-110 object-cover sm:h-64"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-[#f6f3ee] p-5 shadow-sm ring-1 ring-stone-200/80 sm:p-8">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={fieldClass}
            required
            aria-label="Your Name"
          />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className={fieldClass}
            required
            aria-label="Your Email"
          />

          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows={5}
            className={fieldClass}
            required
            aria-label="Your Message"
          />

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full rounded-full bg-teal-800 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;

