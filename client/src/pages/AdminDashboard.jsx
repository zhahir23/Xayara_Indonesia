import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Tag,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../lib/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [referralFilter, setReferralFilter] = useState('all');
  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const referralCodes = [
  ...new Set(
    reservations
      .map(r => r.referralCode)
      .filter(Boolean)
  )
];

  useEffect(() => {
    checkAuth();
    fetchReservations();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      return;
    }

    try {
      await api.delete(`/reservations/${id}`);
      setReservations(reservations.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Gagal menghapus reservasi');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/reservations/${id}`, { status: newStatus });
      setReservations(reservations.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/reservations/${editingReservation.id}`, editingReservation);
      setReservations(reservations.map(r => 
        r.id === editingReservation.id ? editingReservation : r
      ));
      setShowEditModal(false);
      setEditingReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Gagal mengupdate reservasi');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.telepon.includes(searchTerm);

    const matchesReferral =
    referralFilter === 'all' ||
    reservation.referralCode === referralFilter;

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus && matchesReferral;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nama', 'Email', 'Alamat', 'Telepon', 'Tanggal', 'Kebutuhan', 'Merek', 'Total Unit', 'PK', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...reservations.map(r => [
        r.id,
        r.nama,
        r.email,
        r.alamat,
        r.telepon,
        r.tanggal,
        r.kebutuhan,
        r.merek,
        r.totalUnit,
        r.pk,
        r.status,
        r.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 text-sm">Kelola reservasi Xayara Indonesia</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchReservations}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Reservasi</p>
                <p className="text-3xl font-bold text-gray-900">{reservations.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reservations.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="relative md:w-52">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative md:w-56">
              <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <select
                value={referralFilter}
                onChange={(e) => setReferralFilter(e.target.value)}
                className="input-field pl-10"
                disabled={referralCodes.length === 0}
              >
                <option value="all">Semua Kode Referral</option>
                {referralCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking Id</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kontak</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kebutuhan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Detail AC</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode Referral</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Tidak ada data reservasi
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{reservation.bookingId || reservation.id || "-"}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.nama}</p>
                        <p className="text-sm text-gray-500">{reservation.alamat}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{reservation.email}</p>
                        <p className="text-sm text-gray-500">{reservation.telepon}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {new Date(reservation.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {reservation.kebutuhan}
                      {reservation.kebutuhanLainnya && (
                        <span className="text-gray-500 ml-1">({reservation.kebutuhanLainnya})</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{reservation.merek}</p>
                        {reservation.merekLainnya && (
                          <p className="text-gray-500">({reservation.merekLainnya})</p>
                        )}
                        <p className="text-gray-500">{reservation.totalUnit} unit - {reservation.pk}</p>
                        {reservation.pkLainnya && (
                          <p className="text-gray-500">({reservation.pkLainnya})</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {reservation.referralCode || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Reservasi</h2>
              <form onSubmit={handleUpdateReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={editingReservation.nama}
                    onChange={(e) => setEditingReservation({...editingReservation, nama: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingReservation.email}
                    onChange={(e) => setEditingReservation({...editingReservation, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input
                    type="tel"
                    value={editingReservation.telepon}
                    onChange={(e) => setEditingReservation({...editingReservation, telepon: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    value={editingReservation.alamat}
                    onChange={(e) => setEditingReservation({...editingReservation, alamat: e.target.value})}
                    className="input-field"
                    rows="2"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan</label>
                    <input
                      type="text"
                      value={editingReservation.kebutuhan}
                      onChange={(e) => setEditingReservation({...editingReservation, kebutuhan: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                    <input
                      type="text"
                      value={editingReservation.merek}
                      onChange={(e) => setEditingReservation({...editingReservation, merek: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Unit</label>
                    <input
                      type="number"
                      value={editingReservation.totalUnit}
                      onChange={(e) => setEditingReservation({...editingReservation, totalUnit: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PK</label>
                    <input
                      type="text"
                      value={editingReservation.pk}
                      onChange={(e) => setEditingReservation({...editingReservation, pk: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingReservation(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
