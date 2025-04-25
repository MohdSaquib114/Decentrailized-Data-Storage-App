const parseSizeToBytes = (sizeStr) => {
  const [num, unit] = sizeStr.split(" ");
  const units = {
    Bytes: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };
  return parseFloat(num) * (units[unit] || 1);
};

export function getTotalSize(files) {
  const totalSizeInBytes = files.reduce((acc, file) => acc + parseSizeToBytes(file.size), 0);

 
  const sizeInMB = totalSizeInBytes / (1024 ** 2); 
  if (sizeInMB > 1024) {
    
    const sizeInGB = sizeInMB / 1024;
    return `${sizeInGB.toFixed(2)} GB`;
  } else {
    
    return `${sizeInMB.toFixed(2)} MB`;
  }
}

export function countSharedFiles(files) {
  return files.filter(file => file.accessList && file.accessList.length > 0).length;
}
