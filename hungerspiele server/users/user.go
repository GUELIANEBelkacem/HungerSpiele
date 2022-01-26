package user

import "time"

type Users struct {
	UserList []User `json:"userlist"`
}

type User struct {
	UserName  string     `json:"username"`
	Password  string     `json:"password"`
	Inventory []Category `json:"inventory"`
}

type Category struct {
	Name     string    `json:"name"`
	Products []Product `json:"inventory"`
}
type Product struct {
	PName      string    `json:"pname"`
	Number     int       `json:"number"`
	Expiration time.Time `json:"expiration"`
}
