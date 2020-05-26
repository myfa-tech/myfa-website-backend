
const getJobFile = (req, res, next) => {
  const { filename } = req.params;

  res.download(`src/static/${filename}`);
};

export { getJobFile };
