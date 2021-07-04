const fs = require("fs");
const config = require("../config");
const sharp = require("sharp");
const request = require('request');
const moment = require("moment");
const multer = require('multer');
const path = require('path');
const archiver = require('archiver');
const getSize = require('get-folder-size');

function getFolderSize(path) {
    return new Promise((resolve, reject) => {
        getSize(path, (err, size) => {
            if (err) { return reject(err); }
            return resolve(size / 1024 / 1024 / 1024);
        });
    });
}

async function mkdirs(path) {
    let dirs = path.split("/");
    let currentPath = dirs[0];
    for (let i = 1; i < dirs.length; i++) {
        if (!fs.existsSync(currentPath) && currentPath.trim()) {
            fs.mkdirSync(currentPath);
        }
        currentPath += "/" + dirs[i];
    }
    if (!fs.existsSync(currentPath) && currentPath.trim()) {
        fs.mkdirSync(currentPath);
    }
}

async function downloadImage(url, path) {
    const promise = new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(path);
                    }
                })
        })
    })
        .catch(err => {
            throw err
        });
    return promise;
}


async function saveImage(image, makeThumbnail = true, prefix = "") {
    const date = new Date();
    let dir = `${config.storeConfig.IMAGE_FOLDER}/${moment(date).format('YYYY/MM/DDDD')}`;
    let dirThumbnail = `${config.storeConfig.IMAGE_FOLDER}/${moment(date).format('YYYY/MM/DDDD')}`;
    if (prefix.includes('users/')) {
        dir = `${config.storeConfig.IMAGE_FOLDER}/${prefix}`;
    } else if (prefix.startsWith('members/')) {
        dir = `${config.storeConfig.IMAGE_FOLDER}/${prefix}`;
        dirThumbnail = `${config.storeConfig.IMAGE_FOLDER}/${prefix.replace('members/', 'memberThumbnails/')}`;
        await mkdirs(dirThumbnail);
    }
    if (prefix.startsWith('logs/')) {
        dir = `${config.storeConfig.IMAGE_FOLDER}/${prefix}/${moment(date).format('YYYY/MM/DDDD')}`;
    }
    await mkdirs(dir);
    let fileName = `image-${date.getTime()}-${Math.floor(Math.random() * date.getTime())}`;
    return new Promise((resolve, reject) => {
        const imageTypeIndex = image.indexOf(";base64,");
        let imageExt = '.png';
        let base64Data = image;
        if (imageTypeIndex > 0) {
            const imageType = image.substring(0, imageTypeIndex);
            if (imageType.includes('jpeg')) {
                imageExt = '.jpg';
            }
            base64Data = image.substring(imageTypeIndex + 8);
        }

        // let base64Data = image.replace(/^data:image\/\.+;base64,/, "");
        // console.log(base64Data)
        const path = `${dir}/${fileName}${imageExt}`;
        fs.writeFile(path, base64Data, 'base64', async function (err) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            if (!makeThumbnail) {
                return resolve({path});
            }
            try {
                const thumbnailPath = `${dirThumbnail}/${fileName}-thumbnai${imageExt}`;
                await resizeImage(path, thumbnailPath);
                return resolve({path, thumbnailPath});
            } catch (error) {

            }
            return resolve({path});
        });
    })
}

const resizeImageIdentify = async (url) => {
    let folder_name = url.replace(/^.*\/\/[^\/]+/, '').split("/");
    let filename = folder_name[folder_name.length - 1];
    delete folder_name[folder_name.length - 1]
    let filePath = 'public/api' + folder_name.join("/");
    await resizeImage(filePath, filename)
    let urlSplit = url.split("/");
    urlSplit[urlSplit.length - 1] = 'thumbnail-' + urlSplit[urlSplit.length - 1]
    return urlSplit.join("/");
}

async function resizeImage(filePath, thumbnailPath) {
    sharp(filePath)
        .resize(142, null)
        .toBuffer()
        .then((data) => {
            fs.writeFileSync(thumbnailPath, data);
        })
        .catch((error) => {
            console.log("statusRoute |  Error In Uploading Status Image" + error);
            throw error;
        });
};

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.storeConfig.UPLOAD_FOLDER)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

// function to encode file data to base64 encoded string
async function base64Encode(file) {
    // read binary data
    const bitmap = await fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

async function copyFileSync(source, target) {

    let targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

async function copyFolderRecursiveSync(source, target, {rename = undefined} = {}) {
    let files = [];

    // Check if folder needs to be created or integrated
    const targetFolder = path.join(target, rename || path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

async function archiverZipFolder(sour, dest, {nameRootFolder = 'examples'}={}) {
    const output = fs.createWriteStream(dest);
    const archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
        throw err;
    });
    archive.pipe(output);
    archive.directory(sour, nameRootFolder);
    await archive.finalize();
    return true;
}

module.exports = {
    saveImage,
    downloadImage,
    mkdirs,
    resizeImageIdentify,
    storage,
    base64Encode,
    copyFileSync,
    copyFolderRecursiveSync,
    archiverZipFolder,
    getFolderSize,
};
