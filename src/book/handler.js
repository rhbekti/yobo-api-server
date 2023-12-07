const getAllBooks = (req, res) => {
  const dummyBooks = [
    {
      isbn: '195153448',
      title: 'Classical Mythology',
      author: 'Mark P. O. Morford',
      year: '2002',
      publisher: 'Oxford University Press',
      image: {
        s: '',
        m: '',
        l: '',
      },
    },
    {
      isbn: '2005018',
      title: 'Clara Callan',
      author: 'Richard Bruce Wright',
      year: '2001',
      publisher: 'HarperFlamingo Canada',
      image: {
        s: 'https://images.amazon.com/images/P/0002005018.01.THUMBZZZ.jpg',
        m: 'https://images.amazon.com/images/P/0002005018.01.MZZZZZZZ.jpg',
        l: 'https://images.amazon.com/images/P/0002005018.01.LZZZZZZZ.jpg',
      },
    },
  ];

  res.send({
    status: 'true',
    message: 'Books fetch successfully',
    data: dummyBooks,
  });
};

module.exports = {
  getAllBooks,
};
