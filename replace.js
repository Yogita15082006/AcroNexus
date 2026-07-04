const fs = require('fs');
const path = require('path');
const srcDir = path.join('C:/A/Development/AcroNexus/frontend/src');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(srcDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("role === 'admin'")) {
    content = content.replace(/role === 'admin'/g, "['faculty', 'hod', 'coordinator'].includes(role)");
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
