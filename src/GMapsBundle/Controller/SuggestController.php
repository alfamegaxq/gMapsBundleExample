<?php

namespace GMapsBundle\Controller;

use GMapsBundle\Service\AutoSuggestService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class SuggestController extends Controller
{
    public function renderCitySuggestAction($inputParams, $language, $country)
    {
        return $this->render('GMapsBundle:Suggest:suggestInput.html.twig', [
            'inputParams' => $inputParams,
            'language' => $language,
            'country' => $country
        ]);
    }

    /**
     * @Route("/suggest/city", name="suggest_city")
     * @Method({"POST"})
     */
    public function suggestAction(Request $request)
    {

        /** @var AutoSuggestService $client */
        $client = $this->get('city_suggest');
        return new JsonResponse($client->getCitySuggestions(
                $request->request->get('language'),
                $request->request->get('country'),
                $request->request->get('keyword')
            )
        );
    }
}
