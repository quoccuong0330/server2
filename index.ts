import app from "./src/app";

const PORT: number = 8002;

//test
const main = () => {
  app.listen(PORT, async () => {
    console.log("HTTP Server is running on ", PORT);
  
  });
};

main();
