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
import heroImage from '../../../referensi/heroImage.jpeg';

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
      <section className="pb-8 lg:pb-20 -mt-20">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 min-w-0 md:items-stretch">
          {/* Left Content */}
          <div className="min-w-0 overflow-hidden pt-24 pb-20 md:pt-28 md:pb-16 bg-[#0c1f41] order-2 md:order-1 px-6 sm:px-10 md:px-8 lg:px-12 flex items-center justify-center md:justify-end">
            <div className="max-w-md w-full text-left md:ml-auto md:mr-0">
              <h1 className="font-black text-2xl sm:text-3xl lg:text-4xl text-white mb-4 leading-tight">
                Layanan HVAC Profesional
                <br />
                <span className="text-blue-200">Oleh Teknisi Bersertifikat</span>
              </h1>
              <p className="font-normal text-base lg:text-lg text-white mb-6 leading-relaxed">
                Kami melayani instalasi, perawatan, dan perbaikan berbagai sistem HVAC, seperti AC Split, Cassette, VRV/VRF, AHU, Chiller, Plumbing, Elektronik, serta sistem ventilasi dan ducting.
              </p>
              <Link to="/reservation" className="block w-full md:w-fit">
                <div className="w-full md:w-fit px-10 py-3 rounded-full mt-2 transition-transform hover:scale-105" style={{ backgroundColor: 'rgb(247, 228, 191)', color: 'rgb(31, 31, 31)' }}>
                  <div className="flex justify-center items-center">
                    <p className="font-bold text-base mr-4">Reservasi Sekarang</p>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0.375C18.4219 0.375 23.625 5.57812 23.625 12C23.625 18.4219 18.4219 23.625 12 23.625C5.57812 23.625 0.375 18.4219 0.375 12C0.375 5.57812 5.57812 0.375 12 0.375ZM10.6453 7.10625L14.1844 10.5H5.625C5.00156 10.5 4.5 11.0016 4.5 11.625V12.375C4.5 12.9984 5.00156 13.5 5.625 13.5H14.1844L10.6453 16.8937C10.1906 17.3297 10.1812 18.0563 10.6266 18.5016L11.1422 19.0125C11.5828 19.4531 12.2953 19.4531 12.7313 19.0125L18.9516 12.7969C19.3922 12.3562 19.3922 11.6438 18.9516 11.2078L12.7313 4.98281C12.2906 4.54219 11.5781 4.54219 11.1422 4.98281L10.6266 5.49375C10.1812 5.94375 10.1906 6.67031 10.6453 7.10625Z" fill="#1F1F1F"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="min-w-0 overflow-hidden order-1 md:order-2 aspect-[4/3] md:aspect-auto">
            <img
              src={heroImage}
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
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
