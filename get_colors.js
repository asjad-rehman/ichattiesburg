const getColors = require('get-image-colors');
getColors('./public/uploads/logo.png').then(colors => {
  console.log('Colors extracted:');
  colors.forEach(color => console.log(color.hex()));
});
