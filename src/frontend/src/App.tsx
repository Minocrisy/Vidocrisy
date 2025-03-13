import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GeneratorPage from './pages/GeneratorPage'
import EditorPage from './pages/EditorPage'
import LibraryPage from './pages/LibraryPage'

function App() {
  return (
    <Box minH="100vh" bg="gray.900">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generator" element={<GeneratorPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App
