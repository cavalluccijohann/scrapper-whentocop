import {program} from 'commander'
import puppeteer from "puppeteer";

const baseUrl = 'https://www.whentocop.fr/drops'

const sectionSelector = 'div.infinite-scroll-component';
const nameSelector = 'div > a > div.sc-bbdecccd-0 > div.sc-bbdecccd-1 > div.sc-bbdecccd-2 > h3.sc-bbdecccd-5';
const brandSelector = 'div > a > div.sc-bbdecccd-0 > div.sc-bbdecccd-1 > div.sc-bbdecccd-2 > h4.sc-bbdecccd-4';
const indiceSelector = 'div > a > div.sc-bbdecccd-0 > div.sc-bbdecccd-1 > div.sc-bbdecccd-2 > div.sc-bbdecccd-6 > p.sc-bbdecccd-7';


program
    .name("WhenToCop scrapper")
    .version("1.0.0")
    .option("-v, --verbose", "enable verbose mode")
    .option("-n, --number <number>", "number of items to scrap", "5")
    .action(async (options) => {
        console.log("Starting scrapping...")

        const items = await getItems(options.number)

        // check if verbose mode is enabled

        // push items to db
        const response = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        })

        console.log("Scraping done.")
    })

async function getItems(number: number) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(baseUrl)

    // Sélecteur pour cibler la div principale contenant toutes les sneakers
    const containerSelector = 'div.infinite-scroll-component';

    // Attendre que la div principale soit chargée
    await page.waitForSelector(containerSelector);

    // Évaluer le contenu de la page
    const sneakersData = await page.evaluate(() => {
        // Sélectionner le parent avec la classe "test"
        const parentDiv = document.querySelector('.infinite-scroll-component');
        const sneakers = [];

        // Si le parent existe, récupérer tous les enfants <div>
        if (parentDiv) {
            const childDivs = Array.from(parentDiv.children);

            childDivs.forEach(div => {
                // Récupérer tous les éléments <a> dans chaque <div>
                const links = div.querySelectorAll('a');

                links.forEach(link => {
                    const brandElement = link.querySelector('h3.sc-bbdecccd-5');
                    const nameElement = link.querySelector('h4.sc-bbdecccd-4');
                    const indiceElement = link.querySelector('p.sc-bbdecccd-7');

                    if (nameElement && brandElement && indiceElement) {
                        sneakers.push({
                            brand: brandElement.textContent.trim(),
                            name: nameElement.textContent.trim(),
                            indice: indiceElement.textContent.trim()
                        });
                    }
                });
            });
        }
        return sneakers;
    });

    await browser.close()
    return sneakersData;
}

program.parse();