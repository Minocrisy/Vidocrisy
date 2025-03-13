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
  Progress
} from '@chakra-ui/react'
import { FiPlay, FiDownload, FiSave, FiUpload } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import hedraService from '../services/hedra.service'

const GeneratorPage = () => {
  const toast = useToast()
  const [, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<any>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [avatars, setAvatars] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  
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
      try {
        const avatarData = await hedraService.getAvatars()
        setAvatars(avatarData)
        
        const voiceData = await hedraService.getVoices()
        setVoices(voiceData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Error fetching data',
          description: 'Could not load avatars and voices',
          status: 'error',
          duration: 5000,
          isClosable: true
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
  }
  
  // Generate video
  const handleGenerateVideo = async () => {
    setGenerating(true)
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
        isClosable: true
      })
    } catch (error) {
      console.error('Error generating video:', error)
      toast({
        title: 'Error generating video',
        description: 'Could not start video generation',
        status: 'error',
        duration: 5000,
        isClosable: true
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
          isClosable: true
        })
      } else if (status.status === 'failed') {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }
        
        toast({
          title: 'Video generation failed',
          description: status.message || 'An error occurred during video generation',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      console.error('Error checking job status:', error)
    }
  }
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Video Generator
      </Heading>
      <Text mb={8}>
        Create talking head videos with AI avatars using Hedra.
      </Text>

      <Tabs variant="enclosed" colorScheme="brand" mb={8}>
        <TabList>
          <Tab>Hedra</Tab>
          <Tab>RunwayML</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card bg="gray.800" p={4}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      Avatar Selection
                    </Heading>
                    <SimpleGrid columns={2} spacing={4} mb={6}>
                      {avatars.map(avatar => (
                        <VStack 
                          key={avatar.id}
                          p={2} 
                          borderRadius="md" 
                          borderWidth="2px" 
                          borderColor={formData.avatar === avatar.id ? "brand.500" : "gray.600"}
                          _hover={{ borderColor: 'brand.400' }}
                          cursor="pointer"
                          onClick={() => handleAvatarSelect(avatar.id)}
                        >
                          <Image 
                            src={avatar.imageUrl} 
                            alt={`${avatar.name} Avatar`} 
                            borderRadius="md" 
                            boxSize="120px"
                            objectFit="cover"
                          />
                          <Text fontWeight="bold">{avatar.name}</Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    <FormControl mb={4}>
                      <FormLabel>Voice</FormLabel>
                      <Select 
                        bg="gray.700"
                        name="voice"
                        value={formData.voice}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a voice</option>
                        {voices.map(voice => (
                          <option key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} ({voice.labels?.gender || 'Unknown'})
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>Video Resolution</FormLabel>
                      <Select 
                        bg="gray.700" 
                        name="resolution"
                        value={formData.resolution}
                        onChange={handleInputChange}
                      >
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </Select>
                    </FormControl>

                    <FormControl mb={4}>
                      <FormLabel>Aspect Ratio</FormLabel>
                      <Select 
                        bg="gray.700" 
                        name="aspectRatio"
                        value={formData.aspectRatio}
                        onChange={handleInputChange}
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="1:1">1:1 (Square)</option>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      Script
                    </Heading>
                    <FormControl mb={4}>
                      <FormLabel>Enter your script</FormLabel>
                      <Textarea 
                        placeholder="Type or paste your script here..." 
                        bg="gray.700"
                        rows={10}
                        name="script"
                        value={formData.script}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl mb={6}>
                      <FormLabel>Emotions & Gestures (Optional)</FormLabel>
                      <Textarea 
                        placeholder="Add emotions or gestures instructions (comma separated)..." 
                        bg="gray.700"
                        rows={3}
                        name="emotions"
                        value={formData.emotions}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <HStack spacing={4}>
                      <Button leftIcon={<FiUpload />} variant="outline">
                        Upload Audio
                      </Button>
                      <Spacer />
                      <Button 
                        colorScheme="brand" 
                        leftIcon={<FiPlay />}
                        size="lg"
                        onClick={handleGenerateVideo}
                        isLoading={generating}
                        isDisabled={!formData.script || generating || (jobStatus && jobStatus.status === 'processing')}
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
            <Card bg="gray.800" p={4}>
              <CardBody>
                <Text>RunwayML integration coming soon...</Text>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Card bg="gray.800" p={4} mb={8}>
        <CardBody>
          <Heading as="h3" size="md" mb={4}>
            Preview
          </Heading>
          {jobStatus && jobStatus.status === 'processing' && (
            <Box mb={4}>
              <Text mb={2}>Processing: {jobStatus.progress}%</Text>
              <Progress value={jobStatus.progress} colorScheme="brand" size="sm" borderRadius="md" />
            </Box>
          )}
          
          <Box 
            bg="gray.900" 
            height="300px" 
            borderRadius="md" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            overflow="hidden"
          >
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Text color="gray.500">Video preview will appear here</Text>
            )}
          </Box>
          <Flex mt={4} justify="flex-end">
            <HStack spacing={4}>
              <Button 
                leftIcon={<FiSave />} 
                variant="outline"
                isDisabled={!videoUrl}
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
    </Box>
  )
}

export default GeneratorPage
