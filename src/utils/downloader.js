import axios from 'axios';

export const detectPlatform = (url) => {
    if (!url) return null;
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    return 'Unknown';
};

export const validateUrl = (url) => {
    const platform = detectPlatform(url);
    return platform !== 'Unknown' && platform !== null;
};

const API_URL = 'http://localhost:3000/api';

export const mockFetchMediaInfo = async (url) => {
    try {
        const response = await axios.get(`${API_URL}/info`, { params: { url } });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error(error.response?.data?.error || 'Failed to fetch media info');
    }
};

export const mockDownloadMedia = async (media, quality) => {
    try {
        const response = await axios.get(`${API_URL}/download`, {
            params: { url: media.originalUrl, quality },
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                // Progress handling could be passed as a callback if needed
                // For now, MediaPreview handles its own simulated progress or we can update it to use real progress
            }
        });

        // Create a link to download the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${media.title || 'video'}.mp4`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
    } catch (error) {
        console.error("Download Error:", error);
        throw new Error('Download failed');
    }
};

export const parseSizeToMB = (sizeStr) => {
    if (!sizeStr) return 0;
    const units = {
        'B': 1 / (1024 * 1024),
        'KB': 1 / 1024,
        'MB': 1,
        'GB': 1024,
        'TB': 1024 * 1024
    };
    const regex = /(\d+(\.\d+)?)\s*(B|KB|MB|GB|TB)/i;
    const match = sizeStr.match(regex);
    if (match) {
        const value = parseFloat(match[1]);
        const unit = match[3].toUpperCase();
        return value * (units[unit] || 0);
    }
    return parseFloat(sizeStr) || 0;
};

export const formatSize = (mb) => {
    if (mb >= 1024) {
        return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
};
