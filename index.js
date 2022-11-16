let puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:4200/");
  page.on("dialog", async (dialog) => {
    console.log("here");
    console.log(dialog.message());
    await dialog.accept();
    console.log("accepted");
    await browser.close();
  });
  let share1 = await page.waitForSelector("#share_1");
  share1.click();
})();
