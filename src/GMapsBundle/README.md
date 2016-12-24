google maps places snippets bunde
=============

###Whats inside?

- City autocomplete input for defined country.

## Requirements

- jQuery
- jQuery UI
- bundle depends on `GuzzleHttp/guzzle`

## Installation

- in `AppKernel.php`
```
new GMapsBundle\GMapsBundle(),
```
- add routes in `routing.yml`
```
google_autosuggest:
    resource: "@GMapsBundle/Controller/"
    type:     annotation
```
-include scripts
```
<script src="{{ asset('bundles/gmaps/js/script.js') }}"></script>
```
## Usage

- render action in where you want input to be
```
    {{ render(controller('GMapsBundle:Suggest:renderCitySuggest', {
        inputParams: 'name="text" class="city_suggest"',
        language: 'de',
        country: 'de'
    })) }}
```
- stylize how you want. Don't forget to include "Powered by google" logo if oyu dont use google map

## Extending

Feel free to create pull requests to add more google places features

Just preserve idea, that each feature should be realy easy to implement.