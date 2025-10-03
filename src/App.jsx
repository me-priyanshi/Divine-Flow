import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import QueueManagement from './pages/QueueManagement';
import TempleInfo from './pages/TempleInfo';
import TrafficManagement from './pages/TrafficManagement';
import EmergencyContacts from './pages/EmergencyContacts';
import Settings from './pages/Settings';
// import QRVerification from './components/QRVerification';

function App() {
  const [language, setLanguage] = useState('en');
  const [selectedTemple, setSelectedTemple] = useState('somnath');

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    const savedTemple = localStorage.getItem('selected-temple');
    
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTemple) setSelectedTemple(savedTemple);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
  };

  const handleTempleChange = (newTemple) => {
    setSelectedTemple(newTemple);
    localStorage.setItem('selected-temple', newTemple);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header 
          language={language} 
          onLanguageChange={handleLanguageChange}
          selectedTemple={selectedTemple}
          onTempleChange={handleTempleChange}
        />
        
        <main className="pb-20">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  language={language} 
                  selectedTemple={selectedTemple} 
                />
              } 
            />
            <Route 
              path="/queue" 
              element={
                <QueueManagement 
                  language={language} 
                  selectedTemple={selectedTemple} 
                />
              } 
            />
            <Route 
              path="/temple-info" 
              element={
                <TempleInfo 
                  language={language} 
                  selectedTemple={selectedTemple} 
                />
              } 
            />
            <Route 
              path="/traffic" 
              element={
                <TrafficManagement 
                  language={language} 
                  selectedTemple={selectedTemple} 
                />
              } 
            />
            <Route 
              path="/emergency" 
              element={
                <EmergencyContacts 
                  language={language} 
                  selectedTemple={selectedTemple} 
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  language={language} 
                  onLanguageChange={handleLanguageChange}
                  selectedTemple={selectedTemple}
                  onTempleChange={handleTempleChange}
                />
              } 
            />
            {/* <Route 
              path="/verify" 
              element={<QRVerification />} 
            /> */}
          </Routes>
        </main>

        <Navigation language={language} />
      </div>
    </Router>
  );
}

export default App;