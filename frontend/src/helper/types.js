export function getMimeType(filename = "file") {
    const extension = filename.split('.').pop().toLowerCase();

    const mimeTypes = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      json: 'application/json',
      mp4: 'video/mp4',
      mp3: 'audio/mpeg',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      zip: 'application/zip',
      rar: 'application/vnd.rar',
    };
  
    return mimeTypes[extension] || 'application/octet-stream';
  }