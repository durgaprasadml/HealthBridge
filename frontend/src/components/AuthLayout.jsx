export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg fade-in">
        {children}
      </div>
    </div>
  );
}