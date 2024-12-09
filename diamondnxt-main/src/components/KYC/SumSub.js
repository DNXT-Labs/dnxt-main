const [applicantId, setApplicantId] = useState(null);
const [accessToken, setAccessToken] = useState(null);

// Function to create an applicant
const createApplicant = async () => {
  try {
    const response = await Axios.post('/api/create-applicant', {
      externalUserId: 'your-external-user-id',
      levelName: 'basic-kyc-level', // Provide the appropriate level name
    });
    setApplicantId(response.data.id);
  } catch (error) {
    console.error('Error creating applicant:', error);
  }
};

// Function to create an access token
const createAccessToken = async () => {
  try {
    const response = await Axios.post('/api/create-access-token', {
      externalUserId: 'your-external-user-id',
      levelName: 'basic-kyc-level', // Provide the appropriate level name
    });
    setAccessToken(response.data.token);
  } catch (error) {
    console.error('Error creating access token:', error);
  }
};