import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PricingSection from '../components/PricingSection';
import ComparisonTable from '../components/ComparisonTable';
import Calculator from '../components/Calculator';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import OrderModal from '../components/OrderModal';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PricingSection />
        <ComparisonTable />
        <Calculator />
        <FAQ />
      </main>
      <Footer />
      <OrderModal />
    </>
  );
}
