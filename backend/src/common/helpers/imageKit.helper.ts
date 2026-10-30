import imageKit from "../../config/imageKit.config.js";
import { InternalServerError } from "../handlers/error.handlers.js";
import type { IImageKitResponse } from "../interfaces/index.js";

export const uploadImage = async (
    fileBuffer: Buffer,
    fileName: string,
    folder: string
): Promise<IImageKitResponse> => {
    try {
        const response = await imageKit.upload({
            file:     fileBuffer,
            fileName: fileName,
            folder:   folder,
        });
        return {
            url: response.url,
            secretKey: response.fileId,
        };
    } catch (error) {
        console.error(error);
        throw new InternalServerError('Error while uploading file');
    }
};

export const deleteFile = async (fileId: string): Promise<void> => {
    try {
        await imageKit.deleteFile(fileId);
    } catch (error) {
        console.error(error);
        throw new InternalServerError('Error while deleting file');
    }
};
