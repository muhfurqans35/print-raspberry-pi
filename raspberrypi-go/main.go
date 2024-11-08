package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/muhfurqans35/print-raspberry-pi/raspberrypi-go/handlers"
)

func main() {
	// Initialize router
	r := mux.NewRouter()

	// Set up the routes
	r.HandleFunc("/api/print", handlers.PrintHandler).Methods("POST")

	// Start server
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
