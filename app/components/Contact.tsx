import React from 'react';

const Contact: React.FC = () => {
    return (
        <section id='contact' className="bg-teal-600 text-white p-8 md:p-16">
            <div className="max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
                <form className="space-y-6">
                    <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full p-3 rounded bg-white text-black"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full p-3 rounded bg-white text-black"
                    />
                    <textarea
                        placeholder="Your Message"
                        rows={5}
                        className="w-full p-3 rounded bg-white text-black"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-teal-600 font-bold py-3 rounded hover:bg-gray-100 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
