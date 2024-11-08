package handlers

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"strconv"

	"github.com/your_project/models"
)

// Request struct untuk menerima data dari frontend
type PrintRequest struct {
	PrinterID  int `json:"printer_id"`
	PrintJobID int `json:"print_job_id"`
}

// Handler untuk melakukan proses print
func PrintHandler(w http.ResponseWriter, r *http.Request) {
	// Decode request body
	var request PrintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ambil data printer dan print job berdasarkan ID
	printer, err := models.GetPrinterByID(request.PrinterID)
	if err != nil {
		http.Error(w, "Printer not found", http.StatusNotFound)
		return
	}

	printJob, err := models.GetPrintJobByID(request.PrintJobID)
	if err != nil {
		http.Error(w, "Print job not found", http.StatusNotFound)
		return
	}

	// Membangun perintah untuk mengirimkan pekerjaan ke printer
	command := []string{
		"lp",
		"-d", printer.Name, // nama printer yang dipilih
		"-o", "media=" + printJob.PaperSize,
		"-o", "color_mode=" + printJob.ColorMode,
		"-o", "orientation-requested=" + orientationToCUPS(printJob.Orientation),
		"-n", strconv.Itoa(printJob.Copies),
		printJob.File, // Lokasi file yang akan dicetak
	}

	// Eksekusi perintah pencetakan ke CUPS
	err = exec.Command(command[0], command[1:]...).Run()
	if err != nil {
		http.Error(w, "Failed to print: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Kirim response sukses
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Print job successfully submitted"))
}

// Fungsi untuk mengonversi orientasi ke CUPS (landscape/portrait)
func orientationToCUPS(orientation string) string {
	if orientation == "portrait" {
		return "3" // 3 untuk portrait
	}
	return "4" // 4 untuk landscape
}
