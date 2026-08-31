import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, MapPin, AlertCircle, Navigation, ArrowRight, Snowflake, Phone, Menu, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/axios';
import logo from '../assets/logo.png';

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xayara Indonesia Group coordinates
  const XAYARA_COORDS = {
    lat: -6.313764429193717,
    lng: 106.96985201534208
  };

  // Parameters state
  const [parameters, setParameters] = useState({
    kebutuhanOptions: ['Cuci AC', 'Service AC', 'Bongkar Pasang AC', 'Isi Freon', 'Perbaikan AC', 'Beli AC Baru', 'Lainnya'],
    merekOptions: ['Panasonic', 'Daikin', 'Sharp', 'LG', 'Samsung', 'Mitsubishi', 'Gree', 'Changhong', 'Polytron', 'Lainnya'],
    pkOptions: ['0.5 PK', '0.75 PK', '1 PK', '1.5 PK', '2 PK', '2.5 PK', '3 PK', '5 PK', 'Lainnya'],
    referralCodeOptions: ['AMEL01', 'MUTHI02', 'DITHA03', 'SANIA04', 'LAILATUL05', 'CHAIRUNNISA06', 'CAHYA07', 'PRAKAS08', 'RYAN09', 'SAEFUL10', 'SATRIO11', 'WAHYU12', 'BILI13']
  });

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    alamat: '',
    telepon: '',
    tanggal: '',
    kebutuhan: '',
    kebutuhanLainnya: '',
    kebutuhanCatatan: '',
    merek: '',
    merekLainnya: '',
    totalUnit: '',
    pk: '',
    pkLainnya: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [distanceWarning, setDistanceWarning] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const addressInputRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([XAYARA_COORDS.lat, XAYARA_COORDS.lng]);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Fetch parameters from API
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await api.get('/parameters/category/reservation');
        const params = response.data;

        const newParams = { ...parameters };

        params.forEach(param => {
          if (param.key === 'kebutuhan_options') {
            newParams.kebutuhanOptions = param.value.split(',').map(v => v.trim());
          } else if (param.key === 'merek_options') {
            newParams.merekOptions = param.value.split(',').map(v => v.trim());
          } else if (param.key === 'pk_options') {
            newParams.pkOptions = param.value.split(',').map(v => v.trim());
          } else if (param.key === 'referral_code_options') {
            newParams.referralCodeOptions = param.value
              .split(',')
              .map(v => v.trim())
              .filter(Boolean);
          }
        });

        setParameters(newParams);
      } catch (error) {
        console.error('Error fetching parameters:', error);
        // Keep default values on error
      }
    };

    fetchParameters();

    // Refresh parameters when window gains focus (user returns from admin dashboard)
    const handleFocus = () => {
      fetchParameters();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Haversine formula to calculate distance between two coordinates in KM
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in KM
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Search address using OpenStreetMap Nominatim API with location bias
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ID`;
      
      // Add location bias if user location is available
      if (userLocation) {
        const viewbox = `${userLocation.lng - 0.1},${userLocation.lat - 0.1},${userLocation.lng + 0.1},${userLocation.lat + 0.1}`;
        url += `&viewbox=${viewbox}&bounded=1`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setSelectedCoords({ lat: latitude, lng: longitude });
          
          // Calculate distance
          const dist = calculateDistance(
            XAYARA_COORDS.lat,
            XAYARA_COORDS.lng,
            latitude,
            longitude
          );
          setDistance(dist.toFixed(2));

          // Reverse geocode to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data.display_name) {
                setFormData({ ...formData, alamat: data.display_name });
              }
            })
            .catch(err => console.error('Error reverse geocoding:', err));

          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);

 console.log('User location obtained:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
        }
      );
    } else {
      setError('Browser tidak mendukung geolocation.');
    }
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, alamat: value });
    setSelectedCoords(null);
    setDistance(null);
    setDistanceWarning('');

    // Debounce search
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => searchAddress(value), 500));
  };

  // Handle address selection
  const handleAddressSelect = (suggestion) => {
    setFormData({ ...formData, alamat: suggestion.display_name });
    setSelectedCoords({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
    setShowSuggestions(false);

    // Calculate distance
    const dist = calculateDistance(
      XAYARA_COORDS.lat,
      XAYARA_COORDS.lng,
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon)
    );
    setDistance(dist.toFixed(2));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check availability when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.tanggal) {
        setAvailability(null);
        return;
      }

      setCheckingAvailability(true);
      try {
        const response = await api.get(`/reservations/check-availability?tanggal=${formData.tanggal}`);
        setAvailability(response.data);
      } catch (error) {
        console.error('Error checking availability:', error);
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [formData.tanggal]);

  // Custom marker icon
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Map click handler component
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedCoords({ lat, lng });
        
        // Calculate distance
        const dist = calculateDistance(
          XAYARA_COORDS.lat,
          XAYARA_COORDS.lng,
          lat,
          lng
        );
        setDistance(dist.toFixed(2));

        // Reverse geocode to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              setFormData({ ...formData, alamat: data.display_name });
            }
          })
          .catch(err => console.error('Error reverse geocoding:', err));
      }
    });
    return null;
  }

  // Component to handle map center changes
  function MapCenterHandler({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 15);
      }
    }, [center, map]);
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for telepon field
    if (name === 'telepon') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else if (name === 'pkLainnya') {
      // Just store the numeric value, will append ' PK' on submit
      setFormData({
        ...formData,
        [name]: value.trim()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate location selection
    if (!selectedCoords) {
      setError('Silakan pilih lokasi di peta atau gunakan tombol "Gunakan lokasi saya saat ini" untuk mendapatkan koordinat lokasi Anda.');
      setLoading(false);
      return;
    }

    // Validate quota availability
    if (availability && availability.remaining === 0) {
      setError('Kuota reservasi untuk tanggal ini telah penuh. Silakan pilih tanggal lain.');
      setLoading(false);
      return;
    }

    try {
      // Include location data in submission
      const submissionData = {
        ...formData,
        pkLainnya: formData.pkLainnya ? formData.pkLainnya + ' PK' : '',
        latitude: selectedCoords?.lat || null,
        longitude: selectedCoords?.lng || null,
        distanceKm: distance || null
      };

      const response = await api.post('/reservations', submissionData);
      setBookingId(response.data.reservation.id);
      setSuccess(true);
      setFormData({
        nama: '',
        email: '',
        alamat: '',
        telepon: '',
        tanggal: '',
        kebutuhan: '',
        kebutuhanLainnya: '',
        kebutuhanCatatan: '',
        merek: '',
        merekLainnya: '',
        totalUnit: '',
        pk: '',
        pkLainnya: '',
        referralCode: ''
      });
      setAddressSuggestions([]);
      setSelectedCoords(null);
      setDistance(null);
      setDistanceWarning('');
    } catch (err) {
      setError('Gagal membuat reservasi. Silakan coba lagi.');
      console.error('Error creating reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white py-20">
        {/* Navigation Bar */}
        <nav className="fixed w-full top-0 z-[1100] bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src={logo} 
                  alt="Xayara Indonesia" 
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <div className="hidden lg:flex items-center space-x-8">
                <Link to="/" className="font-medium text-gray-700 hover:text-black transition-colors">Beranda</Link>
                <Link to="/reservation" className="font-medium text-gray-700 hover:text-black transition-colors">Reservasi</Link>
              </div>
              <div className="hidden lg:flex items-center space-x-6">
                <a href="tel:+6283114106436" className="flex items-center text-gray-600 hover:text-black transition-colors">
                  <Phone className="w-4 h-4 mr-1" />
                  <span className="text-sm">0858-1020-0501</span>
                </a>
              </div>
              <button className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-100 bg-white">
                <div className="px-4 py-4 space-y-3">
                  <Link to="/" className="block font-medium py-2 text-gray-700 hover:text-black transition-colors">Beranda</Link>
                  <Link to="/reservation" className="block font-medium py-2 text-gray-700 hover:text-black transition-colors">Reservasi</Link>
                  <a href="tel:+6283114106436" className="flex items-center py-2 text-gray-600 hover:text-black transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>0858-1020-0501</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 mt-32">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-normal text-slate-800 mb-4">
              Reservasi Berhasil!
            </h2>
            <div className="bg-[#253f6a]/5 border border-[#253f6a]/10 rounded-2xl p-6 mb-6">
              <p className="text-sm text-slate-600 font-light mb-2">Booking ID Anda:</p>
              <p className="text-2xl font-bold text-[#253f6a]">{bookingId}</p>
            </div>
            <p className="text-lg text-slate-600 font-normal mb-6">
              Terima kasih telah melakukan reservasi. Tim kami akan segera menghubungi Anda untuk konfirmasi. Detail reservasi telah dikirim ke WhatsApp Anda.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setBookingId(null);
                  navigate('/');
                }}
                className="flex items-center justify-center px-6 py-3 bg-[#253f6a] text-white rounded-full hover:bg-[#1e3357] transition-colors font-medium"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-[1100] bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Xayara Indonesia" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="font-medium text-gray-700 hover:text-black transition-colors">Beranda</Link>
              <Link to="/reservation" className="font-medium text-gray-700 hover:text-black transition-colors">Reservasi</Link>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <a href="tel:+6283114106436" className="flex items-center text-gray-600 hover:text-black transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm">0858-1020-0501</span>
              </a>
            </div>
            <button className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white">
              <div className="px-4 py-4 space-y-3">
                <Link to="/" className="block font-medium py-2 text-gray-700 hover:text-black transition-colors">Beranda</Link>
                <Link to="/reservation" className="block font-medium py-2 text-gray-700 hover:text-black transition-colors">Reservasi</Link>
                <a href="tel:+6283114106436" className="flex items-center py-2 text-gray-600 hover:text-black transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>0858-1020-0501</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#253f6a]/5 text-[#253f6a] px-5 py-2 rounded-full text-sm font-medium mb-6">
              <Snowflake className="w-4 h-4 mr-2" />
              Form Reservasi
            </div>
            <h1 className="text-4xl md:text-5xl font-normal text-slate-800 mb-4">
              Buat Reservasi Layanan
            </h1>
            <p className="text-lg text-slate-600 font-normal max-w-2xl mx-auto">
              Isi formulir di bawah ini untuk membuat reservasi layanan AC profesional kami
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              {error.includes('lokasi') || error.includes('koordinat') ? (
                <MapPin className="w-5 h-5 text-red-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="contoh@email.com"
              />
            </div>

            {/* Alamat */}
            <div ref={addressInputRef}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alamat Rumah *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Ketik alamat untuk pencarian atau klik di peta"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={getUserLocation}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Gunakan lokasi saya saat ini"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                  <MapPin className="text-gray-400 w-5 h-5 mt-1.5" />
                </div>
                
                {/* Address Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAddressSelect(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                      >
                        <div className="text-sm text-slate-900">{suggestion.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Interactive Map */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pilih Lokasi di Peta *
                </label>
                <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 relative z-0">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapCenterHandler center={mapCenter} />
                    <MapClickHandler />
                    {selectedCoords && (
                      <Marker position={[selectedCoords.lat, selectedCoords.lng]} icon={customIcon} />
                    )}
                  </MapContainer>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Klik tombol navigasi untuk gunakan lokasi Anda, atau klik pada peta untuk memilih lokasi presisi
                </p>
              </div>
              
              {/* Distance Information */}
              {distance && (
                <div className="mt-2 flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-[#253f6a] mr-1" />
                  <span className="text-slate-600">
                    Jarak dari lokasi kami: <span className="font-semibold text-[#253f6a]">{distance} KM</span>
                  </span>
                </div>
              )}
              
              {/* Location Success Notification */}
              {locationSuccess && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">Lokasi berhasil diperoleh! Alamat dan koordinat telah diisi otomatis.</span>
                </div>
              )}
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nomor Telepon Aktif *
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="0858-1020-0501"
              />
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Reservasi *
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
              {/* Availability Status */}
              {checkingAvailability && (
                <div className="mt-2 flex items-center text-sm text-slate-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Memeriksa ketersediaan...</span>
                </div>
              )}
              {availability && !checkingAvailability && (
                <div className={`mt-2 p-3 rounded-xl flex items-start ${
                  availability.remaining === 0
                    ? 'bg-red-50 border border-red-200'
                    : availability.remaining <= 3
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  {availability.remaining === 0 ? (
                    <XCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : availability.remaining <= 3 ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="text-sm">
                    {availability.remaining === 0 ? (
                      <span className="text-red-800 font-medium">
                        Kuota reservasi untuk tanggal ini telah penuh
                      </span>
                    ) : (
                      <span className={`font-medium ${
                        availability.remaining <= 3 ? 'text-yellow-800' : 'text-green-800'
                      }`}>
                        Sisa kuota: {availability.remaining} dari {availability.quotaLimit} reservasi
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kebutuhan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kebutuhan *
              </label>
              <select
                name="kebutuhan"
                value={formData.kebutuhan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
              >
                <option value="">Pilih jenis layanan</option>
                {parameters.kebutuhanOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.kebutuhan === 'Lainnya' && (
                <input
                  type="text"
                  name="kebutuhanLainnya"
                  value={formData.kebutuhanLainnya}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none mt-2"
                  placeholder="Tuliskan kebutuhan spesifik Anda"
                />
              )}
              {formData.kebutuhan && formData.kebutuhan !== 'Lainnya' && (
                <input
                  type="text"
                  name="kebutuhanCatatan"
                  value={formData.kebutuhanCatatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none mt-2"
                  placeholder="Tuliskan detail tambahan (contoh: tinggi AC, kondisi khusus, dll.)"
                />
              )}
            </div>

            {/* Merek */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Merek AC *
              </label>
              <select
                name="merek"
                value={formData.merek}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
              >
                <option value="">Pilih merek AC</option>
                {parameters.merekOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.merek === 'Lainnya' && (
                <input
                  type="text"
                  name="merekLainnya"
                  value={formData.merekLainnya}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none mt-2"
                  placeholder="Tuliskan merek AC spesifik"
                />
              )}
            </div>

            {/* Total Unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total Unit *
              </label>
              <input
                type="number"
                name="totalUnit"
                value={formData.totalUnit}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Jumlah unit AC"
              />
            </div>

            {/* PK */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kapasitas AC (PK) *
              </label>
              <select
                name="pk"
                value={formData.pk}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
              >
                <option value="">Pilih kapasitas</option>
                {parameters.pkOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.pk === 'Lainnya' && (
                <input
                  type="text"
                  name="pkLainnya"
                  value={formData.pkLainnya}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none mt-2"
                  placeholder="Tuliskan kapasitas AC spesifik"
                />
              )}
            </div>

            {/* Kode Referral (opsional) */}
            {parameters.referralCodeOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kode Referral <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <select
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#253f6a] focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value="">Tanpa kode referral</option>
                  {parameters.referralCodeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#253f6a] to-[#1e3357] text-white px-10 py-4 rounded-full font-medium hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Kirim Reservasi
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-[#253f6a]/5 border border-[#253f6a]/10 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              Informasi Penting
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Pastikan data yang dimasukkan benar dan valid</li>
              <li>• Tim kami akan menghubungi Anda untuk konfirmasi</li>
              <li>• Layanan tersedia untuk area Jabodetabek</li>
              <li>• Harga cuci AC mulai dari Rp 60.000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
