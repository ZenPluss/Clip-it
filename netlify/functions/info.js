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

    console.log('Fetching info for URL:', url);

    try {
        // Use cobalt.tools API for video info
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                isAudioOnly: false,
                isNoTTWatermark: true
            })
        });

        const data = await response.json();

        if (data.status === 'error' || data.status === 'rate-limit') {
            throw new Error(data.text || 'Failed to fetch media info');
        }

        // Extract platform from URL
        let platform = 'Unknown';
        if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';
        else if (url.includes('tiktok.com')) platform = 'TikTok';
        else if (url.includes('instagram.com')) platform = 'Instagram';
        else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter';
        else if (url.includes('facebook.com')) platform = 'Facebook';

        // Format response to match our frontend expectations
        const info = {
            id: Date.now().toString(),
            platform: platform,
            title: data.filename || 'Downloaded Video',
            thumbnail: data.thumb || '',
            duration: 'N/A',
            size: 'Unknown',
            quality: ['best'],
            originalUrl: url,
            mediaType: 'video',
            ext: 'mp4',
            downloadUrl: data.url // Store the download URL
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(info)
        };

    } catch (error) {
        console.error('Error fetching info:', error.message);

        let errorMessage = 'Failed to fetch media info';
        if (error.message.includes('rate-limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('Private')) {
            errorMessage = 'This content is private. Please use a public post.';
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
