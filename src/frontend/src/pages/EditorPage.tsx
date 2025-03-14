import { 
  Box, 
  Heading, 
  Text, 
  Container,
  Badge,
  useBreakpointValue
} from '@chakra-ui/react'
import VideoEditor from '../components/VideoEditor'

const EditorPage = () => {
  // Responsive adjustments
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" })

  return (
    <Box className="fade-in">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Box mb={8} className="slide-in-up">
          <Heading as="h1" size={headingSize} mb={3} className="glow-text">
            Video Editor
          </Heading>
          <Text fontSize="lg" mb={4} opacity={0.9}>
            Splice, trim, and combine videos with easy-to-apply transitions.
          </Text>
          
          <Badge colorScheme="brand" fontSize="sm" px={2} py={1} borderRadius="full">
            FFmpeg-Powered
          </Badge>
        </Box>

        <VideoEditor />
      </Container>
    </Box>
  )
}

export default EditorPage
