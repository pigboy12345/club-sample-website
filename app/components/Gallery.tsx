import React from 'react';

const images = [
    'https://media.gettyimages.com/id/2214592382/photo/fc-barcelona-v-real-madrid-cf-la-liga-ea-sports.jpg?s=1024x1024&w=gi&k=20&c=BszNszqkVYXmttdXpOWkUMr981LZ-Le47OXL-h6ykyU=',
    'https://media.gettyimages.com/id/2214554870/photo/fc-barcelona-v-real-madrid-cf-la-liga-ea-sports.jpg?s=2048x2048&w=gi&k=20&c=Hnd7Zcml_tcxP2HiIId95fYx3h0Qx0OYSEZRX6GbkDM=',
    'https://media.gettyimages.com/id/2193988395/photo/getafe-v-fc-barcelona-laliga-ea-sports.jpg?s=2048x2048&w=gi&k=20&c=WptU_oqNJOeePW79CT48sVrqIeixO8VownWF3wzg6fU=',
    'https://media.gettyimages.com/id/2201357521/photo/fc-barcelona-v-atletico-madrid-spanish-copa-del-rey.jpg?s=2048x2048&w=gi&k=20&c=jOxrfpRdvMZ3bbsJJGAESNyol-0mfdvdy7Kw8qHkWRU=',
];

const Gallery: React.FC = () => {
    return (
        <section id='gallery' className="p-8 md:p-16 bg-white">
            <h2 className="text-3xl font-bold text-teal-600 text-center mb-10">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                ))}
            </div>
        </section>
    );
};

export default Gallery;
