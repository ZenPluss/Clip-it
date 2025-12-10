import ytDlp from 'yt-dlp-exec';

// Helper to format bytes
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return 'Unknown';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const handler = async (event) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters?.url;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL is required' })
        };
    }

    console.log('Fetching info for URL:', url);

    try {
        const output = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            addHeader: ['User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
        });

        console.log('Successfully fetched info for:', output.title);

        // Determine if it's a photo or video
        const isImage = output.ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(output.ext.toLowerCase());
        const mediaType = isImage ? 'image' : 'video';

        // Try to get size
        const sizeBytes = output.filesize || output.filesize_approx;
        const formattedSize = sizeBytes ? formatBytes(sizeBytes) : 'Unknown';

        const info = {
            id: output.id,
            platform: output.extractor_key,
            title: output.title || 'Untitled',
            thumbnail: output.thumbnail || output.url,
            duration: output.duration_string || (isImage ? 'Photo' : 'N/A'),
            size: formattedSize,
            quality: output.formats ? [...new Set(output.formats.map(f => f.resolution || 'original'))] : ['original'],
            originalUrl: url,
            mediaType: mediaType,
            ext: output.ext || 'mp4'
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
        console.error('Full error:', error);

        // Provide more specific error messages
        let errorMessage = 'Failed to fetch media info';
        if (error.message.includes('Private')) {
            errorMessage = 'This content is private. Please use a public post.';
        } else if (error.message.includes('login') || error.message.includes('Sign in')) {
            errorMessage = 'This content requires login. Try a different post or platform.';
        } else if (error.message.includes('not available')) {
            errorMessage = 'Content not available. The post might have been deleted.';
        } else if (error.message.includes('Unsupported URL')) {
            errorMessage = 'This URL is not supported. Try TikTok, YouTube, or Twitter instead.';
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
