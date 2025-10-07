import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { client } from './lib/apollo-client';
import Layout from './components/Layout';
import ArmyListPage from './pages/ArmyListPage';
import ArmyDetailPage from './pages/ArmyDetailPage';
import CreateArmyPage from './pages/CreateArmyPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/armies" replace />} />
            <Route path="armies" element={<ArmyListPage />} />
            <Route path="armies/new" element={<CreateArmyPage />} />
            <Route path="armies/:armyId" element={<ArmyDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
