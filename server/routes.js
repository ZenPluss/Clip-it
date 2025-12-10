import express from 'express';
import ytDlp from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';

const router = express.Router();


// Helper to format bytes
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return 'Unknown';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Get Media Info
router.get('/info', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
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

        res.json(info);
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

        res.status(500).json({
            error: errorMessage,
            details: error.message
        });
    }
});

// Download Media
router.get('/download', async (req, res) => {
    const { url, quality } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
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

        res.header('Content-Disposition', `attachment; filename="${filename}"`);

        // Use a temporary file approach for reliability
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Generate a safe unique filename for the temp file
        const tempFilename = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${info.ext || 'mp4'}`;
        const tempFilePath = path.join(tempDir, tempFilename);

        console.log('Downloading to temp file:', tempFilePath);

        const commonFlags = {
            output: tempFilePath, // Write to file instead of stdout
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

            // Send the file
            res.download(tempFilePath, filename, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                }

                // Clean up temp file after sending (or if error occurs during send)
                try {
                    fs.unlinkSync(tempFilePath);
                    console.log('Temp file deleted');
                } catch (unlinkErr) {
                    console.error('Error deleting temp file:', unlinkErr);
                }
            });
        } else {
            throw new Error('File was not created');
        }

    } catch (error) {
        console.error('Download error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed', details: error.message });
        }
    }
});

export default router;
