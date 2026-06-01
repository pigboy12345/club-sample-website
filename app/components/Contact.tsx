'use client';

import React, { useMemo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

  return (
    <section id="contact" className="bg-teal-600 text-white p-8 md:p-16">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-teal-200"
            required
            aria-label="Your Name"
          />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-teal-200"
            required
            aria-label="Your Email"
          />

          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            rows={5}
            className="w-full p-3 rounded bg-white text-black outline-none focus:ring-2 focus:ring-teal-200"
            required
            aria-label="Your Message"
          />

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-white text-teal-600 font-bold py-3 rounded transition disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

