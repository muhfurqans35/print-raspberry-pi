package handlers

import (
	"encoding/json"

	"net/http"

	"os/exec"

	"strconv"
)

type PrintRequest struct {
	PrinterName string `json:"printer_name"`
	FilePath    string `json:"file_path"`
	Copies      int    `json:"copies"`
	PaperSize   string `json:"paper_size"`
	Orientation string `json:"orientation"`
	ColorMode   string `json:"color_mode"`
}

func PrintHandler(w http.ResponseWriter, r *http.Request) {
	var request PrintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Membangun perintah untuk mengirimkan pekerjaan ke printer
	command := []string{
		"lp",
		"-d", request.PrinterName, // nama printer dari request
		"-o", "media=" + request.PaperSize,
		"-o", "color_mode=" + request.ColorMode,
		"-o", "orientation-requested=" + orientationToCUPS(request.Orientation),
		"-n", strconv.Itoa(request.Copies),
		request.FilePath, // Lokasi file yang akan dicetak
	}

	err := exec.Command(command[0], command[1:]...).Run()
	if err != nil {
		http.Error(w, "Failed to print: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Print job successfully submitted"))
}

func orientationToCUPS(orientation string) string {
	if orientation == "portrait" {
		return "3"
	}
	return "4"
}
