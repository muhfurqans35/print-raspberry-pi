package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"raspberrypi-go/models"
	"strconv"
)

type PrintRequest struct {
	PrinterID  int `json:"printer_id"`
	PrintJobID int `json:"print_job_id"`
}

// Fungsi untuk mendownload file dari Laravel API
func downloadFileFromLaravel(filePath, destination string) error {
	laravelURL := "http://192.168.1.5:8000/api/download?path=" + filePath
	response, err := http.Get(laravelURL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	outFile, err := os.Create(destination)
	if err != nil {
		return err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, response.Body)
	return err
}

// Handler untuk melakukan proses print
func PrintHandler(w http.ResponseWriter, r *http.Request) {
	var request PrintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

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

	// Tempat penyimpanan sementara di Raspberry Pi
	tempFile := "/tmp/" + printJob.File

	// Download file dari Laravel ke Raspberry Pi
	if err := downloadFileFromLaravel(printJob.File, tempFile); err != nil {
		http.Error(w, "Failed to download file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Membuat perintah untuk CUPS
	command := []string{
		"lp",
		"-d", printer.Name,
		"-o", "media=" + printJob.PaperSize,
		"-o", "color_mode=" + printJob.ColorMode,
		"-o", "orientation-requested=" + orientationToCUPS(printJob.Orientation),
		"-n", strconv.Itoa(printJob.Copies),
		tempFile,
	}

	log.Printf("Executing print command: %v", command)
	if err := exec.Command(command[0], command[1:]...).Run(); err != nil {
		http.Error(w, "Failed to print: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Print job successfully submitted"))
}

// Fungsi untuk mengonversi orientasi ke CUPS
func orientationToCUPS(orientation string) string {
	if orientation == "portrait" {
		return "3"
	}
	return "4"
}
