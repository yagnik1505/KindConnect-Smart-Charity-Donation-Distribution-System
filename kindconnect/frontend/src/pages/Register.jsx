import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  User, 
  Building, 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { requestOtp, verifyOtp, completeRegistration, login } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  
  // Registration Flow Steps: 
  // 1: Role Selection, 2: Email Entry & Request OTP, 3: OTP Verification, 4: Set Password
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('DONOR');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password rules validation states
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

  const handleNextStep = () => {
    setError('');
    setSuccess('');
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setSuccess('');
    setStep((prev) => prev - 1);
  };

  const getErrorMessage = (err, defaultMsg) => {
    let detail = '';
    if (err.response) {
      const data = err.response.data;
      const status = err.response.status;
      const statusText = err.response.statusText || '';
      
      if (data) {
        if (typeof data === 'string') detail = data;
        else if (data.Error) detail = data.Error;
        else if (data.error) detail = `${data.error}${data.message ? ': ' + data.message : ''}`;
        else if (data.Message) detail = data.Message;
        else if (data.message) detail = data.message;
        else if (typeof data === 'object') {
          const values = Object.values(data);
          if (values.length > 0) detail = values.join(', ');
        }
      }
      
      if (!detail) {
        detail = `${status} ${statusText}`;
      }
    } else if (err.message) {
      detail = err.message;
    }
    
    return detail ? `${defaultMsg} Details: ${detail}` : defaultMsg;
  };

  // Step 2: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await requestOtp(email);
      setSuccess(`A 6-digit OTP code has been sent to ${email}`);
      // Advance to step 3 after a small delay to let user see success
      setTimeout(() => {
        setStep(3);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send OTP. Please check the email and try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await verifyOtp(email, otpCode);
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        setStep(4);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid or expired OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Complete Registration in Backend
      await completeRegistration(password, role, otpCode);
      setSuccess('Account created successfully! Logging you in...');

      // 2. Perform Automatic Login
      await login(email, password);
      
      // 3. Redirect to dashboard/home after a small delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Registration completion failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Stepper Header Component
  const renderStepper = () => {
    const steps = [
      { num: 1, label: 'Role' },
      { num: 2, label: 'Email' },
      { num: 3, label: 'OTP' },
      { num: 4, label: 'Security' }
    ];

    return (
      <div className="flex items-center justify-between w-full mb-8 px-2">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step === s.num
                    ? 'bg-pink-500 text-white ring-4 ring-pink-100 shadow-md'
                    : step > s.num
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.num ? <Check className="h-5 w-5" /> : s.num}
              </div>
              <span className={`text-xs mt-2 font-medium transition-colors ${
                step === s.num ? 'text-pink-600 font-bold' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 transition-all duration-500 bg-gray-200">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: step > s.num ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full mb-3 shadow-inner">
            <Heart className="h-10 w-10 text-pink-400 animate-pulse" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">KindConnect</h1>
          <p className="text-pink-100/80 text-sm mt-1">Smart Charity Donation & Distribution System</p>
        </div>

        {/* Card Body */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300">
          
          {/* Progress Indicators */}
          {renderStepper()}

          {/* Alert messages */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-r-xl text-sm flex items-start space-x-2 shadow-sm animate-shake">
              <X className="h-5 w-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r-xl text-sm flex items-start space-x-2 shadow-sm">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Select Your Role</h2>
                <p className="text-gray-500 text-sm mt-1">How would you like to participate in the KindConnect ecosystem?</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Donor Card */}
                <button
                  type="button"
                  onClick={() => setRole('DONOR')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'DONOR'
                      ? 'border-pink-500 bg-pink-50/50 shadow-md ring-2 ring-pink-100'
                      : 'border-gray-150 hover:border-pink-200 hover:bg-gray-50/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${role === 'DONOR' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-gray-800 text-base">Donor</span>
                    <span className="block text-gray-500 text-xs mt-0.5">Donate surplus food, clothes, essentials or create campaigns.</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    role === 'DONOR' ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-300'
                  }`}>
                    {role === 'DONOR' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                {/* NGO Card */}
                <button
                  type="button"
                  onClick={() => setRole('NGO')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'NGO'
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-100'
                      : 'border-gray-150 hover:border-indigo-200 hover:bg-gray-50/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${role === 'NGO' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-gray-800 text-base">NGO / Organization</span>
                    <span className="block text-gray-500 text-xs mt-0.5">Claim donations, manage distributions, and run fundraisers.</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    role === 'NGO' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300'
                  }`}>
                    {role === 'NGO' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Driver Card */}
                <button
                  type="button"
                  onClick={() => setRole('DRIVER')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'DRIVER'
                      ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-100'
                      : 'border-gray-150 hover:border-teal-200 hover:bg-gray-50/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${role === 'DRIVER' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-gray-800 text-base">Delivery Driver</span>
                    <span className="block text-gray-500 text-xs mt-0.5">Help transport donations from donors directly to NGOs.</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    role === 'DRIVER' ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
                  }`}>
                    {role === 'DRIVER' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-pink-300/30 flex items-center justify-center space-x-2 text-base"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Email & Request OTP */}
          {step === 2 && (
            <form onSubmit={handleRequestOtp} className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-gray-800 text-left">Verify Your Email</h2>
                <p className="text-gray-500 text-sm mt-1 text-left">Please enter your email address to receive a secure OTP code.</p>
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-250 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-bold rounded-xl transition-all disabled:opacity-55"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-pink-300/30 flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP Verification */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-gray-800 text-left">Enter Verification Code</h2>
                <p className="text-gray-500 text-sm mt-1 text-left">
                  We've sent a 6-digit OTP code to <strong className="text-gray-700">{email}</strong>.
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                  6-Digit OTP Code
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    className="block w-full pl-11 pr-4 py-3.5 tracking-[0.4em] font-mono text-center text-lg bg-gray-50/50 border border-gray-250 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-pink-500 hover:text-pink-600 font-semibold text-sm transition-colors"
                >
                  Resend OTP Code
                </button>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-bold rounded-xl transition-all disabled:opacity-55"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-pink-300/30 flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Password Creation */}
          {step === 4 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-gray-800 text-left">Choose Password</h2>
                <p className="text-gray-500 text-sm mt-1 text-left">Secure your new account with a strong password.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-250 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="Enter strong password"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    Confirm Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-250 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Password Requirements
                </span>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  <li className="flex items-center space-x-2">
                    {hasMinLength ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={hasMinLength ? 'text-gray-700' : ''}>At least 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    {hasUppercase ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={hasUppercase ? 'text-gray-700' : ''}>Contains an uppercase letter (A-Z)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    {hasLowercase ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={hasLowercase ? 'text-gray-700' : ''}>Contains a lowercase letter (a-z)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    {hasNumber ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={hasNumber ? 'text-gray-700' : ''}>Contains a number (0-9)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    {hasSpecial ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={hasSpecial ? 'text-gray-700' : ''}>Contains a special character (@, #, $, etc.)</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-bold rounded-xl transition-all disabled:opacity-55"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid || password !== confirmPassword}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-300/30 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Check className="h-5 w-5 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign In Redirect Link */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-pink-500 hover:text-pink-600 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-400 hover:text-gray-600 text-xs font-semibold tracking-wide uppercase">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
