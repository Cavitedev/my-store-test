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

  // it("Compartir producto.", async () => {
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();
  //   await page.goto("http://localhost:4200/");

  //   let promise = new Promise(async (resolve, reject) => {
  //     page.on("dialog", async (dialog) => {
  //       let m = dialog.message();
  //       expect(m).toBe("The product has been shared");
  //       await dialog.accept();
  //       await browser.close();
  //       resolve();
  //     });

  //     let share1 = await page.waitForSelector("#share_1");
  //     share1.click();
  //     await promise;
  //   });
  //   return promise;
  // });

  // it("Notificar producto", async () => {
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();
  //   await page.goto("http://localhost:4200/");

  //   let promise = new Promise(async (resolve, reject) => {
  //     page.on("dialog", async (dialog) => {
  //       let m = dialog.message();
  //       expect(m).toBe("You will be alerted when the product goes to sale");
  //       await dialog.accept();
  //       await browser.close();
  //       resolve();
  //     });

  //     let notify = await page.waitForSelector(".notify");
  //     notify.click();
  //     await promise;
  //   });
  //   return promise;
  // });

  it("Hacer compra 2 productos", async () => {
    const time_start = new Date();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:4200/");

    const timePageLoaded = new Date();

    displayTime("Tiempo carga página: ", time_start, timePageLoaded);

    console.log(
      "Time load website: " +
        new Date(timePageLoaded - time_start).toISOString().slice(14, 24)
    );

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

        let purchaseText = await purchase.$eval((e) => e.textContent);

        expect(purchaseText).toBe("");

        const timeEnd = new Date();
        displayTime("Tiempo operación: ", timePageLoaded, timeEnd);

        resolve();
      });

      let product1 = await page.waitForSelector(".product-item");
      product1.click();

      let buyButton = await page.waitForSelector("#buy");
      buyButton.click();

      console.log("COMPRAR");
      await promise;
      console.log("COMPRAR2");

      // const value = await nameField.evaluate((el) => el.textContent);
      // console.log(value);

      // let cartItem = await page.waitForSelector(".cart-item");
      // console.log(cartItem.innerHTML);

      // html = await page.$eval(".cart-item", (element) => {
      //   console.log(element.innerHTML);
      //   return element.innerHTML;
      //   expect(false).toBe(true);
      //   expect(element.innerHTML).toBe(
      //     "Your product has been added to the 🛒!"
      //   );
      // });
    });

    return promise;
  });
});

function displayTime(msg, t1, t2) {
  console.log(msg + new Date(t2 - t1).toISOString().slice(14, 24));
}
