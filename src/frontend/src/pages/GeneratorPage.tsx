import { 
  Box, 
  Heading, 
  Text, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Card,
  CardBody,
  SimpleGrid,
  Image,
  VStack,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Flex,
  Spacer,
  useToast,
  Progress,
  Container,
  Badge,
  Tooltip,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  IconButton,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react'
import { FiPlay, FiDownload, FiSave, FiUpload, FiInfo, FiAlertCircle, FiCheckCircle, FiClock, FiVideo } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import hedraService from '../services/hedra.service'

const GeneratorPage = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<any>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [avatars, setAvatars] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Responsive adjustments
  const columnCount = useBreakpointValue({ base: 1, md: 2 })
  const avatarGridColumns = useBreakpointValue({ base: 1, sm: 2 })
  
  // Form state
  const [formData, setFormData] = useState({
    avatar: 'mike',
    voice: '',
    script: '',
    emotions: '',
    resolution: '720p',
    aspectRatio: '16:9'
  })

  useEffect(() => {
    // Fetch avatars and voices when component mounts
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const avatarData = await hedraService.getAvatars()
        setAvatars(avatarData)
        
        const voiceData = await hedraService.getVoices()
        setVoices(voiceData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Could not load avatars and voices. Please try again later.')
        toast({
          title: 'Error fetching data',
          description: 'Could not load avatars and voices',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    // Clean up interval on unmount
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [toast])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle avatar selection
  const handleAvatarSelect = (avatarId: string) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarId
    }))
    
    // Show a toast for feedback
    toast({
      title: 'Avatar selected',
      description: `${avatarId === 'mike' ? 'Mike' : 'Mira'} has been selected as your avatar`,
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-right'
    })
  }
  
  // Generate video
  const handleGenerateVideo = async () => {
    if (!formData.script.trim()) {
      toast({
        title: 'Script required',
        description: 'Please enter a script for your video',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      })
      return
    }
    
    setGenerating(true)
    setError(null)
    
    try {
      const result = await hedraService.generateVideo({
        script: formData.script,
        avatar: formData.avatar,
        voice: formData.voice || formData.avatar, // Default to avatar name if voice not specified
        emotions: formData.emotions ? formData.emotions.split(',') : [],
        resolution: formData.resolution as '720p' | '1080p',
        aspectRatio: formData.aspectRatio as '16:9' | '9:16' | '1:1'
      })
      
      setJobId(result.jobId)
      
      // Start checking job status
      const interval = setInterval(checkJobStatus, 5000)
      setStatusCheckInterval(interval)
      
      toast({
        title: 'Video generation started',
        description: `Estimated time: ${result.estimatedTime}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } catch (error) {
      console.error('Error generating video:', error)
      setError('Could not start video generation. Please try again later.')
      toast({
        title: 'Error generating video',
        description: 'Could not start video generation',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } finally {
      setGenerating(false)
    }
  }
  
  // Check job status
  const checkJobStatus = async () => {
    if (!jobId) return
    
    try {
      const status = await hedraService.checkJobStatus(jobId)
      setJobStatus(status)
      
      if (status.status === 'completed') {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }
        
        setVideoUrl(status.videoUrl || null)
        
        toast({
          title: 'Video generation complete',
          description: 'Your video is ready to view',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      } else if (status.status === 'failed') {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }
        
        setError(status.message || 'An error occurred during video generation')
        toast({
          title: 'Video generation failed',
          description: status.message || 'An error occurred during video generation',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        })
      }
    } catch (error) {
      console.error('Error checking job status:', error)
      setError('Error checking job status. Please try again later.')
    }
  }
  
  // Handle saving to library
  const handleSaveToLibrary = () => {
    if (!videoUrl) return
    
    toast({
      title: 'Video saved',
      description: 'Your video has been saved to the library',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
  }

  return (
    <Box className="fade-in">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Box mb={8} className="slide-in-up">
          <Heading as="h1" size="xl" mb={3} className="glow-text">
            Video Generator
          </Heading>
          <Text fontSize="lg" mb={4} opacity={0.9}>
            Create talking head videos with AI avatars using Hedra.
          </Text>
          
          <Badge colorScheme="brand" fontSize="sm" px={2} py={1} borderRadius="full">
            AI-Powered
          </Badge>
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={6} borderRadius="md" className="slide-in-up">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <CloseButton 
              position="absolute" 
              right="8px" 
              top="8px" 
              onClick={() => setError(null)}
            />
          </Alert>
        )}

        <Tabs 
          variant="enclosed" 
          colorScheme="brand" 
          mb={8}
          className="slide-in-up"
          isLazy
        >
          <TabList>
            <Tab _selected={{ color: "brand.300", borderColor: "brand.500" }}>
              Hedra
            </Tab>
            <Tab _selected={{ color: "brand.300", borderColor: "brand.500" }} isDisabled>
              RunwayML
              <Badge ml={2} colorScheme="gray" fontSize="xs">Soon</Badge>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <Card 
                bg="gray.800" 
                p={{ base: 3, md: 5 }}
                borderRadius="lg"
                boxShadow="xl"
                borderWidth="1px"
                borderColor="gray.700"
                className="card-hover"
              >
                <CardBody>
                  <SimpleGrid columns={columnCount} spacing={8}>
                    <Box>
                      <Heading as="h3" size="md" mb={4} className="slide-in-right">
                        Avatar Selection
                      </Heading>
                      
                      {loading ? (
                        <SimpleGrid columns={avatarGridColumns} spacing={4} mb={6}>
                          <Skeleton height="150px" borderRadius="md" />
                          <Skeleton height="150px" borderRadius="md" />
                        </SimpleGrid>
                      ) : (
                        <SimpleGrid columns={avatarGridColumns} spacing={4} mb={6}>
                          {avatars.map((avatar, index) => (
                            <VStack 
                              key={avatar.id}
                              p={3} 
                              borderRadius="md" 
                              borderWidth="2px" 
                              borderColor={formData.avatar === avatar.id ? "brand.500" : "gray.600"}
                              _hover={{ 
                                borderColor: 'brand.400',
                                transform: 'translateY(-4px)',
                                boxShadow: 'lg'
                              }}
                              cursor="pointer"
                              onClick={() => handleAvatarSelect(avatar.id)}
                              transition="all 0.3s ease"
                              className={`stagger-item card-hover ${formData.avatar === avatar.id ? 'glow' : ''}`}
                              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                            >
                              <Box position="relative" borderRadius="md" overflow="hidden">
                                <Image 
                                  src={avatar.imageUrl} 
                                  alt={`${avatar.name} Avatar`} 
                                  borderRadius="md" 
                                  boxSize="120px"
                                  objectFit="cover"
                                />
                                {formData.avatar === avatar.id && (
                                  <Box 
                                    position="absolute" 
                                    top={2} 
                                    right={2}
                                    bg="brand.500"
                                    borderRadius="full"
                                    p={1}
                                  >
                                    <FiCheckCircle color="white" size={16} />
                                  </Box>
                                )}
                              </Box>
                              <Text fontWeight="bold">{avatar.name}</Text>
                            </VStack>
                          ))}
                        </SimpleGrid>
                      )}

                      <FormControl mb={4}>
                        <FormLabel>
                          Voice
                          <Tooltip label="Select a voice for your avatar" placement="top" hasArrow>
                            <IconButton
                              aria-label="Voice information"
                              icon={<FiInfo />}
                              size="xs"
                              variant="ghost"
                              ml={1}
                            />
                          </Tooltip>
                        </FormLabel>
                        {loading ? (
                          <Skeleton height="40px" borderRadius="md" />
                        ) : (
                          <Select 
                            bg="gray.700"
                            name="voice"
                            value={formData.voice}
                            onChange={handleInputChange}
                            borderRadius="md"
                            _hover={{ borderColor: 'brand.400' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                            <option value="">Select a voice</option>
                            {voices.map(voice => (
                              <option key={voice.voice_id} value={voice.voice_id}>
                                {voice.name} ({voice.labels?.gender || 'Unknown'})
                              </option>
                            ))}
                          </Select>
                        )}
                      </FormControl>

                      <SimpleGrid columns={2} spacing={4}>
                        <FormControl mb={4}>
                          <FormLabel>
                            Video Resolution
                            <Tooltip label="Higher resolution means better quality but larger file size" placement="top" hasArrow>
                              <IconButton
                                aria-label="Resolution information"
                                icon={<FiInfo />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                              />
                            </Tooltip>
                          </FormLabel>
                          <Select 
                            bg="gray.700" 
                            name="resolution"
                            value={formData.resolution}
                            onChange={handleInputChange}
                            borderRadius="md"
                            _hover={{ borderColor: 'brand.400' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                          </Select>
                        </FormControl>

                        <FormControl mb={4}>
                          <FormLabel>
                            Aspect Ratio
                            <Tooltip label="Choose based on where you'll share your video" placement="top" hasArrow>
                              <IconButton
                                aria-label="Aspect ratio information"
                                icon={<FiInfo />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                              />
                            </Tooltip>
                          </FormLabel>
                          <Select 
                            bg="gray.700" 
                            name="aspectRatio"
                            value={formData.aspectRatio}
                            onChange={handleInputChange}
                            borderRadius="md"
                            _hover={{ borderColor: 'brand.400' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="1:1">1:1 (Square)</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    <Box>
                      <Heading as="h3" size="md" mb={4} className="slide-in-right">
                        Script
                      </Heading>
                      <FormControl mb={4}>
                        <FormLabel>
                          Enter your script
                          <Badge ml={2} colorScheme="red">Required</Badge>
                        </FormLabel>
                        <Textarea 
                          placeholder="Type or paste your script here..." 
                          bg="gray.700"
                          rows={10}
                          name="script"
                          value={formData.script}
                          onChange={handleInputChange}
                          borderRadius="md"
                          _hover={{ borderColor: 'brand.400' }}
                          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                          className={formData.script ? '' : 'pulse'}
                        />
                      </FormControl>

                      <FormControl mb={6}>
                        <FormLabel>
                          Emotions & Gestures
                          <Badge ml={2} colorScheme="gray">Optional</Badge>
                          <Tooltip label="Add comma-separated emotions like 'happy, serious, excited'" placement="top" hasArrow>
                            <IconButton
                              aria-label="Emotions information"
                              icon={<FiInfo />}
                              size="xs"
                              variant="ghost"
                              ml={1}
                            />
                          </Tooltip>
                        </FormLabel>
                        <Textarea 
                          placeholder="Add emotions or gestures instructions (comma separated)..." 
                          bg="gray.700"
                          rows={3}
                          name="emotions"
                          value={formData.emotions}
                          onChange={handleInputChange}
                          borderRadius="md"
                          _hover={{ borderColor: 'brand.400' }}
                          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                        />
                      </FormControl>

                      <HStack spacing={4}>
                        <Button 
                          leftIcon={<FiUpload />} 
                          variant="outline"
                          className="btn-hover"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'md'
                          }}
                          transition="all 0.2s ease"
                        >
                          Upload Audio
                        </Button>
                        <Spacer />
                        <Button 
                          colorScheme="brand" 
                          leftIcon={<FiPlay />}
                          size="lg"
                          onClick={handleGenerateVideo}
                          isLoading={generating}
                          loadingText="Generating..."
                          isDisabled={!formData.script || generating || (jobStatus && jobStatus.status === 'processing')}
                          className="btn-hover"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                          }}
                          transition="all 0.2s ease"
                        >
                          Generate Video
                        </Button>
                      </HStack>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card bg="gray.800" p={4} borderRadius="lg" boxShadow="xl" borderWidth="1px" borderColor="gray.700">
                <CardBody>
                  <VStack spacing={4} align="center" py={10}>
                    <FiClock size={40} color="var(--chakra-colors-brand-300)" />
                    <Heading size="md">RunwayML Integration Coming Soon</Heading>
                    <Text textAlign="center" maxW="500px">
                      We're working on integrating RunwayML for even more advanced video generation capabilities.
                      Stay tuned for updates!
                    </Text>
                    <Badge colorScheme="gray">In Development</Badge>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Card 
          bg="gray.800" 
          p={{ base: 3, md: 5 }} 
          mb={8} 
          borderRadius="lg" 
          boxShadow="xl"
          borderWidth="1px"
          borderColor="gray.700"
          className="slide-in-up"
        >
          <CardBody>
            <Heading as="h3" size="md" mb={4} className="slide-in-right">
              Preview
              {jobStatus && jobStatus.status === 'processing' && (
                <Badge ml={3} colorScheme="yellow" fontSize="sm">Processing</Badge>
              )}
              {videoUrl && (
                <Badge ml={3} colorScheme="green" fontSize="sm">Ready</Badge>
              )}
            </Heading>
            
            {jobStatus && jobStatus.status === 'processing' && (
              <Box mb={4} className="fade-in">
                <Flex align="center" mb={2}>
                  <FiClock color="var(--chakra-colors-yellow-400)" />
                  <Text ml={2} color="yellow.400">Processing: {jobStatus.progress}%</Text>
                </Flex>
                <Progress 
                  value={jobStatus.progress} 
                  colorScheme="brand" 
                  size="sm" 
                  borderRadius="md"
                  hasStripe
                  isAnimated
                  className="glow"
                />
              </Box>
            )}
            
            <Box 
              bg="gray.900" 
              height="350px" 
              borderRadius="md" 
              display="flex" 
              justifyContent="center" 
              alignItems="center"
              overflow="hidden"
              boxShadow="inner"
              position="relative"
              className={videoUrl ? 'glow' : ''}
            >
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  className="fade-in"
                />
              ) : (
                <VStack spacing={4} className="pulse">
                  <FiVideo size={40} color="var(--chakra-colors-gray-500)" />
                  <Text color="gray.500">Video preview will appear here</Text>
                </VStack>
              )}
            </Box>
            
            <Flex mt={6} justify="flex-end">
              <HStack spacing={4}>
                <Button 
                  leftIcon={<FiSave />} 
                  variant="outline"
                  isDisabled={!videoUrl}
                  onClick={handleSaveToLibrary}
                  className="btn-hover"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s ease"
                >
                  Save to Library
                </Button>
                {videoUrl ? (
                  <Button 
                    as="a"
                    leftIcon={<FiDownload />} 
                    colorScheme="brand"
                    href={videoUrl}
                    download="generated-video.mp4"
                    className="btn-hover"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s ease"
                  >
                    Download
                  </Button>
                ) : (
                  <Button 
                    leftIcon={<FiDownload />} 
                    colorScheme="brand"
                    isDisabled
                  >
                    Download
                  </Button>
                )}
              </HStack>
            </Flex>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default GeneratorPage
