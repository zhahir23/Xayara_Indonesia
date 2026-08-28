import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/axios';

const Reservation = () => {
  const navigate = useNavigate();
  const referralCodes = [
    'AMEL01',
    'MUTHI02',
    'DITHA03',
    'SANIA04',
    'LAILATUL05',
    'CHAIRUNNISA06',
    'CAHYA07',
    'PRAKAS08',
    'RYAN09',
    'SAEFUL10',
    'SATRIO11',
    'WAHYU12',
    'BILI13'
  ];
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    alamat: '',
    telepon: '',
    tanggal: '',
    kebutuhan: '',
    kebutuhanLainnya: '',
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
  const [reservationData, setReservationData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/reservations', formData);
      console.log('RESPONSE:', response.data);
      setReservationData({
        bookingId: response.data.reservation.id,
        nama: response.data.reservation.nama,
        email: response.data.reservation.email,
        alamat: response.data.reservation.alamat,
        telepon: response.data.reservation.telepon,
        merek: response.data.reservation.merek,
        tanggal: response.data.reservation.tanggal,
        referralCode: formData.referralCode
      });

setSuccess(true);
      setFormData({
        nama: '',
        email: '',
        alamat: '',
        telepon: '',
        tanggal: '',
        kebutuhan: '',
        kebutuhanLainnya: '',
        merek: '',
        merekLainnya: '',
        totalUnit: '',
        pk: '',
        pkLainnya: '',
        referralCode: ''
      });

      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Gagal membuat reservasi. Silakan coba lagi.');
      console.error('Error creating reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = reservationData
  ? encodeURIComponent(
      `Halo Admin Xayara Indonesia, saya ingin konfirmasi reservasi saya dengan Booking ID: *${reservationData.bookingId}*.
      Detail:
      - id Booking: ${reservationData.bookingId}
      - Nama: ${reservationData.nama}
      - Email: ${reservationData.email}
      - Alamat: ${reservationData.alamat}
      - No. HP: ${reservationData.telepon}
      - Merek AC: ${reservationData.merek}
      - Tanggal: ${reservationData.tanggal}
      - Referral Code: ${reservationData.referralCode}`

    )
  : '';
  const whatsappLink = `https://wa.me/6285810200501?text=${whatsappMessage}`;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card text-center py-12">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Reservasi Berhasil!
            </h2>
            <p className="text-gray-600 mb-6">
              Terima kasih telah melakukan reservasi. Tim kami akan segera menghubungi Anda untuk konfirmasi.
            </p>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Booking ID Anda: {reservationData.bookingId}
            </p>
            <p className="text-sm text-gray-500">
              Anda akan diarahkan ke halaman beranda dalam beberapa detik...
            </p>
            <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
  Chat WhatsApp Admin
</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Form Reservasi
          </h1>
          <p className="text-lg text-gray-600">
            Isi formulir di bawah ini untuk membuat reservasi layanan AC
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="contoh@email.com"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Rumah *
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                rows="3"
                className="input-field"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon Aktif *
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="0812-3456-7890"
              />
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Reservasi *
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Kebutuhan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kebutuhan *
              </label>
              <select
                name="kebutuhan"
                value={formData.kebutuhan}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Pilih jenis layanan</option>
                <option value="Cuci AC">Cuci AC</option>
                <option value="Service AC">Service AC</option>
                <option value="Bongkar Pasang AC">Bongkar Pasang AC</option>
                <option value="Isi Freon">Isi Freon</option>
                <option value="Perbaikan AC">Perbaikan AC</option>
                <option value="Beli AC Baru">Beli AC Baru</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {formData.kebutuhan === 'Lainnya' && (
                <input
                  type="text"
                  name="kebutuhanLainnya"
                  value={formData.kebutuhanLainnya}
                  onChange={handleChange}
                  required
                  className="input-field mt-2"
                  placeholder="Tuliskan kebutuhan spesifik Anda"
                />
              )}
            </div>

            {/* Merek */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merek AC *
              </label>
              <select
                name="merek"
                value={formData.merek}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Pilih merek AC</option>
                <option value="Panasonic">Panasonic</option>
                <option value="Daikin">Daikin</option>
                <option value="Sharp">Sharp</option>
                <option value="LG">LG</option>
                <option value="Samsung">Samsung</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Gree">Gree</option>
                <option value="Changhong">Changhong</option>
                <option value="Polytron">Polytron</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {formData.merek === 'Lainnya' && (
                <input
                  type="text"
                  name="merekLainnya"
                  value={formData.merekLainnya}
                  onChange={handleChange}
                  required
                  className="input-field mt-2"
                  placeholder="Tuliskan merek AC spesifik"
                />
              )}
            </div>

            {/* Total Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Unit *
              </label>
              <input
                type="number"
                name="totalUnit"
                value={formData.totalUnit}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
                placeholder="Jumlah unit AC"
              />
            </div>

            {/* PK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasitas AC (PK) *
              </label>
              <select
                name="pk"
                value={formData.pk}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Pilih kapasitas</option>
                <option value="0.5 PK">0.5 PK</option>
                <option value="0.75 PK">0.75 PK</option>
                <option value="1 PK">1 PK</option>
                <option value="1.5 PK">1.5 PK</option>
                <option value="2 PK">2 PK</option>
                <option value="2.5 PK">2.5 PK</option>
                <option value="3 PK">3 PK</option>
                <option value="5 PK">5 PK</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {formData.pk === 'Lainnya' && (
                <input
                  type="text"
                  name="pkLainnya"
                  value={formData.pkLainnya}
                  onChange={handleChange}
                  required
                  className="input-field mt-2"
                  placeholder="Tuliskan kapasitas AC spesifik"
                />
              )}
            </div>

            {/* Kode Referral */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Referral (Opsional)
              </label>
              <select
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Tanpa Referral</option>
                {referralCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Kirim Reservasi'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Informasi Penting
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pastikan data yang dimasukkan benar dan valid</li>
            <li>• Tim kami akan menghubungi Anda untuk konfirmasi</li>
            <li>• Layanan tersedia untuk area Jabodetabek</li>
            <li>• Harga cuci AC mulai dari Rp 60.000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
