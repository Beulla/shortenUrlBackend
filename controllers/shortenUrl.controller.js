const shortid=require("shortid")
const db=require("../models")
const Url=db.shortenedUrls

const shortenUrl=(req,res)=>{
    const  longerUrl  = req.body.url;
    const shorterUrl =shortid.generate();
    try {
       Url.create({ longerUrl, shorterUrl });
      res.json({ shortUrl: `http://localhost:${8080}/${shorterUrl}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to shorten URL' });
    }
}
const redirect=async(req,res)=>{
  try {
    const shorterUrl = req.params.shortUrl;
    console.log(shorterUrl)
    const url = await Url.findOne({ where: { shorterUrl: shorterUrl } });
    console.log(url)
    if (url) {
      res.redirect(url.longerUrl);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const deleteUrl=async(req,res)=>{
  try {
    const shortUrl = req.params.shortUrl;
    const deletedUrlCount = await Url.destroy({ where: { shorterUrl: shortUrl } });
    if (deletedUrlCount > 0) {
      res.status(204).send(); 
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const getAll=async(req,res)=>{
  try {
    const { email } = req.params;
    const urls = await URL.findAll({ where: { email: email } });
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports={shortenUrl,redirect,deleteUrl,getAll}