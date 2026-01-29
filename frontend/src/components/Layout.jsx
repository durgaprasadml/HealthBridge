export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">HealthBridge</h1>

        <nav className="space-y-4 text-sm">
          <p className="opacity-90 cursor-pointer">Login</p>
          <p className="opacity-90 cursor-pointer">Signup</p>
          <p className="opacity-90 cursor-pointer">Profile</p>
        </nav>

        <div className="mt-auto text-xs opacity-70">
          © 2026 HealthBridge
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}