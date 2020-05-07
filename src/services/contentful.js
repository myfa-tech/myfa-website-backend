import * as Contentful from 'contentful';
import dotenv from 'dotenv';

dotenv.config();

const CONTENTFUL_SPACE = process.env.CONTENTFUL_SPACE;
const CONTENTFUL_PASSWORD = process.env.CONTENTFUL_PASSWORD;

const contentful = Contentful.createClient({
  space: CONTENTFUL_SPACE,
  accessToken: CONTENTFUL_PASSWORD,
});

const getArticles = async () => {
  const articles = await contentful.getEntries();
  return articles;
};

const getSingleArticle = async (id) => {
  const article = await contentful.getEntry(id);
  return article;
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

const fetchSingleArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await getSingleArticle(id);

    res.status(201).send({ article });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

export { fetchArticles, fetchSingleArticle };
