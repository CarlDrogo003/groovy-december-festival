import Link from "next/link";

export default function SponsorsPage() {
  const sponsors = [
    { name: "MTN Nigeria", category: "Diamond Sponsor", logo: "/assets/1754801197_sponsor.jpg" },
    { name: "First Bank", category: "Platinum Sponsor", logo: "/assets/1754801248_sponsor.jpg" },
    { name: "Dangote Group", category: "Gold Sponsor", logo: "/assets/1754801294_sponsor.jpg" },
    { name: "Globacom", category: "Silver Sponsor", logo: "/assets/1754801338_sponsor.jpg" },
    { name: "Access Bank", category: "Bronze Sponsor", logo: "/assets/1754801361_sponsor.jpg" },
    { name: "UBA", category: "Bronze Sponsor", logo: "/assets/1754801391_sponsor.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Sponsors & Partners
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Celebrating the incredible organizations that make Groovy December possible
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amazing Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to partner with leading organizations who share our vision of celebrating culture, 
            community, and connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sponsor.name}</h3>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Become a Sponsor</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our family of sponsors and partners. Help us create unforgettable experiences 
            while showcasing your brand to thousands of festival-goers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Contact Us 📧
            </Link>
            <Link 
              href="/vendors" 
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105"
            >
              Vendor Info 🏪
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
