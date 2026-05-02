/**
 * 文件
 */
declare namespace File {

    interface FileInfo {
        fileId: number,
        originalName: string,
        storageName: string,
        filePath: string,
        fileUrl: string,
        fileSize: string,
        contentType: string,
        extension: string,
        storageType: string,
        md5: string,
        uploadTime: string,
        uploadUserId: number
    }

}