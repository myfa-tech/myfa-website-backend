import * as Contentful from 'contentful';

const contentful = Contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "p2hszwuxldl9",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "WZjoYOAJg-UsVcqv9Lt-HJnyRXEWDr3DtgZ5qxYjWEE"
});

const getArticles = async () => {
  const articles = await contentful.getEntries();

  return articles;
};

const fetchArticles = async (req, res, next) => {
  try {
    const articles = await getArticles();

    res.status(201).send({ articles });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

export { fetchArticles };
