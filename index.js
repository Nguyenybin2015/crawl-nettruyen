const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const folderPath = './image';

const webpageUrl =
  "https://www.nettruyenco.vn/truyen-tranh/mashle-magic-and-muscles/chuong-1/372895"; 

axios
  .get(webpageUrl)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const imageSrcList = [];

    $("img").each((index, element) => {
      const src = $(element).attr("src");
      imageSrcList.push(src);
    });

    console.log("Image src attributes:");
    var count = 0;
    const imagesToDelete = 2; //Number of images to delete from the beginning and end, Because 2 image first and final is logo :))) 

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    imageSrcList.forEach((element, index) => {
      if (index >= imagesToDelete && index < imageSrcList.length - imagesToDelete) {
        url(element, count++);
      }
    });
  })
  .catch((error) => {
    console.error("Error retrieving webpage:", error);
  });

function url(imageUrl, count) {
  const outputPath = `${folderPath}/image${count}.jpg`;
  console.log(outputPath);

  axios({
    method: "get",
    url: imageUrl,
    responseType: "stream",
    headers: {
      "sec-ch-ua":
        '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
      Referer: "https://www.nettruyenco.vn/",
      DNT: 1,
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.0.0",
      "sec-ch-ua-platform": "Windows",
    },
  })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(outputPath));
    })
    .catch((error) => {
      console.error("Error downloading the image:", error);
    });
}
