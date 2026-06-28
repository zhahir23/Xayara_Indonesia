import { Link } from 'react-router-dom';
import { 
  Snowflake, 
  Wrench, 
  ShoppingCart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: <Snowflake className="w-8 h-8" />,
      title: 'Cuci AC',
      description: 'Jasa cuci AC profesional mulai dari Rp 60.000',
      price: 'Mulai Rp 60.000'
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Service & Bongkar Pasang',
      description: 'Perbaikan dan instalasi AC oleh teknisi bersertifikat',
      price: 'Hubungi untuk harga'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Jual Beli Elektronik',
      description: 'Pusat jual beli barang elektronik berkualitas',
      price: 'Harga kompetitif'
    }
  ];

  const features = [
    'Teknisi Bersertifikat',
    'Garansi Service',
    'Respon Cepat',
    'Harga Terjangkau',
    'Area Jabodetabek',
    'Layanan 24/7'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Spesialis HVAC & Elektrikal Bersertifikasi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Cuci AC mulai dari Rp 60.000! Melayani jasa service, bongkar pasang AC & jual beli barang elektronik area Jabodetabek
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reservation" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 inline-flex items-center justify-center">
                Buat Reservasi Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="tel:+6281234567890" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 inline-flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap untuk kebutuhan HVAC dan elektrikal Anda dengan layanan profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="text-primary-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-primary-600 font-semibold">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Xayara Indonesia?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="font-medium text-gray-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Melayani Kebutuhan AC Anda?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Dapatkan layanan profesional dengan harga terjangkau
          </p>
          <Link to="/reservation" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 inline-flex items-center">
            Reservasi Sekarang
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
              <a href="tel:+6281234567890" className="text-primary-600 hover:underline">
                0812-3456-7890
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a href="mailto:info@xayara.com" className="text-primary-600 hover:underline">
                info@xayara.com
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Area Layanan</h3>
              <p className="text-gray-600">Jabodetabek</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Xayara Indonesia</h3>
              <p className="text-gray-400">
                Spesialis HVAC & Elektrikal Bersertifikasi melayani area Jabodetabek
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Cuci AC</li>
                <li>Service AC</li>
                <li>Bongkar Pasang AC</li>
                <li>Jual Beli Elektronik</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
              <div className="flex items-center text-gray-400">
                <Clock className="w-5 h-5 mr-2" />
                <span>24/7 Layanan Darurat</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Xayara Indonesia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
