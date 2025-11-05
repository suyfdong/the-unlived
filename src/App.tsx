import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import WritePage from './components/WritePage';
import ResultPage from './components/ResultPage';
import ExhibitionPage from './components/ExhibitionPage';
import DetailPage from './components/DetailPage';
import AboutPage from './components/AboutPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'write':
        return <WritePage onNavigate={setCurrentPage} />;
      case 'result':
        return <ResultPage onNavigate={setCurrentPage} />;
      case 'exhibition':
        return <ExhibitionPage onNavigate={setCurrentPage} />;
      case 'detail':
        return <DetailPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
