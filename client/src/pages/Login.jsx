import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await api.post('/auth/login', formData);
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/admin');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email atau password salah';
      setError(errorMessage);
      console.error('Login error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#0c1f41' }}>
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4" title="Kembali ke Beranda" aria-label="Kembali ke Beranda">
              <img
                src={logo}
                alt="Xayara Indonesia"
                className="h-16 w-auto mx-auto object-contain transition-transform hover:scale-105"
              />
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="text-gray-600 mt-2">
              Masuk untuk mengelola reservasi
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="input-field pl-10"
                  placeholder="Masukkan email admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-medium py-3 px-4 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#0c1f41' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
