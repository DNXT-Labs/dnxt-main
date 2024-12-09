const express = require('express');
const axios = require('axios');
const { verifySignature, createAccessToken, createApplicant } = require('./utils');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();



router.post('/mint', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Extracting the base64 data and the image type
        const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = image.split(';')[0].split('/')[1];

        // Generating a unique filename
        const filename = `${uuidv4()}.${type}`;

        // Defining the path to save the image
        const imagePath = path.join(__dirname, '..', 'uploads', filename);

        // Writing the image data to the file
        fs.writeFileSync(imagePath, base64Data, 'base64');

        console.log('Image saved successfully:', imagePath);
        res.json({ message: 'Successfully saved image', imageUrl: `/uploads/${filename}` });

    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

router.post('/create-access-token', async (req, res) => {
    try {
        const { externalUserId, levelName, signature } = req.body;

        // Verify the signature and externalUserId
        const isSignatureValid = verifySignature(signature, externalUserId);
        if (!isSignatureValid) {
            return res.status(400).json({ error: 'Invalid Signature' });
        }

        // Call the createAccessToken function and await the result
        const response = await axios(createAccessToken(externalUserId, levelName));

        if (response) {
            // Log the Sumsub API response
            console.log('Sumsub API Response:', response.data);

            // Send the Sumsub API response back to the client
            res.json({ status: 'success', data: response.data });
        } else {
            // Handle the case where there's no response
            res.status(500).json({ error: 'Internal Server Error', message: 'No response from Sumsub API' });
        }
    } catch (error) {
        console.error('Error creating access token:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

router.post('/create-applicant', async (req, res) => {
    try {
        const { externalUserId, levelName, signature } = req.body;

        // Verify the signature and externalUserId
        const isSignatureValid = verifySignature(signature, externalUserId);
        if (!isSignatureValid) {
            return res.status(400).json({ error: 'Invalid Signature' });
        }

        // Call the createApplicant function and await the result
        const response = await axios(createApplicant(externalUserId, levelName));

        if (response) {
            // Log the Sumsub API response
            console.log('Sumsub API Response:', response.data);

            // Send the Sumsub API response back to the client
            res.json({ status: 'success', data: response.data });
        } else {
            // Handle the case where there's no response
            res.status(500).json({ error: 'Internal Server Error', message: 'No response from Sumsub API' });
        }
    } catch (error) {
        console.error('Error creating applicant:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

module.exports = router;
