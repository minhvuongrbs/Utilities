const fs = require('fs');

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) reject(err);

      try {
        let response = splitDataToArray(data);
        response = JSON.parse(response);
        resolve(response);
      } catch (error) {
        throw error;
      }
    });
  });
};

const writeFile = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err) console.log(err);
  });
};

const isJSONData = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

const decodeBase64 = (base64Data) => {
  const buff = Buffer.from(base64Data, 'base64');
  return buff.toString('ascii');
};

const createLog = (oneLineData) => {
  // const oneLineData = await readFile('1request.json');

  const url = oneLineData.message;
  const res = oneLineData.meta.res;
  const req = oneLineData.meta.req;

  const payloadData = decodeBase64(req.body.message.data);
  const errData = `statusCode: ${res.statusCode}, message: ${res.body.message}`;
  const result = {
    url,
    payloadData,
    errData,
  };
  return result;
};

const executeConverting = async (fileName) => {
  let datas = await readFile(fileName);

  const result = datas.map((data) => createLog(data));
  writeFile('output.json', JSON.stringify(result));
};

const splitDataToArray = (rawData) => {
  const splitData = rawData.split(`{"level"`).join(`,{"level"`);
  const result = `[${splitData.substr(1)}]`;
  return result;
};

executeConverting('15.log');
