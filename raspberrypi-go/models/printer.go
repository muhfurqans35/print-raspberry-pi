package models

import "errors"

// "errors"

// Struktur untuk data Printer
type Printer struct {
	PrinterID int    `json:"printer_id"`
	Name      string `json:"name"`
}

// Simulasi database atau sumber data untuk printer
var printers = []Printer{
	{PrinterID: 9999, Name: "EPSON_L3250_Series"},
}

// Fungsi untuk mengambil data printer berdasarkan ID
func GetPrinterByID(printerID int) (*Printer, error) {
	for _, printer := range printers {
		if printer.PrinterID == printerID {
			return &printer, nil
		}
	}
	return nil, errors.New("printer not found")
}
