import {program} from 'commander'
import puppeteer from "puppeteer";

// Url of the website to scrap
const baseUrl = 'https://www.whentocop.fr/drops'

program
    .name("WhenToCop scrapper")
    .version("1.0.0")
    .option("-n, --number <number>", "number of items to scrap", "10")
    .option("-s --scroll", "scroll to the bottom of the page")
    .action(async (options) => {

        console.log("Options: ", options)
        console.log("Starting scrapping...")

        // get items
        const items = await getItems(options.number)

        // push items to db
        await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        })

        console.log("Scraping done.")
    })

/**
 * Get items from the website
 * @param maxItems
 */
async function getItems(maxItems: number) {
    // Inits
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(baseUrl);

    // Main container selector
    const containerSelector = 'div.infinite-scroll-component';

    // Wait for the container to load
    await page.waitForSelector(containerSelector);

    // Get the data
    const sneakersData = await page.evaluate((maxItems) => {
        // Get the parent div
        const parentDiv = document.querySelector('.infinite-scroll-component');
        const sneakers = [];

        // Check if the parent div exists
        if (parentDiv) {
            const childDivs = Array.from(parentDiv.children);

            // Loop through all the child divs
            for (let div of childDivs) {

                // Break if we reached the maxItems
                if (sneakers.length >= maxItems) break;

                const links = div.querySelectorAll('a');

                // Loop through all the links
                for (let link of links) {

                    // Break if we reached the maxItems
                    if (sneakers.length >= maxItems) break;

                    // Get the elements
                    const brandElement = link.querySelector('h3.sc-bbdecccd-5');
                    const nameElement = link.querySelector('h4.sc-bbdecccd-4');
                    const indiceElement = link.querySelector('p.sc-bbdecccd-7');

                    // Check if the elements exist and push the data
                    if (nameElement && brandElement && indiceElement) {
                        sneakers.push({
                            brand: brandElement.textContent.trim(),
                            name: nameElement.textContent.trim(),
                            indice: indiceElement.textContent.trim()
                        });
                    }
                }
            }
        }
        // Return the sneakers
        return sneakers;
    }, maxItems); // Pass the maxItems to the evaluate function

    // Close the browser and return the data
    await browser.close();
    return sneakersData;
}

// Start the program
program.parse();