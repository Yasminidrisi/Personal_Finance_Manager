import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleSendResetLink = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email!");
      return;
    }
    console.log(`Reset link sent to: ${email}`);
    setResetSent(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset successful!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700">Reset Password</h2>
        <p className="text-gray-600 text-center">
          {resetSent ? "Enter your new password" : "Enter your email to receive a reset link"}
        </p>

        {!resetSent ? (
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600">
          <Link to="/" className="text-blue-500 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
