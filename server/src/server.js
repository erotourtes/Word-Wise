import "./config.js";
import http from "http";
import fs from "fs";
import url from "url";

import { data } from "./data.js";

import { config } from "./config.js";
import routes from "./routes.js";

const getData = async (req) => {
  const buffer = [];
  for await (const chunk of req) {
    buffer.push(chunk);
  }
  const body = Buffer.concat(buffer).toString();
  return body.length ? body : null;
};

const port = config.PORT || 3000;
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const link = req.url;
  const method = req.method;
  const query = url.parse(link, true).query;
  const body = await getData(req);

  console.log(
    `link: ${link} ${JSON.stringify(query)} ${
      body && Object.keys(body) ? "body is not empty" : "body is empty"
    }`
  );

  try {
    const dataRecieved = { ...query, body: JSON.parse(body) };
    const router = routes[method][query.type];
    const words = router(dataRecieved);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(words));
  } catch (err) {
    console.log(err.message, err.messageToUser);
    res.statusCode = 400;
    const avaliableRoutes = Object.keys(routes[method]);
    const example = `Example: http://${config.HOST}:${config.PORT}/?type=${avaliableRoutes[0]}`;
    const msg = `Maybe you meant: ${avaliableRoutes}\nExample: ${example}`;
    res.end(
      `An error occured\n${err.messageToUser}\n${err.messageToUser ? "" : msg}`
    );
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

process.on("exit", () => {
  console.log("exit");
  fs.writeFile(
    `${process.cwd()}/data/backup.json`,
    JSON.stringify(data),
    "utf-8"
  ).catch((err) => console.log(err));
});
