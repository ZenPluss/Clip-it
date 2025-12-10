import ytDlp from 'yt-dlp-exec';

export const handler = async (event) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters?.url;
    const quality = event.queryStringParameters?.quality;

    if (!url) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'URL is required' })
        };
    }

    console.log('Getting download URL for:', url);

    try {
        // Get direct download URL from yt-dlp
        const info = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            addHeader: ['User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
            format: 'best[ext=mp4][protocol^=http]/best[ext=mp4]/best',
        });

        const isImage = info.ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(info.ext.toLowerCase());
        const rawFilename = `${info.title || 'download'}.${info.ext || 'mp4'}`;
        const filename = rawFilename.replace(/[^\x20-\x7E]/g, '_');

        // Get the direct download URL
        let downloadUrl = info.url;

        // For formats with multiple URLs, prefer the one with best quality
        if (info.requested_formats && info.requested_formats.length > 0) {
            downloadUrl = info.requested_formats[0].url;
        }

        console.log('Direct download URL obtained for:', filename);

        // Return the direct download URL to the client
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
                title: info.title,
                ext: info.ext
            })
        };

    } catch (error) {
        console.error('Download error:', error.message);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: 'Failed to get download URL',
                details: error.message
            })
        };
    }
};
