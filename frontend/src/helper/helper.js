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
  

export function getTotalSize(files){
  const totalSize = files.reduce((acc, file) => acc + parseSizeToBytes(file.size), 0);
  return totalSize
}  