export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f0faf9] flex items-center justify-center px-4">
      {children}
    </div>
  );
}