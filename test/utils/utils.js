module.exports = {

  gerarSenha(t = 64) {
    let pass = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (i = 1; i <= t; i++) {
      var char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char)
    }

    return pass;
  },

}