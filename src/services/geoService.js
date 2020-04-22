import geoip from 'geoip-lite';

const getGeo = (req, res, next) => {
  const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const data = geoip.lookup(ip);

  res.status(200);
  res.send(data);
};

export { getGeo };
