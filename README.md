# visualization-experiments
Ongoing work on visualizations of coverage &amp; other relevant data.

## web1

Sunburst of EPA download coverage

## DataRescue

Map of DataRescue events held from December 2016 to Spring 2017, viewable at [envirodatagov.org/datarescue/](https://envirodatagov.org/datarescue/)

### Deploy

In order to integrate the visualization into Wordpress, work with the files under [`DataRescue/Wordpress`](/DataRescue/Wordpress) and add them to the following locations:

- `wp-content/themes/<theme-name>/page-templates`
    - [`page_datarescue.php`](/DataRescue/Wordpress/page_datarescue.php)
- `wp-includes/js`
    - [`datarescue.js`](/DataRescue/Wordpress/datarescue.js)
    - [`slick.min.js`](/DataRescue/Wordpress/slick.min.js)
    - [`d3.v4.min.custom.js`](/DataRescue/Wordpress/d3.v4.min.custom.js)
- `wp-includes/assets`
    - [`us-states.json`](/DataRescue/Wordpress/us-states.json)
