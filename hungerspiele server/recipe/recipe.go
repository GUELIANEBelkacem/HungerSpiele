package recipe

type Recipe struct {
	Results []struct {
		Vegetarian          bool    `json:"vegetarian"`
		Priceperserving     float64 `json:"pricePerServing"`
		PriceEuro           float64 `json:"priceeuro"`
		Extendedingredients []struct {
			ID              int           `json:"id"`
			Aisle           string        `json:"aisle"`
			Image           string        `json:"image"`
			Consistency     string        `json:"consistency"`
			Name            string        `json:"name"`
			Nameclean       string        `json:"nameClean"`
			Original        string        `json:"original"`
			Originalstring  string        `json:"originalString"`
			Originalname    string        `json:"originalName"`
			Amount          float64       `json:"amount"`
			Unit            string        `json:"unit"`
			Meta            []interface{} `json:"meta"`
			Metainformation []interface{} `json:"metaInformation"`
			Measures        struct {
				Us struct {
					Amount    float64 `json:"amount"`
					Unitshort string  `json:"unitShort"`
					Unitlong  string  `json:"unitLong"`
				} `json:"us"`
				Metric struct {
					Amount    float64 `json:"amount"`
					Unitshort string  `json:"unitShort"`
					Unitlong  string  `json:"unitLong"`
				} `json:"metric"`
			} `json:"measures"`
		} `json:"extendedIngredients"`
		ID                    int           `json:"id"`
		Title                 string        `json:"title"`
		Readyinminutes        int           `json:"readyInMinutes"`
		Servings              int           `json:"servings"`
		Sourceurl             string        `json:"sourceUrl"`
		Image                 string        `json:"image"`
		Imagetype             string        `json:"imageType"`
		Summary               string        `json:"summary"`
		Cuisines              []interface{} `json:"cuisines"`
		Dishtypes             []string      `json:"dishTypes"`
		Diets                 []string      `json:"diets"`
		Occasions             []interface{} `json:"occasions"`
		Spoonacularsourceurl  string        `json:"spoonacularSourceUrl"`
		Usedingredientcount   int           `json:"usedIngredientCount"`
		Missedingredientcount int           `json:"missedIngredientCount"`
	} `json:"results"`
	Offset       int `json:"offset"`
	Number       int `json:"number"`
	Totalresults int `json:"totalResults"`
}
