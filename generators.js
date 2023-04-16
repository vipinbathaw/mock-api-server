let generators = {
  randomString: {
    name: 'randomString',
    params: [{ name: 'length', desc: 'Length of the string to return' }],
    func: (length = 10) => {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },
  },
};

module.exports = generators;
