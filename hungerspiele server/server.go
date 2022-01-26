package main

import (
	"encoding/json"
	"fmt"
	"hungerspiele/recipe"
	user "hungerspiele/users"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var foodAPIKey = "7db35cbf591a49889e87236c76cfb85e"
var currencyAPIKey = "7cee22847574e752d3eb"
var search = "banana"
var dollarToEuro = 1.0
var us = []user.User{}
var users = user.Users{UserList: us}

type ExchangeRate struct {
	USDEUR float64 `json:"USD_EUR"`
}

type LoginResponse struct {
	Answer    bool `json:"answer"`
	FirstTime bool `json:"firsttime"`
}

type UserDataResponse struct {
	UserName string         `json:"username"`
	Category string         `json:"category"`
	Answer   []user.Product `json:"answer"`
}

type AddProd struct {
	User     string    `json:"user"`
	Catigory string    `json:"catigory"`
	Name     string    `json:"name"`
	Number   int       `json:"number"`
	MyDate   time.Time `json:"date"`
}

func updateExhangeRate() {
	for {
		rqt := fmt.Sprintf("https://free.currconv.com/api/v7/convert?q=USD_EUR&compact=ultra&apiKey=%s", currencyAPIKey)
		res, _ := http.Get(rqt)
		body, _ := ioutil.ReadAll(res.Body)
		var exch ExchangeRate
		json.Unmarshal(body, &exch)
		dollarToEuro = exch.USDEUR
		fmt.Println("the current exchange rate: ")
		fmt.Println(dollarToEuro)
		time.Sleep(3600 * time.Second)
	}
}

func getUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	usnm := mux.Vars(r)["uname"]
	uspw := mux.Vars(r)["upassword"]


	found := false
	for index, _ := range users.UserList {
		if users.UserList[index].UserName == usnm {
			found = true
			if users.UserList[index].Password == uspw {
				var ans = LoginResponse{Answer: true, FirstTime: false}
				json.NewEncoder(w).Encode(ans)
			} else {
				var ans = LoginResponse{Answer: false, FirstTime: false}
				json.NewEncoder(w).Encode(ans)
			}
			break
		}
	}

	if !found {

		var newCat = []user.Category{}
		newUsr := user.User{UserName: usnm, Password: uspw, Inventory: newCat}
		users.UserList = append(users.UserList, newUsr)
		var ans = LoginResponse{Answer: true, FirstTime: true}
		json.NewEncoder(w).Encode(ans)
	}
	saveData()
}

func getUserData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	usnm := mux.Vars(r)["uname"]
	rsch := mux.Vars(r)["rsearch"]

	found := false
	for index, _ := range users.UserList {
		if users.UserList[index].UserName == usnm {
			for index2, _ := range users.UserList[index].Inventory {
				if users.UserList[index].Inventory[index2].Name == rsch {
					found = true
					var subans = UserDataResponse{UserName: usnm, Category: rsch, Answer: users.UserList[index].Inventory[index2].Products}
					ans := []UserDataResponse{}
					ans = append(ans, subans)
					json.NewEncoder(w).Encode(ans)
					break
				}
			}
		}
	}

	if !found {

		newInv := []user.Product{}
		ans := []UserDataResponse{}
		var subans = UserDataResponse{UserName: usnm, Category: rsch, Answer: newInv}
		ans = append(ans, subans)
		json.NewEncoder(w).Encode(ans)
	}
	saveData()
}
func getRecipes(w http.ResponseWriter, r *http.Request) {
	//init header and supress cors error
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	//get the rcipe name
	search = mux.Vars(r)["rname"]

	//formating the request
	rqt := fmt.Sprintf("https://api.spoonacular.com/recipes/complexSearch?apiKey=%s&query=%s&number=12&fillIngredients=true&addRecipeInformation=true&instructionsRequired=false", foodAPIKey, search)
	//rqt := fmt.Sprintf("https://api.edamam.com/search?q=%s&app_id=%s&app_key=%s", search, foodAPIKey)
	//getting the request
	res, err1 := http.Get(rqt)
	if err1 != nil {
		fmt.Println("error getting the request")
	}

	body, _ := ioutil.ReadAll(res.Body)
	var rec recipe.Recipe

	unMarshalErr := json.Unmarshal(body, &rec)
	for key, _ := range rec.Results {
		rec.Results[key].PriceEuro = (dollarToEuro * rec.Results[key].Priceperserving) / 3

	}

	json.NewEncoder(w).Encode(rec)

	fmt.Println(unMarshalErr)
	//fmt.Println(rec)
	//ress := string(body)
	//json.NewEncoder(w).Encode(res)
	/*
		ww := bufio.NewWriter(w)
		ww.Write(body)
		ww.Flush()
	*/
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %v", err)
		return
	}
	fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
	var temp AddProd
	_ = json.NewDecoder(r.Body).Decode(&temp)

	found := false
	for index, _ := range users.UserList {
		if users.UserList[index].UserName == temp.User {
			for index2, _ := range users.UserList[index].Inventory {
				if users.UserList[index].Inventory[index2].Name == temp.Catigory {
					found = true

					myProd := user.Product{PName: temp.Name, Number: temp.Number, Expiration: temp.MyDate}
					users.UserList[index].Inventory[index2].Products = append(users.UserList[index].Inventory[index2].Products, myProd)

					break
				}
			}

		}
	}

	if !found {
		newProd := user.Product{PName: temp.Name, Number: temp.Number, Expiration: temp.MyDate}
		var newInv = []user.Product{}
		newInv = append(newInv, newProd)

		newUsrData := user.Category{Name: temp.Catigory, Products: newInv}

		for index, _ := range users.UserList {
			if users.UserList[index].UserName == temp.User {
				users.UserList[index].Inventory = append(users.UserList[index].Inventory, newUsrData)
			}
		}

	}
	saveData()
}

func updateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %v", err)
		return
	}
	fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
	var temp AddProd
	_ = json.NewDecoder(r.Body).Decode(&temp)
	for index, _ := range users.UserList {
		if users.UserList[index].UserName == temp.User {
			for i, _ := range users.UserList[index].Inventory {
				if users.UserList[index].Inventory[i].Name == temp.Catigory {
					for j, _ := range users.UserList[index].Inventory {
						if users.UserList[index].Inventory[i].Products[j].PName == temp.Name {
							users.UserList[index].Inventory[i].Products = append(users.UserList[index].Inventory[i].Products[:j], users.UserList[index].Inventory[i].Products[(j+1):]...)
							break
						}
					}
				}

			}
			break
		}
	}

	saveData()
}

func saveData() {
	file, _ := json.MarshalIndent(users, "", " ")

	_ = ioutil.WriteFile("data.json", file, 0644)
}

func loadData() {
	file, _ := ioutil.ReadFile("data.json")

	_ = json.Unmarshal([]byte(file), &users)
}

func main() {
	loadData()
	//http.HandleFunc("/search", hndRqt)
	//http.ListenAndServe(":3000", nil)
	go func() { updateExhangeRate() }()
	//new router
	r := mux.NewRouter()
	//handeling requests
	r.HandleFunc("/recipes/search/{rname}", getRecipes).Methods("GET")
	r.HandleFunc("/users/search/{uname}/{rsearch}", getUserData).Methods("GET")
	r.HandleFunc("/users/login/{uname}/{upassword}", getUser).Methods("GET")
	r.HandleFunc("/users/submit", addProduct).Methods("POST")
	r.HandleFunc("/users/update", updateProduct).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods: []string{
			http.MethodGet, //http methods for your app
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
			http.MethodOptions,
			http.MethodHead,
		},

		AllowedHeaders: []string{
			"*",
		},
	})

	handler := c.Handler(r)
	//listening
	log.Fatal(http.ListenAndServe(":8000", handler))

}
