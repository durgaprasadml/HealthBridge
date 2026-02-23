import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  );
}