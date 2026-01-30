import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex items-center justify-center py-10 px-4">
        {children}
      </main>
    </div>
  );
}