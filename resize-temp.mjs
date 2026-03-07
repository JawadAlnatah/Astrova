import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const astrovaDir = path.join(__dirname, 'public', 'cosmos');

const filesToResize = [
    'CG 4 Extra large.jpg',
    'NGC 6357.jpg',
    'pillars of creation._Extra Large.png',
    'sky photo of the night sky EXTRA LARGE-resized.jpg',
    'noirlab2515a-resized.jpg'
];

async function processImages() {
    for (const file of filesToResize) {
        const inputPath = path.join(astrovaDir, file);
        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping ${file}, not found.`);
            continue;
        }
        console.log(`Processing ${file}...`);

        const ext = path.extname(file).toLowerCase();
        const outputPath = path.join(astrovaDir, `temp-${file}`);

        try {
            if (ext === '.png') {
                await sharp(inputPath, { limitInputPixels: false })
                    .resize(4096, null, {
                        kernel: sharp.kernel.lanczos3,
                        withoutEnlargement: true
                    })
                    .png({ quality: 85, compressionLevel: 9 })
                    .toFile(outputPath);
            } else {
                await sharp(inputPath, { limitInputPixels: false })
                    .resize(4096, null, {
                        kernel: sharp.kernel.lanczos3,
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 80 })
                    .toFile(outputPath);
            }

            console.log(`Done resizing ${file}`);
            fs.unlinkSync(inputPath);
            fs.renameSync(outputPath, inputPath);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

processImages();
