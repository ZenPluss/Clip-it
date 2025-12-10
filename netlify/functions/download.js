export const handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters?.url;
    if (!url) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'URL is required' })
        };
    }

    console.log('Getting download URL for:', url);

    try {
        // Use cobalt.tools API for download
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                isAudioOnly: false,
                isNoTTWatermark: true,
                filenamePattern: 'basic'
            })
        });

        const data = await response.json();

        if (data.status === 'error' || data.status === 'rate-limit') {
            throw new Error(data.text || 'Failed to get download URL');
        }

        // cobalt.tools returns direct download URL
        const downloadUrl = data.url;
        const filename = data.filename || 'video.mp4';

        console.log('Direct download URL obtained');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                success: true,
                downloadUrl: downloadUrl,
                filename: filename,
                title: filename.replace(/\.[^/.]+$/, ''), // Remove extension
                ext: filename.split('.').pop() || 'mp4'
            })
        };

    } catch (error) {
        console.error('Download error:', error.message);

        let errorMessage = 'Failed to get download URL';
        if (error.message.includes('rate-limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        }

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: errorMessage,
                details: error.message
            })
        };
    }
};
