/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { House, HOUSES } from './data/houses';
import { ContactFormData } from './utils/contactValidation';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedHouses } from './components/FeaturedHouses';
import { CatalogSection } from './components/CatalogSection';
import { ProcessSection } from './components/ProcessSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HouseDetailModal } from './components/HouseDetailModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { SheetsSyncModal } from './components/SheetsSyncModal';
import { fetchHousesFromSupabase, getSupabaseClient } from './services/supabaseService';

const STORAGE_KEY_HOUSES = 'hausburg_custom_houses';
const STORAGE_KEY_SHEET_ID = 'hausburg_spreadsheet_id';

export default function App() {
  const [houses, setHouses] = useState<House[]>(HOUSES);
  const [isCustomCatalog, setIsCustomCatalog] = useState(false);
  const [currentSheetId, setCurrentSheetId] = useState('');
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  const [selectedHouseForModal, setSelectedHouseForModal] = useState<House | null>(null);
  const [contactInitialHouse, setContactInitialHouse] = useState<House | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    formData: ContactFormData;
    orderCode: string;
    mailtoLink: string;
  } | null>(null);

  // Initialize catalog directly from Supabase (free tier)
  useEffect(() => {
    let isMounted = true;
    const initCatalog = async () => {
      try {
        const { houses: loadedHouses, isFromSupabase } = await fetchHousesFromSupabase();
        if (isMounted && loadedHouses && loadedHouses.length > 0) {
          setHouses(loadedHouses);
          if (isFromSupabase) {
            setIsCustomCatalog(true);
          }
        }
      } catch (err) {
        console.warn('Could not load houses from Supabase:', err);
      }
    };

    initCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleHousesUpdated = (newHouses: House[], sheetId: string) => {
    setHouses(newHouses);
    setIsCustomCatalog(true);
    setCurrentSheetId(sheetId);
    try {
      localStorage.setItem(STORAGE_KEY_HOUSES, JSON.stringify(newHouses));
      localStorage.setItem(STORAGE_KEY_SHEET_ID, sheetId);
    } catch (e) {
      console.warn('Failed to save houses to local storage', e);
    }
  };

  const handleResetToDefault = () => {
    setHouses(HOUSES);
    setIsCustomCatalog(false);
    setCurrentSheetId('');
    try {
      localStorage.removeItem(STORAGE_KEY_HOUSES);
      localStorage.removeItem(STORAGE_KEY_SHEET_ID);
    } catch (e) {
      console.warn('Failed to remove houses from local storage', e);
    }
  };

  const handleOpenContact = (houseName?: string) => {
    if (houseName) {
      const match = houses.find((h) => h.name.toLowerCase() === houseName.toLowerCase());
      if (match) {
        setContactInitialHouse(match);
      }
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHouseForDetail = (house: House) => {
    setSelectedHouseForModal(house);
  };

  const handleCloseDetailModal = () => {
    setSelectedHouseForModal(null);
  };

  const handleContactFromDetail = (house: House) => {
    setSelectedHouseForModal(null);
    setContactInitialHouse(house);
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleQuickContactFromCatalog = (house: House) => {
    setContactInitialHouse(house);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSuccess = (formData: ContactFormData, orderCode: string, mailtoLink: string) => {
    setOrderConfirmation({
      formData,
      orderCode,
      mailtoLink,
    });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProcess = () => {
    const el = document.getElementById('process');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Compute featured houses from dynamic houses array
  const featuredHouses = houses.filter((h) => h.featured);
  const displayFeatured = featuredHouses.length > 0 ? featuredHouses : houses.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#121e15] text-[#f2f6f3] flex flex-col font-body selection:bg-[#2d4d35] selection:text-white relative">
      
      {/* Top Navbar */}
      <Navbar
        onOpenContact={() => handleOpenContact()}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          featuredHouse={displayFeatured[0]}
          onExploreCatalog={scrollToCatalog}
          onExploreProcess={scrollToProcess}
          onSelectHouse={handleSelectHouseForDetail}
        />

        {/* Featured Houses */}
        <FeaturedHouses
          houses={displayFeatured}
          onSelectHouse={handleSelectHouseForDetail}
          onExploreAll={scrollToCatalog}
        />

        {/* Catalog Section */}
        <CatalogSection
          houses={houses}
          onSelectHouse={handleSelectHouseForDetail}
          onQuickContact={handleQuickContactFromCatalog}
        />

        {/* Process Section */}
        <ProcessSection />

        {/* Contact Form Section */}
        <ContactSection
          initialHouse={contactInitialHouse}
          houses={houses}
          onSuccessSubmit={handleOrderSuccess}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <HouseDetailModal
        house={selectedHouseForModal}
        onClose={handleCloseDetailModal}
        onSelectForContact={handleContactFromDetail}
      />

      <OrderConfirmationModal
        orderData={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />

      {/* Google Sheets Live Sync Modal */}
      <SheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        onHousesUpdated={handleHousesUpdated}
        onResetToDefault={handleResetToDefault}
        currentSheetId={currentSheetId}
        isCustomCatalog={isCustomCatalog}
        houseCount={houses.length}
      />
    </div>
  );
}
