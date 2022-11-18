let puppeteer = require("puppeteer");
let reporters = require("jasmine-reporters");

describe("Puppeteer+Jasmine+Jasmine Reporter sample", function () {
  beforeAll(function () {
    var tapReporter = new reporters.JUnitXmlReporter({
      savePath: __dirname,
      consolidateAll: false,
    });
    jasmine.getEnv().addReporter(tapReporter);
    console.log("Tap reporter configured");
  });

  beforeEach(function () {
    // Alguna vez tarda 9 segundos en vez de 3. Seguramente por algun tema dentro del sistema operativo
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  it("Notificar producto", async () => {
    console.log("\nNotificar producto");

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:4200/");

    const timePageLoaded = new Date();

    let promise = new Promise(async (resolve, reject) => {
      page.on("dialog", async (dialog) => {
        let m = dialog.message();
        expect(m).toBe("You will be alerted when the product goes to sale");
        await dialog.accept();
        await browser.close();
        resolve();
      });

      let notify = await page.waitForSelector(".notify");
      notify.click();
      await promise;

      const timeEnd = new Date();
      displayTime("Tiempo operación: ", timePageLoaded, timeEnd);
    });
    return promise;
  });

  it("Compartir producto", async () => {
    console.log("\nCompartir producto");

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:4200/");

    const timePageLoaded = new Date();

    let promise = new Promise(async (resolve, reject) => {
      page.on("dialog", async (dialog) => {
        let m = dialog.message();
        expect(m).toBe("The product has been shared");
        await dialog.accept();
        await browser.close();
        resolve();
      });

      let share1 = await page.waitForSelector("#share_1");
      share1.click();
      await promise;

      const timeEnd = new Date();
      displayTime("Tiempo operación: ", timePageLoaded, timeEnd);
    });
    return promise;
  });

  it("Hacer compra de 2 productos", async () => {
    console.log("\n Hacer compra de 2 productos");

    const timeStart = new Date();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:4200/");

    const timePageLoaded = new Date();

    displayTime("Tiempo carga página web: ", timeStart, timePageLoaded);

    let promise = new Promise(async (resolve, reject) => {
      page.on("dialog", async (dialog) => {
        let m = dialog.message();
        expect(m).toBe("Your product has been added to the 🛒!");
        await dialog.dismiss();

        let checkout = await page.waitForSelector("#checkout");
        checkout.click();

        let cartItem = await page.waitForSelector(".cart-item");
        let nameProduct = await cartItem.$eval(
          "span:nth-of-type(1)",
          (e) => e.textContent
        );
        expect(nameProduct).toBe("Phone XL");

        let priceProduct = await cartItem.$eval(
          "span:nth-of-type(2)",
          (e) => e.textContent
        );
        expect(priceProduct).toBe("$799.00");

        let nameField = await page.waitForSelector("#name");
        nameField.type("Juan");

        let addressField = await page.waitForSelector("#address");
        addressField.type("calle X");

        let purchase = await page.waitForSelector("#purchase");
        purchase.click();

        resolve();
      });

      let product1 = await page.waitForSelector(".product-item");
      product1.click();

      let buyButton = await page.waitForSelector("#buy");
      buyButton.click();

      await promise;
      const timeEnd = new Date();
      displayTime("Tiempo operación: ", timePageLoaded, timeEnd);
    });

    return promise;
  });

  it("Ver precios de envío", async () => {
    console.log("\nVer precios de envío");

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:4200/");

    const timePageLoaded = new Date();

    let checkout = await page.waitForSelector("#checkout");
    await checkout.click();

    let shipping = await page.waitForSelector("#shipping");
    await shipping.click();

    let shippingItem = await page.waitForSelector(".shipping-item");

    let nameItem = await shippingItem.$eval(
      "span:nth-of-type(1)",
      (e) => e.textContent
    );
    expect(nameItem).toBe("Overnight");

    let priceItem = await shippingItem.$eval(
      "span:nth-of-type(2)",
      (e) => e.textContent
    );
    expect(priceItem).toBe("$25.99");

    const timeEnd = new Date();
    displayTime("Tiempo operación: ", timePageLoaded, timeEnd);
  });
});

function displayTime(msg, t1, t2) {
  console.log(msg + new Date(t2 - t1).toISOString().slice(14, 24));
}
