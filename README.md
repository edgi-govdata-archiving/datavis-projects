# DataVis Projects
Ongoing work to create visually informative data models surrounding EDGI and it's affiliates.

## Coverage Map
An interactive Sequence Sunburst to display completion rate of coverage data.

### Usage
#### Standalone
The standalone model can be used as is and is loaded with [`sample coverage data`](/Coverage/Standalone/sample.json). It can be directly placed into a webserver and viewed through the browser

#### React
Will finish this write up later.

## DataRescue
Map of DataRescue events held from December 2016 to Spring 2017, viewable at [envirodatagov.org/datarescue/](https://envirodatagov.org/datarescue/)

### Usage

#### Standalone
The standalone model can be used as is and is loaded with data directly from EDGI. It can be directly placed into a webserver and viewed through the browser

#### Wordpress
In order to integrate the visualization into Wordpress, work with the files under [`DataRescue/Wordpress`](/DataRescue/Wordpress) and add them to the following locations:

- `wp-content/themes/<theme-name>/page-templates`
    - [`page_datarescue.php`](/DataRescue/Wordpress/page_datarescue.php)
- `wp-includes/js`
    - [`datarescue.js`](/DataRescue/Wordpress/datarescue.js)
    - [`slick.min.js`](/DataRescue/Wordpress/slick.min.js)
    - [`d3.v4.min.custom.js`](/DataRescue/Wordpress/d3.v4.min.custom.js)
- `wp-includes/assets`
    - [`us-states.json`](/DataRescue/Wordpress/us-states.json)
