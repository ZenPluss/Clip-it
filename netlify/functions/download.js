import ytDlp from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';

export const handler = async (event) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const url = event.queryStringParameters?.url;
    const quality = event.queryStringParameters?.quality;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL is required' })
        };
    }

    console.log('Starting download for URL:', url);

    try {
        // First, get media info to determine type
        const info = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            addHeader: ['User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
        });

        const isImage = info.ext && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(info.ext.toLowerCase());
        const rawFilename = `${info.title || 'download'}.${info.ext || 'mp4'}`;
        // Sanitize filename to remove non-ASCII characters to prevent header errors
        const filename = rawFilename.replace(/[^\x20-\x7E]/g, '_');

        console.log('Downloading:', filename);

        // Use /tmp directory (Lambda's temporary storage)
        const tempDir = '/tmp';

        // Generate a safe unique filename for the temp file
        const tempFilename = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${info.ext || 'mp4'}`;
        const tempFilePath = path.join(tempDir, tempFilename);

        console.log('Downloading to temp file:', tempFilePath);

        const commonFlags = {
            output: tempFilePath,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            addHeader: ['User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
        };

        if (isImage) {
            await ytDlp(url, {
                ...commonFlags,
                format: 'best',
            });
        } else {
            // Priority:
            // 1. Standard HTTP MP4 (Format 18/22) - Safest, plays everywhere
            // 2. Best MP4 (might be HLS) - Good fallback
            // 3. Best available - Last resort
            await ytDlp(url, {
                ...commonFlags,
                format: 'best[ext=mp4][protocol^=http]/best[ext=mp4]/best',
            });
        }

        // Check if file exists and has size
        if (fs.existsSync(tempFilePath)) {
            const stats = fs.statSync(tempFilePath);
            console.log('Download complete. File size:', stats.size);

            if (stats.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            // Read file as binary
            const fileBuffer = fs.readFileSync(tempFilePath);
            const base64File = fileBuffer.toString('base64');

            // Clean up temp file
            try {
                fs.unlinkSync(tempFilePath);
                console.log('Temp file deleted');
            } catch (unlinkErr) {
                console.error('Error deleting temp file:', unlinkErr);
            }

            // Determine content type
            let contentType = 'application/octet-stream';
            if (isImage) {
                const ext = info.ext.toLowerCase();
                contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
            } else {
                contentType = 'video/mp4';
            }

            // Return file as base64 encoded binary
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Cache-Control': 'no-cache'
                },
                body: base64File,
                isBase64Encoded: true
            };
        } else {
            throw new Error('File was not created');
        }

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
                error: 'Download failed',
                details: error.message
            })
        };
    }
};
