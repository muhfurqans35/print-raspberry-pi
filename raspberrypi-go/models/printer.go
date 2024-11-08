package models

// "errors"

// Struktur untuk data Printer
type Printer struct {
	PrinterID int    `json:"printer_id"`
	Name      string `json:"name"`
}

// // Simulasi database atau sumber data untuk printer
// var printers = []Printer{
// 	{PrinterID: 1, Name: "EPSON_L3250_Series"},
// 	{PrinterID: 2, Name: "HP_LaserJet_Pro"},
// }

// Fungsi untuk mengambil data printer berdasarkan ID
// func GetPrinterByID(printerID int) (*Printer, error) {
// 	for _, printer := range printers {
// 		if printer.PrinterID == printerID {
// 			return &printer, nil
// 		}
// 	}
// 	return nil, errors.New("printer not found")
// }
