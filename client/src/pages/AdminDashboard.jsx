import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Save,
  ArrowUpDown,
  MapPin,
  RefreshCw,
  MessageSquare,
  Mail,
  Send,
  Users,
  ClipboardList,
  BadgeCheck,
  X
} from 'lucide-react';
import api from '../lib/axios';
import CustomSelect from '../components/CustomSelect';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [dailyQuotas, setDailyQuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kebutuhanFilter, setKebutuhanFilter] = useState('all');
  const [merekFilter, setMerekFilter] = useState('all');
  const [referralFilter, setReferralFilter] = useState('all');
  const [whatsappStatusFilter, setWhatsappStatusFilter] = useState('all');
  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParameter, setEditingParameter] = useState(null);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const [editingDailyQuota, setEditingDailyQuota] = useState(null);
  const [showDailyQuotaModal, setShowDailyQuotaModal] = useState(false);
  const [broadcastStats, setBroadcastStats] = useState([]);
  const [emailBroadcasts, setEmailBroadcasts] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ subject: '', content: '' });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [broadcastRecipients, setBroadcastRecipients] = useState([]);
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [resendingBroadcastId, setResendingBroadcastId] = useState(null);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState(30);
  const [resendingId, setResendingId] = useState(null);
  const [bulkResending, setBulkResending] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [filterOptions, setFilterOptions] = useState({
    kebutuhanOptions: [],
    merekOptions: [],
    referralCodeOptions: ['AMEL01', 'MUTHI02', 'DITHA03', 'SANIA04', 'LAILATUL05', 'CHAIRUNNISA06', 'CAHYA07', 'PRAKAS08', 'RYAN09', 'SAEFUL10', 'SATRIO11', 'WAHYU12', 'BILI13']
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Idle timeout configuration
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  const WARNING_TIMEOUT = 30; // 30 seconds warning before logout
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    console.log('AdminDashboard mounting...');
    checkAuth();
    fetchReservations();
    fetchParameters();
    fetchDailyQuotas();
    fetchBroadcastStats();
    fetchEmailBroadcasts();
    setupIdleTimer();
    console.log('AdminDashboard mounted successfully');
    return () => cleanupIdleTimer();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    fetchReservations(1);
  }, [searchTerm, statusFilter, startDate, endDate, kebutuhanFilter, merekFilter, referralFilter, whatsappStatusFilter, sortBy, sortOrder]);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Validate token by calling API endpoint
    try {
      await api.get('/auth/validate');
    } catch (error) {
      // Token is invalid or expired
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const resetIdleTimer = () => {
    cleanupIdleTimer();
    setupIdleTimer();
  };

  const setupIdleTimer = () => {
    // Reset idle timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(warningTimerRef.current);
      clearInterval(countdownRef.current);
      
      // Set warning timer
      warningTimerRef.current = setTimeout(() => {
        setShowIdleWarning(true);
        setIdleCountdown(WARNING_TIMEOUT);
        
        // Start countdown
        countdownRef.current = setInterval(() => {
          setIdleCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, IDLE_TIMEOUT - (WARNING_TIMEOUT * 1000));
      
      // Set logout timer
      idleTimerRef.current = setTimeout(() => {
        handleLogout();
      }, IDLE_TIMEOUT);
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Return cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  };

  const cleanupIdleTimer = () => {
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearInterval(countdownRef.current);
  };

  const handleStayLoggedIn = () => {
    setShowIdleWarning(false);
    resetIdleTimer();
  };

  const fetchReservations = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter,
        startDate,
        endDate,
        kebutuhan: kebutuhanFilter === 'all' ? '' : kebutuhanFilter,
        merek: merekFilter === 'all' ? '' : merekFilter,
        referralCode: referralFilter === 'all' ? '' : referralFilter,
        whatsappStatus: whatsappStatusFilter,
        sortBy,
        sortOrder
      });

      const response = await api.get(`/reservations?${params}`);
      setReservations(response.data.data);
      setPagination(response.data.pagination);
      if (response.data.stats) setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch reservations';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (whatsappStatusFilter !== 'all' ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0) +
    (kebutuhanFilter !== 'all' ? 1 : 0) +
    (merekFilter !== 'all' ? 1 : 0) +
    (referralFilter !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setWhatsappStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setKebutuhanFilter('all');
    setMerekFilter('all');
    setReferralFilter('all');
  };

  const fetchParameters = async () => {
    try {
      const response = await api.get('/parameters');
      setParameters(response.data);

      // Extract filter options from parameters (keep current values as fallback
      // so referral filter still shows if the parameter row is missing)
      const newFilterOptions = { ...filterOptions, kebutuhanOptions: [], merekOptions: [] };
      response.data.forEach(param => {
        if (param.key === 'kebutuhan_options') {
          newFilterOptions.kebutuhanOptions = param.value.split(',').map(v => v.trim());
        } else if (param.key === 'merek_options') {
          newFilterOptions.merekOptions = param.value.split(',').map(v => v.trim());
        } else if (param.key === 'referral_code_options') {
          newFilterOptions.referralCodeOptions = param.value.split(',').map(v => v.trim()).filter(Boolean);
        }
      });
      setFilterOptions(newFilterOptions);
    } catch (error) {
      console.error('Error fetching parameters:', error);
    }
  };

  const fetchDailyQuotas = async () => {
    try {
      const response = await api.get('/daily-quotas');
      setDailyQuotas(response.data);
    } catch (error) {
      console.error('Error fetching daily quotas:', error);
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      title: 'Hapus Reservasi',
      message: 'Apakah Anda yakin ingin menghapus reservasi ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/reservations/${id}`);
          setToast({ type: 'success', message: 'Reservasi berhasil dihapus' });
          setTimeout(() => setToast(null), 3000);
          fetchReservations(pagination.page);
        } catch (error) {
          console.error('Error deleting reservation:', error);
          setToast({ type: 'error', message: 'Gagal menghapus reservasi' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/reservations/${id}`, { status: newStatus });
      fetchReservations(pagination.page);
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

  const fetchBroadcastStats = async () => {
    try {
      const response = await api.get('/email-broadcasts/status');
      setBroadcastStats(response.data);
    } catch (error) {
      console.error('Error fetching broadcast stats:', error);
    }
  };

  const fetchEmailBroadcasts = async () => {
    try {
      const response = await api.get('/email-broadcasts');
      setEmailBroadcasts(response.data);
    } catch (error) {
      console.error('Error fetching email broadcasts:', error);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.subject || !broadcastForm.content) {
      setToast({ type: 'error', message: 'Subject dan konten harus diisi' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setSendingBroadcast(true);
      const response = await api.post('/email-broadcasts', broadcastForm);
      const broadcast = response.data.broadcast;
      setToast({ 
        type: 'success', 
        message: `Email broadcast berhasil dibuat! ID: ${broadcast.id} | Total Penerima: ${broadcast.totalRecipients} | Status: ${broadcast.status}` 
      });
      setTimeout(() => setToast(null), 5000);
      setShowBroadcastModal(false);
      setBroadcastForm({ subject: '', content: '' });
      fetchEmailBroadcasts();
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setToast({ type: 'error', message: 'Gagal mengirim broadcast email: ' + (error.response?.data?.message || error.message) });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleDeleteBroadcast = async (id) => {
    setConfirmModal({
      title: 'Hapus Broadcast',
      message: 'Apakah Anda yakin ingin menghapus broadcast ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/email-broadcasts/${id}`);
          setToast({ type: 'success', message: 'Broadcast berhasil dihapus' });
          setTimeout(() => setToast(null), 3000);
          fetchEmailBroadcasts();
        } catch (error) {
          console.error('Error deleting broadcast:', error);
          setToast({ type: 'error', message: 'Gagal menghapus broadcast' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    });
  };

  const handleViewRecipients = async (broadcast) => {
    setSelectedBroadcast(broadcast);
    setRecipientFilter('all');
    await fetchBroadcastRecipients(broadcast.id);
    setShowRecipientsModal(true);
  };

  const fetchBroadcastRecipients = async (broadcastId) => {
    try {
      const statusFilter = recipientFilter === 'all' ? '' : `?status=${recipientFilter}`;
      const response = await api.get(`/email-broadcasts/${broadcastId}/recipients${statusFilter}`);
      setBroadcastRecipients(response.data);
    } catch (error) {
      console.error('Error fetching broadcast recipients:', error);
      alert('Gagal mengambil data penerima');
    }
  };

  const handleResendFailed = async (broadcastId) => {
    setConfirmModal({
      title: 'Kirim Ulang Email Gagal',
      message: 'Apakah Anda yakin ingin mengirim ulang email yang gagal?',
      onConfirm: async () => {
        try {
          setResendingBroadcastId(broadcastId);
          const response = await api.post(`/email-broadcasts/${broadcastId}/resend`);
          setToast({ type: 'success', message: response.data.message });
          setTimeout(() => setToast(null), 5000);
          fetchEmailBroadcasts();
          if (selectedBroadcast?.id === broadcastId) {
            await fetchBroadcastRecipients(broadcastId);
          }
        } catch (error) {
          console.error('Error resending failed emails:', error);
          setToast({ type: 'error', message: 'Gagal mengirim ulang email: ' + (error.response?.data?.message || error.message) });
          setTimeout(() => setToast(null), 5000);
        } finally {
          setResendingBroadcastId(null);
        }
      }
    });
  };

  useEffect(() => {
    if (selectedBroadcast && showRecipientsModal) {
      fetchBroadcastRecipients(selectedBroadcast.id);
    }
  }, [recipientFilter]);

  // Auto-refresh broadcast status for sending broadcasts
  useEffect(() => {
    const interval = setInterval(() => {
      const sendingBroadcasts = emailBroadcasts.filter(b => b.status === 'sending');
      if (sendingBroadcasts.length > 0) {
        fetchEmailBroadcasts();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [emailBroadcasts]);

  // Parameter handlers
  const handleEditParameter = (parameter) => {
    setEditingParameter({ ...parameter });
    setShowParameterModal(true);
  };

  const handleAddParameter = () => {
    setEditingParameter({ key: '', value: '', description: '', category: 'general' });
    setShowParameterModal(true);
  };

  const handleSaveParameter = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parameters', editingParameter);
      await fetchParameters();
      setShowParameterModal(false);
      setEditingParameter(null);
    } catch (error) {
      console.error('Error saving parameter:', error);
      alert('Gagal menyimpan parameter');
    }
  };

  const handleDeleteParameter = async (key) => {
    setConfirmModal({
      title: 'Hapus Parameter',
      message: 'Apakah Anda yakin ingin menghapus parameter ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/parameters/${key}`);
          setToast({ type: 'success', message: 'Parameter berhasil dihapus' });
          setTimeout(() => setToast(null), 3000);
          await fetchParameters();
        } catch (error) {
          console.error('Error deleting parameter:', error);
          setToast({ type: 'error', message: 'Gagal menghapus parameter' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    });
  };

  // Daily quota handlers
  const handleEditDailyQuota = (quota) => {
    setEditingDailyQuota({ ...quota, tanggal: quota.tanggal.split('T')[0] });
    setShowDailyQuotaModal(true);
  };

  const handleAddDailyQuota = () => {
    setEditingDailyQuota({ tanggal: '', quota_limit: 10 });
    setShowDailyQuotaModal(true);
  };

  const handleSaveDailyQuota = async (e) => {
    e.preventDefault();
    try {
      await api.post('/daily-quotas', editingDailyQuota);
      await fetchDailyQuotas();
      setShowDailyQuotaModal(false);
      setEditingDailyQuota(null);
    } catch (error) {
      console.error('Error saving daily quota:', error);
      alert('Gagal menyimpan daily quota');
    }
  };

  const handleDeleteDailyQuota = async (id) => {
    setConfirmModal({
      title: 'Hapus Daily Quota',
      message: 'Apakah Anda yakin ingin menghapus daily quota ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/daily-quotas/${id}`);
          setToast({ type: 'success', message: 'Daily quota berhasil dihapus' });
          setTimeout(() => setToast(null), 3000);
          await fetchDailyQuotas();
        } catch (error) {
          console.error('Error deleting daily quota:', error);
          setToast({ type: 'error', message: 'Gagal menghapus daily quota' });
          setTimeout(() => setToast(null), 3000);
        }
      }
    });
  };

  const handleResendWhatsApp = async (id) => {
    try {
      setResendingId(id);
      await api.post(`/reservations/${id}/resend-whatsapp`);
      setToast({ type: 'success', message: 'WhatsApp message sent successfully' });
      setTimeout(() => setToast(null), 3000);
      fetchReservations(pagination.page);
    } catch (error) {
      console.error('Error resending WhatsApp:', error);
      setToast({ type: 'error', message: 'Gagal mengirim ulang pesan WhatsApp' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setResendingId(null);
    }
  };

  const handleResendAllFailed = async () => {
    const failedCount = reservations.filter(r => !r.whatsappSent).length;
    if (failedCount === 0) {
      setToast({ type: 'error', message: 'Tidak ada pesan WhatsApp yang gagal untuk dikirim ulang' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    setConfirmModal({
      title: 'Kirim Ulang WhatsApp Gagal',
      message: `Apakah Anda yakin ingin mengirim ulang ${failedCount} pesan WhatsApp yang gagal?`,
      onConfirm: async () => {
        try {
          setBulkResending(true);
          const response = await api.post('/reservations/resend-all-failed-whatsapp');
          setToast({ type: 'success', message: response.data.message });
          setTimeout(() => setToast(null), 5000);
          fetchReservations(pagination.page);
        } catch (error) {
          console.error('Error resending all failed WhatsApp:', error);
          setToast({ type: 'error', message: 'Gagal mengirim ulang pesan WhatsApp' });
          setTimeout(() => setToast(null), 3000);
        } finally {
          setBulkResending(false);
        }
      }
    });
  };

  const filteredReservations = reservations;

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

  const getWhatsAppBadge = (whatsappSent) => {
    if (whatsappSent === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </span>
    );
  };

  const truncateLabel = (text, max = 30) => {
    if (!text || text.length <= max) return text || '';
    return text.slice(0, max - 3) + '...';
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nama', 'Email', 'Alamat', 'Telepon', 'Tanggal', 'Kebutuhan', 'Catatan Kebutuhan', 'Merek', 'Total Unit', 'PK', 'Kode Referral', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...reservations.map(r => [
        r.id,
        r.nama,
        r.email,
        r.alamat,
        r.telepon,
        r.tanggal,
        r.kebutuhan + (r.kebutuhanLainnya ? ` (${r.kebutuhanLainnya})` : ''),
        r.kebutuhanCatatan || '',
        r.merek + (r.merekLainnya ? ` (${r.merekLainnya})` : ''),
        r.totalUnit,
        r.pk + (r.pkLainnya ? ` (${r.pkLainnya})` : ''),
        r.referralCode || '',
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

  if (error && reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Error memuat data</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchReservations();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 text-sm">Kelola reservasi Xayara Indonesia</p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 md:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchReservations}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors flex justify-center items-center w-full sm:w-auto"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center w-full sm:w-auto justify-center text-xs sm:text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleResendAllFailed}
                disabled={bulkResending}
                className="flex items-center w-full sm:w-auto justify-center text-xs sm:text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkResending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Resend All Failed WhatsApp</span>
                <span className="sm:hidden">Resend</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full sm:w-auto justify-center text-xs sm:text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm w-full ${
                activeTab === 'reservations'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reservasi
            </button>
            <button
              onClick={() => setActiveTab('daily-quotas')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm w-full ${
                activeTab === 'daily-quotas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kuota Harian
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm w-full ${
                activeTab === 'parameters'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Parameter
            </button>
            <button
              onClick={() => setActiveTab('email-broadcasts')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm w-full ${
                activeTab === 'email-broadcasts'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reservations' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {/* Total — informational, not a filter */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Reservasi</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-11 h-11 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Status cards double as quick filters */}
              {[
                { key: 'pending', label: 'Pending', icon: Clock, text: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-500' },
                { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-500' },
                { key: 'completed', label: 'Completed', icon: BadgeCheck, text: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-500' },
                { key: 'cancelled', label: 'Cancelled', icon: XCircle, text: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-500' }
              ].map(({ key, label, icon: Icon, text, bg, ring }) => {
                const active = statusFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(active ? 'all' : key)}
                    aria-pressed={active}
                    title={active ? 'Klik untuk hapus filter' : `Filter status: ${label}`}
                    className={`card text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${ring} ${active ? `ring-2 ring-offset-1 ${ring}` : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
                        <p className={`text-3xl font-bold mt-1 ${text}`}>{stats[key]}</p>
                      </div>
                      <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${text}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-semibold">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-medium">
                      {activeFilterCount} aktif
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={activeFilterCount === 0}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:flex-[2] relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan booking ID, nama, email, telepon, atau alamat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <CustomSelect
                      value={statusFilter}
                      onChange={setStatusFilter}
                      options={[
                        { value: 'all', label: 'Semua Status' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'confirmed', label: 'Confirmed' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <CustomSelect
                      value={whatsappStatusFilter}
                      onChange={setWhatsappStatusFilter}
                      options={[
                        { value: 'all', label: 'Semua WhatsApp' },
                        { value: 'sent', label: 'Terkirim' },
                        { value: 'failed', label: 'Gagal' }
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan</label>
                    <CustomSelect
                      value={kebutuhanFilter}
                      onChange={setKebutuhanFilter}
                      options={[
                        { value: 'all', label: 'Semua Kebutuhan' },
                        ...filterOptions.kebutuhanOptions.map((option) => ({
                          value: option,
                          label: truncateLabel(option)
                        }))
                      ]}
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek AC</label>
                    <CustomSelect
                      value={merekFilter}
                      onChange={setMerekFilter}
                      options={[
                        { value: 'all', label: 'Semua Merek' },
                        ...filterOptions.merekOptions.map((option) => ({
                          value: option,
                          label: truncateLabel(option)
                        }))
                      ]}
                    />
                  </div>
                  {filterOptions.referralCodeOptions.length > 0 && (
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kode Referral</label>
                      <CustomSelect
                        value={referralFilter}
                        onChange={setReferralFilter}
                        options={[
                          { value: 'all', label: 'Semua Kode Referral' },
                          ...filterOptions.referralCodeOptions.map((option) => ({
                            value: option,
                            label: truncateLabel(option)
                          }))
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto relative">
              {loading && reservations.length > 0 && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary-500 animate-pulse z-20" />
              )}
              <table className="w-full min-w-[1180px]">
                <thead>
                  <tr className="border-b bg-gray-50 sticky top-0 z-20">
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sticky left-0 bg-gray-50 z-10 shadow-[8px_0_8px_-8px_rgba(0,0,0,0.12)]">Booking ID</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Nama</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Kontak</th>
                    <th
                      className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={() => {
                        if (sortBy === 'tanggal') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('tanggal');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        Tanggal
                        {sortBy === 'tanggal' && (
                          <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Kebutuhan</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Detail AC</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">WhatsApp</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">Kode Referral</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sticky right-0 bg-gray-50 z-10 shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-14">
                        <div className="flex flex-col items-center text-center gap-2">
                          <ClipboardList className="w-10 h-10 text-gray-300" />
                          <p className="text-gray-600 font-medium">Tidak ada reservasi</p>
                          <p className="text-sm text-gray-400">
                            {activeFilterCount > 0
                              ? 'Coba longgarkan atau reset filter di atas.'
                              : 'Reservasi baru akan muncul di sini.'}
                          </p>
                          {activeFilterCount > 0 && (
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="mt-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Reset filter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="group border-b hover:bg-gray-50">
                        <td className="py-4 px-3 text-sm font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[8px_0_8px_-8px_rgba(0,0,0,0.12)] transition-colors">
                          {reservation.id}
                        </td>
                        <td className="py-4 px-3 max-w-[180px]">
                          <div>
                            <p className="font-medium text-gray-900 truncate" title={reservation.nama}>{reservation.nama}</p>
                            <div className="flex items-center gap-1">
                              <p className="text-sm text-gray-500 truncate flex-1" title={reservation.alamat}>{reservation.alamat}</p>
                              {reservation.googleMapsLink && (
                                <a
                                  href={reservation.googleMapsLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                  title="Lihat di Google Maps"
                                >
                                  <MapPin className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 max-w-[160px]">
                          <div>
                            <p className="text-sm text-gray-900 truncate" title={reservation.email}>{reservation.email}</p>
                            <a
                              href={`https://wa.me/${reservation.telepon.replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-700 hover:underline truncate block"
                              title={reservation.telepon}
                            >
                              {reservation.telepon}
                            </a>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(reservation.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-900 max-w-[130px]">
                          <div>
                            <span className="truncate block" title={reservation.kebutuhan + (reservation.kebutuhanLainnya ? ` (${reservation.kebutuhanLainnya})` : '')}>
                              {reservation.kebutuhan}
                              {reservation.kebutuhanLainnya && (
                                <span className="text-gray-500 ml-1">({reservation.kebutuhanLainnya})</span>
                              )}
                            </span>
                            {reservation.kebutuhanCatatan && (
                              <p className="text-xs text-gray-500 truncate mt-1" title={reservation.kebutuhanCatatan}>
                                {reservation.kebutuhanCatatan}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-3 max-w-[130px]">
                          <div className="text-sm">
                            <p className="text-gray-900 truncate" title={reservation.merek}>{reservation.merek}</p>
                            {reservation.merekLainnya && (
                              <p className="text-gray-500 truncate" title={reservation.merekLainnya}>({reservation.merekLainnya})</p>
                            )}
                            <p className="text-gray-500 truncate" title={`${reservation.totalUnit} unit - ${reservation.pk}${reservation.pkLainnya ? ` (${reservation.pkLainnya})` : ''}`}>
                              {reservation.totalUnit} unit - {reservation.pk}
                            </p>
                            {reservation.pkLainnya && (
                              <p className="text-gray-500 truncate" title={reservation.pkLainnya}>({reservation.pkLainnya})</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          {getStatusBadge(reservation.status)}
                        </td>
                        <td className="py-4 px-3">
                          {getWhatsAppBadge(reservation.whatsappSent)}
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-900 whitespace-nowrap">
                          {reservation.referralCode || '-'}
                        </td>
                        <td className="py-4 px-3 sticky right-0 bg-white group-hover:bg-gray-50 z-10 shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)] transition-colors">
                          <div className="flex flex-col items-start gap-2 w-[132px]">
                            <CustomSelect
                              value={reservation.status}
                              onChange={(val) => handleStatusUpdate(reservation.id, val)}
                              options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                              ]}
                              className="min-w-[120px]"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleResendWhatsApp(reservation.id)}
                                disabled={resendingId === reservation.id || reservation.whatsappSent === true}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={reservation.whatsappSent ? 'WhatsApp sudah terkirim' : 'Resend WhatsApp'}
                              >
                                {resendingId === reservation.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MessageSquare className="w-4 h-4" />
                                )}
                              </button>
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="card mt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan {((pagination.page - 1) * pagination.limit) + 1} hingga {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} reservasi
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => fetchReservations(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchReservations(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => fetchReservations(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'daily-quotas' && (
          <>
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Kuota Harian</h2>
                <button
                  onClick={handleAddDailyQuota}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kuota Harian
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Kuota Limit</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyQuotas.map((quota) => (
                      <tr key={quota.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{quota.tanggal}</td>
                        <td className="py-3 px-4">{quota.quota_limit}</td>
                        <td className="py-3 px-4">{quota.created_at}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleEditDailyQuota(quota)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDailyQuota(quota.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {dailyQuotas.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          Belum ada kuota harian yang diatur
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'parameters' && (
          <>
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Parameter Sistem</h2>
                <button
                  onClick={handleAddParameter}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Parameter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Key</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param) => (
                      <tr key={param.key} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{param.key}</td>
                        <td className="py-4 px-4 text-gray-900">{param.value}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">{param.category}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{param.description}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleEditParameter(param)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteParameter(param.key)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
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
                <div className="flex flex-col md:flex-row md:gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan</label>
                    <input
                      type="text"
                      value={editingReservation.kebutuhan}
                      onChange={(e) => setEditingReservation({...editingReservation, kebutuhan: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                    <input
                      type="text"
                      value={editingReservation.merek}
                      onChange={(e) => setEditingReservation({...editingReservation, merek: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Kebutuhan</label>
                  <textarea
                    value={editingReservation.kebutuhanCatatan || ''}
                    onChange={(e) => setEditingReservation({...editingReservation, kebutuhanCatatan: e.target.value})}
                    className="input-field"
                    rows="2"
                    placeholder="Detail tambahan (contoh: tinggi AC, kondisi khusus, dll.)"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Unit</label>
                    <input
                      type="number"
                      value={editingReservation.totalUnit}
                      onChange={(e) => setEditingReservation({...editingReservation, totalUnit: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PK</label>
                    <input
                      type="text"
                      value={editingReservation.pk}
                      onChange={(e) => setEditingReservation({...editingReservation, pk: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Referral</label>
                  {filterOptions.referralCodeOptions.length > 0 ? (
                    <select
                      value={editingReservation.referralCode || ''}
                      onChange={(e) => setEditingReservation({...editingReservation, referralCode: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Tanpa kode referral</option>
                      {filterOptions.referralCodeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editingReservation.referralCode || ''}
                      onChange={(e) => setEditingReservation({...editingReservation, referralCode: e.target.value})}
                      className="input-field"
                    />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
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

      {/* Daily Quota Edit Modal */}
      {showDailyQuotaModal && editingDailyQuota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingDailyQuota.id ? 'Edit Kuota Harian' : 'Tambah Kuota Harian'}
              </h2>
              <form onSubmit={handleSaveDailyQuota} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editingDailyQuota.tanggal}
                    onChange={(e) => setEditingDailyQuota({...editingDailyQuota, tanggal: e.target.value})}
                    className="input-field"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kuota Limit</label>
                  <input
                    type="number"
                    value={editingDailyQuota.quota_limit}
                    onChange={(e) => setEditingDailyQuota({...editingDailyQuota, quota_limit: parseInt(e.target.value)})}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDailyQuotaModal(false);
                      setEditingDailyQuota(null);
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

      {/* Parameter Edit Modal */}
      {showParameterModal && editingParameter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingParameter.key ? 'Edit Parameter' : 'Tambah Parameter'}
              </h2>
              <form onSubmit={handleSaveParameter} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                  <input
                    type="text"
                    value={editingParameter.key}
                    onChange={(e) => setEditingParameter({...editingParameter, key: e.target.value})}
                    className="input-field"
                    disabled={!!editingParameter.key}
                    placeholder="Contoh: daily_reservation_quota"
                  />
                  {editingParameter.key && (
                    <p className="text-xs text-gray-500 mt-1">Key tidak dapat diubah setelah dibuat</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <textarea
                    value={editingParameter.value}
                    onChange={(e) => setEditingParameter({...editingParameter, value: e.target.value})}
                    className="input-field"
                    rows="3"
                    placeholder="Contoh: 10 atau Cuci AC,Service AC,Bongkar Pasang AC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingParameter.category}
                    onChange={(e) => setEditingParameter({...editingParameter, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="general">General</option>
                    <option value="reservation">Reservation</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingParameter.description}
                    onChange={(e) => setEditingParameter({...editingParameter, description: e.target.value})}
                    className="input-field"
                    rows="2"
                    placeholder="Deskripsi parameter"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowParameterModal(false);
                      setEditingParameter(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Email Broadcast Tab */}
      {activeTab === 'email-broadcasts' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Email Broadcast</h2>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Buat Broadcast Baru
              </button>
            </div>

            <div className="space-y-4">
              {emailBroadcasts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada email broadcast
                </div>
              ) : (
                emailBroadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{broadcast.subject}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Dikirim oleh: {broadcast.sent_by} • {new Date(broadcast.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          broadcast.status === 'completed' ? 'bg-green-100 text-green-800' :
                          broadcast.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                          broadcast.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {broadcast.status === 'completed' ? 'Selesai' :
                           broadcast.status === 'sending' ? 'Mengirim' :
                           broadcast.status === 'failed' ? 'Gagal' : 'Pending'}
                        </span>
                        <button
                          onClick={() => handleViewRecipients(broadcast)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Penerima"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        {broadcast.failed_count > 0 && broadcast.status === 'completed' && (
                          <button
                            onClick={() => handleResendFailed(broadcast.id)}
                            disabled={resendingBroadcastId === broadcast.id}
                            className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Kirim Ulang yang Gagal"
                          >
                            {resendingBroadcastId === broadcast.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBroadcast(broadcast.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>Total Penerima: {broadcast.total_recipients}</span>
                      <span className="text-green-600">Terkirim: {broadcast.sent_count}</span>
                      <span className="text-red-600">Gagal: {broadcast.failed_count}</span>
                      {broadcast.completed_at && (
                        <span>Selesai: {new Date(broadcast.completed_at).toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Buat Email Broadcast</h2>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={broadcastForm.subject}
                    onChange={(e) => setBroadcastForm({...broadcastForm, subject: e.target.value})}
                    className="input-field"
                    placeholder="Contoh: Promo Spesial - Diskon 20% untuk Service AC"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konten Email</label>
                  <textarea
                    value={broadcastForm.content}
                    onChange={(e) => setBroadcastForm({...broadcastForm, content: e.target.value})}
                    className="input-field"
                    rows="10"
                    placeholder="Tulis konten email promo di sini..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Tulis konten email seperti biasa, tidak perlu HTML</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Info:</strong> Email akan dikirim ke semua pelanggan yang memiliki email di database reservasi.
                    Pastikan Brevo API sudah dikonfigurasi di environment variables.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBroadcastModal(false);
                      setBroadcastForm({ subject: '', content: '' });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={sendingBroadcast}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={sendingBroadcast}
                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingBroadcast ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Broadcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Recipients Modal */}
      {showRecipientsModal && selectedBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Penerima Email</h2>
                <button
                  onClick={() => {
                    setShowRecipientsModal(false);
                    setSelectedBroadcast(null);
                    setBroadcastRecipients([]);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{selectedBroadcast.subject}</h3>
                <p className="text-sm text-gray-500">
                  Total Penerima: {selectedBroadcast.total_recipients} • 
                  Terkirim: {selectedBroadcast.sent_count} • 
                  Gagal: {selectedBroadcast.failed_count}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRecipientFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      recipientFilter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setRecipientFilter('sent')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      recipientFilter === 'sent'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Terkirim
                  </button>
                  <button
                    onClick={() => setRecipientFilter('failed')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      recipientFilter === 'failed'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Gagal
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {broadcastRecipients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada penerima dengan status ini
                  </div>
                ) : (
                  broadcastRecipients.map((recipient) => (
                    <div key={recipient.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{recipient.nama || 'Tanpa Nama'}</p>
                          <p className="text-sm text-gray-600">{recipient.email}</p>
                          {recipient.sent_at && (
                            <p className="text-xs text-gray-500">
                              Dikirim: {new Date(recipient.sent_at).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          recipient.status === 'sent' ? 'bg-green-100 text-green-800' :
                          recipient.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recipient.status === 'sent' ? 'Terkirim' :
                           recipient.status === 'failed' ? 'Gagal' : 'Pending'}
                        </span>
                      </div>
                      {recipient.status === 'failed' && recipient.error_message && (
                        <p className="text-xs text-red-600 mt-2">
                          Error: {recipient.error_message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idle Warning Modal */}
      {showIdleWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sesi Akan Berakhir
              </h2>
              <p className="text-gray-600 mb-4">
                Anda tidak aktif selama beberapa waktu. Demi keamanan, Anda akan logout otomatis dalam:
              </p>
              <div className="text-4xl font-bold text-orange-600 mb-6">
                {idleCountdown} detik
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout Sekarang
                </button>
                <button
                  onClick={handleStayLoggedIn}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Tetap Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 max-w-[90vw] animate-slide-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {confirmModal.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {confirmModal.message}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (confirmModal.onConfirm) {
                      await confirmModal.onConfirm();
                    }
                    setConfirmModal(null);
                  }}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
