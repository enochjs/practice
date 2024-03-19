
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import fs from 'fs/promises';
import cookies from './cookie.json';
import path from 'path';

export class AnimateReactNative {

  private rootDir = 'src/animateReactNative.com';
  private assetsDir = 'src/animateReactNative.com/assets';
  private baseUrl = 'https://www.animatereactnative.com';
  private linkListUrl = 'https://www.animatereactnative.com/animations';

  private initBrowser = async () => {
    // const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' });
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized', '--disable-features=site-per-process'],
    });
    return browser;
  }

  private initPage = async (browser: Browser) => {
    const context = await browser.createBrowserContext();
    context.clearPermissionOverrides();
    await context.overridePermissions(this.baseUrl, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
    const page = await context.newPage();
    await page?.setCookie(...cookies as any);

    return page;
  }

  // 获取所有页面的链接
  private getAllLinks = async (page: Page) => {
    await page?.goto(this.linkListUrl);
    const selector = '#__next a.no-underline';
    await page?.waitForSelector(selector, {
      timeout: 10000,
    })
    const links: string[] = []
    // get All links
    await page?.$$(selector).then(async (elements) => {
      for (let i = 0; i < elements.length; i++) {
        await elements[i].evaluate((el) => {
          return el.href;
        }).then((link) => {
          links.push(link as string);
        });
      }
    });
    return links;
  }

  // 获取所有的tab
  private getAllTabs = async (page: Page, link: string) => {
    await page?.goto(link);
    const selector = 'a.tab';

    await page?.waitForSelector(selector, {
      timeout: 10000,
    });
    return page?.$$(selector)
  }

  // 获取页面tab的内容
  private getTabContent = async (page: Page, tab: ElementHandle<HTMLAnchorElement>) => {
    await tab?.click();
    const selector = '[data-tip=copy] button'
    
    const result = await page.$(selector).then(async (element) => {
      await element?.click();
      const content = await page.evaluate(() => navigator.clipboard.readText())
      return content;
    });
    return result;
  }

  // 获取tab的text, 作为filename用
  private getTabName = async (link: string, tab: ElementHandle<HTMLAnchorElement>) => {
    const filename = await tab.evaluate((el) => {
      return el.textContent;
    })
    const dirName = link.split('/').pop();
    if (dirName) {
      await fs.mkdir(path.join(this.assetsDir, dirName), {
        recursive: true,
      }).catch((e) => console.log('====error', e));
    }
    return `${dirName}/${filename}`;
  }

  private writeFile = async (filename: string, content: string) => {
    const exist = await fs.access(filename)
      .then(() => true)
      .catch(() => false);

    if (!exist) {
      try {
        await fs.writeFile(filename, content);
      } catch (error) {
        await fs.appendFile('/error.log', `${filename} ${error} \n`);
      }
    }
  }

  private checkIsFinished = async (link: string) => {
    const finished = await fs.readFile(path.join(this.rootDir, 'success.json'), 'utf-8');
    const success = JSON.parse(finished);
    if ((success as any)[link]) {
      return true;
    }
    return false;
  }

  private setFinished = async (link: string) => {
    const finished = await fs.readFile(path.join(this.rootDir, 'success.json'), 'utf-8');
    const success = JSON.parse(finished);
    (success as any)[link] = true;
    await fs.writeFile(path.join(this.rootDir, 'success.json'), JSON.stringify(success, null, 2));
  }

  private getPageContent = async (page: Page, link: string) => {
    if (await this.checkIsFinished(link)) {
      return;
    }
    console.log('====link', link);
    await page?.goto(link, {
      timeout: 90000,
    });
    const tabs = await this.getAllTabs(page, link);
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const content = await this.getTabContent(page, tab);
      const tabName = await this.getTabName(link, tab);
      await this.writeFile(path.join(this.assetsDir, tabName), content);
    }
    await this.setFinished(link);
    const random = Math.random();
    await this.delay(10000 * (random < 0.5 ? random + 0.6 : random));
  };

  private delay = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }


  public start = async () => {
    const browser = await this.initBrowser();
    const page = await this.initPage(browser);
    const links = await this.getAllLinks(page);
    while (links.length > 0) {
      const link = links.pop();
      if (!link) {
        continue;
      }
      await this.getPageContent(page, link);
      
    }
  }
}
