function generateRandomString(length) {
    if (length <= 0) {
      throw new Error('Length must be greater than 0');
    }
  
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567891234567890';
    const randomIndexes = Array.from({ length }, () => Math.floor(Math.random() * possibleChars.length));
    const randomString = randomIndexes.map(index => possibleChars[index]).join('');
  
    return randomString;
  } // Change 10 to the desired length of your random string
//   console.log(generateRandomString(30))
  module.exports=generateRandomString(10)+Date.now()