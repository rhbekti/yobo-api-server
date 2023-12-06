const getAllCategories = (req, res) => {
  const dummyCategories = [
    {
      photoUrl: 'https://uploads-ssl.webflow.com/5dca23595f1e4663d62cab0b/6315afd1267b7d7261cdcea4_visa.png',
      title: 'Visa',
    },
    {
      photoUrl: 'https://uploads-ssl.webflow.com/5dca23595f1e4663d62cab0b/6315afd13ef4cf7e837c5f75_jago.png',
      title: 'Jago',
    },
    {
      photoUrl: 'https://uploads-ssl.webflow.com/5dca23595f1e4663d62cab0b/6315afd170d137cfe7731044_bca.png',
      title: 'BCA',
    },
    {
      photoUrl: 'https://uploads-ssl.webflow.com/5dca23595f1e4663d62cab0b/6315afd1caf1231954a83147_apple.png',
      title: 'Apple Pay',
    },
    {
      photoUrl: 'https://uploads-ssl.webflow.com/5dca23595f1e4663d62cab0b/6315afd10bda28621c3e11e3_paypal.png',
      title: 'Paypal',
    },
  ];

  res.status(200);
  res.send({
    status: 'true',
    message: 'Categories fetch successfully',
    data: dummyCategories,
  });
};

module.exports = {
  getAllCategories,
};
