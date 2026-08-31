import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import logo from '../assets/logo.png';
import heroImage from '../../../referensi/heroImage.jpeg';
import instalasiACImage from '../../../referensi/Instalasi AC.jpg';
import instalasiVentilasiImage from '../../../referensi/Instalasi sistem ventilasi.jpg';
import serviceMaintenanceImage from '../../../referensi/Service dan maintenance AC 2.jpg';
import instalasiPerpipaanImage from '../../../referensi/Instalasi sistem perpipaan 2.jpg';
import instalasiKelistrikanImage from '../../../referensi/Instalasi sistem Kelistrikan 2.jpg';
import elektronikImage from '../../../referensi/Elektronik 2.jpg';
import petaImage from '../../../referensi/peta.jpg';
import gambarKedua from '../../../referensi/Gambar kedua.jpg';
import gambarKetiga from '../../../referensi/Gambar ketiga.jpg';
import logoHomejuice from '../../../referensi/homjuice 2.jpg';
import logoBankDKI from '../../../referensi/bankdki.jpg';
import logoBCA from '../../../referensi/bca.jpg';
import logoTastebud from '../../../referensi/tastebudtraveller.jpg';
import { useEffect } from 'react';

const Home = () => {
  // Scroll persistence
  useEffect(() => {
    // Restore scroll position on mount
    const savedScrollPosition = sessionStorage.getItem('homeScrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }

    // Save scroll position on unmount
    const handleScroll = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Material Berkualitas',
      description: 'Menggunakan material terbaik untuk hasil maksimal'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Garansi Layanan',
      description: 'Jaminan kepuasan dan kualitas pekerjaan'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Teknisi Bersertifikat',
      description: 'Tim profesional berpengalaman dan tersertifikasi'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Harga Terjangkau',
      description: 'Layanan premium dengan harga kompetitif'
    }
  ];

  const services = [
    {
      name: 'Instalasi AC (Split, Cassette, Central, VRV/VRF)',
      image: instalasiACImage
    },
    {
      name: 'Instalasi sistem ventilasi',
      image: instalasiVentilasiImage
    },
    {
      name: 'Service dan maintenance AC',
      image: serviceMaintenanceImage
    },
    {
      name: 'Instalasi sistem perpipaan',
      image: instalasiPerpipaanImage
    },
    {
      name: 'Instalasi sistem Kelistrikan',
      image: instalasiKelistrikanImage
    },
    {
      name: 'Elektronik',
      image: elektronikImage
    }
  ];

  const areas = [
    'Jakarta Timur',
    'Jakarta Barat',
    'Jakarta Selatan',
    'Jakarta Utara',
    'Jakarta Pusat',
    'Kota Depok',
    'Kab. Bogor',
    'Cikarang',
    'Bekasi'
  ];

  const tentangKeunggulan = [
    'Ramah Lingkungan',
    'Respon Cepat',
    'Material Berkualitas',
    'Garansi Layanan',
    'Teknisi Bersertifikat',
    'Harga Terjangkau'
  ];

  return (
    <div className="min-h-screen font-sans bg-white">
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
                  <div className="w-full md:w-fit px-10 py-3 rounded-full mt-2 transition-transform hover:scale-102" style={{ backgroundColor: 'rgb(247, 228, 191)', color: 'rgb(31, 31, 31)' }}>
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
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Layanan Kami</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"> </p>

            {/* Wrapper baru untuk memusatkan dan menyeimbangkan posisi list agar proporsional */}
            <div className="max-w-4xl mx-auto bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                {/* Left Column - 3 Services */}
                <div className="space-y-6 flex flex-col justify-center">
                  {services.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-32 h-20 sm:w-40 sm:h-24 md:w-44 md:h-28 object-cover rounded-xl flex-shrink-0"
                      />
                      <span className="text-gray-700 font-medium text-sm sm:text-base leading-snug">{service.name}</span>
                    </div>
                  ))}
                </div>

                {/* Right Column - 3 Services */}
                <div className="space-y-6 flex flex-col justify-center">
                  {services.slice(3, 6).map((service, index) => (
                    <div key={index + 3} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-32 h-20 sm:w-40 sm:h-24 md:w-44 md:h-28 object-cover rounded-xl flex-shrink-0"
                      />
                      <span className="text-gray-700 font-medium text-sm sm:text-base leading-snug">{service.name}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </section>

      {/* Area Coverage Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Layanan AC Tersedia di 9 Wilayah
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Kami melayani area Jabodetabek dengan cakupan luas
            </p>

            {/* Grid Container: 1 Kolom di HP/Zoom Tinggi, 2 Kolom di Layar Lebar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              {/* KIRI: List 9 Wilayah (Menggunakan 3 kolom kecil internal agar rapi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 order-2 lg:order-1">
                {areas.map((area, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col justify-center items-center min-h-[100px] border border-gray-100">
                    <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{area}</span>
                  </div>
                ))}
              </div>

              {/* KANAN: Gambar Peta */}
              <div className="w-full h-full min-w-0 overflow-hidden rounded-xl shadow-md order-1 lg:order-2 bg-white p-2">
                <img
                  src={petaImage}
                  alt="Peta Wilayah Layanan"
                  className="w-full h-auto max-h-[400px] lg:max-h-none object-contain lg:object-cover rounded-lg mx-auto"
                />
              </div>

            </div>
          </div>
        </section>

      {/* About Us Section */}
      <section className="py-20 px-4 bg-[#0c1f41]">
        {/* Menggunakan max-w-5xl agar konten berkumpul sempurna di tengah */}
        <div className="max-w-5xl mx-auto">

          <h2 className="text-3xl font-black text-center text-white mb-12">
            Tentang Kami
          </h2>

          {/* Grid dibuat seimbang 50:50 (lg:grid-cols-2) agar sisi kiri dan kanan pas di tengah */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* SISI KIRI: Gambar Atas dan Bawah */}
            <div className="flex flex-col gap-6 justify-center w-full">
              <div className="overflow-hidden rounded-2xl shadow-md h-52 sm:h-64 lg:h-56">
                <img
                  src={gambarKedua}
                  alt="Teknisi Xayara 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md h-52 sm:h-64 lg:h-56">
                <img
                  src={gambarKetiga}
                  alt="Teknisi Xayara 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* SISI KANAN: Deskripsi, Keunggulan, & Mitra */}
            <div className="flex flex-col justify-center space-y-8 w-full">

              {/* Bagian Pertama: Deskripsi Perusahaan */}
              <div>
                <p className="text-blue-100 leading-relaxed text-sm sm:text-base text-justify md:text-left">
                  Xayara Indonesia Group merupakan perusahaan yang bergerak di bidang solusi HVAC (Heating, Ventilation, and Air Conditioning) yang berkomitmen menghadirkan layanan profesional untuk memenuhi kebutuhan sistem tata udara di Indonesia. Kami melayani perancangan, instalasi, perawatan (maintenance), hingga perbaikan sistem pendingin udara untuk berbagai jenis bangunan, mulai dari perkantoran, komersial, industri, hingga residensial.
                </p>
              </div>

              {/* Bagian Kedua: List Keunggulan */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Mengapa Memilih Kami?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Ramah Lingkungan',
                    'Respon Cepat',
                    'Material Berkualitas',
                    'Garansi Layanan',
                    'Teknisi Bersertifikat',
                    'Harga Terjangkau'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-[#132c59] p-3 rounded-xl border border-blue-900">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-blue-100 font-medium text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian Ketiga: Mitra Usaha */}
              <div className="border-t border-blue-900 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">Mitra Usaha Kami</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-900/50 flex items-center justify-center w-full h-16">
                    <img src={logoHomejuice} alt="Homjuice" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-900/50 flex items-center justify-center w-full h-16">
                    <img src={logoBankDKI} alt="Bank DKI" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-900/50 flex items-center justify-center w-full h-16">
                    <img src={logoBCA} alt="BCA" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-900/50 flex items-center justify-center w-full h-16">
                    <img src={logoTastebud} alt="Tastebud Traveller" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

        {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">

          {/* Grid Utama: 1 Kolom di HP / High Zoom, 2 Kolom di Layar Lebar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

            {/* SISI KIRI: Logo & Alamat */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Xayara Indonesia" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md">
                Jl. Raya Bojong Kulur, Bojong Kulur, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16969, Indonesia.
              </p>
            </div>

            {/* SISI KANAN: Hubungi Kami (WhatsApp & Email) */}
            <div className="md:pl-12 lg:pl-24 space-y-4">
              <h3 className="text-lg font-bold text-[#0c1f41] uppercase tracking-wider">
                Hubungi Kami
              </h3>

              <div className="space-y-4">
                {/* Baris WhatsApp */}
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg text-green-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-tight">WhatsApp</p>
                    <a
                      href="https://wa.me/6285810200501"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 font-medium hover:text-green-600 transition-colors text-sm sm:text-base"
                    >
                      085810200501
                    </a>
                  </div>
                </div>

                {/* Baris Email */}
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-tight">Email</p>
                    <a
                      href="mailto:xayaraindonesiagroup@gmail.com"
                      className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm sm:text-base break-all"
                    >
                      xayaraindonesiagroup@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright Area */}
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Xayara Indonesia Group. All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6285810200501"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center transform hover:-translate-y-1 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default Home;
