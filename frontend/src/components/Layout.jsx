import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen relative z-10">{children}</main>
      <Footer />
    </>
  );
}