const { Builder, By, Key, until } = require("selenium-webdriver");

describe('Selenium WebDriver Test', () => {
  let driver;
  let mockElement;

  beforeAll(() => {
    driver = {
      get: jest.fn(),
      getTitle: jest.fn().mockResolvedValue("Python"),
      findElement: jest.fn(),
      wait: jest.fn(),
      takeScreenshot: jest.fn(),
    };

    mockElement = {
      clear: jest.fn(),
      sendKeys: jest.fn(),
    };
    By.name = jest.fn().mockReturnValue({ name: "q" });
  });

  it('Should navigate to Python.org and perform search', async () => {
    driver.findElement.mockImplementation((locator) => {
      if (locator.name === "q") {
        return Promise.resolve(mockElement);
      }
      return Promise.resolve(mockElement);
    });

    await driver.get("http://www.python.org");

    let title = await driver.getTitle();
    expect(title).toBe("Python");

    let elem = await driver.findElement(By.name("q"));
    await elem.clear();
    await elem.sendKeys("pycon");
    await elem.sendKeys(Key.RETURN);

    expect(driver.get).toHaveBeenCalledWith("http://www.python.org");
    expect(driver.getTitle).toHaveBeenCalled();
    expect(driver.findElement).toHaveBeenCalledWith(expect.objectContaining({ name: "q" }));
    expect(mockElement.clear).toHaveBeenCalled();
    expect(mockElement.sendKeys).toHaveBeenCalledWith("pycon");
    expect(mockElement.sendKeys).toHaveBeenCalledWith(Key.RETURN);
  });
});
