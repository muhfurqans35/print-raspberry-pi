package main

import (
	"log"
	"net/http"

	"raspberrypi-go/handlers"

	"github.com/gorilla/mux"
)

func main() {
	// Initialize router
	r := mux.NewRouter()

	// Set up the routes
	r.HandleFunc("/api/print", handlers.PrintHandler).Methods("POST")
	r.HandleFunc("/get-printer-status", handlers.PrinterStatusHandler).Methods("GET")
	// Start server
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
