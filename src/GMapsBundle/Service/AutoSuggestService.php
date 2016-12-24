<?php

namespace GMapsBundle\Service;

use GuzzleHttp\Client;

class AutoSuggestService
{

    /** @var  String */
    private $key;

    /**
     * @param Client $client
     * @param String $key
     */
    public function __construct($key)
    {
        $this->key = $key;
    }

    /**
     * @param string $language
     * @param string $country
     * @param string $input
     *
     * @return array
     */
    public function getCitySuggestions($language, $country, $input)
    {
        $client = new \GuzzleHttp\Client();
        return json_decode($client->get('https://maps.googleapis.com/maps/api/place/autocomplete/json', [
            'query' => ['types' => '(cities)',
                'components' => 'country:' . $country,
                'language' => $language,
                'key' => $this->key,
                'input' => $input]
        ])->getBody())->predictions;
    }
}