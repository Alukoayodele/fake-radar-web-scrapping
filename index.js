import puppeteer from "puppeteer";
import {
  danishList,
  dutchList,
  portugeseList,
  russianList,
  englishList,
  frenchList,
  spanishList,
  italianList,
} from "./utils.js";
const url = process.argv[2];
const pattern =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
if (!pattern.test(url)) {
  console.log("please, enter a valid url");
  process.exit(1);
}

async function start() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://alukoayodele.github.io/fake-radar/");
    await page.type("#data", url);
    await Promise.all([page.waitForNavigation(), page.click("#clickme")]);

    await page.goto(url);
    const lang = await page.evaluate(() => {
      return document.querySelector("html").lang;
    });
    if (!lang) {
      console.log("Language can not be detected");
      process.exit(1);
    }
    const termsList = getTermsAndConditionList(lang.toUpperCase());
    console.log(termsList, ".....>");
    if (!termsList || null) {
      console.log("Language not supported");
      process.exit(1);
    }
    const confirmedLinkText = await findByLink(page, termsList);
    console.log(confirmedLinkText, "--->");

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]"), (a) => ({
        attribute: a.getAttribute("href"),
        text: a.innerHTML,
      }));
    });

    const filteredList = getFilteredAttribute(links, confirmedLinkText);
    console.log(filteredList, "___<<");

    if (!filteredList.length) {
      console.log("No Legal page found");
      process.exit(1);
    }
    let legalPagePath = [];
    filteredList.forEach((list) => {
      !pattern.test(list.attribute) ? legalPagePath.push(url + list.attribute) : legalPagePath.push(list.attribute)
    });
    console.log(legalPagePath.join(","));

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

const getTermsAndConditionList = (language) => {
  switch (language) {
    case "EN":
      return englishList;
    case "IT":
      return italianList;
    case "ES":
      return spanishList;
    case "FR":
      return frenchList;
    case "DE":
      return danishList;
    case "PT":
      return portugeseList;
    case "NL":
      return dutchList;
    case "RU":
      return russianList;
    default:
      return null;
  }
};

function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space
  let nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
}

async function findByLink(page, linkStrings) {
  let linkedText = [];
  for (const linkString of linkStrings) {
    const links = await page.$$("a[href]");
    for (let i = 0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty("innerText");
      let linkText = await valueHandle.jsonValue();
      const text = getText(linkText);
      if (linkString == text.toLowerCase()) {
        linkedText.push(text);
      }
    }
  }
  return linkedText;
}

function getFilteredAttribute(links, linkedText) {
  let legalUrlArray = [];
  for (const text of linkedText) {
    const legal = links.filter((t) =>
      t.text.toLowerCase().includes(text.toLowerCase())
    );
    legalUrlArray.push(...legal);
  }

  return legalUrlArray;
}
start();
